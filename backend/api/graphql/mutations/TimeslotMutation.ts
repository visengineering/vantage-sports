import { Op } from 'sequelize';
import emailService from '../../services/email.service';
import smsService from '../../services/sms.service';
import icsService from '../../services/ics.calender.service';
import merge from 'lodash.merge';
import { User, Participant, Profile, Timeslot, Event } from '../../models';
import { TimeslotType } from '../types/TimeslotType';
import { TimeslotInputType } from '../inputTypes/TimeslotInputType';
import { hasTimeslotStarted, isTimeslotPast } from '../../helpers/timeslot';
import { DEFAULT_TIMEZONE } from '../../helpers/timezone';
import moment from 'moment';
import logger from '../../helpers/logger';

export const deleteTimeslot = {
  type: TimeslotType,
  description:
    'The mutation that allows you to delete an existing Timeslot by Id',
  args: {
    timeslot: {
      name: 'timeslot',
      type: TimeslotInputType('delete'),
    },
  },
  resolve: async (value: any, { timeslot }: { timeslot: { id: number } }) => {
    const foundTimeslot = await Timeslot.findByPk(timeslot.id);

    if (!foundTimeslot) {
      throw new Error(`(#000038) Timeslot with id: ${timeslot.id} not found!`);
    }

    if (foundTimeslot.participantsCount > 0) {
      throw new Error(
        `(#000039) Timeslot cannot be deleted because people have already booked spots for this date and time.`
      );
    }

    if (foundTimeslot.isCancelled) {
      throw new Error(
        `(#000042) Timeslot cannot be deleted because its cancelled.`
      );
    }

    if (isTimeslotPast(foundTimeslot.endDate)) {
      throw new Error(
        `(#000043) Timeslot cannot be deleted becacuse it has finished.`
      );
    }

    if (hasTimeslotStarted(foundTimeslot.startDate, foundTimeslot.endDate)) {
      throw new Error(
        `(#000044) Timeslot cannot be deleted because it has already started.`
      );
    }

    await Timeslot.destroy({
      where: {
        id: timeslot.id,
      },
    });

    const siblingsTimeslots = await Timeslot.findAll({
      where: {
        eventId: foundTimeslot.eventId,
      },
    });

    if (!siblingsTimeslots.length) {
      await Event.destroy({
        where: {
          id: foundTimeslot.eventId,
        },
      });
    } else {
      const isActiveTimeslots = siblingsTimeslots.filter(
        (timeslot) => !timeslot.isCancelled
      );

      if (!isActiveTimeslots.length) {
        await Event.update(
          {
            isEventCancelled: true,
            eventCancelDate: new Date(),
          },
          {
            where: {
              id: foundTimeslot.eventId,
              isEventCancelled: false,
              eventCancelDate: null,
            },
          }
        );

        const event = await Event.findByPk(foundTimeslot.eventId, {
          include: [
            {
              model: Timeslot,
              as: 'timeslots',
            },
          ],
        });

        if (!event) {
          throw new Error(
            `(#000045) Event not found for timeslot: ${foundTimeslot.id}.`
          );
        }

        const timeslotsToCancel =
          event.timeslots
            ?.filter((t) => t.isCancelled === false)
            .filter((t) => t.participantsCount > 0) ?? [];

        if (!timeslotsToCancel.length) {
          return;
        }

        await updateUnderlyingTimeslots(event, timeslotsToCancel);
      }
    }

    return foundTimeslot;
  },
};

