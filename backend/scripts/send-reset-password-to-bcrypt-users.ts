import { User } from '../api/models';
import emailService from '../api/services/email.service';

const { Op } = require('sequelize');
(async () => {
  try {
    const UsersWithUUIDPassword = await User.findAll({
      where: {
        password: {
          [Op.regexp]: '([a-f0-9]+-[a-f0-9]+){4}',
        },
      },
    });

    for (const user of UsersWithUUIDPassword) {
      console.log(
        'email with UUID password is = ',
        user.email,
        ' ; password hash: ',
        user.password
      );
      user.password = (Math.random() + 1).toString(36).substring(2);
      user.save();

      await emailService().sendPasswordResetToCorruptedUsers(
        user.email,
        `${process.env.REACT_APP_API}/request-password`
      );
    }
  } catch (error) {
    console.log('Failed migration (up) script:\n\n', error, '\n\n');
    throw error;
  }
})();
