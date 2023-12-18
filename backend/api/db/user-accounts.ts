import moment from 'moment';
import { CreationAttributes } from 'sequelize/types';
import { Event, Participant, Profile, User } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { UserTypeEnum } from 'api/models/User';

export const TRAINEE_1_EMAIL =
  process.env.TRAINEE_1_EMAIL ?? 'ajdija+seed-t-1@gmail.com';
export const TRAINEE_2_EMAIL =
  process.env.TRAINEE_2_EMAIL ?? 'ajdija+seed-t-2@gmail.com';
export const COACH_1_EMAIL =
  process.env.COACH_1_EMAIL ?? 'ajdija+seed-c-1@gmail.com';
export const COACH_2_EMAIL =
  process.env.COACH_2_EMAIL ?? 'ajdija+seed-c-2@gmail.com';
export const MOCK_TIMEZONE = 'America/New_York';

export const eventDefaultMocks: Omit<CreationAttributes<Event>, 'profileId'> = {
  title: 'New event from your seeds',
  cost: 50,
  max: 1000,
  duration: 5,
  sessionType: 'Virtual',
  timezone: MOCK_TIMEZONE,
  date: moment(new Date()).add(1, 'day').toDate(),
};
export const participantDefaultMocks: () => Omit<
  CreationAttributes<Participant>,
  'clientId' | 'coachId' | 'eventId' | 'timeslotId'
> = () => ({
  paid: true,
  paymentIntent: uuidv4(),
  paymentReference: uuidv4(),
  email_notification_sent: true,
  timezone: MOCK_TIMEZONE,
});

export const seedUser = async (
  email: string,
  userType: UserTypeEnum
): Promise<[User, Profile]> => {
  const find = (await User.findAll({
    where: {
      email,
    },
    include: [{ model: Profile, as: 'profile' }],
  })) as (User & { profile: Profile })[];
  if (find.length > 0) {
    return [find[0], find[0].profile];
  }
  console.log(`\n\nCreating new user: ${email} ...\n\n`);
  const user: User = await User.create({
    email,
    password: email,
    userType,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const profile: Profile = await user.createProfile({
    name: email,
    sportId: 2,
    userType,
    city: 'Warsaw',
    state: 'Mazowieckie',
    zip: '19300',
    primaryPositionId: 4,
    secondaryPositionId: 5,
    skill: 'shooting',
  });
  return [user, profile];
};
