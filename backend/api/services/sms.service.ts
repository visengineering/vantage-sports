import Sequelize, { CreationAttributes } from 'sequelize';
import moment from 'moment-timezone';
import icsService from './ics.calender.service';
import Twilio from 'twilio';
import {
  createNotificationLog,
  updateFailedNotificationLog,
  updateNotificationLog,
} from './notification_logging.service';
import {
  User,
  Profile,
  Participant,
  Notification,
  Event,
  Timeslot,
} from '../models';
import {
  NotificationDeliveryStatus,
  NotificationMedium,
  NotificationType,
} from '../models/Notification';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_MOBILE_NUMBER;
import logger from '../helpers/logger';
import { EventSessionType } from '../models/Event';
import { getRemaingTimeslots } from '../helpers/common';
import { UserTypeEnum } from '../models/Profile';
const client = Twilio(accountSid, authToken);
const { getEventEmailData } = icsService();
const messagingServiceId = process.env.MESSAGE_SERVICE_ID;

const SMSService = () => {
  const sendSMS = async (
    phoneNumber: string,
    smsContent: string,
    notification: { id: number }
  ) => {
    try {
      if (!phoneNumber || (phoneNumber && phoneNumber.length < 10)) {
        logger.error(
          `Sending sms failed. Phone Number ${phoneNumber} invalid or missing. SMS content : ${(
            smsContent + ''
          )?.slice(0, smsContent.indexOf('.'))}`
        );
        throw new Error(
          `Error:Send SMS : Failed to send SMS as number is invalid, cell:${phoneNumber}`
        );
      }

      const smsParams = {
        from: twilioPhoneNumber,
        to: `+${phoneNumber}`,
        body: smsContent,
        messagingServiceId,
      };

      let message: MessageInstance;
      try {
        message = await client.messages.create(smsParams);
      } catch (error: any) {
        logger.error(
          `SMS.Service Error: Failed to create Twillio Client Message usin cell : ${phoneNumber} Error: ${JSON.stringify(
            error
          )}`
        );
        const failureNotificationLogBody = { id: notification?.id };
        await updateFailedNotificationLog(failureNotificationLogBody);

        return;
      }

      if (message && message.sid) {
        const successNotificationLogBody = {
          updateBody: {
            serviceId: message?.sid,
            deliveryStatus: NotificationDeliveryStatus.S,
            updatedAt: new Date(),
          },
          updateWhere: { where: { id: notification?.id } },
        };
        await updateNotificationLog(successNotificationLogBody);

        logger.info(
          `sms sent successfully to ${phoneNumber}, twilio message id :${message.sid}`
        );
        return {
          msg: `SMS sent successfully.`,
          number: phoneNumber,
          success: true,
        };
      } else {
        const failureNotificationLogBody = { id: notification?.id };
        await updateFailedNotificationLog(failureNotificationLogBody);

        logger.error(
          `Error: Failed to send sms ${phoneNumber}, twilio message id : ${
            message && message?.sid
          }`
        );
        return {
          msg: 'Failed to send SMS.',
          number: phoneNumber,
          success: false,
        };
      }
    } catch (error: any) {
      const failureNotificationLogBody = { id: notification?.id };
      await updateFailedNotificationLog(failureNotificationLogBody);
      logger.error(
        `Error :SMS Service---> Sending SMS failed. ${phoneNumber}. ${error.message}`,
        JSON.stringify({ error }, null, 4)
      );
      return true;
    }
  };
  /*********************************************************************/
  const sendTrainingSignup = async (
    userId: number,
    event: Event,
    timeslot: Timeslot
  ) => {
    logger.info(
      `send TrainingSignup SMS: userId: ${userId} event id:${event.id}`
    );
    try {
      const user = await User.findByPk(userId);
      const userProfile = await Profile.findOne({ where: { userId: userId } });

      const [participant] = await Participant.findAll({
        where: {
          clientId: userId,
          eventId: event.id,
        },
        order: [['id', 'DESC']],
        limit: 1,
      });

      const participantTimezone = participant.timezone || 'America/New_York';
      const eventData = await getEventEmailData(event);
      const { coach } = eventData;
      if (!coach) {
        logger.error(
          `(#000009) Coach not in eventData. Profile Id ; ${event?.profileId} , userId : ${userId}`
        );
        throw Error('Coach not in eventData. (#000009)');
      }
      const coachName = eventData['Coach Name'] || 'there';
      const coachCellPhone = coach?.cellphone || '';
      const userCellPhone = userProfile?.cellphone || '';
      const userEmail = user?.email ? user.email : '';
      const isCoachPhoneVerified = coach?.isPhoneVerified || false;
      const isUserPhoneVerified = userProfile?.isPhoneVerified || false;
      const location = eventData['Location'];
      const name = (userProfile && userProfile.name) || ``;

      // SMS to User
      if (userCellPhone && isUserPhoneVerified) {
        // PS: Formatting needs to be that ugly to work properly.
        const smsContent = `
Hi ${name}, You have successfully booked and paid for a session on vantage sports.

Event details:
Title - ${eventData['Event Title'] || '-'}
Date - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('LL')}
Time - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('hh:mm A')}
Location - ${location || '-'}
Link - ${process.env.REACT_APP_API}/training/${event.id}

Need help? -  email info@vantagesports.com or call /  text 908 410 5277.
        `;

        const notificationToUser = {
          type: NotificationType.EV_BOOKED,
          subject:
            'You have successfully booked and paid for a session on vantage sports',
          userId,
          message: smsContent,
          toNumber: userCellPhone,
          notification_medium: NotificationMedium.SMS,
          deliveryStatus: NotificationDeliveryStatus.I,
          eventIds: event?.id ? [event.id] : [],
          userType: '2',
          createdAt: new Date(),
        };

        const notificationDataUser = await createNotificationLog(
          notificationToUser
        );
        if (notificationDataUser) {
          await sendSMS(userCellPhone, smsContent, notificationDataUser);
        } else {
          logger.error(`Send training signup to User FAIL.`);
        }
      } else {
        logger.error(
          `SMSService: Send training signup to User was EXCLUDED due to UserId: ${userId} Cell:${
            userCellPhone && userCellPhone
          } Verified:${!!isUserPhoneVerified} `
        );
      }

      //SMS to Coach
      if (coachCellPhone && isCoachPhoneVerified) {
        // PS: Formatting needs to be that ugly to work properly.
        const smsContent = `
Hi ${coachName}, Congratulations, a client has booked your session on Vantagesports.

Name: ${name}
Email: ${userEmail || '-'}
Cell: ${userCellPhone || '-'}
Date - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('LL')}
Time - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('hh:mm A')}
Location - ${location || '-'}
Link - ${process.env.REACT_APP_API}/training/${event.id}

Need help? - email info@vantagesports.com or call / text 908 410 5277.
        `;

        const notificationToCoach = {
          type: NotificationType.EV_BOOKED,
          subject: 'a client has booked your session on Vantagesports',
          userId: coach.userId,
          toNumber: coachCellPhone,
          message: smsContent,
          notification_medium: NotificationMedium.SMS,
          deliveryStatus: NotificationDeliveryStatus.I,
          eventIds: event?.id ? [event.id] : [],
          userType: '1',
          createdAt: new Date(),
        };

        const notificationDataCoach = await createNotificationLog(
          notificationToCoach
        );

        if (notificationDataCoach) {
          await sendSMS(coachCellPhone, smsContent, notificationDataCoach);
        } else {
          logger.error(`Send training signup to COACH FAIL.`);
        }
      } else {
        logger.error(
          `Send training signup to COACH FAIL due to UserId: ${userId} Cell:${coachCellPhone} Verified:${!!isCoachPhoneVerified}`
        );
        return;
      }
    } catch (error: any) {
      logger.error(
        `Error : Sending Training Signup SMS failed, eventId:${
          event && event.id
        } userId:${userId}, event:${event.title}`
      );
      return;
    }
  };

  /*********************************************************************/

  const sendUpcomingSMSEventNotification = async (
    userId: number,
    event: Event,
    sendToCoach: boolean,
    timeslot: Timeslot
  ) => {
    try {
      const userProfile = await Profile.findOne({ where: { userId: userId } });
      const eventData = await getEventEmailData(event);
      const coach = eventData && eventData.coach;

      if (!coach) {
        logger.error(
          `Failed to send upcoming sms notification  userId: ${userId}, eventId :${event?.id}`
        );
        return;
      }

      const participant = await Participant.findOne({
        where: {
          clientId: userId,
          paid: true,
          eventId: event?.id,
        },
      });

      const participantTimezone = participant?.timezone || 'America/New_York';
      const coachName = eventData['Coach Name'] || 'there';
      const coachCellPhone = coach.cellphone || '';
      const userCellPhone = (userProfile && userProfile.cellphone) || '';
      const isCoachPhoneVerified = coach?.isPhoneVerified || false;
      const isUserPhoneVerified =
        (userProfile && userProfile.isPhoneVerified) || false;
      const location = eventData['Location'];
      const name = (userProfile && userProfile.name) || `there`;
      const remainingMinutesToString = getRemaingTimeslots(
        timeslot.startDate,
        eventData.timezone
      );

      //SMS to User
      if (userCellPhone && isUserPhoneVerified) {
        const smsContent = `
Hi ${name}
Your session begins in ${remainingMinutesToString}.
Event details:
Title - ${eventData['Event Title'] || '-'}
Date - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('LL')}
Time - ${moment
          .tz(new Date(timeslot.startDate), participantTimezone)
          .format('hh:mm a')}
Location - ${location || ''}
${
  eventData['Session Type'].toLowerCase() == 'virtual'
    ? 'Zoom link will be sent 5 mins prior to event start time.'
    : ''
}

Need help? - info@vantagesports.com or call / text 908 410 5277.
      `;

        const isNotificationSent: boolean = !!((await Notification.findOne({
          where: {
            type: 'EV_UPCOMING_REMINDER',
            subject: `Your session begins in ${remainingMinutesToString}.`,
            userId,
            toNumber: userCellPhone,
            notification_medium: 'SMS',
            userType: '2',
            eventIds: {
              [Sequelize.Op.contains]: event.id ? [event.id] : [],
            },
          },
        })) as any);

        if (!isNotificationSent) {
          try {
            const notificationToUser = {
              type: NotificationType.EV_UPCOMING_REMINDER,
              subject: `Your session begins in ${remainingMinutesToString}.`,
              userId,
              message: smsContent,
              toNumber: userCellPhone,
              notification_medium: NotificationMedium.SMS,
              deliveryStatus: NotificationDeliveryStatus.I,
              eventIds: event?.id ? [event.id] : [],
              userType: '2',
              createdAt: new Date(),
            };

            const notificationDataUser = await createNotificationLog(
              notificationToUser
            );

            if (notificationDataUser) {
              await sendSMS(userCellPhone, smsContent, notificationDataUser);
            } else {
              logger.error(
                `Failed to send Upcoming event SMS notification to User==> Id: ${userId} Name:${name}`
              );
            }
          } catch (error: any) {
            logger.error(
              `Error: Failed to send Upcoming event SMS notification to User==> Id: ${userId} Name:${name} Cell : ${userCellPhone} isPhoneVerified: ${isUserPhoneVerified}`
            );
          }
        }
      } else {
        logger.error(
          `Send Upcoming sms to User FAIL due to UserId: ${userId} Cell:${userCellPhone} Verified:${isUserPhoneVerified}`
        );
      }

      //SMS to Coach
      if (!sendToCoach) {
        //This will be the case, when sms is already sent to coach.
        return;
      }

      if (coachCellPhone && isCoachPhoneVerified) {
        const smsContent = `
Hi ${coachName}
Your next session begins in ${remainingMinutesToString}

Event details:
Title - ${eventData['Event Title'] || '-'}
Date - ${moment.tz(new Date(timeslot.startDate), event.timezone).format('LL')}
Time - ${moment
          .tz(new Date(timeslot.startDate), event.timezone)
          .format('hh:mm a')}
Location - ${location || ''}

Need help? - email info@vantagesports.com or call / text 908 410 5277.
      `;
        try {
          logger.info(
            `Send Upcoming event SMS notification to coach==> coach id: ${coach?.id} coach name:${coachName}`
          );

          const notificationToCoach = {
            type: NotificationType.EV_UPCOMING_REMINDER,
            subject: `Your next session begins in ${remainingMinutesToString}.`,
            userId: coach?.userId,
            toNumber: coachCellPhone,
            message: smsContent,
            notification_medium: NotificationMedium.SMS,
            deliveryStatus: NotificationDeliveryStatus.I,
            eventIds: event?.id ? [event.id] : [],
            userType: '1',
            createdAt: new Date(),
          };

          const notificationDataCoach = await createNotificationLog(
            notificationToCoach
          );

          if (notificationDataCoach) {
            await sendSMS(coachCellPhone, smsContent, notificationDataCoach);
          } else {
            logger.error(
              `Failed to send Upcoming event SMS notification to coach==> Id: ${userId} Name:${name}`
            );
          }
        } catch (error: any) {
          logger.error(
            `Error: Failed to send Upcoming event SMS notification to coach==> Id: ${
              coach?.id
            } Name:${coachName} Cell : ${coachCellPhone}   isPhoneVerified: ${isCoachPhoneVerified} sendToCoach:${!!sendToCoach}`
          );
          return;
        }
      } else {
        logger.error(
          `Send Upcoming sms to COACH FAIL as due to UserId: ${userId} Cell:${coachCellPhone} Verified:${isCoachPhoneVerified} sendToCoach :${!!sendToCoach}`
        );
        return;
      }
    } catch (error: any) {
      logger.error(
        `Failed to send upcoming event sms notification ${error} ${JSON.stringify(
          error,
          null,
          4
        )}`
      );
      return;
    }
  };

  /****************************************************************** */
  const sendDailyEventSMSNotification = async (data: any) => {
    try {
      logger.info(
        `SendDailyEventSMSNotification :data count eventsCount ${data.length} `
      );

      for (let i = 0; i < data.length; i++) {
        const { coachUser, events } = data[i];
        try {
          const coachProfile = await coachUser.getProfile();
          logger.info(
            `SendDailyEventSMSNotification coachProfileId: ${coachProfile.id}`
          );
          const coachCellPhone = coachProfile.cellphone;
          const isCoachPhoneVerified = coachProfile.isPhoneVerified;
          const coachName = coachProfile.name || 'there';
          const eventIds = events.map((e: Event) => e.id) || [];

          const todaysEvents = events.filter(
            (event: Event & { timeslots?: Timeslot[] }) =>
              event.timeslots?.filter((t: Timeslot) => !!t.participantsCount)
                .length
          );

          if (!(Array.isArray(todaysEvents) && todaysEvents.length)) {
            logger.error(
              `No booked timeslots found for this coach: ${coachName}, coachCellPhone: ${coachCellPhone}`
            );
            continue;
          }

          let smsContent = `Hi ${coachName}, This is a reminder that you have training sessions today, here are the details:
            ${todaysEvents
              .map((event: Event & { timeslots?: Timeslot[] }) => {
                return !event.timeslots
                  ? []
                  : event.timeslots
                      .filter((t: Timeslot) => !!t.participantsCount)
                      .map(
                        (timeslot: Timeslot) => `
Event details:
Title - ${event.title || ''}
Date - ${moment.tz(timeslot.startDate, event.timezone).format('LL')}
Time - ${moment.tz(timeslot.startDate, event.timezone).format('hh:mm a')}
Location - ${event.location || ''}

${timeslot.participantsCount || 0} participants have joined this training.

${
  (event.sessionType + '').toLowerCase().includes('virtual')
    ? 'Zoom link will be sent 5 mins prior to start time.'
    : ''
}
                    `
                      );
              })
              .join('')}
          `;

          smsContent +=
            'Need help? - info@vantagesports.com or call / text 908 410 5277. ';

          //this the inner coach exception
          try {
            if (coachCellPhone && isCoachPhoneVerified) {
              if (smsContent.length > 1598) {
                smsContent =
                  smsContent.substring(0, 1400) +
                  '.. additional events available on line http://www.vantagesports.com';
              }

              const startOfToday = new Date(
                new Date().setHours(0, 0, 0)
              ).toJSON();
              const currentTime = new Date(
                new Date().setHours(23, 59, 59)
              ).toJSON();
              const isNotificationSent = await Notification.findOne({
                where: {
                  type: 'EV_DAILY_REMINDER',
                  userId: coachUser?.id,
                  userType: '1',
                  eventIds: { [Sequelize.Op.contains]: eventIds },
                  notification_medium: 'SMS',
                  createdAt: {
                    [Sequelize.Op.gt]: startOfToday,
                    [Sequelize.Op.lt]: currentTime,
                  },
                },
              });

              if (isNotificationSent) {
                continue;
              }

              const notificationToCoach = {
                type: NotificationType.EV_DAILY_REMINDER,
                subject:
                  'This is a reminder that you have training sessions today.',
                userId: coachUser?.id,
                toNumber: coachCellPhone,
                message: smsContent,
                notification_medium: NotificationMedium.SMS,
                deliveryStatus: NotificationDeliveryStatus.I,
                eventIds,
                userType: '1',
                createdAt: new Date(),
              };

              const notificationDataCoach = await createNotificationLog(
                notificationToCoach
              );

              const updateBody = { dailyReminderAt: new Date() };
              const updateWhere = {
                where: {
                  dailyReminderAt: null,
                  participantsCount: { [Sequelize.Op.gt]: 0 },
                  id: {
                    [Sequelize.Op.in]: notificationToCoach?.eventIds || [],
                  },
                },
              };
              await Event.update(updateBody, updateWhere);

              if (notificationDataCoach) {
                await sendSMS(
                  coachCellPhone,
                  smsContent,
                  notificationDataCoach
                );
              } else {
                logger.error(
                  `Send Daily SMS to COACH FAIL for coach: ${coachName}`
                );
              }
            } else {
              logger.error(
                `Send Daily SMS to COACH FAIL for coach: ${coachName} Cell:${coachCellPhone} Verified:${isCoachPhoneVerified}`
              );
              continue;
            }
          } catch (error: any) {
            logger.error(
              `Send Daily SMS to all COACHES FAILED coach coach:${coachName} Cell:${coachCellPhone} `,
              JSON.stringify({ error }, null, 4)
            );
            continue;
          }
        } catch (error: any) {
          logger.error(
            `SendDailyEventSMSNotification:Failed to send daily event sms notification coach:${coachUser} event:${events}`
          );
        }
      }
    } catch (error: any) {
      logger.error(
        'Failed to send daily SMS notification',
        JSON.stringify({ error }, null, 4)
      );
      return;
    }
  };
  /*********************************************************************/
  const sendEventCancellationSms = async (
    event: any,
    eventData: any,
    participants: any,
    timeslot: Timeslot
  ) => {
    try {
      participants.forEach(async (participant: any) => {
        const {
          cellphone = null,
          name = 'there',
          isPhoneVerified = false,
          timezone = 'America/New_York',
          clientId: userId,
        } = participant;

        const smsContent = `
Hi ${name}, We are very sorry to let you know that the below scheduled training session has been cancelled. We will be reaching out with details on rescheduling.

Here were the event details:

Event Title : ${eventData['Event Title'] || ''}
Event Date : ${moment.tz(timeslot.startDate, timezone).format('LL')}
Event Time : ${moment.tz(timeslot.startDate, timezone).format('h:mm a')}
Event Type : ${event.sessionType}
Event Duration : ${timeslot.duration}
Event Cost : ${timeslot.cost} USD

Please expect a full refund within 5 to 7 days.

-Team Vantage Sports
        `;

        try {
          if (cellphone && isPhoneVerified) {
            const notificationToUser = {
              type: NotificationType.EV_CANCELLED,
              subject:
                'We are very sorry to let you know that the below scheduled training session has been cancelled.',
              userId,
              message: smsContent,
              toNumber: cellphone,
              notification_medium: NotificationMedium.SMS,
              deliveryStatus: NotificationDeliveryStatus.I,
              eventIds: event?.id ? [event.id] : [],
              userType: '2',
              createdAt: new Date(),
            };

            const notificationDataUser = await createNotificationLog(
              notificationToUser
            );
            if (notificationDataUser) {
              await sendSMS(cellphone, smsContent, notificationDataUser);
            } else {
              logger.error(
                `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
                  participant
                )} Id:${participant.id} Verified:${isPhoneVerified}`
              );
            }
          } else {
            logger.error(
              `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
                participant
              )} Id:${participant.id} Verified:${isPhoneVerified}`
            );
            return;
          }
        } catch (error: any) {
          logger.error(
            `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
              participant
            )} Id:${participant.id} Verified:${isPhoneVerified}`
          );
          return;
        }
      });
    } catch (error: any) {
      logger.error(
        'Failed to send cancellation sms to user',
        JSON.stringify({ error }, null, 4)
      );
      return;
    }
  };
  /*********************************************************************/
  const sendSignupWelcomeForNewUser = async (
    user: User,
    userProfile: Profile
  ) => {
    try {
      const smsContent =
        user.userType === UserTypeEnum.COACH
          ? 'Thanks for signing up for Vantage Sports! Please take a few minutes to set up your profile and set your training availability. More on how to do that here: https://leeward-crime-ef4.notion.site/Set-Availability-Feature-b5926d5d0c334affa86fd0055b37d59f'
          : 'Thanks for signing up to Vantage Sports, This is Yosef, I&apos;m a current D1 Lacrosse Player. Myself and our hundreds of other college athletes are excited to help you take your game to the next level. Check out our site to see if there is a coach in your area! video: https://youtube.com/shorts/340VZkEI7kg?feature=share';
      if (userProfile.isPhoneVerified) {
        const notificationToUser = {
          type: NotificationType.WELCOME_USER,
          subject: `${userProfile.name} welcome to Vantage Sports!`,
          userId: user.id,
          message: smsContent,
          toNumber: userProfile.cellphone,
          notification_medium: NotificationMedium.SMS,
          deliveryStatus: NotificationDeliveryStatus.I,
          eventIds: [-1],
          userType: user.userType,
          createdAt: new Date(),
        };

        const notificationDataUser = await createNotificationLog(
          notificationToUser
        );
        if (notificationDataUser) {
          await sendSMS(
            userProfile.cellphone,
            smsContent,
            notificationDataUser
          );
        } else {
          logger.error(`Send welcome SMS to new user FAIL.`);
        }
      } else {
        logger.error(`Send welcome SMS to new user FAIL.`);
        return;
      }
    } catch (error: any) {
      logger.error(
        'Failed to send sendSignupWelcomeForNewUser sms',
        JSON.stringify({ error }, null, 4)
      );
      return;
    }
  };
  /*********************************************************************/
  const sendTimeslotCancellationSms = async (
    event: any,
    eventData: any,
    participants: any,
    timeslot: Timeslot
  ) => {
    try {
      participants.forEach(async (participant: any) => {
        const {
          cellphone = null,
          name = 'there',
          isPhoneVerified = false,
          timezone = 'America/New_York',
          clientId: userId,
        } = participant;

        const smsContent = `
Hi ${name}, We are very sorry to let you know that the below scheduled training session has been cancelled. We will be reaching out with details on rescheduling.

Here were the event details:

Event Title : ${eventData['Event Title'] || ''}
Event Date : ${moment.tz(timeslot.startDate, timezone).format('LL')}
Event Time : ${moment.tz(timeslot.startDate, timezone).format('h:mm a')}
Event Type : ${event.sessionType}
Event Duration : ${timeslot.duration}
Event Cost : ${timeslot.cost} USD

Please expect a full refund within 5 to 7 days.

-Team Vantage Sports
        `;

        try {
          if (cellphone && isPhoneVerified) {
            const isNotificationSent = await Notification.findOne({
              where: {
                type: NotificationType.TS_CANCELLED,
                subject:
                  'We are very sorry to let you know that the below scheduled training session has been cancelled.',
                userId: participant.id,
                message: smsContent,
                toNumber: cellphone,
                notification_medium: NotificationMedium.SMS,
                deliveryStatus: NotificationDeliveryStatus.I,
                userType: '2',
                eventIds: {
                  [Sequelize.Op.contains]: event?.id ? [event.id] : [],
                },
              },
            });

            if (isNotificationSent) {
              return;
            }

            const notificationToUser = {
              type: NotificationType.TS_CANCELLED,
              subject:
                'We are very sorry to let you know that the below scheduled training session has been cancelled.',
              userId: participant.id,
              message: smsContent,
              toNumber: cellphone,
              notification_medium: NotificationMedium.SMS,
              deliveryStatus: NotificationDeliveryStatus.I,
              eventIds: event?.id ? [event.id] : [],
              userType: '2',
              createdAt: new Date(),
            };

            const notificationDataUser = await createNotificationLog(
              notificationToUser
            );

            if (notificationDataUser) {
              await sendSMS(cellphone, smsContent, notificationDataUser);
            } else {
              logger.error(
                `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
                  participant
                )} Id:${participant.id} Verified:${isPhoneVerified}`
              );
            }
          } else {
            logger.error(
              `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
                participant
              )} Id:${participant.id} Verified:${isPhoneVerified}`
            );
            return;
          }
        } catch (error: any) {
          logger.error(
            `Send Cancellation SMS to Participant FAIL due to participant: ${JSON.stringify(
              participant
            )} Id:${participant.id} Verified:${isPhoneVerified}`
          );
          return;
        }
      });
    } catch (error: any) {
      logger.error(
        'Failed to send cancellation sms to user',
        JSON.stringify({ error }, null, 4)
      );
      return;
    }
  };

  /*********************************************************************/
  const sendUpdatedLocationSMSEventNotification = async (
    event: any,
    eventData: any,
    participants: any
  ) => {
    try {
      participants.forEach(async (participant: any) => {
        const {
          cellphone = null,
          name = 'there',
          isPhoneVerified = false,
          timezone = 'America/New_York',
          clientId: userId,
        } = participant;

        const locationText =
          event.sessionType == 'In-Person'
            ? `has changed locations to ${event.location}`
            : `has changed to a virtual session`;

        const smsContent = `
Hi ${name}, We are letting you know that your scheduled Event: "${eventData['Event Title']}" ${locationText}.
-Team Vantage Sports
        `;

        try {
          if (cellphone && isPhoneVerified) {
            const notificationToUser: CreationAttributes<Notification> = {
              type: NotificationType.EV_UPDATED_LOCATION,
              subject: `Your Event ${eventData['Event Title']} ${locationText}`,
              userId,
              message: smsContent,
              toNumber: cellphone,
              notification_medium: NotificationMedium.SMS,
              deliveryStatus: NotificationDeliveryStatus.I,
              eventIds: event?.id ? [event.id] : [],
              userType: '2',
              createdAt: new Date(),
            };

            const notificationDataUser = await createNotificationLog(
              notificationToUser
            );
            if (notificationDataUser) {
              await sendSMS(cellphone, smsContent, notificationDataUser);
            } else {
              logger.error(
                `Send Updated Location SMS to Participant FAIL due to participant: ${JSON.stringify(
                  participant
                )} Id:${participant.id} Verified:${isPhoneVerified}`
              );
            }
          } else {
            logger.error(
              `Send Updated Location SMS to Participant FAIL due to participant: ${JSON.stringify(
                participant
              )} Id:${participant.id} Verified:${isPhoneVerified}`
            );
            return;
          }
        } catch (error: any) {
          logger.error(
            `Send Updated Location SMS to Participant FAIL due to participant: ${JSON.stringify(
              participant
            )} Id:${participant.id} Verified:${isPhoneVerified}`
          );
          return;
        }
      });
    } catch (error: any) {
      logger.error(
        'Failed to send updated location sms to user',
        JSON.stringify({ error }, null, 4)
      );
      return;
    }
  };

  type NotificationEventCreateConfirmation = {
    coachId: User['id'];
    attachments: any; // TODO: improve types
    coachName: string;
    eventId: number /* Important: eventId, not timeslotId */;
    eventTitle: string;
    timeslots: Timeslot[];
    timezone: string;
    eventLocation: string;
    coachCellPhone: string;
    isPhoneVerified: boolean;
    eventSessionType: EventSessionType;
  };

  /*********************************************************************/
  const sendEventCreateConfirmation = async ({
    coachId,
    coachName,
    eventId /* Important: eventId, not timeslotId */,
    eventTitle,
    timeslots,
    timezone,
    eventLocation,
    eventSessionType,
    coachCellPhone,
    isPhoneVerified,
  }: NotificationEventCreateConfirmation) => {
    try {
      const coachUser = await User.findByPk(coachId);
      if (!coachUser) {
        logger.error(`Failed coach select on DB. Coach: ${coachId} (userId)`);
        throw Error('Coach select didnt work (#000004)');
      }
      if (coachCellPhone && isPhoneVerified) {
        const smsContent = `
Hi ${coachName},

You have successfully created a session on Vantage Sports.
You will receive a notification if and when clients book your event as a well as a reminder one hour before the event.

Title - ${eventTitle || ''}
Type - ${eventSessionType}
Location - ${eventLocation || ''}
Max Participants - ${timeslots[0].maxParticipantsCount || 0}

Dates:
${timeslots
  .map(
    (timeslot: Timeslot, id) => `
        ${id + 1}) ${moment
      .tz(timeslot.startDate, timezone)
      .format('LL hh:mm a')}
      `
  )
  .join('')}

If you have any questions or need support please email info@vantagesports.com or call +1908 410 5277
         `;

        const notificationToCoach = {
          type: NotificationType.EV_CREATE,
          userId: coachUser?.id,
          toEmail: coachUser?.email,
          message: smsContent,
          deliveryStatus: NotificationDeliveryStatus.I,
          eventIds: eventId ? [eventId] : [],
          userType: '1',
          subject: 'Vantage Sports Event Created',
          toNumber: coachCellPhone,
          notification_medium: NotificationMedium.SMS,
          createdAt: new Date(),
        };

        const notificationDataCoach = await createNotificationLog(
          notificationToCoach
        );

        if (notificationDataCoach) {
          if (smsContent.length > 1598) {
            // Substring added in case somebody goes really overboard with number of timeslots
            // https://www.twilio.com/docs/api/errors/21617
            const finalSmsContent =
              smsContent.substring(0, 1500) +
              '.. additional events available on line http://www.vantagesports.com';
            await sendSMS(
              coachCellPhone,
              finalSmsContent,
              notificationDataCoach
            );
          } else {
            await sendSMS(coachCellPhone, smsContent, notificationDataCoach);
          }
        } else {
          logger.error(
            `Send Event Created SMS to Coach FAIL for coach: ${coachName}`
          );
        }
      } else {
        logger.error(
          `Send Event Created SMS to Coach FAIL due to coach: ${coachName} Id:${coachId} Verified:${isPhoneVerified}`
        );
      }
    } catch (error: any) {
      logger.error(
        `Failed to send create event email notification. Coach: ${coachId} (userId)`
      );
    }
  };

  /*********************************************************************/
  return {
    sendSMS,
    sendEventCreateConfirmation,
    sendUpcomingSMSEventNotification,
    sendTrainingSignup,
    sendSignupWelcomeForNewUser,
    sendDailyEventSMSNotification,
    sendEventCancellationSms,
    sendTimeslotCancellationSms,
    sendUpdatedLocationSMSEventNotification,
  };
};

export default SMSService;
