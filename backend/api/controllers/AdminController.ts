import authService from '../services/auth.service';
import { Request } from 'express';
import jwtDecode from 'jwt-decode';
import logger from '../helpers/logger';
import { User, UserTypeEnum } from '../models/User';
import { Profile } from '../models/Profile';
import { Notification } from '../models/Notification';
import { Event } from '../models/Event';
import { Participant } from '../models/Participant';
import { Repeat_Booking } from '../models/Repeat_Booking';
import { Review } from '../models/Review';
import { getProfilePathUsingName } from '../helpers/common';
import { Timeslot } from '../models/Timeslot';

export const extractIsAdmin = (jwt?: string | null) => {
  if (jwt) {
    const { isAdmin } = jwtDecode<{ isAdmin: boolean | undefined }>(jwt);
    return !!isAdmin;
  }
  return false;
};

export const extractJwt = (req: Request) => {
  const tokenInCookies = req?.cookies?.jwt || '';
  let tokenInHeader = req?.headers?.authorization || '';
  const splitted = tokenInHeader && tokenInHeader.split(' ');
  tokenInHeader = (splitted && splitted[1]) || '';
  const tokenInBody = req?.body?.token || '';
  const token = tokenInCookies || tokenInHeader || tokenInBody;
  return token;
};

export const AdminController = () => {
  const rescheduleTraining = async (req: any, res: any) => {
    const {
      participantId,
      currentTimeslotId,
      coachProfileId,
      desiredTimeslotId,
    } = req.body;
    const token = extractJwt(req);
    const isAdmin = extractIsAdmin(token);
    authService().verify(token, async (err: any) => {
      if (err) {
        logger.error(
          'Error: Is not valid JWT and tries to access admin capabilities (reschedule training).'
        );
        return res.status(404).json();
      }

      if (!isAdmin) {
        logger.error('Error: Is not admin and tries to login as someone else.');
        return res.status(404).json();
      }

      if (
        !participantId ||
        !currentTimeslotId ||
        !coachProfileId ||
        !desiredTimeslotId
      ) {
        logger.error('Error: Invalid data.');
        return res
          .status(400)
          .json({ msg: 'Invalid data. Aborted reschedule training.' });
      }

      try {
        const participant = await Participant.findByPk(participantId);

        if (!participant) {
          logger.error(
            `Error : Participant with id ${participantId} not Found - aborting reschedule training.`
          );
          return res.status(400).json({
            msg: `Error : User with id ${participantId} not Found - aborting reschedule training.`,
          });
        }

        if (participant.coachId !== coachProfileId) {
          logger.error(
            `Error : Participant has other coach profile id than the one sent within request - aborting reschedule training.`
          );
          return res.status(400).json({
            msg: `Error : Participant has other coach profile id than the one sent within request - aborting reschedule training.`,
          });
        }

        if (participant.timeslotId !== currentTimeslotId) {
          logger.error(
            `Error : Participant has other timeslot id than the one sent within request - aborting reschedule training.`
          );
          return res.status(400).json({
            msg: `Error : Participant has other timeslot id than the one sent within request - aborting reschedule training.`,
          });
        }

        const currentTimeslot = await Timeslot.findByPk(participant.timeslotId);

        if (!currentTimeslot) {
          logger.error(
            `Error : Trying to reschedule to timeslot id ${participant.timeslotId} but the timeslot was not Found - aborting reschedule training.`
          );
          return res.status(400).json({
            msg: `Error : Trying to reschedule to timeslot id ${participant.timeslotId} but the timeslot was not Found - aborting reschedule training.`,
          });
        }

        const timeslotToRescheduleTo = await Timeslot.findByPk(
          desiredTimeslotId
        );

        if (!timeslotToRescheduleTo) {
          logger.error(
            `Error : Trying to reschedule to timeslot id ${desiredTimeslotId} but the timeslot was not Found - aborting reschedule training.`
          );
          return res.status(400).json({
            msg: `Error : Trying to reschedule to timeslot id ${desiredTimeslotId} but the timeslot was not Found - aborting reschedule training.`,
          });
        }

        // Decrease old timeslot participants count.
        currentTimeslot.participantsCount =
          currentTimeslot.participantsCount - 1;
        currentTimeslot.save();

        // Increase new timeslot participants count.
        // Warning: This might lead to overbooking of that timeslot.
        // This is completely fine provided a need arises and we confirmed this with coach.
        // In the UI admin person receives multiple warnings when trying to choose fully booked timeslot. But it is not prohibitted for flexibility.
        timeslotToRescheduleTo.participantsCount =
          timeslotToRescheduleTo.participantsCount + 1;
        timeslotToRescheduleTo.save();

        // Update participant object after rescheduling.
        // Warining: This might lead to incorrect timeslotId+participantId pair being shown in Stripe, we do not update that.
        participant.eventId = timeslotToRescheduleTo.eventId;
        participant.timeslotId = timeslotToRescheduleTo.id;
        participant.save();

        logger.error(
          `Successful reschedule training based on data: ${JSON.stringify(
            {
              participantId,
              currentTimeslotId,
              coachProfileId,
              desiredTimeslotId,
            },
            null,
            4
          )}`
        );

        return res.status(200).json({});
      } catch (error) {
        logger.error(
          'Error: Failed reschedule training - unknown error: ',
          error
        );
        return res.status(500).json({ msg: 'Internal server error' });
      }
    });
  };
  const loginAs = async (req: any, res: any) => {
    const { userId } = req.body;
    const token = extractJwt(req);
    const isAdmin = extractIsAdmin(token);
    authService().verify(token, async (err: any) => {
      if (err) {
        logger.error(
          'Error: Is not valid JWT and tries to login as someone else.'
        );
        return res.status(404).json();
      }

      if (!isAdmin) {
        logger.error('Error: Is not admin and tries to login as someone else.');
        return res.status(404).json();
      }

      if (!userId) {
        logger.error('Error: Invalid user id.');
        return res.status(400).json({ msg: 'Invalid user id. Aborted login.' });
      }

      try {
        const user = await User.findByPk(userId);

        if (!user) {
          logger.error(
            `Error : User with id ${userId} not Found - aborting login as other user.`
          );
          return res.status(400).json({
            msg: `Error : User with id ${userId} not Found - aborting login as other user.`,
          });
        }

        const profile = await user.getProfile();

        if (!profile) {
          logger.error('Error : profile data missing');
          return res.status(400).jsonp({
            status: 400,
            msg: 'User details are missing, Please contact support for assistance.',
          });
        }

        const token = authService().issue({
          id: user.id,
          isAdmin: true,
          profileId: profile.id,
        });

        return res.status(200).json({
          token,
          user,
          profile,
        });
      } catch (error) {
        logger.error('Error: Login as other user error', error);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    });
  };
  const changeUserType = async (req: any, res: any) => {
    const { userId, userType: userTypeInput } = req.body;
    const userType = userTypeInput.toString();
    const token = extractJwt(req);
    const isAdmin = extractIsAdmin(token);
    authService().verify(token, async (err: any) => {
      if (err) {
        logger.error('Error: Is not valid JWT and tries to changeUserType.');
        return res.status(404).json();
      }

      if (!isAdmin) {
        logger.error('Error: Is not admin and tries to changeUserType.');
        return res.status(404).json();
      }

      logger.info(
        'Logged in as admin and executing changeUserType with userId = ',
        userId,
        ' and userType = ',
        userType
      );

      if (!userId) {
        logger.error('Error: Invalid user id.');
        return res
          .status(400)
          .json({ msg: 'Invalid user id. Aborted change.' });
      }
      if (
        !userType ||
        !(userType === UserTypeEnum.COACH || userType === UserTypeEnum.TRAINEE)
      ) {
        logger.error('Error: Invalid user type userType = ', userType);
        return res
          .status(400)
          .json({ msg: 'Invalid user type. Aborted change.' });
      }

      try {
        const user = await User.findByPk(userId);

        if (!user) {
          logger.error(
            `Error : User with id ${userId} not Found - aborting changed.`
          );
          return res.status(400).json({
            msg: `Error : User with id ${userId} not Found - aborting change.`,
          });
        }

        const profile = await user.getProfile();

        if (!profile) {
          logger.error('Error : profile data missing');
          return res.status(400).jsonp({
            status: 400,
            msg: 'User details are missing, Please contact support for assistance.',
          });
        }

        user.userType =
          userType === UserTypeEnum.COACH
            ? UserTypeEnum.COACH
            : userType === UserTypeEnum.TRAINEE
            ? UserTypeEnum.TRAINEE
            : UserTypeEnum.TRAINEE;
        profile.userType =
          userType.toString() === UserTypeEnum.COACH
            ? UserTypeEnum.COACH
            : userType.toString() === UserTypeEnum.TRAINEE
            ? UserTypeEnum.TRAINEE
            : UserTypeEnum.TRAINEE;

        if (profile.userType === UserTypeEnum.COACH) {
          profile.path = await getProfilePathUsingName(
            profile.name,
            profile.id
          );
        }

        await user.save();
        await profile.save();

        return res.status(200).json({});
      } catch (error) {
        logger.error(
          'Error: Change user type failed, userType = ',
          userType,
          ' and userId = ',
          userId
        );
        logger.error('Above change failed because: ', error);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    });
  };
  const deleteUser = async (req: any, res: any) => {
    const { userProfileId } = req.body;
    const token = extractJwt(req);
    const isAdmin = extractIsAdmin(token);
    authService().verify(token, async (err: any) => {
      if (err) {
        logger.error('Error: Is not valid JWT and tries to deleteUser.');
        return res.status(404).json();
      }

      if (!isAdmin) {
        logger.error('Error: Is not admin and tries to deleteUser.');
        return res.status(404).json();
      }

      logger.info(
        'Logged in as admin and executing deleteUser with userProfileId = ',
        userProfileId
      );

      if (!userProfileId) {
        logger.error('Error: Invalid user profile id.');
        return res
          .status(400)
          .json({ msg: 'Invalid user profile id. Aborted change.' });
      }

      try {
        const userProfile = await Profile.findByPk(userProfileId);
        if (!userProfile || !userProfile.id) {
          logger.error(
            `Error : User with id ${userProfileId} profile not Found - aborting changed.`
          );
          return res.status(400).json({
            msg: `Error : User with id ${userProfileId} profile not Found - aborting change.`,
          });
        }

        const profileId = userProfile.id;
        const userType = userProfile.userType.toString();

        if (userType === UserTypeEnum.COACH) {
          await Event.destroy({
            where: { profileId },
          });

          await Repeat_Booking.destroy({
            where: { coachProfileId: profileId },
          });
        }

        await Repeat_Booking.destroy({
          where: { playerProfileId: profileId },
        });

        await Participant.destroy({
          where: { clientId: userProfile.userId },
        });

        await Review.destroy({
          where: { playerProfileId: profileId },
        });

        await Profile.destroy({
          where: { id: profileId },
        });

        await Notification.destroy({
          where: { userId: userProfile.userId },
        });

        await User.destroy({
          where: { id: userProfile.userId },
        });

        return res.status(200).json({});
      } catch (error) {
        logger.error(
          'Error: Delete user failed for user profile id = ',
          userProfileId
        );
        logger.error('Above change failed because: ', error);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    });
  };

  return {
    rescheduleTraining,
    loginAs,
    deleteUser,
    changeUserType,
  };
};

export default { AdminController };
