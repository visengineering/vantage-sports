import moment from 'moment-timezone';
import { Op } from 'sequelize';
import emailService from '../../services/email.service';
import smsService from '../../services/sms.service';
import icsService from '../../services/ics.calender.service';
import merge from 'lodash.merge';
import {
  Event,
  User,
  Participant,
  Profile,
  Timeslot,
  GeoAddress,
} from '../../models';
import { EventType } from '../types';
import { EventInputType } from '../inputTypes';
import logger from '../../helpers/logger';
import { EventTypeEnum, EventSessionTypeEnum } from '../../models/Event';
import {
  FormInputTimeSlot,
  GQLEventCreateTimeslots,
  GQLEventEditTimeslots,
} from 'api/types';
import { DEFAULT_TIMEZONE } from '../../helpers/timezone';
import { checkOverlappingTimeSlots } from '../../helpers/checkOverlappingTimeSlots';
import { hasTimeslotStarted, isTimeslotPast } from '../../helpers/timeslot';

const { GraphQLInt, GraphQLNonNull } = require('graphql');

const sendEventEmailConfirmation = async ({
  coachProfile,
  coachUser,
  createdEvent,
  timeslots,
}: {
  coachProfile: Profile;
  coachUser: User;
  createdEvent: Event;
  timeslots: Timeslot[];
}) => {
  let eventEmailDisplayData = await icsService().getEventEmailData(
    createdEvent
  );
  const attachments = await Promise.all(
    timeslots.map(async (timeslot) => {
      const icsEventData = await icsService().createICSEvent(
        createdEvent,
        coachProfile,
        timeslot
      );
      const icsAttachment = await icsService().createICSAttachment(
        icsEventData?.value
      );
      return icsAttachment;
    })
  );

  emailService().sendEventCreateConfirmation({
    coachId: eventEmailDisplayData.coach.userId,
    attachments,
    coachName: eventEmailDisplayData.coach.name,
    eventId: eventEmailDisplayData['Event-Id'],
    eventTitle: eventEmailDisplayData['Event Title'],
    timeslots,
    timezone: eventEmailDisplayData.timezone,
    eventLocation: eventEmailDisplayData.Location,
    eventSessionType: eventEmailDisplayData['Session Type'],
  });

  smsService().sendEventCreateConfirmation({
    coachId: eventEmailDisplayData.coach.userId,
    attachments,
    coachName: eventEmailDisplayData.coach.name,
    eventId: eventEmailDisplayData['Event-Id'],
    eventTitle: eventEmailDisplayData['Event Title'],
    timeslots,
    timezone: eventEmailDisplayData.timezone,
    eventLocation: eventEmailDisplayData.Location,
    eventSessionType: eventEmailDisplayData['Session Type'],
    coachCellPhone: coachProfile.cellphone,
    isPhoneVerified: coachProfile.isPhoneVerified,
  });

  try {
    emailService().sendEventCreateNotificationToFavorites({
      coachProfile,
      coachUser,
      attachments,
      eventId: eventEmailDisplayData['Event-Id'],
      eventTitle: eventEmailDisplayData['Event Title'],
      timeslots,
      timezone: eventEmailDisplayData.timezone,
      eventLocation: eventEmailDisplayData.Location,
      eventSessionType: eventEmailDisplayData['Session Type'],
    });
  } catch (e) {
    logger.error(e);
  }
};

