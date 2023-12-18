import { Event } from '../../models';
import { QueryInterface, Sequelize } from 'sequelize/types';
import {
  COACH_1_EMAIL,
  eventDefaultMocks,
  participantDefaultMocks,
  seedUser,
  TRAINEE_1_EMAIL,
  TRAINEE_2_EMAIL,
} from '../user-accounts';
import moment from 'moment';
import { UserTypeEnum } from '../../models/User';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    try {
      console.log('\n\nSeeding users...\n\n');
      const [trainee1, trainee1Profile] = await seedUser(
        TRAINEE_1_EMAIL,
        UserTypeEnum.TRAINEE
      );
      const [trainee2, trainee2Profile] = await seedUser(
        TRAINEE_2_EMAIL,
        UserTypeEnum.TRAINEE
      );
      const [coach1, coach1Profile] = await seedUser(
        COACH_1_EMAIL,
        UserTypeEnum.COACH
      );

      console.log('\n\nSeeding event...\n\n');
      const startDate = moment(new Date()).subtract(1, 'day');

      const coach1Event: Event = await coach1Profile.createEvent({
        ...eventDefaultMocks,
        title: 'Seed: 2 timeslots, 2 participants',
        date: startDate.toDate(),
      });
      const timeslot1EndDate = startDate
        .clone()
        // Plus sign here to convert string into number
        .add(+coach1Event.duration, 'minutes')
        .toDate();

      console.log('\n\nSeeding timeslots...\n\n');
      const timeslot = await coach1Event.createTimeslot({
        timeslot: [startDate.toDate(), timeslot1EndDate],
        startDate: startDate.toDate(),
        endDate: timeslot1EndDate,
        cost: parseInt(coach1Event.cost.toString()),
        maxParticipantsCount: coach1Event.max,
        duration: parseInt(coach1Event.duration.toString()),
      });

      const timeslot2EndDate = moment(timeslot1EndDate)
        // Plus sign here to convert string into number
        .add(+coach1Event.duration, 'minutes')
        .toDate();
      const timeslot2 = await coach1Event.createTimeslot({
        timeslot: [timeslot1EndDate, timeslot2EndDate],
        startDate: timeslot1EndDate,
        endDate: timeslot2EndDate,
        cost: parseInt(coach1Event.cost.toString()),
        maxParticipantsCount: coach1Event.max,
        duration: parseInt(coach1Event.duration.toString()),
      });

      console.log('\n\nSeeding participants...\n\n');
      const trainee1ParticipantTimeslot1 = await coach1Event.createParticipant({
        ...participantDefaultMocks(),
        clientId: trainee1.id,
        coachId: coach1Profile.id,
        timeslotId: timeslot.id,
      });
      const trainee2ParticipantTimeslot1 = await coach1Event.createParticipant({
        ...participantDefaultMocks(),
        clientId: trainee2.id,
        coachId: coach1Profile.id,
        timeslotId: timeslot.id,
      });
      const trainee1ParticipantTimeslot2 = await coach1Event.createParticipant({
        ...participantDefaultMocks(),
        clientId: trainee1.id,
        coachId: coach1Profile.id,
        timeslotId: timeslot2.id,
      });
    } catch (error) {
      console.log('\n\nFailed seed script:\n\n', error, '\n\n\n\n');
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {},
};