export const cancelTimeslot = {
  type: TimeslotType,
  description: `The mutation that allows you to cancel an existing Timeslot by Id.`,
  args: {
    timeslot: {
      name: 'timeslot',
      type: TimeslotInputType('cancel'),
    },
  },
  resolve: async (value: any, args: { timeslot: { id: number } }) => {
    const { timeslot } = args;
    const timeslotToBeCancelled = await Timeslot.findByPk(timeslot.id);

    if (!timeslotToBeCancelled) {
      throw new Error(`(#000037) Timeslot with id: ${timeslot.id} not found!`);
    }

    if (timeslotToBeCancelled.isCancelled) {
      throw new Error(`(#000036) Already cancelled! id: ${timeslot.id}`);
    }

    if (isTimeslotPast(timeslotToBeCancelled.endDate)) {
      throw new Error(
        `(#000051) Timeslot cannot be cancelled becacuse it has finished.`
      );
    }

    if (
      hasTimeslotStarted(
        timeslotToBeCancelled.startDate,
        timeslotToBeCancelled.endDate
      )
    ) {
      throw new Error(
        `(#000052) Timeslot cannot be cancelled because it has already started.`
      );
    }

    const event = await Event.findByPk(timeslotToBeCancelled.eventId, {
      include: [
        {
          model: Timeslot,
          as: 'timeslots',
          required: true,
        },
      ],
    });

    if (!event) {
      throw new Error(
        `(#000038) No event found against this Timeslot with id: ${timeslot.id}!`
      );
    }

    await Timeslot.update(
      {
        isCancelled: true,
        cancelDate: new Date(),
      },
      {
        where: {
          id: timeslot.id,
          isCancelled: false,
          cancelDate: null,
        },
      }
    );

    const siblingsTimeslots = await Timeslot.findAll({
      where: {
        eventId: timeslotToBeCancelled.eventId,
      },
    });

    if (siblingsTimeslots.length) {
      const isActiveTimeslots = siblingsTimeslots.filter(
        (timeslot) => !timeslot.isCancelled
      );

      if (!isActiveTimeslots.length) {
        await event.update(
          {
            isEventCancelled: true,
            eventCancelDate: new Date(),
          },
          {
            where: {
              isEventCancelled: false,
              eventCancelDate: null,
            },
          }
        );

        const timeslotsToCancel =
          event.timeslots
            ?.filter((t) => t.isCancelled === false)
            .filter((t) => t.participantsCount > 0) ?? [];

        if (!timeslotsToCancel.length) {
          return;
        }

        await updateUnderlyingTimeslots(event, timeslotsToCancel);

        return timeslotToBeCancelled;
      }
    }

    const participants: Participant[] = await Participant.findAll({
      where: {
        timeslotId: timeslotToBeCancelled.id,
        paid: true,
        paymentReference: { [Op.ne]: null },
      },
    });

    const participantsWithTimezones = participants.map(
      ({ clientId, timezone }) => ({
        clientId,
        timezone,
      })
    );

    const participantProfileDetails: (Profile & { user: User })[] =
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
        attributes: ['id', 'userId', 'name', 'cellphone', 'isPhoneVerified'],
      })) as (Profile & { user: User })[];

    // TODO: Timeslot cancellation sms and email notification

    const eventData = await icsService().getEventEmailData(event);

    const participantProfileDetailsMapped = participantProfileDetails.map(
      (userProfile) => ({
        id: userProfile.userId,
        cellphone: userProfile.cellphone,
        isPhoneVerified: userProfile.isPhoneVerified,
        email: userProfile.user.email,
        name: userProfile.name,
        coachName: eventData['Coach Name'],
        timezone:
          participantsWithTimezones.find(
            (p) => p.clientId === userProfile.userId
          )?.timezone ?? DEFAULT_TIMEZONE,
      })
    );

    emailService().sendTimeslotCancellationEmail(
      event,
      participantProfileDetailsMapped,
      timeslotToBeCancelled
    );
    smsService().sendTimeslotCancellationSms(
      event,
      eventData,
      participantProfileDetailsMapped,
      timeslotToBeCancelled
    );

    return timeslotToBeCancelled;
  },
};