const createEventWithTimeslots = {
  type: EventType,
  description: 'The mutation that allows you to create a new event',
  args: {
    event: {
      name: 'event',
      type: EventInputType('createTimeslots'),
    },
  },
  resolve: async (
    value: any,
    createData: { event: GQLEventCreateTimeslots }
  ) => {
    try {
      const payload = createData.event;

      logger.info('Payload data for event: ', JSON.stringify(payload, null, 4));

      const coachProfile: Profile | null = await Profile.findByPk(
        payload.coachProfileId
      );
      if (!coachProfile) {
        logger.error(`(#000024) coachProfile ; event: ${payload}`);
        throw Error(`(#000024) coachProfile ; event: ${payload}`);
      }
      const coachUser = await User.findByPk(coachProfile.userId);
      if (!coachUser) {
        logger.error(`(#000025) coachUser ; event: ${payload}`);
        throw Error(`(#000025) coachUser ; event: ${payload}`);
      }

      const minDate = (payload.timeslots as FormInputTimeSlot[]).reduce(
        (first: FormInputTimeSlot, second: FormInputTimeSlot) => {
          return first.startDate < second.startDate ? first : second;
        }
      )?.startDate;

      const event = {
        // From now on even old form creates timeslot type
        // The null or EventTypeEnum.LEGACY_ONE_TIME will only remain on old events created before (up to 3months ago?)
        eventType: EventTypeEnum.MULTIPLE_TIMESLOTS,
        profileId: payload.coachProfileId,
        mediaId: payload.image,
        title: payload.title,
        universityId: payload.university,
        sportId: payload.sport,
        skillId: payload.skill,
        positionId: payload.position,
        location: payload.location,
        geoAddressId: undefined as number | undefined,
        sessionType: payload.locationType,
        description: payload.about,
        // All of these properties below are legacy.
        // In the future we will remove these columns on prod as we migrate legacy events.
        timezone: payload.timezone || 'America/New_York',
        cost: 0, // To make sure noone is billed in case of bugs
        duration: 0,
        date: new Date('1900-01-01T10:00:00.000Z'),
        time: null,
        max: 0,
      };

      const timeslotsArray = payload.timeslots.map(
        (
          timeslot: Omit<FormInputTimeSlot, 'startDate'> & { startDate: string }
        ) => {
          const startDate = moment(new Date(timeslot.startDate).toISOString());
          const timeslotEndDate = startDate
            .clone()
            // Plus sign here to convert string into number
            .add(+timeslot.duration, 'minutes')
            .toDate();
          if (
            timeslot.maxParticipantsCount <= 0 ||
            isNaN(timeslot.maxParticipantsCount) ||
            typeof timeslot.maxParticipantsCount !== 'number'
          ) {
            throw new Error(
              'Maximum number of participants should be greater than 0.'
            );
          }
          return {
            timeslot: [startDate.toDate(), timeslotEndDate],
            startDate: startDate.toDate(),
            endDate: timeslotEndDate,
            cost: timeslot.cost,
            maxParticipantsCount: timeslot.maxParticipantsCount,
            duration: timeslot.duration,
          };
        }
      );

      if (!timeslotsArray || timeslotsArray.length === 0) {
        logger.error(`(#000027) timeslotsArray missing ; event: ${payload}`);
        throw Error(`(#000027) timeslotsArray missing ; event: ${payload}`);
      }

      const previousEvents = await coachProfile.getEventsFromDate(minDate);

      const isOverlappingRequest = checkOverlappingTimeSlots(timeslotsArray);

      if (isOverlappingRequest) {
        logger.error(
          'The event you are about to create has conflicting timeslots with each other ;'
        );
        throw Error(
          'The event you are about to create has conflicting timeslots with each other ;'
        );
      }

      const overlappingTimeSlots = await Event.getOverlappingTimeSlots(
        previousEvents,
        timeslotsArray
      );

      if (overlappingTimeSlots.length) {
        logger.error(
          `The event you are about to create has conflicting timeslots with your other event(s) called ${overlappingTimeSlots
            .map(
              (event) =>
                `"${event.title}" (${event.timeslots
                  ?.map(
                    (timeslot) =>
                      `${moment(timeslot.startDate.toISOString()).format(
                        'MM-DD-YYYY'
                      )}
                      : ${moment(
                        timeslot.startDate.toISOString(),
                        'HHmm'
                      ).format('HH:mm')}
                      - ${moment(timeslot.endDate.toISOString(), 'HHmm').format(
                        'HH:mm'
                      )}`
                  )
                  .join(' ; ')})`
            )
            .join(', ')
            .replace(
              /, ([^,]*)$/,
              ' and $1'
            )}. Please change your selection to prevent overlap with existing events.`
        );

        throw Error(
          `The event you are about to create has conflicting timeslots with your other event(s) called ${overlappingTimeSlots
            .map(
              (event) =>
                `"${event.title}" (${event.timeslots
                  ?.map(
                    (timeslot) =>
                      `${moment(timeslot.startDate.toISOString()).format(
                        'MM-DD-YYYY'
                      )}
                      : ${moment(
                        timeslot.startDate.toISOString(),
                        'HHmm'
                      ).format('HH:mm')}
                      - ${moment(timeslot.endDate.toISOString(), 'HHmm').format(
                        'HH:mm'
                      )}`
                  )
                  .join(' ; ')})`
            )
            .join(', ')
            .replace(
              /, ([^,]*)$/,
              ' and $1'
            )}. Please change your selection to prevent overlap with existing events.`
        );
      }

      if (event.sessionType === EventSessionTypeEnum.In_Person) {
        const geoAddressDB = payload.geoAddressDB;

        logger.info('geoAddressDB data for event: ', geoAddressDB);

        if (!geoAddressDB) {
          logger.error('(#000062) Error: geoAddressDB data missing.');
        } else {
          try {
            const eventGeoAddress = await GeoAddress.create(geoAddressDB);

            logger.info(
              'GeoAddress create attempt result for new Event: ',
              JSON.stringify(eventGeoAddress, null, 4)
            );

            if (!eventGeoAddress?.id) {
              logger.error('GeoAddress create attempt for event is failed!');
            } else {
              event.geoAddressId = eventGeoAddress.id;
            }
          } catch (error: any) {
            logger.error(`Failed to create geoAddress for events: `, error);
          }
        }
      }

      const createdEvent: Event = await Event.create(event);
      const timeslots = await Promise.all(
        timeslotsArray?.map((timeslot) => {
          return createdEvent.createTimeslot(timeslot);
        })
      );
      sendEventEmailConfirmation({
        coachProfile,
        coachUser,
        createdEvent,
        timeslots,
      });
      return createdEvent;
    } catch (error: any) {
      logger.error((error && error.message) || error);
      throw Error((error && error.message) || error);
    }
  },
};

