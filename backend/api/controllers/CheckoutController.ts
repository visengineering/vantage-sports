import {
  Event,
  Media,
  User,
  Profile,
  Participant,
  Repeat_Booking,
  Timeslot,
  FavoriteCoach,
} from '../models';
import db from '../../config/database';
import Sequelize, { Op } from 'sequelize';
import emailService from '../services/email.service';
import authService from '../services/auth.service';
import smsService from '../services/sms.service';
import inflcrService from '../services/inflcr.service';
import Stripe from 'stripe';
import moment from 'moment';
import { convertMsToHours } from '../helpers/common';

const {
  STRIPE_PRIVATE_KEY = 'sk_test_51J3QwRJC0wQjbgOdjd8xENTRRHKMbKRHXSiSXve91F5T6FqU66iGFt4LMncsqRslO65adDt1gMHTm3yTobIjxlIC00Ws1ATNZ7',
  STRIPE_CALLBACK: CALLBACK = 'http://localhost:3000/checkout_callback',
  STRIPE_CANCEL_CALLBACK: CANCEL_CHECKOUT = 'http://localhost:3000/training',
} = process.env;

import logger from '../helpers/logger';
import { extractJwt, extractUserId } from './AuthController';
const stripe = new Stripe(STRIPE_PRIVATE_KEY, { apiVersion: '2020-08-27' });

//43200000 = 12 Hours
const DEFAULT_AVAILABLE_TIME_IN_MS = '43200000';

const TIMESLOT_AVAILABLE_IN_MS =
  process.env.TIMESLOT_AVAILABLE_IN_MILLISECOND || DEFAULT_AVAILABLE_TIME_IN_MS;