export const updateTimeslot = {
  type: TimeslotType,
  description:
    'The mutation that allows you to update an exsiting Timeslot by Id',
  args: {
    timeslot: {
      name: 'timeslot',
      type: TimeslotInputType('update'),
    },
  },
  resolve: async (
    value: any,
    {
      timeslot,
    }: {
      timeslot: {
        id: number;
        startDate: string;
        duration: number;
        cost: number;
        maxParticipantsCount: number;
      };
    }
  ) => {
    const foundTimeslot = await Timeslot.findByPk(timeslot.id, {
      include: [
        {
          model: Event,
          as: 'event',
          include: [{ model: Profile, as: 'coach' }],
        },
      ],
    });
    if (!foundTimeslot) {
      throw new Error(`Timeslot with id: ${timeslot.id} not found!`);
    }
    if (foundTimeslot.isCancelled) {
      throw new Error(
        `(#000047) Timeslot cannot be edited because its cancelled.`
      );
    }

    if (isTimeslotPast(foundTimeslot.endDate)) {
      throw new Error(
        `(#000048) Timeslot cannot be edited becacuse it has finished.`
      );
    }

    if (hasTimeslotStarted(foundTimeslot.startDate, foundTimeslot.endDate)) {
      throw new Error(
        `(#000049) Timeslot cannot be edited because it has already started.`
      );
    }

    if (foundTimeslot.participantsCount > timeslot.maxParticipantsCount) {
      throw new Error(
        `(#000049) Timeslot cannot be edited because the new value for Maximum Participants Count is smaller than actual number of signed up participants (${foundTimeslot.participantsCount}).`
      );
    }

    const timeslotEndDate = moment(timeslot.startDate)
      // Plus sign here to convert string into number
      .add(timeslot.duration, 'minutes')
      .toDate();

    const timeslotUpdated = {
      timeslot: [new Date(timeslot.startDate), timeslotEndDate],
      startDate: new Date(timeslot.startDate),
      endDate: timeslotEndDate,
      duration: timeslot.duration,
      cost: timeslot.cost,
      maxParticipantsCount: timeslot.maxParticipantsCount,
    };

    const coachProfile: Profile | null = await Profile.findByPk(
      foundTimeslot.event?.coach?.id
    );
    if (!coachProfile) {
      logger.error(`(#000050) coachProfile`);
      throw Error(`(#000050) coachProfile`);
    }
    const previousEvents = await coachProfile.getEventsFromDate(new Date());

    const changedDateTime =
      foundTimeslot.duration !== timeslot.duration ||
      foundTimeslot.startDate.toISOString() !==
        moment(timeslot.startDate).toISOString();
    if (changedDateTime) {
      const overlappingTimeSlots = await Event.getOverlappingTimeSlots(
        previousEvents,
        [timeslotUpdated],
        timeslot.id
      );
      if (overlappingTimeSlots.length) {
        logger.error(
          `The timeslot you are about to update has conflicting date & time with your other event(s) called ${overlappingTimeSlots
            .map(
              (event) =>
                `"${event.title}" (${event.timeslots
                  ?.map(
                    (timeslot) =>
                      `${moment(timeslot.startDate).format('MM-DD-YYYY')}
                      : ${moment(timeslot.startDate, 'HHmm').format('HH:mm')}
                      - ${moment(timeslot.endDate, 'HHmm').format('HH:mm')}`
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
          `The timeslot you are about to update has conflicting date & time with your other event(s) called ${overlappingTimeSlots
            .map(
              (event) =>
                `"${event.title}" (${event.timeslots
                  ?.map(
                    (timeslot) =>
                      `${moment(timeslot.startDate).format('MM-DD-YYYY')}
                      : ${moment(timeslot.startDate, 'HHmm').format('HH:mm')}
                      - ${moment(timeslot.endDate, 'HHmm').format('HH:mm')}`
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
    }

    const updates = merge(foundTimeslot, timeslotUpdated);
    foundTimeslot.update(updates);
    return await foundTimeslot.save();
  },
};

const updateUnderlyingTimeslots = async (
  event: Event,
  timeslots: Timeslot[]
) => {
  for (let timeslot of timeslots) {
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
        coachId: event.profileId,
        paid: true,
        paymentReference: { [Op.ne]: null },
        eventId: event.id,
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
        attributes: ['id', 'userId', 'name', 'cellphone', 'isPhoneVerified'],
      })) as (Profile & { user: User })[];

    const eventData = await icsService().getEventEmailData(event);

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

    await emailService().sendTimeslotCancellationEmail(
      event,
      participantProfileDetailsMapped,
      timeslot
    );
    await smsService().sendTimeslotCancellationSms(
      event,
      eventData,
      participantProfileDetailsMapped,
      timeslot
    );
  }
};