const deleteEvent = {
  type: EventType,
  description: 'The mutation that allows you to delete a existing Event by Id',
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value: any, { id }: { id: number }) => {
    try {
      const foundEvent = await Event.findByPk(id, {
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
          },
        ],
      });

      if (!foundEvent) {
        throw new Error(`Event with id: ${id} not found!`);
      }

      if (foundEvent.eventType === EventTypeEnum.MULTIPLE_TIMESLOTS) {
        const timeslots: Timeslot[] =
          await Timeslot.getTimeslotsWithParticipants(id);

        const isBookedEvent = timeslots.some(
          (timeslot) =>
            timeslot.participantsCount > 0 ||
            (Array.isArray(timeslot.participants) &&
              timeslot.participants.length > 0)
        );

        if (isBookedEvent) {
          throw new Error(`Event with active participants cannot be deleted`);
        } else {
          await Timeslot.destroy({
            where: {
              eventId: id,
              isCancelled: false,
              cancelDate: null,
            },
          });
          await Event.destroy({
            where: {
              id,
            },
          });
        }
      } else {
        await Event.destroy({
          where: {
            id,
          },
        });
      }

      return foundEvent;
    } catch (error: any) {
      logger.error(`Deleting event:: ${error?.message || error}`);
      throw new Error(`Deleting event:: ${error?.message || error}`);
    }
  },
};

