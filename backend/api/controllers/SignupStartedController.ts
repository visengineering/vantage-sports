import { Op, where, fn, col } from 'sequelize';
import { SignupStarted, User } from '../models/index';
import logger from '../helpers/logger';

export const SignupStartedController = () => {
  const signupStarted = async (req: any, res: any) => {
    const reqBody = req.body;
    const email = reqBody?.email;

    logger.info(
      'Request Body for signupStarted',
      JSON.stringify({ ...reqBody }, null, 4)
    );

    if (email && email !== '') {
      try {
        const prevUser = await User.findOne({
          where: where(fn('lower', col('email')), {
            [Op.eq]: reqBody.email.toString().toLowerCase().trim(),
          }),
        });

        const prevSignupStartedUser = await SignupStarted.findOne({
          where: { email: email },
        });

        if (prevUser) {
          logger.error(
            `The email ${email} is in user. User Id : ${prevUser.id}`
          );

          if (prevSignupStartedUser) {
            logger.info(`Removing entry from SignupStartedUser: ${email}`);
            await prevSignupStartedUser.destroy();
          }

          return res.status(400).json({
            isUserExists: true,
            message: `The email ${email} is in use. If you have lost your password request a password reset.`,
          });
        }

        if (prevSignupStartedUser) {
          logger.info(
            'Prev signupStartedUser: ',
            JSON.stringify(prevSignupStartedUser, null, 4)
          );

          await prevSignupStartedUser.increment('numberOfTries', {
            by: 1,
          });

          logger.info(
            'Prev signupStartedUser after updated: ',
            JSON.stringify(prevSignupStartedUser, null, 4)
          );

          return res.status(200).json({
            numberOfTries: prevSignupStartedUser.numberOfTries,
          });
        }

        logger.info(`Creating SignupStartedUser with  Email : ${email}`);

        const signupStartedUser = await SignupStarted.create({
          email: email,
        });

        logger.info(
          'SignupStartedUser created: ',
          JSON.stringify(signupStartedUser, null, 4)
        );

        return res.status(200).json({
          numberOfTries: signupStartedUser.numberOfTries,
        });
      } catch (error: any) {
        logger.error(
          `Error: SignupStarted error for email ${email} -> `,
          error?.message
        );
        return res.status(500).json({
          isUserExists: undefined,
          message: 'Something went wrong.',
        });
      }
    }

    logger.error('Access Denied: Incorrect email -> ', email);
    return res.status(400).json({
      isUserExists: undefined,
      message: 'Access Denied: Incorrect email.',
    });
  };

  return {
    signupStarted,
  };
};

export default { SignupStartedController };
