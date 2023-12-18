import { EventTypeEnum } from '../../models/Event';
import { Profile } from '../../models';
import { User } from '../../models';
import { Event } from '../../models';
import { Participant } from '../../models';
import { MOCK_TIMEZONE } from '../user-accounts';
import moment from 'moment-timezone';
import { UserTypeEnum } from '../../models/User';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    try {
      let playerUsers = [];
      let playerProfiles = [];
      let coachUsers = [];
      let coachProfiles = [];

      const findOrCreateUser = async function (
        type: string,
        index: number
      ): Promise<[User, Profile]> {
        let user: [User, boolean] = await User.findOrCreate({
          where: { email: `${type}${index}@gmail.com` },
          defaults: {
            email: `${type}${index}@gmail.com`,
            password: `${type}`,
            userType:
              type == 'coach' ? UserTypeEnum.COACH : UserTypeEnum.TRAINEE,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        let u: User = user[0];

        let profile = await Profile.findOrCreate({
          where: { userId: `${u.id}` },
          defaults: {
            userId: u.id,
            name: `${type}${index}`,
            userType:
              type == 'coach' ? UserTypeEnum.COACH : UserTypeEnum.TRAINEE,
            sportId: 2,
            universityId: 2,
            city: 'Boston',
            state: 'Massachusetts',
            zip: '06613',
            primaryPositionId: 4,
            secondaryPositionId: 5,
            skill: 'shooting',
          },
        });
        return [u, profile[0]];
      };

      for (let i = 0; i < 20; i++) {
        let [user, profile] = await findOrCreateUser('player', i);
        playerUsers.push(user);
        playerProfiles.push(profile);
      }

      for (let i = 0; i < 3; i++) {
        let [user, profile] = await findOrCreateUser('coach', i);
        coachUsers.push(user);
        coachProfiles.push(profile);
        for (let j = 0; j < 10; j++) {
          const date = moment
            .tz(Date.now(), MOCK_TIMEZONE)
            .add(j, 'minutes')
            .add(i, 'hours');
          console.log('create event');
          let event = await Event.findOrCreate({
            where: {
              profileId: profile.id,
              title: `Timeslots Event ${j} For Coach${i}`,
            },
            defaults: {
              eventType: EventTypeEnum.MULTIPLE_TIMESLOTS,
              profileId: profile.id,
              title: `Event${j} For Coach${i}`,
              cost: 50,
              max: 1000,
              duration: 30,
              sessionType: 'Virtual',
              timezone: MOCK_TIMEZONE,
              date: date.toDate(),
            },
          });
          console.log(`event: ${JSON.stringify(event)}`);

          const timeslotEndDate = date
            .clone()
            .add(30 * j + i, 'minutes')
            .toDate();
          const timeslot = await event[0].createTimeslot({
            timeslot: [date.toDate(), timeslotEndDate],
            startDate: date.toDate(),
            endDate: timeslotEndDate,
            cost: 50,
            maxParticipantsCount: 1000,
            duration: 30,
          });

          console.log(`timeslot: ${JSON.stringify(timeslot)}`);

          for (const playerUser of playerUsers) {
            let participant = await Participant.create({
              clientId: playerUser.id,
              coachId: profile.id,
              eventId: event[0].id,
              paid: true,
              paymentReference: 'paid',
              timezone: 'America/New_York',
              timeslotId: timeslot.id,
            });
          }
        }
      }
    } catch (error) {
      console.log('Failed seed script:\n\n', error, '\n\n');
      throw error;
    }
  },

  down: async (queryInterface: any, Sequelize: any) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