const cancelEvent = {
  type: EventType,
  description: `The mutation that allows you to cancel an existing Event by Id.
  This will cancel all respective timeslots connected to the event`,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value: any, args: { id: number }) => {
    try {
      const { id } = args;
      let eventToBeCancelled = await Event.findByPk(id, {
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            attributes: [
              'id',
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
              'participantsCount',
              'cancelDate',
              'isCancelled',
            ],
          },
        ],
      });

      if (!eventToBeCancelled) {
        throw new Error(`(#000035) Event with id: ${id} not found!`);
      }

      const isCompletedOrStartedEvent = eventToBeCancelled.timeslots?.every(
        (timeslot) =>
          hasTimeslotStarted(timeslot.startDate, timeslot.endDate) ||
          isTimeslotPast(timeslot.endDate)
      );

      if (isCompletedOrStartedEvent) {
        throw new Error(
          `(#000053) Event cannot be cancelled because it is completed.`
        );
      }

      await Event.update(
        {
          isEventCancelled: true,
          eventCancelDate: new Date(),
        },
        {
          where: {
            id,
            isEventCancelled: false,
            eventCancelDate: null,
          },
        }
      );

      const timeslotsToCancel =
        eventToBeCancelled.timeslots
          ?.filter(
            (t) =>
              t.isCancelled === false &&
              !(
                hasTimeslotStarted(t.startDate, t.endDate) ||
                isTimeslotPast(t.endDate)
              )
          )
          .filter((t) => t.participantsCount > 0) ?? [];

      if (!timeslotsToCancel.length) {
        return eventToBeCancelled;
      }

      for (let timeslot of timeslotsToCancel) {
        await Timeslot.update(
          {
            isCancelled: true,
            cancelDate: new Date(),
          },
          {
            where: {
              id: timeslot.id,
              isCancelled: false,
            },
          }
        );

        let participants: Participant[] = await Participant.findAll({
          where: {
            coachId: eventToBeCancelled.profileId,
            paid: true,
            paymentReference: { [Op.ne]: null },
            eventId: eventToBeCancelled.id,
          },
        });

        const participantsWithTimezones = participants.map(
          ({ clientId, timezone }) => ({
            clientId,
            timezone,
          })
        );

        let participantProfileDetails: (Profile & { user: User })[] =
          (await Profile.findAll({
            where: {
              userId: {
                [Op.in]: [
                  ...new Set(
                    participantsWithTimezones.map(({ clientId }) => clientId)
                  ),
                ],
              },
            },
            include: [User],
            attributes: [
              'id',
              'userId',
              'name',
              'cellphone',
              'isPhoneVerified',
            ],
          })) as (Profile & { user: User })[];

        const eventData = await icsService().getEventEmailData(
          eventToBeCancelled
        );

        const participantProfileDetailsMapped = participantProfileDetails.map(
          (userProfile) => ({
            id: userProfile.userId,
            cellphone: userProfile.cellphone,
            isPhoneVerified: userProfile.isPhoneVerified,
            email: userProfile.user.email,
            name: userProfile.name,
            coachName: eventData['Coach Name'],
            clientId: userProfile.userId,
            timezone:
              participantsWithTimezones.find(
                (p) => p.clientId === userProfile.userId
              )?.timezone ?? DEFAULT_TIMEZONE,
          })
        );

        emailService().sendTimeslotCancellationEmail(
          eventToBeCancelled,
          participantProfileDetailsMapped,
          timeslot
        );
        smsService().sendTimeslotCancellationSms(
          eventToBeCancelled,
          eventData,
          participantProfileDetailsMapped,
          timeslot
        );
      }

      return eventToBeCancelled;
    } catch (error: any) {
      logger.error(`Cancelling event:: ${error?.message || error}`);
      throw new Error(`Cancelling event:: ${error?.message || error}`);
    }
  },
};

