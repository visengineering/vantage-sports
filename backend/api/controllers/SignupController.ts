import { v4 as uuidv4 } from 'uuid';
import { Profile, User, SignupStarted, GeoAddress } from '../models/index';
import { UserTypeEnum } from '../models/Profile';
import { GeoAddressDBType } from '../models/GeoAddress';
import authService from '../services/auth.service';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
const GOOGLE_CLIENT_ID_W = process.env.GOOGLE_CLIENT_ID_W;
const client = new OAuth2Client(GOOGLE_CLIENT_ID_W);
import logger from '../helpers/logger';
import {
  mapInputToReferralSourceId,
  ReferralSourceIdEnum,
} from '../models/ReferralSource';
import { getProfilePathUsingName } from '../helpers/common';
import emailService from '../services/email.service';
import { Request, Response } from 'express';
import AuthController from './AuthController';
import { Op } from 'sequelize';

logger.info(`process.env.GOOGLE_CLIENT_ID_W =`, process.env.GOOGLE_CLIENT_ID_W);

const createGeoAddress = async (geoAddressDB?: GeoAddressDBType) => {
  if (!geoAddressDB) {
    logger.error('(#000041) Error: geoAddressDB data missing: ', geoAddressDB);
    return undefined;
  }
  try {
    const geoAddress = await GeoAddress.create(geoAddressDB);

    logger.info('GeoAddress create result: ', JSON.stringify(geoAddress));

    if (!!geoAddress && !!geoAddress.id) return geoAddress;
    else return undefined;
  } catch (error: any) {
    logger.error(`Failed to create GeoAddress.\n Error: `, error);
    return undefined;
  }
};

const deleteGeoAddress = async (geoAddress: GeoAddress) => {
  try {
    logger.info(
      `Removing entry from GeoAddress table after failed in create Profile.\n GeoAddress:  ${JSON.stringify(
        geoAddress
      )}`
    );
    await geoAddress.destroy();
  } catch (error: any) {
    logger.error(
      `Failed to remove entry in GeoAddress table after failed in create Profile.\n Error: `,
      error
    );
  }
};

