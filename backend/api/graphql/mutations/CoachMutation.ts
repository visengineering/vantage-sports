import merge from 'lodash.merge';
import { CoachType } from '../types';
import { Profile } from '../../models';
import { CoachInputType } from '../inputTypes';
import { getProfilePathUsingName } from '../../helpers/common';

const updateCoach = {
  type: CoachType,
  description: 'The mutation that allows you to update an exsiting Coach by Id',

  args: {
    coach: {
      name: 'coach',
      type: CoachInputType('update'),
    },
  },
  resolve: async (value: any, { coach }: any) => {
    const foundCoach = await Profile.findByPk(coach.id);
    if (!foundCoach) {
      throw new Error(`Coach profile with id: ${coach.id} not found!`);
    }

    if (
      coach.primaryPosition &&
      coach.secondaryPosition &&
      coach.primaryPosition.id === coach.secondaryPosition.id
    ) {
      throw new Error(
        `Primary position must be different than secondary position!`
      );
    }

    if (foundCoach.name !== coach.name) {
      coach.path = await getProfilePathUsingName(coach.name, coach.id);
    }

    if (foundCoach.cellphone !== coach.cellphone) {
      coach.isPhoneVerified = false;
    }

    delete coach.email;
    const updates = merge(foundCoach, coach);

    foundCoach.update(updates);
    if (coach.cellphone !== foundCoach.cellphone)
      foundCoach.isPhoneVerified = false;
    return await foundCoach.save();
  },
};

export { updateCoach };
export default { updateCoach };
