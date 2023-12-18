import axios from 'axios';
import { User, Profile, Participant, Event } from '../models';

import logger from '../helpers/logger';
const INFLCR_ID = process.env.INFLCR || '1a8a826f-0c56-4bda-89e0-da93e9a4da5c';

export const InflcrService = () => {
  const reportEarning = async (participant: Participant, event: Event) => {
    const coachProfile: Profile | null = await Profile.findByPk(
      event.profileId
    );
    if (!coachProfile) {
      throw Error(
        `(#000016) coachProfile not found ; event.profileId: ${event.profileId}`
      );
    }
    const coachUser: User | null = await User.findByPk(coachProfile.userId);
    if (!coachUser) {
      throw Error(
        `(#000017) coachUser not found ; coachProfile.userId: ${coachProfile.userId}`
      );
    }

    if (coachProfile.inflcr != true) {
      logger.info(
        `Coach ${coachProfile.name} , Profile: ${coachProfile.id} was not inflcr and not sent`
      );
      return;
    }

    if (!coachUser.email) {
      logger.error(
        `Inflcr cant be logged as coachId: ${coachUser.id} doesnt have email`
      );
      return;
    }

    const inflcr_payload = {
      user: {
        email: coachUser.email,
      },
      transaction: {
        cost: event.cost,
        date: participant.createdAt,
        identifier: participant.id,
        notes: '',
        payment_type: 'cash',
        name: `EventTitle: ${event.title} EventId: ${event.id} CoachProfile: ${event.profileId} CoachName: ${coachProfile.name} CoachId: ${coachUser.id}`,
        transaction_type: 'camps-and-lessons',
        vendor_name: 'VantageSports',
        vendor_point_of_contact: 'Patrick Johnson',
        vendor_email: 'patrick@vantagesports.com',
        vendor_phone: '19084105277',
      },
    };

    try {
      await axios.post(
        `https://dash.inflcr.com/webhook/transaction/initiative/${INFLCR_ID}`,
        inflcr_payload
      );
    } catch (error: any) {
      logger.error(
        `INFLCR POST ERROR Participant: ${participant?.id} ${error?.message}`
      );
    }
  };

  return {
    reportEarning,
  };
};

export default InflcrService;