export const SignupController = () => {
  const signup = async (req: Request, res: Response) => {
    try {
      const reqBody = req?.body;

      logger.info(
        'Request Body for User Signup',
        JSON.stringify({ ...reqBody, password: 'xyz' }, null, 4)
      );

      reqBody.email = reqBody?.email?.toString().toLowerCase();

      const referralSourceId: ReferralSourceIdEnum | null =
        mapInputToReferralSourceId(reqBody?.referralSource);

      if (!referralSourceId && referralSourceId !== 0) {
        logger.error(
          '(#000041) Error: referralSourceId data missing',
          referralSourceId
        );
        return res.status(400).json({
          status: 400,
          message: 'Referral source must be provided.',
        });
      }

      if (
        !reqBody?.email.toString().trim() ||
        !reqBody?.userType.toString().trim() ||
        !reqBody?.password.toString().trim()
      ) {
        logger.error(
          `(#000058) Email or User Type or Password is missing. Cannot signup without proper data. Values: email=${JSON.stringify(
            reqBody?.email
          )} ; userType=${JSON.stringify(
            reqBody?.userType
          )} ; password=${JSON.stringify(reqBody?.password)}`
        );
        return res.status(400).json({
          status: 400,
          message: 'All user data must be provided to finish signup.',
        });
      }

      const geoAddressDB: GeoAddressDBType | undefined = reqBody?.geoAddressDB;
      const { city, state, postalCode } = geoAddressDB ?? {};

      if (
        !reqBody?.name?.toString().trim() ||
        !reqBody?.userType?.toString().trim() ||
        !reqBody?.cellphone?.toString().trim() ||
        !reqBody?.location?.toString().trim() ||
        !reqBody?.sport?.toString().trim() ||
        !state?.toString().trim()
      ) {
        logger.error(
          `(#000059) Cannot signup without proper profile data. (PS: inflcr, city, zip are optional) Values: ${JSON.stringify(
            {
              name: reqBody?.name,
              userType: reqBody?.userType,
              cellphone: reqBody?.cellphone,
              isPhoneVerified: false,
              inflcr: reqBody.inflcr,
              hometown: reqBody?.location,
              sportId: Number(reqBody?.sport),
              referralSourceId,
              state,
              city,
              zip: postalCode,
            }
          )}`
        );
        return res.status(400).json({
          status: 400,
          message: 'All profile data must be provided to finish signup.',
        });
      }

      const previous_users = await User.findAll({
        where: { email: reqBody?.email },
      });

      if (
        previous_users &&
        Array.isArray(previous_users) &&
        previous_users.length > 0
      ) {
        logger.error(
          `The user name ${reqBody?.email} is in user. User Id : ${previous_users[0].id}`
        );
        return res.status(400).json({
          message: `The user name ${reqBody?.email} is in use. If you have lost your password request a password reset.`,
        });
      }

      logger.info(
        `Creating user with  Email : ${reqBody?.email} ; userType: ${reqBody?.userType}`
      );

      const user = await User.create({
        email: reqBody?.email,
        userType: reqBody?.userType,
        source: reqBody?.source,
        password: reqBody?.password,
        privacyPolicy: true,
        termsOfService: true,
      });

      const profileGeoAddress = await createGeoAddress(geoAddressDB);

      const profileParams = {
        name: reqBody?.name,
        userType: reqBody?.userType,
        cellphone: reqBody?.cellphone,
        isPhoneVerified: false,
        disabledBooking: false,
        inflcr: reqBody.inflcr,
        hometown: reqBody?.location,
        geoAddressId: profileGeoAddress ? profileGeoAddress.id : undefined,
        sportId: Number(reqBody?.sport),
        referralSourceId,
        state,
        city,
        zip: postalCode,
      };

      const profile = await user.createProfile(profileParams);

      if (!profile) {
        logger.error(
          `Failed to create a profile during signup. User account was created but Profile was not created. Signup data (profile): ${JSON.stringify(
            profileParams
          )} ;  `
        );

        if (!!profileGeoAddress) deleteGeoAddress(profileGeoAddress);

        return res.status(400).json({
          status: 400,
          message:
            'Failed to finish signup. Please contact support to resolve this rare issue.',
        });
      }

      logger.info('profile created', JSON.stringify(profile, null, 4));

      const isCoach =
        parseInt(profile.userType) === parseInt(UserTypeEnum.COACH);

      try {
        if (isCoach) {
          const path = await getProfilePathUsingName(profile.name, profile.id);

          await profile.update({
            path,
          });
        }
      } catch (err: any) {
        // Silent failure as it is not essential.
        logger.error(
          `Failed to update path for newly created user. User = ${JSON.stringify(
            user
          )} ; Profile = ${JSON.stringify(profile)} ; error=`,
          err
        );
      }

      const token = authService().issue({
        id: user.id,
        isAdmin: !!user.admin,
        profileId: profile.id,
      });
      logger.info({
        userId: user.id,
        userName: profile.name,
        email: user.email,
      });

      try {
        const prevSignupStartedUser = await SignupStarted.findOne({
          where: { email: reqBody?.email },
        });

        if (prevSignupStartedUser) {
          logger.info(
            `Removing entry from SignupStartedUser: ${reqBody?.email}`
          );
          await prevSignupStartedUser.destroy();
        }
      } catch (err: any) {
        // Silent failure as it is not essential.
        logger.error(
          `Failed to remove entry in SignupStarted table after successful signup. err=`,
          err
        );
      }

      try {
        await emailService().sendSignupWelcomeForNewUser(
          isCoach,
          user,
          profile
        );
      } catch (error: any) {
        logger.error(
          `Failed to send signup email to user :${user.id}, profile: ${profile.id} => Error: ${error?.message}`
        );
      }

      return res.status(200).json({
        user,
        token,
        profile,
        isPhoneVerified: false,
        message: 'Signed up successfully.',
      });
    } catch (error: any) {
      logger.error('Error : Regular Signup', error?.message);
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  };

  const socialSignup = async (req: Request, res: Response) => {
    const reqBody = req?.body;

    logger.info(
      'Request Body for User Signup',
      JSON.stringify({ ...reqBody, password: 'xyz' }, null, 4)
    );

    reqBody.email = reqBody?.email?.toString().toLowerCase();

    const referralSourceId: ReferralSourceIdEnum | null =
      mapInputToReferralSourceId(reqBody?.sReferralSource);

    if (!referralSourceId && referralSourceId !== 0) {
      logger.error(
        '(#000042) Error: referralSourceId data missing',
        referralSourceId
      );
      return res.status(400).json({
        status: 400,
        message: 'Referral source must be provided.',
      });
    }

    if (
      !reqBody?.sEmail?.toString().trim() ||
      !reqBody?.sUserType?.toString().trim()
    ) {
      logger.error(
        `(#000060) Email or User Type or Password is missing. Cannot signup without proper data. Values: email=${JSON.stringify(
          reqBody?.sEmail
        )} ; userType=${JSON.stringify(reqBody?.sUserType)}`
      );
      return res.status(400).json({
        status: 400,
        message: 'All user data must be provided to finish signup.',
      });
    }

    const geoAddressDB: GeoAddressDBType | undefined = reqBody?.geoAddressDB;
    const { city, state, postalCode } = geoAddressDB ?? {};

    if (
      !reqBody?.sName?.toString().trim() ||
      !reqBody?.sUserType?.toString().trim() ||
      !reqBody?.sPhoneNumber?.toString().trim() ||
      !reqBody?.sInflcr?.toString().trim() ||
      !reqBody?.sLocation?.toString().trim() ||
      !reqBody?.sSport?.toString().trim() ||
      !state?.toString().trim()
    ) {
      logger.error(
        `(#000061) Cannot signup without proper profile data. (PS: city, zip are optional) Values: ${JSON.stringify(
          {
            sName: reqBody?.sName,
            sUserType: reqBody?.sUserType,
            sPhoneNumber: reqBody?.sPhoneNumber,
            isPhoneVerified: false,
            sInflcr: reqBody?.sInflcr,
            sLocation: reqBody?.sLocation,
            sSport: Number(reqBody?.sSport),
            referralSourceId,
            state,
            city,
            zip: postalCode,
          }
        )}`
      );
      return res.status(400).json({
        status: 400,
        message: 'All profile data must be provided to finish signup.',
      });
    }

    const {
      sSocialType,
      sPhoneNumber,
      sSocialToken,
      sEmail,
      sUserType,
      source,
      sName,
      sInflcr,
      sSport,
      sLocation,
    } = reqBody;

    let sSocialId;

    if (sSocialType === 'G') {
      try {
        logger.info({
          sSocialType,
          sSocialToken,
          sEmail,
          sUserType: '1',
          source,
          sName: '',
          'Google Client Id': GOOGLE_CLIENT_ID_W,
        });

        const ticket = await client.verifyIdToken({
          idToken: sSocialToken,
          audience: GOOGLE_CLIENT_ID_W ? [GOOGLE_CLIENT_ID_W] : [],
        });
        const payload = ticket.getPayload();

        if (!payload || !payload['sub']) {
          logger.error(
            'Social signup failed. Google payload=',
            JSON.stringify(payload),
            ' ;  req body=',
            JSON.stringify(reqBody)
          );
          return res.status(400).jsonp({
            status: 400,
            message: 'Social signup failed, Please try again.',
          });
        }

        sSocialId = payload.sub;
      } catch (error: any) {
        logger.error(`Google Signup Error: ${error}`);
        return res.status(500).jsonp({
          status: 500,
          message: 'Internal Server Error!',
          data: { isExist: false, sEmail, sName },
        });
      }
    } else if (sSocialType === 'F') {
      try {
        logger.info(
          `SignupController: Facebook Social Token:  ${sSocialToken}`
        );
        const fbRes = await axios.get(
          `https://graph.facebook.com/me?access_token=${sSocialToken}&debug=all&fields=id,email&format=json&method=get&pretty=1&scope=email,public_profile`
        );

        if (!fbRes || (fbRes && !fbRes.data.id)) {
          logger.error(
            'Social signup failed fbRes=',
            JSON.stringify(fbRes),
            ' ;  req body=',
            JSON.stringify(reqBody)
          );
          return res.status(400).jsonp({
            status: 400,
            message: 'Social signup failed, Please try again.',
          });
        }
        if (!fbRes.data.email) {
          logger.error(
            'Social signup failed fbRes=',
            JSON.stringify(fbRes),
            ' ;  req body=',
            JSON.stringify(reqBody)
          );
          return res.status(400).jsonp({
            status: 400,
            message: 'Social signup failed, Please try again.',
          });
        }
        sSocialId = fbRes.data.id;
      } catch (error: any) {
        logger.error(
          `Facebook Signup Error: ${error}`,
          ' ;  req body=',
          JSON.stringify(reqBody)
        );
        return res.status(500).jsonp({
          status: 500,
          message: 'Internal Server Error!',
          data: { isExist: false, sEmail, sName },
        });
      }
    }

    const socialUser = await User.findOne({
      where: {
        [Op.or]: [{ sSocialId }, { email: sEmail }],
      },
    });

    if (socialUser && socialUser.id) {
      logger.error('User already signedup. Logging in user=', socialUser);
      return AuthController.AuthController().socialLogin(req, res);
    }

    const password = uuidv4();
    const newUser = await User.create({
      email: sEmail,
      sSocialId,
      sSocialToken,
      sSocialType,
      password,
      userType: sUserType,
      source,
      privacyPolicy: true,
      termsOfService: true,
    });

    const profileGeoAddress = await createGeoAddress(geoAddressDB);

    const profileParams = {
      name: sName,
      userType: sUserType,
      userId: newUser.id,
      cellphone: sPhoneNumber,
      isPhoneVerified: false,
      disabledBooking: false,
      inflcr: sInflcr,
      hometown: sLocation,
      geoAddressId: profileGeoAddress ? profileGeoAddress.id : undefined,
      sportId: Number(sSport),
      referralSourceId,
      state,
      city,
      zip: postalCode,
    };

    const profile = await Profile.create(profileParams);

    if (!profile) {
      logger.error(
        `Failed to create a profile during social signup. User account was created but Profile was not created. Signup data (profile): ${JSON.stringify(
          profileParams
        )} ;  `
      );

      if (!!profileGeoAddress) deleteGeoAddress(profileGeoAddress);

      return res.status(400).json({
        status: 400,
        message:
          'Failed to finish social signup. Please contact support to resolve this rare issue.',
      });
    }

    logger.info('profile created', JSON.stringify(profile, null, 4));

    const token = authService().issue({
      id: newUser.id,
      isAdmin: !!newUser.admin,
      profileId: profile.id,
    });

    try {
      const prevSignupStartedUser = await SignupStarted.findOne({
        where: { email: sEmail },
      });

      if (prevSignupStartedUser) {
        logger.info(`Removing entry from SignupStartedUser: ${sEmail}`);
        await prevSignupStartedUser.destroy();
      }
    } catch (err: any) {
      // Silent failure as it is not essential.
      logger.error(
        `Failed to Removing entry from SignupStartedUser. email = ${JSON.stringify(
          sEmail
        )} ; reqBody = ${JSON.stringify(reqBody)} ; err=`,
        err
      );
    }

    return res.status(200).json({
      user: newUser,
      token,
      profile,
      isPhoneVerified: false,
      message: 'Signed up successfully.',
    });
  };

  return {
    signup,
    socialSignup,
  };
};

export default { SignupController };
