import { Event, Participant, Timeslot } from '../../models';
import { EventTypeEnum } from '../../models/Event';
import { QueryInterface, Sequelize } from 'sequelize/types';
import moment from 'moment-timezone';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    try {
      const result = await queryInterface.sequelize.query(`
        SELECT "Event".id FROM "events" AS "Event" LEFT JOIN "timeslots" on "timeslots"."eventId" = "Event".id
        WHERE ("Event"."eventType" <> '${EventTypeEnum.MULTIPLE_TIMESLOTS}' OR "Event"."eventType" is null) AND "timeslots"."eventId" IS NULL AND "timeslots"."startDate" IS NULL AND "timeslots"."endDate" IS NULL
      `);

      const events: any[] = result[0];

      for (let event of events) {
        console.log('In progress');

        const previousEvent = await Event.findByPk(event.id);

        if (previousEvent) {
          console.log(`Previous event found:: ${previousEvent.title}`);

          if (previousEvent.date) {
            const startDate = moment
              .tz(new Date(previousEvent.date), previousEvent.timezone)
              .toDate();

            const endDate = moment
              .tz(
                moment(startDate)
                  // Plus sign here to convert string into number
                  .add(+previousEvent.duration, 'hours'),
                previousEvent.timezone
              )
              .toDate();

            const timeslot = {
              timeslot: [startDate, endDate],
              startDate: startDate,
              endDate: endDate,
              cost: Number(previousEvent.cost),
              maxParticipantsCount: previousEvent.max,
              duration: Number(+previousEvent.duration * 60),
              isCancelled: previousEvent.isEventCancelled,
              cancelDate: previousEvent.eventCancelDate,
              notificationDate: previousEvent.notificationDate,
              isNotificationProcessed: previousEvent.isNotificationProcessed,
              participantsCount: previousEvent.participantsCount,
            };

            const createdTimeSlot: Timeslot =
              await previousEvent.createTimeslot(timeslot);
            console.log(
              `Timeslot created:: ${timeslot.startDate} for event ${previousEvent.title}`
            );

            if (createdTimeSlot) {
              const participants: Participant[] =
                await previousEvent.getParticipants();

              await Promise.all(
                participants.map((participant: Participant) => {
                  return participant.update({ timeslotId: createdTimeSlot.id });
                })
              );
              console.log('Added timeslots in participants');
            }
          }

          previousEvent.set({
            eventType: EventTypeEnum.LEGACY_ONE_TIME,
          });

          await previousEvent.save();
        }
      }
    } catch (error) {
      console.log('Failed migration up() script:\n\n', error, '\n\n');
      throw error;
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    try {
      const result = await queryInterface.sequelize.query(`
        SELECT id FROM "events" AS "Event" 
          WHERE "Event"."eventType" <> '${EventTypeEnum.MULTIPLE_TIMESLOTS}';
      `);

      const events: any[] = result[0];

      for (let event of events) {
        const previousEvent = await Event.findByPk(event.id);

        if (previousEvent) {
          const participants: Participant[] =
            await previousEvent.getParticipants();

          for (let participant of participants) {
            console.log(`participant updating to null:: ${participant.id}`);
            await participant.update({ timeslotId: null! });
          }

          previousEvent.set({
            eventType: null,
          });

          await previousEvent.save();

          await Timeslot.deleteTimeSlots(event.id);
        }
      }
    } catch (error) {
      console.log('Failed migration down() script:\n\n', error, '\n\n');
      throw error;
    }
  },
};