export const CheckoutController = () => {
  const createSession = async (req: any, res: any) => {
    try {
      const eventId = req?.body?.eventId;
      const timeslotId = req?.body?.timeslotId;
      const timezone = req?.body?.timezone ?? 'America/New_York';
      let jwt = extractJwt(req);
      const isSignedIn = !!jwt;

      if (!isSignedIn) {
        logger.error('User not signed in');
        return res.status(401).json({ message: 'Please login to checkout.' });
      }

      const playerId = extractUserId(jwt);

      if (!playerId) {
        logger.error('User is not present in JWT.');
        return res.status(401).json({ message: 'Please relogin to checkout.' });
      }
      if (!eventId) {
        return res.status(500).json({ message: 'Event id is missing' });
      }

      const playerProfile = await Profile.findOne({
        where: { userId: playerId },
      });

      if (!playerProfile) {
        return res.status(500).json({ message: 'Player profile is missing.' });
      }

      const event = await Event.findByPk(parseInt(eventId), {
        include: [
          {
            model: Timeslot,
            as: 'timeslots',
            required: true,
            where: {
              id: timeslotId,
            },
            attributes: [
              'id',
              'startDate',
              'endDate',
              'duration',
              'cost',
              'maxParticipantsCount',
            ],
          },
        ],
      });
      if (!event) {
        console.error(
          `Error!!! Checking out for event that does not exist! id=${eventId} (#000001)`
        );
        return res.status(500).json({
          message:
            'Checking out for event that does not exist. Please contact support.',
        });
      }
      if (!event || !event.timeslots || event.timeslots.length === 0) {
        return res
          .status(500)
          .json({ message: 'Timeslot attached to event is missing.' });
      }

      if (
        moment(event.timeslots[0].startDate).isBefore(
          moment().add(TIMESLOT_AVAILABLE_IN_MS, 'milliseconds')
        )
      ) {
        const timeslotAvailableInHours = convertMsToHours(
          TIMESLOT_AVAILABLE_IN_MS
        );
        return res.status(400).json({
          message: `You cannot select training that is starting in ${timeslotAvailableInHours} hours.`,
        });
      }

      const coachProfile = await Profile.findByPk(event.profileId);
      if (!coachProfile) {
        return res.status(500).json({ message: 'Coach Profile is missing' });
      }

      if (coachProfile.disabledBooking) {
        return res.status(400).json({
          message: `This coach is taking a break. You cannot book events from ${coachProfile.name} until coach switches bookings on again.`,
        });
      }

      if (
        event.timeslots[0].participantsCount >=
        event.timeslots[0].maxParticipantsCount
      ) {
        return res.status(422).json({
          message:
            'Given event is already full. Please try to join some other event.',
        });
      }

      const previousParticipant = await Participant.findOne({
        where: {
          clientId: playerId,
          paid: true,
          customer: { [Op.ne]: null },
        },
      });

      const participantBody = {
        clientId: playerId,
        coachId: event.profileId,
        eventId: event.id,
        waiver: true,
        paid: false,
        timezone,
        timeslotId,
        customer: previousParticipant?.customer ?? undefined,
      };

      logger.debug({
        participantsCount: event.participantsCount,
        maxParticipantsAllowd: event.max,
        participantBody: JSON.stringify(participantBody, null, 4),
      });

      const participant = await Participant.create(participantBody);

      //Setting common price_data parameters for stripe session
      const unit_amount = parseFloat(event.timeslots[0].cost.toString()) || 0;
      const currency = 'usd';
      const quantity = 1;

      const image: Media | null = event.mediaId
        ? await Media.findByPk(event.mediaId)
        : null;
      const product_data = image?.url ? { images: [image?.url] } : {};

      const playerUser = await User.findByPk(playerId);
      if (!playerUser) {
        console.error(
          `(#000040) Player user does not exist! playerId=${playerId}`
        );
        return res.status(500).json({
          message: '(#000040) Failed to load user.',
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: participantBody.customer,
        allow_promotion_codes: true,
        client_reference_id: playerId.toString(),
        payment_method_types: ['card'],
        customer_email: participantBody.customer ? undefined : playerUser.email,
        line_items: [
          {
            price_data: {
              unit_amount: unit_amount * 100,
              currency,
              product_data: {
                name: event.title,
                description: `${event.description} With: ${coachProfile?.name} At: ${event?.location} (ref# ${event.id}/${event.timeslots[0].id})`,
                ...product_data,
              },
            },
            quantity,
          },
          {
            price_data: {
              unit_amount,
              currency,
              product_data: {
                name: 'Charity Donation',
                description: `Doug Flutie Jr. Foundation for Autism`,
              },
            },
            quantity,
          },
          {
            price_data: {
              unit_amount: unit_amount * 10,
              currency,
              product_data: {
                name: 'Service Charge',
                description:
                  'We charge a 10% service fee to our clients so that we can keep our service free for college athletes. They keep 100% of their listed session price.',
              },
            },
            quantity,
          },
        ],
        payment_intent_data: {
          setup_future_usage: 'off_session',
        },
        mode: 'payment',
        success_url: `${CALLBACK}?success=true&u=${playerId}&sessionId={CHECKOUT_SESSION_ID}&j=${jwt}&e=${eventId}&p=${playerProfile.id}&ut=${playerProfile.userType}&participantId=${participant.id}&isGuest=false`,
        cancel_url: `${CANCEL_CHECKOUT}/${event.id}`,
      });

      return res.status(200).json({
        sessionId: session.id,
        participantId: participant.id,
      });
    } catch (error: any) {
      logger.error('Error : checkoutController', error);
      return res.status(500).json({ message: error?.message });
    }
  };

  const purchaseComplete = async (req: any, res: any) => {
    try {
      const { checkoutSession = null, participationId = null } = req?.body;
      let userId = req?.body?.userId || null;

      let {
        existingUserBasedOnEmail = null,
        event = null,
        participant = null,
        timeslot = null,
      } = {} as {
        existingUserBasedOnEmail?: null | User;
        event?: Event;
        participant: Participant;
        timeslot: Timeslot;
      };

      if (!userId) {
        logger.error(
          'User id is invalid or doesnt exist',
          JSON.stringify({ reqBody: req.body }, null, 4)
        );
        return res
          .status(400)
          .json({ status: 400, message: 'Not a valid user.' });
      }

      const session = await stripe.checkout.sessions.retrieve(checkoutSession, {
        expand: ['payment_intent'],
      });

      const paymentIntentId = (session.payment_intent as Stripe.PaymentIntent)
        .id;

      const customer = session.customer as string;
      const payment = await stripe.paymentIntents.retrieve(paymentIntentId);

      const participantHasAlreadyPaid = await Participant.hasParticipantPaid(
        paymentIntentId
      );

      logger.debug(
        `Purchase -
         session Id: ${session.id}
         session_customer: ${session.customer}
         session_intent: ${paymentIntentId}
         payment status: ${payment.status}
         customer already paid (duplicate confirmation): ${participantHasAlreadyPaid}
         session_customer_email: ${session.customer_details?.email}
         session_customer_phone: ${(session.customer_details as any)?.phone}`
      );

      await db.transaction(
        { isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
        async (t) => {
          const transactionOptions = { transaction: t, lock: true };

          participant = await Participant.findByPk(
            parseInt(participationId),
            transactionOptions
          );

          const customerEmail = session?.customer_details?.email || null;
          // TODO: Check! Most likely never gets a phone number, at least according to TypeScript
          const customerPhone =
            (session?.customer_details as any)?.phone || null;

          if (customerEmail) {
            //Checking if email entered by user already exists
            existingUserBasedOnEmail = await User.findOne({
              where: { email: customerEmail },
              ...transactionOptions,
            });

            userId = existingUserBasedOnEmail?.id;
          }

          await Participant.update(
            {
              clientId: userId,
              paid: payment.status === 'succeeded',
              paymentReference: checkoutSession,
              customer,
              paymentIntent: paymentIntentId,
            },
            {
              where: { id: participant?.id },
              ...transactionOptions,
            }
          );

          event = await Event.findByPk(participant?.eventId, {
            ...transactionOptions,
            include: [
              {
                model: Timeslot,
                as: 'timeslots',
                required: true,
                where: {
                  id: participant?.timeslotId,
                },
                attributes: [
                  'id',
                  'startDate',
                  'endDate',
                  'duration',
                  'cost',
                  'maxParticipantsCount',
                ],
              },
            ],
          });

          if (!event) {
            console.error('Error!!! EVENT NOT PROVIDED (#000002)');
            return;
          }

          timeslot = await Timeslot.findByPk(
            participant?.timeslotId,
            transactionOptions
          );
          if (!timeslot) {
            console.error('Error!!! TIMESLOT NOT PROVIDED (#000028)');
            return;
          }

          if (!participantHasAlreadyPaid) {
            await event.increment('participantsCount', {
              by: 1,
              transaction: t,
            });
            await timeslot.increment('participantsCount', {
              by: 1,
              transaction: t,
            });

            // Repeat booking table update follow below
            const playerProfile = await Profile.findOne({
              where: { userId },
              raw: true,
              ...transactionOptions,
            });

            if (!playerProfile) {
              console.error('Error!!! PLAYER PROFILE NOT PROVIDED (#000003)');
              return;
            }

            let repeatBooking = await Repeat_Booking.findOne({
              where: {
                coachProfileId: parseInt(event.profileId.toString()),
                playerProfileId: parseInt(playerProfile.id.toString()),
              },
              ...transactionOptions,
            });

            if (!repeatBooking) {
              repeatBooking = await Repeat_Booking.create(
                {
                  coachProfileId: parseInt(event.profileId.toString()),
                  playerProfileId: parseInt(playerProfile.id.toString()),
                  participationCount: 0,
                },
                {
                  ...transactionOptions,
                }
              );
            }
            await repeatBooking.increment('participationCount', {
              by: 1,
              transaction: t,
            });
          }
        }
      );

      const playerUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'email',
          'admin',
          'createdAt',
          'sSocialId',
          'sSocialToken',
          'sSocialType',
          'userType',
        ],
      });
      userId = playerUser?.id;
      if (!event) {
        console.error(
          '\n(#000013) Error!!! EVENT NOT PROVIDED, skipping email/sms sending. \n'
        );
        return;
      }
      if (!timeslot) {
        console.error(
          '\n(#000032) Error!!! TIMESLOT NOT PROVIDED, skipping email/sms sending. \n'
        );
        return;
      }
      if (!playerUser) {
        console.error(
          '\n(#000041) Error!!! playerUser NOT PROVIDED, skipping email/sms sending. \n'
        );
        return;
      }

      const profile = await playerUser.getProfile();
      const token = authService().issue({
        id: playerUser.id,
        isAdmin: !!playerUser.admin,
        profileId: profile.id,
      });

      try {
        emailService().sendTrainingSignup(userId, event, timeslot);
      } catch (error) {
        logger.error(
          `PurchaseComplete: Failed to send training signup EMAIL userId :${userId} Error: ${error}`
        );
      }

      try {
        smsService().sendTrainingSignup(userId, event, timeslot);
      } catch (error) {
        logger.error(
          `PurchaseComplete: Failed to send training signup SMS userId : ${userId} Error: ${error}`
        );
      }

      if (!participant) {
        logger.error(
          `(#000018) reportEarning cannot be called because participant is null`
        );
        throw Error(
          `(#000018) reportEarning cannot be called because participant is null`
        );
      }
      try {
        inflcrService().reportEarning(participant, event);
      } catch (error) {
        logger.error(
          `PurchaseComplete: inflcr send earning error encountered. Error:`,
          error
        );
      }
      try {
        FavoriteCoach.addEntryIfEligible({
          playerProfileId: profile.id,
          coachProfileId: event.profileId,
        });
      } catch (error) {
        logger.error(
          `Failed to add coach as favorite coach of a player. Coach profile id =`,
          event.profileId,
          ', player profile id =',
          profile.id
        );
      }

      return res.status(200).json({
        participantId: participant?.id,
        user: playerUser,
        profile,
        token,
        isToBeLoggedIn: false,
        coachId: event?.profileId,
        event,
      });
    } catch (error: any) {
      logger.error(
        `payment failed Error:${error}, Error Message : ${error?.message}`,
        req.body
      );
      return res
        .status(400)
        .json({ status: 400, message: 'Something went wrong during payment.' });
    }
  };

  return {
    createSession,
    purchaseComplete,
  };
};

export default { CheckoutController };