const updateEvent = {
  type: EventType,
  description: 'The mutation that allows you to update an exsiting Event by Id',

  args: {
    event: {
      name: 'event',
      type: EventInputType('update'),
    },
  },
  resolve: async (
    value: any,
    {
      event,
    }: { event: GQLEventEditTimeslots & { geoAddressId?: number | null } }
  ) => {
    logger.info('Payload data for event: ', JSON.stringify(event, null, 4));

    try {
      const foundEvent = await Event.findByPk(event.id, {
        order: [[{ model: Timeslot, as: 'timeslots' }, 'startDate', 'ASC']],
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            attributes: [
              'id',
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
              'participantsCount',
              'cancelDate',
              'isCancelled',
            ],
            include: [
              {
                model: Participant,
                as: 'participants',
                attributes: ['clientId', 'timezone'],
              },
            ],
          },
        ],
      });

      if (!foundEvent) throw new Error(`Event with id: ${event.id} not found!`);

      logger.info('foundEvent: ', JSON.stringify(foundEvent, null, 4));

      const priorLocation = foundEvent.location;
      const geoAddressDB = event.geoAddressDB;
      const isLocationChanged = priorLocation !== event.location;

      if (
        event.sessionType === EventSessionTypeEnum.Virtual ||
        (!geoAddressDB && isLocationChanged)
      ) {
        if (foundEvent.geoAddressId) {
          event.geoAddressId = null;
          await foundEvent.removeEventGeoAddress();
        }
      } else if (
        event.sessionType === EventSessionTypeEnum.In_Person &&
        geoAddressDB
      ) {
        if (!foundEvent.geoAddressId) {
          await foundEvent.createEventGeoAddress({
            geoAddressDB,
            location: event.location,
          });
        } else if (foundEvent.geoAddressId && isLocationChanged) {
          const updatedEventGeoAddress = await foundEvent.setEventGeoAddress({
            geoAddressDB,
            location: event.location,
          });

          if (!updatedEventGeoAddress) event.geoAddressId = null;
        }
      }

      const updates = merge(foundEvent, event);
      foundEvent.update(updates);
      await foundEvent.save();

      if (foundEvent.location == priorLocation) return foundEvent;

      if (foundEvent?.timeslots) {
        const timeslots = foundEvent?.timeslots;
        const eventData = await icsService().getEventEmailData(foundEvent);

        if (!timeslots || timeslots.length == 0) return foundEvent;

        timeslots
          .filter((t) => {
            const startDateISO = t.startDate.toISOString();
            return (
              !t.isCancelled &&
              moment(startDateISO).isAfter(
                moment(new Date().toJSON()).utcOffset(
                  moment(startDateISO).utcOffset()
                )
              ) &&
              t.participants &&
              t.participants.length > 0
            );
          })
          .map(async (t) => {
            const participants: Participant[] = t.participants || [];

            const participantProfileDetails: Profile[] = await Profile.findAll({
              where: {
                userId: {
                  [Op.in]: [
                    ...new Set(participants.map(({ clientId }) => clientId)),
                  ],
                },
              },
              include: [User],
              attributes: [
                'id',
                'userId',
                'name',
                'cellphone',
                'isPhoneVerified',
              ],
            });

            return participantProfileDetails.map((userProfile) => ({
              id: userProfile.userId,
              cellphone: userProfile.cellphone,
              isPhoneVerified: userProfile.isPhoneVerified,
              email: userProfile.user.email,
              name: userProfile.name,
              coachName: eventData['Coach Name'],
              clientId: userProfile.userId,
              timezone:
                participants.find((p) => p.clientId === userProfile.userId)
                  ?.timezone ?? DEFAULT_TIMEZONE,
            }));
          })
          .forEach(async (participantData) => {
            const activeParticipants = await participantData;

            emailService().sendUpdatedLocationEmailEventNotification(
              foundEvent,
              eventData,
              activeParticipants
            );

            smsService().sendUpdatedLocationSMSEventNotification(
              foundEvent,
              eventData,
              activeParticipants
            );
          });
      }

      return foundEvent;
    } catch (error: any) {
      logger.error(`Updating event:: ${error?.message || error}`);
      throw new Error(`Updating event:: ${error?.message || error}`);
    }
  },
};

export { createEventWithTimeslots, deleteEvent, updateEvent, cancelEvent };
export default { deleteEvent, updateEvent, cancelEvent };
