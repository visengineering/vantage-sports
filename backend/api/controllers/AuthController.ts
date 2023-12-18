import sequelize from 'sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { User, Reset, Profile, Participant, Event } from '../models';
import authService, { JWT_SECRET } from '../services/auth.service';
import bcryptService from '../services/bcrypt.service';
import emailService from '../services/email.service';
import smsService from '../services/sms.service';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { Twilio } from 'twilio';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

const GOOGLE_CLIENT_ID_W = process.env.GOOGLE_CLIENT_ID_W;
const client = new OAuth2Client(GOOGLE_CLIENT_ID_W);

export const extractUserId = (jwt?: string | null) => {
  if (jwt) {
    const { id: userId } = jwtDecode<{ id: number | undefined }>(jwt);
    return userId;
  }
  return undefined;
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

import logger from '../helpers/logger';

export const AuthController = () => {
  const passwordResetRequest = async (req: Request, res: Response) => {
    try {
      if (!req.body?.email) {
        return res.status(401).json({
          msg: 'Email field cannot be empty.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('email')),
          sequelize.fn(
            'lower',
            req.body.email.toString().toLowerCase().trim()
          ) as any
        ),
      });
      if (user) {
        const reset = await Reset.create({
          userId: user.id,
          email: req.body.email.toString().toLowerCase(),
          key: uuidv4(),
        });
        emailService().sendPasswordResetCode(
          user.email,
          `${process.env.REACT_APP_API}/change-password/${reset.key}`
        );
        return res.status(200).json({
          success: true,
        });
      } else {
        return res.status(500).json({
          msg: 'User with this email address does not exist.',
        });
      }
    } catch (err) {
      console.log(
        'Failed to send password reset link',
        err,
        ' ; req body =',
        JSON.stringify(req.body)
      );
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const validateResetRequest = async (req: Request, res: Response) => {
    try {
      const reset = await Reset.findOne({
        where: {
          key: req.body.key,
          createdAt: {
            [Op.gte]: moment(new Date()).subtract(15, 'minutes').toDate(),
          },
        },
      });
      logger.debug(
        'reset date',
        moment(new Date()).subtract(15, 'minutes').toDate()
      );

      if (reset) {
        return res.status(200).json({
          success: true,
          email: reset.email,
        });
      } else {
        return res.status(403).json({ msg: 'Inactive Reset Request' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Inactive Reset Request' });
    }
  };

  const passwordChange = async (req: Request, res: Response) => {
    try {
      const reset = await Reset.findOne({
        where: {
          key: req.body.key,
          createdAt: {
            [Op.gte]: moment(new Date()).subtract(15, 'minutes').toDate(),
          },
        },
      });

      if (!reset) {
        return res.status(403).json({
          msg: 'Reset link has expired. Link was valid only for 15 minutes. Please generate a new one.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('email')),
          sequelize.fn(
            'lower',
            reset.email.toString().toLowerCase().trim()
          ) as any
        ),
      });

      if (user) {
        if (
          await bcryptService().comparePassword(
            req.body.password2,
            user.password
          )
        ) {
          return res.status(403).json({
            msg: 'You used this password previously. Please choose a different one.',
          });
        }
        user.password = req.body.password2;
        await user.save();
        return res.status(200).json({
          success: true,
          key: user.id,
        });
      }

      logger.error(
        `Error while changing password with a reset link. User ${reset.email} not found!`
      );
      return res.status(403).json({
        msg: 'No user found with the email provided.',
      });
    } catch (err) {
      console.log(
        'Password change failure =',
        err,
        ' ; req body =',
        JSON.stringify(req.body)
      );
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const login = async (req: Request, res: Response) => {
    const email = req.body?.email;
    const password = req.body?.password;

    if (email && password) {
      try {
        const user = await User.findOne({
          where: sequelize.where(
            sequelize.fn('lower', sequelize.col('email')),
            sequelize.fn('lower', email.toString().toLowerCase().trim()) as any
          ),
        });

        if (!user) {
          logger.error(`Error : User ${email} as not Found`);
          return res.status(400).json({
            msg: 'Access Denied: User with this email does not exist.',
          });
        }

        if (await bcryptService().comparePassword(password, user.password)) {
          const profile = await Profile.findOne({
            where: { userId: user.id },
          });

          if (!profile) {
            logger.error('Error : profile data missing');
            return res.status(400).jsonp({
              status: 400,
              msg: 'Correct password but your account requires reset due to technical problem. Please contact support for assistance.',
            });
          }
          const token = authService().issue({
            id: user.id,
            isAdmin: !!user.admin,
            profileId: profile.id,
          });
          const resBody = {
            token,
            user,
            profile,
            isPhoneVerified: profile.isPhoneVerified,
            eventsToBeReviewed: [],
          };

          try {
            const eventsToBeReviewed = await getNonReviewedEvents(user.id);
            Object.assign(resBody, { eventsToBeReviewed });
          } catch (err: any) {
            logger.error(
              `Failed to query for non reviewed events. User = ${JSON.stringify(
                user
              )} ; Profile = ${JSON.stringify(profile)} ; error=`,
              err
            );
          }

          return res.status(200).json(resBody);
        }

        logger.error(`Error: User (id) ${user.id} used incorrect password.`);
        return res
          .status(401)
          .json({ msg: 'Access Denied: Incorrect password' });
      } catch (error) {
        logger.error('Error:User login error', error);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    logger.error('Error: Login or password not provided to login function.');
    return res
      .status(400)
      .json({ msg: 'Access Denied: Incorrect Username or Password' });
  };

  const validate = (req: Request, res: Response) => {
    const { token } = req.body;

    authService().verify(token, (err: any) => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  const socialLogin = async (req: Request, res: Response) => {
    let userSocialId;
    let userSocialEmail;
    let userSocialName;
    const { sSocialType, sSocialToken } = req.body;
    if (sSocialType === 'G') {
      try {
        // https://developers.google.com/identity/sign-in/web/backend-auth
        const ticket = await client.verifyIdToken({
          idToken: sSocialToken,
          // Specify the CLIENT_ID of the app that accesses the backend:
          audience: GOOGLE_CLIENT_ID_W ? [GOOGLE_CLIENT_ID_W] : [],
        });
        const payload = ticket.getPayload();

        if (!payload || !payload['sub']) {
          logger.error(
            'Social login failed. Google payload=',
            JSON.stringify(payload),
            ' ;  req body=',
            JSON.stringify(req.body)
          );
          return res.status(400).jsonp({
            status: 400,
            message: 'Invalid Credentials, Please try again.',
          });
        }
        if (!payload.email) {
          return res.status(400).jsonp({
            status: 400,
            message:
              'Google login failed because missing access to user email.',
          });
        }
        if (!payload.email_verified) {
          return res.status(400).jsonp({
            status: 400,
            message: 'Google login failed because user has not verified email.',
          });
        }

        userSocialId = payload.sub;
        userSocialEmail = payload.email;
        userSocialName = payload.name;
      } catch (error: any) {
        logger.error(
          'Social login failed. Google error=',
          error,
          ' ;  req body=',
          JSON.stringify(req.body)
        );
        return res.status(500).jsonp({
          status: 500,
          message: 'Google sign-in failed for unknown reason!',
          data: {
            isExist: false,
            sEmail: userSocialEmail,
            sName: userSocialName,
          },
        });
      }
    } else if (sSocialType === 'F') {
      try {
        const fbRes = await axios.get(
          `https://graph.facebook.com/me?access_token=${sSocialToken}&debug=all&fields=id,name,email&format=json&method=get&pretty=1`
        );

        if (!fbRes || (fbRes && (!fbRes.data.id || !fbRes.data.email))) {
          logger.error(
            'Social login failed. Facebook res=',
            JSON.stringify(fbRes?.data),
            ' ;  req body=',
            JSON.stringify(req.body)
          );
          return res.status(400).jsonp({
            status: 400,
            message: 'Invalid Credentials, Please try again.',
          });
        }

        userSocialId = fbRes.data.id;
        userSocialEmail = fbRes.data.email;
        userSocialName = fbRes.data.name;
      } catch (error: any) {
        logger.error(
          'Social login failed. Facebook error=',
          error,
          ' ;  req body=',
          JSON.stringify(req.body)
        );
        return res.status(500).jsonp({
          status: 500,
          message: 'Facebook sign-in failed for unknown reason!',
          data: {
            isExist: false,
            sEmail: userSocialEmail,
            sName: userSocialName,
          },
        });
      }
    }

    let user = await User.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('email')),
        sequelize.fn(
          'lower',
          userSocialEmail.toString().toLowerCase().trim()
        ) as any
      ),
    });

    if (!user) {
      user = await User.findOne({
        where: { sSocialId: userSocialId },
      });
    }

    if (!user) {
      logger.error(
        'Error: user not registered. sSocialId=',
        userSocialId,
        ' ; email=',
        userSocialEmail,
        ' ; req=',
        JSON.stringify(req?.body)
      );
      return res.status(404).jsonp({
        status: 404,
        message: 'User not found!',
        data: {
          isExist: false,
          sEmail: userSocialEmail,
          sName: userSocialName,
        },
      });
    }

    if ((user && !user.sSocialId) || !user.sSocialToken || !user.sSocialType) {
      await User.update(
        {
          sSocialType,
          sSocialId: userSocialId,
          sSocialToken: sSocialToken,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
    }

    const profile = await Profile.findOne({
      where: { userId: user.id },
    });

    if (!profile) {
      logger.error(
        'Error : Auth with social login failed because profile details are missing. user.id=',
        user.id,
        ' ; sSocialId=',
        userSocialId,
        ' ; email=',
        userSocialEmail,
        ' ; req=',
        JSON.stringify(req?.body)
      );
      return res.status(400).json({
        message:
          'Social login failed. Profile details are missing - please contact support for assistance.',
      });
    }

    const token = authService().issue({
      id: user.id,
      isAdmin: !!user.admin,
      profileId: profile.id,
    });

    const resBody = {
      token,
      user,
      profile,
      isPhoneVerified: profile.isPhoneVerified,
    };

    try {
      const eventsToBeReviewed = await getNonReviewedEvents(user.id);
      Object.assign(resBody, { eventsToBeReviewed });
    } catch (err: any) {
      logger.error(
        `Failed to query for non reviewed events within social login. User = ${JSON.stringify(
          user
        )} ; Profile = ${JSON.stringify(profile)} ; error=`,
        err
      );
    }

    return res.status(200).json(resBody);
  };

  const sendVerificationCode = async (req: Request, res: Response) => {
    try {
      let { phoneNumber } = req && req.body;
      const token = extractJwt(req);
      await authService().verify(token, (err) => {
        if (err) {
          logger.error(
            'Error in sendVerificationCode: auth service verify failed with err=',
            err,
            ' ; req body=',
            JSON.stringify(req.body)
          );
          throw new Error(err);
        }
      });

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_MOBILE_NUMBER;
      const smsVerifyServiceId = process.env.SMS_VERIFY_SERVICE_ID;

      if (!accountSid || !authToken || !twilioNumber || !smsVerifyServiceId) {
        logger.error(
          'Twilio configuration error. Missing environment variables. accountSid=',
          accountSid,
          ' ; authToken=',
          authToken,
          ' ; twilioNumber=',
          twilioNumber,
          ' ; smsVerifyServiceId=',
          smsVerifyServiceId
        );
        return res.status(400).json({
          msg: 'We are experiencing configuration issue. Please immediatelly let our support know. Sorry for the inconvenience.',
          isInvalid: true,
        });
      }

      const client = new Twilio(accountSid, authToken);

      logger.debug({
        accountSid,
        authToken,
        twilioNumber,
        smsVerifyServiceId,
        phoneNumber,
      });

      try {
        if (phoneNumber && phoneNumber.length == 11) {
          await client.lookups.v1.phoneNumbers(`+${phoneNumber}`).fetch();
        } else {
          logger.error(
            'Mobile number is not a valid US phone number',
            phoneNumber,
            ' ; length=',
            phoneNumber.length,
            ' ; req body=',
            JSON.stringify(req.body)
          );
          return res.status(400).json({
            msg: 'Invalid Mobile Number. Please enter a valid mobile number to send verification code',
            isInvalid: true,
          });
        }
      } catch (error: any) {
        logger.error(
          'Error : mobile number is invalid',
          error?.message,
          ' ; entire error object=',
          JSON.stringify(error),
          ' ; req body=',
          JSON.stringify(req.body)
        );

        if (error && error.status === 400) {
          return res.status(400).json({
            msg: 'Invalid Mobile Number. Please enter a valid mobile number to send verification code',
            isInvalid: true,
          });
        }

        return res.status(400).json({
          msg: 'Please check if your mobile number is correct.',
          isInvalid: true,
        });
      }

      const smsConfig = {
        friendlyName: 'Vantage Sports',
        from: twilioNumber,
        to: `+${phoneNumber}`,
        channel: 'sms', //one of sms,email,call
      };

      logger.debug({ smsConfig });

      const response = await client.verify
        .services(smsVerifyServiceId)
        .verifications.create(smsConfig);

      logger.debug(
        'SendVerification response',
        JSON.stringify(response, null, 4)
      );

      if (
        response &&
        response.sendCodeAttempts &&
        response.sendCodeAttempts.length > 5
      ) {
        logger.error(
          'Tried sending mobile verification passcode more than 5 times',
          response
        );
        return res.status(400).json({
          status: 400,
          msg: 'You have tried sending mobile verification passcode request too many times.Please try again after some time.',
          tooManyRequests: true,
        });
      }

      return res.status(200).json({
        status: 200,
        msg: 'Verification Code has been sent to your mobile number.',
      });
    } catch (error: any) {
      logger.error(
        'Error : send verification code response',
        error,
        ' ; req body=',
        JSON.stringify(req.body)
      );
      if (error.status === 429) {
        logger.error('Error : Send verification code : Too many requests');
        return res.status(400).json({
          status: 400,
          msg: 'You have tried sending too many mobile verification passcode requests. Please try again after some time.',
          tooManyRequests: true,
        });
      }

      logger.error(
        'Error: send verification code response status: ',
        error.status
      );
      if (error.status === 403 && error.code === 60205) {
        logger.error(
          'Error: status: 403, Send code: 60205, msg: SMS is not supported by landline phone number'
        );
        return res.status(400).json({
          status: 403,
          code: 60205,
          msg: 'SMS is not supported by landline phone number',
        });
      }

      return res.status(500).json({
        status: 500,
        msg: 'Sending mobile verification passcode failed.',
      });
    }
  };

  const checkVerificationCode = async (req: Request, res: Response) => {
    try {
      const token = extractJwt(req);
      if (token) {
        await new Promise((resolve, reject) => {
          jwt.verify(token, JWT_SECRET, async (err: any) => {
            if (err) {
              return reject(false);
            }
            resolve(true);
          });
        }).catch(() => res.sendStatus(403));

        const userId = extractUserId(token);

        const { phoneNumber, code } = req.body;
        if (!phoneNumber || !code) {
          logger.error(
            '[checkVerificationCode] Missing phonenumber or code. Phone=',
            phoneNumber,
            ' ; code=',
            code
          );
          return res.status(400).json({
            msg: 'Missing phone number or code.',
            isInvalid: true,
          });
        }

        logger.debug({ phoneNumber, code });
        const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        const smsVerifyServiceId = process.env.SMS_VERIFY_SERVICE_ID;
        const client = new Twilio(accountSid, authToken);

        if (!accountSid || !authToken || !smsVerifyServiceId) {
          logger.error(
            '[checkVerificationCode] Twilio configuration error. Missing environment variables. accountSid=',
            accountSid,
            ' ; authToken=',
            authToken,
            ' ; smsVerifyServiceId=',
            smsVerifyServiceId
          );
          return res.status(400).json({
            msg: 'We are experiencing configuration issue. Please let our support know. Sorry for the inconvenience.',
            isInvalid: true,
          });
        }

        // Twilio deletes the verification SID once it’s:
        // * expired (10 minutes)
        // * approved
        // * when the max attempts to check a code have been reached
        // https://stackoverflow.com/questions/71226110/twilio-mobile-number-verification-verificationcheck-was-not-found-on-express
        const response = await client.verify
          .services(smsVerifyServiceId)
          .verificationChecks.create({
            // "to" should follow E.164 standard
            // https://www.twilio.com/docs/glossary/what-e164
            // but we do not explicitly check it, this might be thrown from Twilio as:
            // "Invalid parameter: To"
            to: `+${phoneNumber}`,
            code: `${code}`,
          });

        if (response?.status === 'approved' && response?.channel === 'sms') {
          const profile = await Profile.findOne({
            where: { userId },
          });

          if (!profile) {
            console.error(
              '[checkVerificationCode] User state corrupted. Missing profile. userId=',
              userId,
              ' ; req body=',
              JSON.stringify(req.body)
            );
            return res.status(500).json({
              msg: 'Uknown error. Please contact support.',
            });
          } else {
            const user = await User.findByPk(profile.userId);

            if (!user) {
              console.error(
                '[checkVerificationCode] User state corrupted. Missing user. userId=',
                userId,
                ' ; req body=',
                JSON.stringify(req.body)
              );
              return res.status(500).json({
                msg: 'Uknown user presence error. Please contact support.',
              });
            }

            profile.cellphone = phoneNumber;
            profile.isPhoneVerified = true;
            await profile.save();

            if (moment(user.createdAt).isSame(new Date(), 'day')) {
              // If user registered today then send welcome SMS.
              try {
                logger.info(
                  '__________________Sending new user welcome SMS________________________'
                );
                smsService().sendSignupWelcomeForNewUser(user, profile);
              } catch (error) {
                logger.error(
                  `Phone Verified but failed to send welcome SMS. userId: ${userId} ; profileId: ${profile.id} ; Error: ${error}`
                );
              }
            }

            return res.status(200).json({
              status: 200,
              user,
              profile,
              msg: 'Your mobile number has been successfully verified.',
            });
          }
        }
        logger.error('Error : Invalid otp code', JSON.stringify(req.body));
        return res.status(400).json({
          status: 400,
          isCodeInvalid: true,
          msg: 'Mobile verification passcode is invalid,Please enter a valid code.',
        });
      }
      return res.status(401);
    } catch (error: any) {
      logger.error(
        'Error : Something went wrong with otp verification',
        error?.message,
        ' ; req body=',
        JSON.stringify(req.body)
      );
      return res.status(500).json({ status: 500, msg: 'Something went wrong' });
    }
  };

  const checkPhoneNumberValidation = async (req: Request, res: Response) => {
    const phoneNumber = req.body?.phoneNumber;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      logger.error(
        '[checkVerificationCode] Twilio configuration error. Missing environment variables. accountSid=',
        accountSid,
        ' ; authToken=',
        authToken,
        ' ; req body=',
        JSON.stringify(req?.body)
      );
      return res.status(400).json({
        msg: 'We are experiencing configuration issue. Please let our support know. Sorry for the inconvenience.',
        isInvalid: true,
      });
    }

    const client = new Twilio(accountSid, authToken);

    logger.debug({ accountSid, authToken });

    try {
      const response = await client.lookups.v1
        .phoneNumbers(`+${phoneNumber}`)
        .fetch();

      logger.debug('Send lookups response', JSON.stringify(response));

      if (response?.carrier?.type === 'landline') {
        logger.error(
          'Error: given number is landline phone number',
          ' ; req body=',
          JSON.stringify(req?.body)
        );

        return res.status(400).json({
          status: 403,
          msg: 'SMS is not supported by landline phone number',
          isLandline: true,
        });
      }

      return res.status(200).json({
        status: 200,
        msg: 'This number is valid mobile to send verification code.',
      });
    } catch (error: any) {
      logger.error(
        'Error : mobile number is invalid',
        error.message,
        ' ; req body=',
        JSON.stringify(req?.body)
      );

      if (error && error.status === 400) {
        return res.status(400).json({
          msg: 'Invalid Mobile Number. Please enter a valid mobile number to send verification code',
          isInvalid: true,
        });
      }

      return res.status(400).json({
        msg: 'Please check if your mobile number is correct.',
        isInvalid: true,
      });
    }
  };

  return {
    login,
    validate,
    validateResetRequest,
    passwordResetRequest,
    passwordChange,
    socialLogin,
    sendVerificationCode,
    checkVerificationCode,
    checkPhoneNumberValidation,
  };
};

export default { AuthController };

//Helper functions

export async function getNonReviewedEvents(userId: number) {
  //=============================================================================================
  // query for completed events where given user has participated but has not given the review
  //=============================================================================================
  const participants = await Participant.findAll({
    where: {
      clientId: userId,
      paid: true,
      paymentReference: { [Op.ne]: null },
      toast_notification_sent: false,
      reviewId: null,
    },
  });

  const timeslotIds = participants.map((participant) => participant.timeslotId);

  const pastEventsQuery = Event.getPastEventsQuery();
  const timeslotsQuery = pastEventsQuery.include.filter(
    (t) => t.as === 'timeslots'
  )[0];
  const pastEvents = await Event.findAll({
    ...pastEventsQuery,
    include: [
      ...pastEventsQuery.include.filter((t) => t.as != 'timeslots'),
      {
        ...timeslotsQuery,
        where: {
          ...timeslotsQuery.where,
          id: { [Op.in]: timeslotIds },
          endDate: {
            [Op.lt]: new Date().toJSON(),
          },
        },
      },
    ],
    raw: true,
    attributes: ['id', 'title', 'duration', 'date'],
  });

  const toReviewTimeslotIds: number[] = [];
  const timeNow = moment(new Date());
  const eventsToBeReviewed = pastEvents.filter((event) => {
    return !!event.timeslots?.some((timeslot) => {
      if (moment(timeslot.endDate).isBefore(timeNow)) {
        toReviewTimeslotIds.push(event.id);
        return true;
      }
      return false;
    });
  });

  await Participant.update(
    { toast_notification_sent: true },
    {
      where: {
        clientId: userId,
        timeslotId: { [Op.in]: toReviewTimeslotIds },
        paid: true,
        paymentReference: { [Op.ne]: null },
        toast_notification_sent: false,
        reviewId: null,
      },
    }
  );
  return eventsToBeReviewed;

  //=============================================================================================
}
