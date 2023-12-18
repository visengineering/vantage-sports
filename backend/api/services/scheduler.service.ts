import { Op } from 'sequelize';
import { User, Profile, Event, Participant, Timeslot } from '../models/index';
import emailService, { ParticipantListObject } from '../services/email.service';
import smsService from '../services/sms.service';
import icsService from '../services/ics.calender.service';
import moment from 'moment-timezone';
import logger from '../helpers/logger';
const dailyNotificationTime =
  process.env.DAILY_NOTIFICATION_TIME || `0 14 * * *`;

logger.info(`Cron ${dailyNotificationTime}`);

export const SchedulerService = () => {
  async function notificationBefore1Hour() {
    logger.info(
      'This function runs every n minutes. Current UTC time is',
      moment(new Date().toJSON()).format('dddd, MMMM Do YYYY, h:mm:ss a')
    );

    const currentTime = new Date();
    const timeAfter2Hour = new Date(Date.now() + 2 * 60 * 60 * 1000);

    try {
      const upcomingEvents = await Event.findAll({
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            where: {
              isNotificationProcessed: false,
              participantsCount: { [Op.gt]: 0 },
              startDate: {
                [Op.gt]: currentTime,
                [Op.lt]: timeAfter2Hour,
              },
              isCancelled: false,
            },
            attributes: [
              'id',
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
              'participantsCount',
              'cancelDate',
              'isNotificationProcessed',
              'isCancelled',
            ],
          },
        ],
      });

      const upcomingEventIds = upcomingEvents.map((event: Event) => event.id);
      const upcomingTimeslotIds = upcomingEvents
        .map((event: Event) => {
          if (!event.timeslots) {
            return [];
          }
          return event.timeslots.map((t) => t.id);
        })
        .reduce<number[]>(
          (acc, timeslots: number[]) => [...acc, ...timeslots],
          []
        );

      if (!upcomingEventIds?.length) {
        return;
      }

      let participants: Participant[] = [];
      participants = await Participant.findAll({
        where: {
          eventId: { [Op.in]: upcomingEventIds },
          paid: true,
          paymentIntent: { [Op.ne]: null },
          paymentReference: { [Op.ne]: null },
        },
        include: [
          { model: Event, as: 'events' },
          {
            model: Timeslot,
            required: true,
            as: 'timeslot',
            where: {
              id: { [Op.in]: upcomingTimeslotIds },
            },
          },
        ],
      });

      logger.debug(
        !!participants.length &&
          JSON.stringify(
            {
              participants: participants.map((p: Participant) => ({
                id: p.id,
                clientId: p.clientId,
                coachId: p.coachId,
                eventId: p.eventId,
              })),
            },
            null,
            4
          )
      );

      await Timeslot.update(
        {
          isNotificationProcessed: true,
          notificationDate: new Date(),
        },
        {
          where: {
            isCancelled: false,
            id: { [Op.in]: upcomingTimeslotIds },
            isNotificationProcessed: false,
            startDate: {
              [Op.gt]: currentTime,
              [Op.lt]: timeAfter2Hour,
            },
          },
        }
      );

      // This will make sure, email is sent only once to coach
      let timeslotIds: number[] = [];
      let sendToCoach = false;
      const participantTimeslotsMap: {
        [a: number]: {
          [b: number]: Participant;
        };
      } = {};
      for (let i = 0; i < participants.length; i++) {
        const participant: Participant = participants[i];
        if (!participant?.clientId) {
          logger.error(
            `Failed to send notification to participant participantId : ${participant?.id}`
          );
          return;
        }

        if (!participant.timeslotId) {
          logger.error(
            `Failed to send notification to participant participantId : ${participant?.id}`
          );
          return;
        }

        const userId = participant.clientId;
        if (participant.timeslotId in participantTimeslotsMap) {
          if (!(userId in participantTimeslotsMap[participant.timeslotId])) {
            participantTimeslotsMap[participant.timeslotId][userId] =
              participant;
          }
        } else {
          participantTimeslotsMap[participant.timeslotId] = {};
          participantTimeslotsMap[participant.timeslotId][userId] = participant;
        }
      }

      for (let i = 0; i < Object.entries(participantTimeslotsMap).length; i++) {
        const [timeslotId, userIdParticipantMap]: [
          string,
          {
            [b: number]: Participant;
          }
        ] = Object.entries(participantTimeslotsMap)[i];

        const timeslotIdNr = parseInt(timeslotId);
        sendToCoach = !timeslotIds.includes(timeslotIdNr);
        timeslotIds = [...new Set([...timeslotIds, timeslotIdNr])];
        const timeslot = await Timeslot.findByPk(timeslotIdNr);
        if (!timeslot) {
          throw Error(
            `(#000033) timeslot not found ; eventId: ${timeslotIdNr}`
          );
        }
        // Do not change this to left join on Timeslot with "include: { where ... }"
        const event = await Event.findByPk(timeslot.eventId);
        if (!event) {
          throw Error(`(#000014) event not found ; eventId: ${timeslotIdNr}`);
        }

        for (let j = 0; j < Object.entries(userIdParticipantMap).length; j++) {
          const [userId, participant]: [string, Participant] =
            Object.entries(userIdParticipantMap)[j];
          await smsService().sendUpcomingSMSEventNotification(
            parseInt(userId),
            event,
            sendToCoach,
            timeslot
          );
          await emailService().sendUpcomingEventEmailNotification(
            parseInt(userId),
            event,
            participant,
            sendToCoach,
            timeslot
          );
        }
      }
    } catch (error: any) {
      logger.error('\n\nerror:\n\n');
      logger.error(error?.message || error);
    }
  }

  async function notificationEveryday9AM() {
    try {
      const currentTime = new Date();
      const timeAfter12Hours = new Date(Date.now() + 12 * 60 * 60 * 1000);

      logger.info(
        `Daily events mail/txt notification function currentTime: ${currentTime} max time: ${timeAfter12Hours}`
      );
      let todaysEvents: Event[] = await Event.findAll({
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            where: {
              startDate: {
                [Op.gt]: currentTime,
                [Op.lt]: timeAfter12Hours,
              },
              isCancelled: false,
            },
            attributes: [
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
              'participantsCount',
              'isNotificationProcessed',
              'notificationDate',
              'isCancelled',
              'cancelDate',
            ],
          },
        ],
      });

      if (!todaysEvents?.length) {
        logger.info('Daily events: No Daily Events');
        return;
      } else {
        logger.info(`Daily events count: ${todaysEvents?.length}`);
      }

      const todaysEventsMapped = todaysEvents
        .filter((e) => !!e.timeslots?.length)
        .reduce<{
          [a: number]: Event[];
        }>((acc, cur: Event) => {
          if (acc[cur.profileId]) {
            acc[cur.profileId].push(cur);
          } else {
            acc[cur.profileId] = [cur];
          }
          return acc;
        }, {});

      logger.info(
        JSON.stringify(
          {
            todaysEvents: Object.entries(todaysEventsMapped).map(
              ([key, value]) => ({
                eventIds: value.map((v) => v.id),
                coachId: key,
              })
            ),
          },
          null,
          4
        )
      );

      const data: {
        coachUser: User;
        events: (Event & { timeslots?: Timeslot[] })[];
      }[] = [];
      for (let i = 0; i < Object.entries(todaysEventsMapped).length; i++) {
        const [coachProfileId, eventsArray] =
          Object.entries(todaysEventsMapped)[i];

        const coachProfile = await Profile.findByPk(coachProfileId);
        if (!coachProfile) {
          logger.error(
            `DailyNotification: CoachProfile Was not found for: ${coachProfileId}`
          );
          continue;
        }
        const coachUser: User | null = await User.findByPk(coachProfile.userId);

        const events = [];
        for (let j = 0; j < eventsArray.length; j++) {
          const event = eventsArray[j];
          events.push(event);
        }

        if (!events?.length) {
          logger.debug(
            `CoachUser id ${coachUser?.id} with  emailId:${coachUser?.email} doesn't have any events today`
          );
          continue;
        }

        // when coach is deleted but not event ...coach can be null
        if (coachUser != null) {
          data.push({ coachUser, events });
        }

        if (!data.length) {
          logger.error(
            `Sending daily sms notification to coachUser EXCLUDED because of no events. Mobile number missing ----> coachProfileId: ${coachProfileId}, Cell:${coachProfile?.cellphone}, phoneVerified : ${coachProfile?.isPhoneVerified}`
          );
          continue;
        }

        // Email is primary login and will all ways be sent
        await emailService().sendDailyEventNotification(data);

        if (!coachProfile?.cellphone || !coachProfile?.isPhoneVerified) {
          logger.error(
            `Sending daily sms notification to coachUser EXCLUDED because - Mobile number missing ----> coachProfile.id: ${coachProfile.id} --  name: ${coachProfile.name}, Cell:${coachProfile?.cellphone}, phoneVerified : ${coachProfile?.isPhoneVerified}`
          );
          continue;
        } else {
          await smsService().sendDailyEventSMSNotification(data);
        }
      }
    } catch (error: any) {
      logger.error(
        'Sending daily notification failed',
        JSON.stringify({ Error: error, errorMessage: error?.message }, null, 4)
      );
      return true;
    }
  }

  async function reviewNotificationHourly() {
    const pastEvents = await Event.findAll({
      where: {
        date: { [Op.lt]: new Date() },
      },
      attributes: ['id', 'title', 'profileId', 'date', 'duration'],
      raw: true,
    });

    const currentTime = new Date().toJSON();
    const eventsToBeReviewed = pastEvents.filter((event: Event) => {
      const eventStartHours = new Date(event.date).getHours();
      const eventCompleteTime = new Date(
        new Date(event.date).setHours(eventStartHours + Number(event.duration))
      ).toJSON();
      return eventCompleteTime < currentTime;
    });

    if (!eventsToBeReviewed?.length) {
      return;
    }

    const eventIds = eventsToBeReviewed.map((event: Event) => event.id);

    const participants: (Participant & { events: Event })[] =
      (await Participant.findAll({
        where: {
          updatedAt: {
            [Op.gt]: new Date(new Date().setHours(new Date().getHours() - 24)),
          }, // This will look for participants where participant record is updated only within past 24 hours
          eventId: { [Op.in]: eventIds },
          paid: true,
          paymentReference: { [Op.ne]: null },
          email_notification_sent: false,
          reviewId: null,
        },
        raw: true,
        attributes: ['id', 'eventId', 'clientId', 'coachId', 'id', 'eventId'],
        include: [{ model: Event, as: 'events', attributes: ['id', 'title'] }],
      })) as (Participant & { events: Event })[];

    if (!participants.length) {
      return;
    }

    const participantsList: ParticipantListObject = [];
    const participantIds = [];

    for (let i = 0; i < participants.length; i++) {
      const currentParticipant: Participant = participants[i];
      let eventId = null;
      let eventTitle = null;
      let playerProfile: Profile | null = null;
      let playerUser: User | null = null;
      try {
        playerUser = await User.findByPk(currentParticipant.clientId, {
          raw: true,
          attributes: ['email', 'id'],
        });
        if (!playerUser) {
          throw Error(
            `(#000015) playerUser not found ; currentParticipant.clientId: ${currentParticipant.clientId}`
          );
        }
        playerProfile = await Profile.findOne({
          where: { userId: playerUser.id },
          raw: true,
          attributes: ['name', 'id'],
        });
        if (!playerProfile) {
          throw Error(
            `(#000019) playerProfile not found ; playerUser.id: ${playerUser.id}`
          );
        }

        const event = await Event.findByPk(currentParticipant.eventId);

        if (!event) {
          throw Error(
            `(#000020) Event not found ; event.id: ${currentParticipant.eventId}`
          );
        }

        eventId = event.id;
        eventTitle = event.title;
        participantIds.push(currentParticipant.id);

        const participantObject = {
          participantId: currentParticipant.id,
          playerProfileId: playerProfile.id,
          playerUserId: playerUser.id,
          playerEmail: playerUser.email,
          playerName: playerProfile.name,
          eventTitle,
          eventId,
        };
        participantsList.push(participantObject);
      } catch (error: any) {
        logger.error(
          `Error : Failed to add to event review email list. participantId : ${currentParticipant.id}, eventId : ${eventId}, clientProfileId : ${playerProfile?.id}}, message: ${error.message}`
        );
        continue;
      }
    }
    await emailService().sendEventReviewPendingEmail(participantsList);
  }

  return {
    notificationBefore1Hour,
    notificationEveryday9AM,
    reviewNotificationHourly,
  };
};

export default SchedulerService;
