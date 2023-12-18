import merge from 'lodash.merge';

import { UserType } from '../types';
import { User } from '../../models';
import { UserInputType } from '../inputTypes';

const updateUser = {
  type: UserType,
  description: 'The mutation that allows you to update an existing User by Id',
  args: {
    user: {
      name: 'user',
      type: UserInputType('update'),
    },
  },
  resolve: async (_: any, { user }: any) => {
    const foundUser = await User.findByPk(user.id);

    if (!foundUser) {
      throw new Error(`User with id: ${user.id} not found!`);
    }

    const updatedUser = merge(foundUser, {
      email: user.email,
    });

    return foundUser.update(updatedUser);
  },
};

const deleteUser = {
  type: UserType,
  description: 'The mutation that allows you to delete a existing User by Id',
  args: {
    user: {
      name: 'user',
      type: UserInputType('delete'),
    },
  },
  resolve: async (_: any, { user }: any) => {
    const foundUser = await User.findByPk(user.id);

    if (!foundUser) {
      throw new Error(`User with id: ${user.id} not found!`);
    }

    await User.destroy({
      where: {
        id: user.id,
      },
    });

    return foundUser;
  },
};

export { updateUser, deleteUser };
export default { updateUser, deleteUser };
