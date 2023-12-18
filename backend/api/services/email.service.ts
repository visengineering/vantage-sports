import Sequelize, { CreationAttributes } from 'sequelize';
import moment from 'moment-timezone';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import icsService from './ics.calender.service';
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
  FavoriteCoach,
} from '../models';
import {
  NotificationDeliveryStatus,
  NotificationMedium,
  NotificationType,
} from '../../api/models/Notification';
import logger from '../helpers/logger';
import { EventSessionType } from 'api/models/Event';
import { getRemaingTimeslots } from '../helpers/common';
import { resolve } from 'path';
const { createICSEvent, createICSAttachment } = icsService();

export type ParticipantListItem = {
  participantId: number;
  playerProfileId: number;
  playerUserId: number;
  playerEmail: string;
  playerName?: string;
  eventTitle: string;
  eventId: number;
};

export type ParticipantListObject = ParticipantListItem[];

const beforeEmail = (
  title: string
) => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
  <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
  <title></title>

    <style type="text/css">
      table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_html_1 .v-container-padding-padding { padding: 8px !important; } }
@media only screen and (min-width: 520px) {
  .u-row {
    width: 100% !important;
  }
  .u-row .u-col {
    vertical-align: top;
  }

  .u-row .u-col-100 {
    width: 100% !important;
  }

}

@media (max-width: 520px) {
  .u-row-container {
    max-width: 100% !important;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .u-row .u-col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important;
  }
  .u-row {
    width: calc(100% - 40px) !important;
  }
  .u-col {
    width: 100% !important;
  }
  .u-col > div {
    margin: 0 auto;
  }
}
body {
  margin: 0;
  padding: 0;
}

table,
tr,td {
  vertical-align: top;
  border-collapse: collapse;
}


p {
  margin: 0;
}

.ie-container table,
.mso-container table {
  table-layout: fixed;
}

* {
  line-height: inherit;
}

a[x-apple-data-detectors='true'] {
  color: #000000 !important;
  text-decoration: none !important;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
table{
font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
a{
text-decoration:none;
font-weight:400px;
}

</style>



</head>

<body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF;color: #000000">
  <!--[if IE]><div class="ie-container"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="Margin: 0 auto;min-width: 100%;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: #FFFFFF;"><![endif]-->

<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color: #FFFFFF;width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
<div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
  <div style="background-color: #FFFFFF;width: 100% !important;">
  <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

  <h3 style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-weight: normal; font-family: arial,helvetica,sans-serif; font-size: 18px;">
    <strong>${title}</strong>
  </h3>

      </td>
    </tr>
  </tbody>
</table>

<table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

<table id="u_content_html_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
  <tbody>
    <tr>
      <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:25px;font-family:arial,helvetica,sans-serif;" align="left">
  <div>
    `;
const afterEmail = `<br/><br/>
<footer>
Thanks,<br/>
Patrick
</footer>
  </div>

      </td>
    </tr>
  </tbody>
</table>

  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
  </div>
</div>
<!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>


    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
  </tr>
  </tbody>
  </table>
  <!--[if mso]></div><![endif]-->
  <!--[if IE]></div><![endif]-->
</body>

</html>`;

const coachContent = `
  <div>
    Thanks for signing up for Vantage Sports! My name is Yosef and I'm a D1 lacrosse player.  Patrick and I have set up a platform for all college athletes to make money via NIL by giving private lessons, recruiting advice and virtual instruction to aspiring college athletes. <br />
  </div>
  <br />
  <div>
    To get started, set up your profile and list your training availability. Here is a
    <a
      href="https://streaklinks.com/BE3WaSCKimpegTwUQwF2Qg1-/https%3A%2F%2Fleeward-crime-ef4.notion.site%2FSet-Availability-Feature-b5926d5d0c334affa86fd0055b37d59f"
      target="_blank"
      data-saferedirecturl="https://streaklinks.com/BE3WaSCKimpegTwUQwF2Qg1-/https%3A%2F%2Fleeward-crime-ef4.notion.site%2FSet-Availability-Feature-b5926d5d0c334affa86fd0055b37d59f"
      >guide on how to set your availability.</a
    >
    .&nbsp;
  </div>
  <br />
  <div>
    If you have any questions, don't hesitate to reach out to Patrick at 908-410-5277 or 
    <a
      email="patrick@vantagesports.com"
      target="_blank"
      >patrick@vantagesports.com</a
    >
    and someone from our team will be in touch.
  </div>
`;

const traineeContent = `
  <div>
    Thanks for signing up for Vantage Sports! I'm Yosef, a current D1 Lacrosse
    Player (you may have seen me on Tik Tok). Myself&nbsp;and our hundreds of
    other college&nbsp;athletes are excited to help you take your&nbsp;game to
    the next level.<br />
  </div>
  <br />
  <div>
    To get started browse our
    <a
      href="https://streaklinks.com/BE3SVmGDw5ERR6hrOw0bbXM9/https%3A%2F%2Fwww.vantagesports.com%2Fhome"
      target="_blank"
      data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BE3SVmGDw5ERR6hrOw0bbXM9/https%253A%252F%252Fwww.vantagesports.com%252Fhome&amp;source=gmail&amp;ust=1655213067762000&amp;usg=AOvVaw0mGGdspx9uEq6ebBm_JS-M"
      >available training&nbsp;sessions</a
    >
    , browse by&nbsp;
    <a
      href="https://streaklinks.com/BE3SVmO394VjSgTPxwS63t0B/https%3A%2F%2Fwww.vantagesports.com%2Fcoaches"
      target="_blank"
      data-saferedirecturl="https://www.google.com/url?q=https://streaklinks.com/BE3SVmO394VjSgTPxwS63t0B/https%253A%252F%252Fwww.vantagesports.com%252Fcoaches&amp;source=gmail&amp;ust=1655213067762000&amp;usg=AOvVaw3KkEBJLazWIu40Gx8GjxIK"
      >college athletes</a
    >
    .&nbsp;
  </div>
  <br />
  <div>
    Not finding what you are looking for on our site?
    <a
      href="https://streaklinks.com/BE3SVmKb2wjR80yE5Qq8PgW3/https%3A%2F%2Fg6ey57cftos.typeform.com%2Fto%2FNcm0mRzv"
      target="_blank"
      >Fill out this request form</a
    >
    and someone from our team will be in touch.
  </div>
  <br />
  <div>
    Keep an eye on the IG and Tik Tok for playlist, workouts and
    recruiting&nbsp;tips!
  </div>
`;

const createSignupEmailContent = (isCoach: boolean, name: string) => `
<!Doctype html>
<head>
<style>
body {
  font-family: Arial;
}
table {
  border: none;
  border-collapse: collapse;
}

td {
  border-width: 1pt;
  border-style: solid;
  border-color: rgb(255, 255, 255);
  vertical-align: top;
  padding: 5pt;
  overflow: hidden;
}

td > span {
  border: none;
  display: inline-block;
  overflow: hidden;
  width: 105px;
  height: 105px;
}

.border-vertical {
  border-color: rgb(255, 255, 255) rgb(14, 62, 172) rgb(255, 255, 255)
    rgb(255, 255, 255);
}

td > p {
  line-height: 1.8;
  margin-top: 0pt;
  margin-bottom: 0pt;
}

td > p span {
  font-size: 10pt;
  font-family: Arial;
  background-color: transparent;
  font-variant-numeric: normal;
  vertical-align: baseline;
  white-space: pre-wrap;
}
.span-head {
  color: rgb(102, 102, 102);
}
.span-name {
  font-size: 11.5pt;
  background-color: transparent;
  font-weight: 700;
  text-decoration-line: underline;
}

.span-vantage {
  color: rgb(0, 0, 0);
}
.span-tiktok {
  font-size: 11pt;
  color: rgb(0, 0, 0);
  white-space: inherit;
}
.span-play {
  font-size: 11pt;
  color: rgb(0, 0, 0);
}
.text-center {
  line-height: 1.2;
  text-align: center;
  margin-top: 0pt;
  margin-bottom: 0pt;
}
.border-horizontal {
  border-width: 1pt;
  border-style: solid;
  border-color: rgb(255, 255, 255) rgb(255, 255, 255)
    rgb(14, 62, 172);
  vertical-align: top;
  padding: 5pt;
  overflow: hidden;
}
</style>
</head>
<body>
  <div>
    <div>Hi ${name}</div>
    <br />
    ${isCoach ? coachContent : traineeContent}
    <br />
    <div>Yosef</div>
    <span>
      <table>
        <colgroup>
          <col width="122" />
          <col width="151" />
          <col width="256" />
        </colgroup>
        <tbody>
          <tr style="height: 102.75pt;">
            <td>
              <br />
              <span>
                <img
                  src="https://lh4.googleusercontent.com/bID5xoBGXf4e7vzntbcHQYDJGtea22i25RD8UH_Lhg4d_d1OSNb5xdkv4nA5bcylOKXP40gKifXjmXcSulSTh0km77iekIsdul82G3ECdzS1f8hxQfjE1qheBuNCkI8IYW7vMAj1FbWPGwEIHg"
                  width="155.04496402877697"
                  height="105"
                  style="margin-top: 0px;"
                  class="CToWUd a6T"
                  tabindex="0"
                />
              </span>
            </td>

            <td class="border-vertical">
              <br />
              <p>
                <a
                  href="mailto:yosefngowe@gmail.com"
                  style="text-decoration-line: none;"
                  target="_blank"
                  ><span class="span-name">Yosef Ngowe</span
                  ></a
                >
              </p>
              <p>
                <span class="span-head">Head of Marketing</span>
              </p>
              <p>
                <span class="span-vantage">Vantage Sports</span>
              </p>
              <p>
                <a
                  href="https://www.vantagesports.com/"
                  style="text-decoration-line: none;"
                  target="_blank"
                >
                  <span>vantagesports.com</span>
                </a>
              </p>
            </td>
            <td>
              <br />
              <br />
              <br />
            <p class="text-center">
              <span class="span-play">Play it Forward.</span>
            </p>
            <p class="text-center">
              <span class="span-tiktok">
                <a
                  href="https://streaklinks.com/BE3SVmK5udKF7XIivQuHaYSk/https%3A%2F%2Fwww.tiktok.com%2F%40yosefvtg%3Flang%3Den"
                  target="_blank"
                >
                  Check us out on Tik Tok
                </a>
              </span>
            </p>
          </td>
          </tr>
          <tr style="height: 17.8989pt;">
            <td class="border-horizontal">
              <br />
            </td>
            <td class="border-horizontal">
              <br />
            </td>
            <td class="border-horizontal">
              <br />
            </td>
          </tr>
          <tr style="height: 36.6489pt">
            <td
              style="
                border-width: 1pt;
                border-style: solid;
                border-color: rgb(14, 62, 172) rgb(255, 255, 255) rgb(255, 255, 255);
                vertical-align: top;
                padding: 5pt;
                overflow: hidden;
              "
            >
              <br />
              <p style="line-height: 1.2; margin-top: 0pt; margin-bottom: 0pt">
                <span
                  style="
                    font-size: 7pt;
                    font-family: Arial;
                    color: rgb(0, 0, 0);
                    background-color: transparent;
                    font-variant-numeric: normal;
                    font-variant-east-asian: normal;
                    vertical-align: baseline;
                    white-space: pre-wrap;
                  "
                  ><span
                    style="
                      border: none;
                      display: inline-block;
                      overflow: hidden;
                      width: 109px;
                      height: 31px;
                    "
                    ><img
                      src="https://lh6.googleusercontent.com/aKwC_Lzy3sVjVB2owRKFmfY8X9eRnykYHt8KbHNQwf8uMA8aiDqWGMWS8Jexf-JHR2dQQFhRifPi6m76yDHUiKbA5kl0QssmIHckAXZUK3Mmi5VtsVxu5Rbri88toUpJiJFaqRKoydTyeaolmg"
                      width="109"
                      height="31"
                      style="margin-left: 0px; margin-top: 0px"
                      class="CToWUd" /></span
                ></span>
              </p>
            </td>
            <td
              style="
                border-width: 1pt;
                border-style: solid;
                border-color: rgb(14, 62, 172) rgb(255, 255, 255) rgb(255, 255, 255);
                vertical-align: top;
                padding: 5pt;
                overflow: hidden;
              "
            >
              <br />
            </td>
            <td
              style="
                border-width: 1pt;
                border-style: solid;
                border-color: rgb(14, 62, 172) rgb(255, 255, 255) rgb(255, 255, 255);
                vertical-align: top;
                padding: 5pt;
                overflow: hidden;
              "
            >
              <p
              
                style="
                  line-height: 1.2;
                  margin-right: 31.5pt;
                  text-align: right;
                  margin-top: 0pt;
                  margin-bottom: 0pt;
                "
              >
                &nbsp;<a
                  href="https://streaklinks.com/BE3SVmOoaNHirkdPAQsv9_WQ/https%3A%2F%2Fwww.instagram.com%2Fvantagesports_nil%2F"
                  style="text-decoration-line: none"
                  target="_blank"
                  ><span
                    style="
                      font-size: 7pt;
                      font-family: Arial;
                      background-color: transparent;
                      font-variant-numeric: normal;
                      font-variant-east-asian: normal;
                      text-decoration-line: underline;
                      vertical-align: baseline;
                      white-space: pre-wrap;
                    "
                    ><span
                      style="
                        border: none;
                        display: inline-block;
                        overflow: hidden;
                        width: 24px;
                        height: 24px;
                      "
                      ><img
                        src="https://lh5.googleusercontent.com/nUxrw-SKMSgzDdQ9usSRZF4XxBqr3Ypjan8m71r3WQ7KlCFYGWy0C6mHtFuDQ5MVZv3DGTKxYf8NXv797JSOp-EOidvmWA7PDtZSDmVqOIYyYCZKUy9JfnIdrMrR2dRx1VrwHVcJ8rX4AQbxQg"
                        width="24"
                        height="24"
                        style="margin-left: 0px; margin-top: 0px"
                        class="CToWUd" /></span></span></a
                ><a
                  href="https://streaklinks.com/BE3SVmWV1YnLiyRqzQ8eGg5A/https%3A%2F%2Fwww.tiktok.com%2F%40yosefvtg%3Flang%3Den"
                  style="text-decoration-line: none"
                  hspace="streak-track"
                  target="_blank"
                  ><span
                    style="
                      font-size: 7pt;
                      font-family: Arial;
                      background-color: transparent;
                      font-variant-numeric: normal;
                      font-variant-east-asian: normal;
                      text-decoration-line: underline;
                      vertical-align: baseline;
                      white-space: pre-wrap;
                    "
                    ><span
                      style="
                        border: none;
                        display: inline-block;
                        overflow: hidden;
                        width: 27px;
                        height: 29px;
                      "
                      ><img
                        src="https://lh4.googleusercontent.com/qguQwdXX7Qu7y3IKuioiZoXRfGOiJ5dNycBrCryl4OnEBETY9PiwjfF0nkYs_YoLO_0Yq-l7_KnbJ-_VSAIAxC__ySXH9r-0cEjsn-J-dTLB6l7TSqydHIjQbJjMd9hae2HiCd03WtmtdjM1ZA"
                        width="45.81028257456829"
                        height="29"
                        style="margin-top: 0px"
                        class="CToWUd" /></span></span
                ></a>
              </p>
              <br /><br /><br /><br />
            </td>
          </tr>
        </tbody>
      </table>
    </span>
  </div>

</body>
</html>

`;
const EmailService = () => {
  function validateEmail(emailAdress: string) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailAdress.match(regexEmail);
  }

  const sendEmail = async (msg: MailDataRequired, notification?: any) => {
    try {
      msg = Object.assign(msg, { bcc: ['notifications@vantagesports.com'] });

      if (process.env.SENDGRID_API_KEY == null) {
        logger.error(
          `Sendgrid is not configured correctly. Please check sendgrid credentials.`
        );
        throw 'SENDGRID MISS CONFIGURED';
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const emailResponseData = await sgMail.send(msg);

      if (!emailResponseData) {
        //throwing error from here so it can be logged to notification service.
        throw new Error(
          `Error :Send Email Function:Failed to send email using Sendgrid Email Id:${
            msg && msg.to
          }`
        );
      }

      const [response = null] = emailResponseData;
      const { headers = null } = response as any;

      //Here we check if we have a notification id, and message id from sendgrid - if yes - we will update entry in notification table
      if (notification?.id && headers && headers['x-message-id']) {
        const successNotificationLogBody = {
          updateBody: {
            serviceId: headers['x-message-id'],
            deliveryStatus: NotificationDeliveryStatus.S,
            updatedAt: new Date(),
          },
          updateWhere: { where: { id: notification?.id } },
        };
        await updateNotificationLog(successNotificationLogBody);
      }
      logger.info(
        `Email sent successfully, EmailId : ${msg?.to}, Notification Id : ${notification?.id}`
      );
    } catch (error: any) {
      const failureNotificationLogBody = { id: notification?.id };
      await updateFailedNotificationLog(failureNotificationLogBody);

      logger.error(
        'Error: Send Mail Function - Failed to send mail',
        JSON.stringify(
          {
            NotificationId: notification?.id,
            Email: msg?.to,
            Subject: msg?.subject,
            errorMessage: error?.message,
            errorBody: error?.response?.body,
          },
          null,
          4
        )
      );
    }
  };

  type EventCreateNotificationToFavorites = {
    coachProfile: Profile;
    coachUser: User;
    attachments: any; // TODO: improve types
    eventId: number /* Important: eventId, not timeslotId */;
    eventTitle: string;
    timeslots: Timeslot[];
    timezone: string;
    eventLocation: string;
    eventSessionType: EventSessionType;
  };

  const sendEventCreateNotificationToFavorites = async ({
    coachProfile,
    coachUser,
    attachments,
    eventId /* Important: eventId, not timeslotId */,
    eventTitle,
    timeslots,
    timezone,
    eventLocation,
    eventSessionType,
  }: EventCreateNotificationToFavorites) => {
    try {
      const coachFavoritedBy = await FavoriteCoach.findAll({
        where: {
          coachProfileId: coachProfile.id,
        },
        include: [
          {
            model: Profile,
            as: 'player',
          },
        ],
      });
      logger.info(
        '\n\n\n\n number of favorites: ',
        coachFavoritedBy.length,
        '\n\n\n\n '
      );
      if (!coachFavoritedBy || coachFavoritedBy.length === 0) {
        return;
      }

      const emailSubject = `${coachProfile.name} has added new training on Vantage Sports`;

      await Promise.all(
        coachFavoritedBy.map(async (userProfile) => {
          const emailToCoach = {
            to: coachUser?.email, // Change to your recipient
            from: process.env.SENDGRID_EMAIL ?? '', // Change to your verified sender
            subject: emailSubject,
            attachments: attachments,
            html: `
      ${beforeEmail(emailSubject)}

       <strong>Hi ${userProfile.player?.name},</strong>

        <p>Your favorite coach has added new availability, book now <a href="${
          process.env.REACT_APP_API
        }/training/${eventId}">using this link</a>.</p>

        <table>
        <tr><td>Title</td><td> ${eventTitle}</td></tr>
        <tr><td>Location</td><td> ${eventLocation}</td></tr>
        <tr><td>Type</td><td> ${eventSessionType}</td></tr>
        </table>

        <table style="display:table;width:100%;table-layout:fixed;">
        <tr>
        <th>Date & Time</th>
        <th>Duration</th>
        <th>Cost</th>
        <th>Max Participants</th>
        </tr>
        ${timeslots
          .map(
            (timeslot) =>
              `
          <tr>
          <td>${moment
            .tz(timeslot.startDate, timezone)
            .format('LL h:mm A')}</td>
          <td>${timeslot.duration} minutes</td>
          <td>${timeslot.cost}</td>
          <td>${timeslot.maxParticipantsCount}</td>
          </tr>
        `
          )
          .join('')}
        </table>

        <br/>

        <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>

        ${afterEmail}
      `,
          };

          await sendEmail(emailToCoach);
        })
      );
    } catch (error: any) {
      logger.error(
        `Failed to send notification to all users who favorited coach. Coach profile: ${JSON.stringify(
          coachProfile
        )} ; Coach user: ${JSON.stringify(coachUser)}`
      );
    }
  };

  type ParticipantData = Pick<User, 'email'> &
    Pick<Participant, 'timezone' | 'id'> &
    Pick<Profile, 'cellphone' | 'isPhoneVerified' | 'name'> & {
      coachName: string;
    };
  const sendEventCancellationEmail = async (
    event: Event,
    participants: ParticipantData[],
    timeslot: Timeslot
  ) => {
    const coachProfile = await Profile.findByPk(event.profileId);
    const coachUser = await User.findByPk(coachProfile?.userId);
    const coachEmail = coachUser?.email;

    // Sending cancellation mail to participants
    participants.forEach(async (participant: ParticipantData) => {
      const { email: participantEmail, timezone } = participant;

      if (!participantEmail) {
        logger.error(
          'Error : Participant email missing. Participant id is : ',
          participant.id
        );
        return;
      }

      const emailSubject = 'Vantage Sports Event cancelled';

      const emailToParticipant = {
        to: participantEmail,
        from: process.env.SENDGRID_EMAIL ?? '',
        subject: emailSubject,
        html: `
        ${beforeEmail('Vantage Sports Event Cancelled')}

        <strong>Hi ${participant.name || ''},</strong>

        <p>We are very sorry to let you know that the below scheduled training <a href="${
          process.env.REACT_APP_API
        }/training/${event.id}">session</a> has been cancelled for date ${moment
          .tz(timeslot.startDate, timezone)
          .format(
            'LL h:mm A'
          )}. We will be reaching out with details on rescheduling.</p><br/>

         <p>Please expect a full refund within 5 to 7 days.</p>
         <p>If you have any questions you can reach to <a href="mailto:info@vantagesports.com">info@vantagesports.com</a> or call
         Patrick at <a href="tel:+1908 410 5277">+1908 410 5277</a>.</p>

        <h3>Here were the details: </h3>

        <table >
        <tr><td>Coach:</td><td> ${coachProfile?.name || '-'}</td></tr>
        <tr><td>Coach Email:</td><td>${coachEmail || '-'}</td></tr>
        <tr><td>Coach Cell Phone Number</td><td> ${
          coachProfile?.cellphone || '-'
        }</td></tr>
        <tr><td>Title:</td><td> ${event.title}</td></tr>
        <tr><td>Date:</td><td>${moment
          .tz(timeslot.startDate, timezone)
          .format('LL')} </td></tr>
        <tr><td>Time:</td><td> ${moment
          .tz(timeslot.startDate, timezone)
          .format('h:mm a')}</td></tr>
        <tr><td>Location</td><td> ${event.location}</td></tr>
        <tr><td>Type</td><td> ${event.sessionType}</td></tr>
        <tr><td>Duration</td><td> ${timeslot.duration}</td></tr>
        <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
        <tr><td>Participants Count</td><td> ${
          timeslot.participantsCount
        }</td></tr>
        <tr><td>Max Participants</td><td> ${
          timeslot.maxParticipantsCount
        }</td></tr>
        </table>

        ${afterEmail}
        `,
      };

      try {
        const notificationToParticipant = {
          type: NotificationType.EV_CANCELLED,
          subject: emailSubject,
          userId: participant?.id,
          toEmail: participantEmail,
          message: emailToParticipant.html,
          deliveryStatus: NotificationDeliveryStatus.I,
          notification_medium: NotificationMedium.EMAIL,
          eventIds: event?.id ? [event.id] : [],
          userType: '2',
          createdAt: new Date(),
        };

        const notificationDataParticipant = await createNotificationLog(
          notificationToParticipant
        );

        await sendEmail(emailToParticipant, notificationDataParticipant);
      } catch (error: any) {
        logger.error(
          `Failed to send cancellation email to participant. Participant id : ${participant?.id}, participantEmail:${participantEmail}`
        );
        return;
      }
    });
  };

  const sendPasswordResetCode = async (emailTo: string, url: string) => {
    const msg = {
      to: emailTo,
      from: process.env.SENDGRID_EMAIL ?? '',
      subject: 'Vantage Sports Password Reset',
      html: `You are receiving this emails because of a recent request to change your password. You may visit this unique link to reset your VantageSports.com password <a href=${url}>${url}</a> If you have received this in error contact support. `,
    };
    try {
      await sendEmail(msg);
    } catch (error: any) {
      logger.error(
        `Failed to send password reset email participant. url: ${url}, participantEmail:${emailTo}`
      );
    }
  };

  const sendSignupWelcomeForNewUser = async (
    isCoach: boolean,
    user: User,
    userProfile: Profile
  ) => {
    const signupEmailContent = createSignupEmailContent(
      isCoach,
      userProfile.name
    );

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_EMAIL ?? '',
      subject: 'Thanks for Signing Up for Vantage Sports!',
      html: signupEmailContent,
    };

    const notificationToUser = {
      type: NotificationType.WELCOME_USER,
      subject: 'Thanks for Signing Up for Vantage Sports!',
      userId: user.id,
      message: signupEmailContent,
      toEmail: user.email,
      notification_medium: NotificationMedium.EMAIL,
      deliveryStatus: NotificationDeliveryStatus.I,
      eventIds: [-1],
      userType: user.userType,
      createdAt: new Date(),
    };
    try {
      const notificationDataUser = await createNotificationLog(
        notificationToUser
      );

      if (notificationDataUser) {
        await sendEmail(msg, notificationDataUser);
      } else {
        logger.error(
          `Send welcome email to new user failed user: ${user.email}, userType: user.userType, notificationDataUser is null`
        );
      }
    } catch (error: any) {
      logger.error(
        `Failed to send sendSignupWelcomeForNewUser`,
        `email:${user.email}`,
        `notificationToUser: ${JSON.stringify(notificationToUser)}`,
        `Error:${error?.message}`
      );
    }
  };

  const sendPasswordResetToCorruptedUsers = async (
    emailTo: string,
    url: string
  ) => {
    const msg = {
      to: emailTo,
      from: process.env.SENDGRID_EMAIL ?? '',
      subject: 'Vantage Sports Password Reset',
      html: `You are receiving this email because we had a slight issue with our system and had to reset your password. All of your data is still there however whenever you log back into Vantage Sports, you will need to reset your password to a new one here: <a href=${url}>${url}</a>. If there are any issues please reach out to us on our website's chat or contact info@vantagesports.com and we apologize for any inconveniences. `,
    };
    try {
      await sendEmail(msg);
    } catch (error: any) {
      logger.error(
        `Failed to send password reset email participant. url: ${url}, participantEmail:${emailTo}`
      );
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
    eventSessionType: EventSessionType;
  };

  const sendEventCreateConfirmation = async ({
    coachId,
    attachments,
    coachName,
    eventId /* Important: eventId, not timeslotId */,
    eventTitle,
    timeslots,
    timezone,
    eventLocation,
    eventSessionType,
  }: NotificationEventCreateConfirmation) => {
    try {
      const coachUser = await User.findByPk(coachId);
      if (!coachUser) {
        logger.error(`Failed coach select on DB. Coach: ${coachId} (userId)`);
        throw Error('Coach select didnt work (#000004)');
      }

      const emailSubject = 'Vantage Sports Event Created';

      const emailToCoach = {
        to: coachUser?.email, // Change to your recipient
        from: process.env.SENDGRID_EMAIL ?? '', // Change to your verified sender
        subject: emailSubject,
        attachments: attachments,
        html: `
      ${beforeEmail('Vantage Sports Event Created')}

       <strong>Hi ${coachName},</strong>

        <p>You have successfully created a session on <a href="http://vantagesports.com">Vantage Sports</a> </p><br/>
        <p>You will receive a notification if and when clients book your event as a well as a reminder one hour before the event.</p></br>

        <h3>Here are the details of the <a href="${
          process.env.REACT_APP_API
        }/training/${eventId}">event</a></h3>.

        <table>
        <tr><td>Title</td><td> ${eventTitle}</td></tr>
        <tr><td>Location</td><td> ${eventLocation}</td></tr>
        <tr><td>Type</td><td> ${eventSessionType}</td></tr>
        </table>

        <table style="display:table;width:100%;table-layout:fixed;">
        <tr>
        <th>Date & Time</th>
        <th>Duration</th>
        <th>Cost</th>
        <th>Max Participants</th>
        </tr>
        ${timeslots
          .map(
            (timeslot) =>
              `
          <tr>
          <td>${moment
            .tz(timeslot.startDate, timezone)
            .format('LL h:mm A')}</td>
          <td>${timeslot.duration} minutes</td>
          <td>${timeslot.cost}</td>
          <td>${timeslot.maxParticipantsCount}</td>
          </tr>
        `
          )
          .join('')}
        </table>

        <br/>

        <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>

        ${afterEmail}
      `,
      };

      const notificationToCoach = {
        type: NotificationType.EV_CREATE,
        subject: emailSubject,
        userId: coachUser?.id,
        toEmail: coachUser?.email,
        message: emailToCoach.html,
        deliveryStatus: NotificationDeliveryStatus.I,
        notification_medium: NotificationMedium.EMAIL,
        eventIds: eventId ? [eventId] : [],
        userType: '1',
      };

      const notificationDataCoach = await createNotificationLog(
        notificationToCoach
      );

      await sendEmail(emailToCoach, notificationDataCoach);
    } catch (error: any) {
      logger.error(
        `Failed to send create event email notification. Coach: ${coachId} (userId)`
      );
    }
  };

  const sendUpcomingEventEmailNotification = async (
    userId: number,
    event: Pick<
      Event,
      'id' | 'profileId' | 'title' | 'sessionType' | 'location' | 'timezone'
    >,
    participant: Participant,
    sendToCoach: any,
    timeslot: Timeslot
  ) => {
    try {
      logger.debug(
        'Upcoming events Email',
        JSON.stringify({ id: event?.id }, null, 4)
      );

      if (!event?.profileId) {
        logger.error(
          'coach profileId is missing. participant Id:',
          participant.id
        );
        return;
      }

      const coachProfile = await Profile.findByPk(event.profileId);
      const coachUser = await User.findByPk(coachProfile?.userId);
      if (!coachUser) {
        logger.error(
          `(#000006) Failed coach select on DB. Coach Id ; ${event?.profileId} , sendToCoach : ${sendToCoach}`
        );
        throw Error('Coach select didnt work (#000006)');
      }
      const signedUpUser = await User.findByPk(userId);
      if (!signedUpUser) {
        logger.error(
          `(#000005) Failed signed up user select on DB. Profile Id ; ${event?.profileId} , sendToCoach : ${sendToCoach}`
        );
        throw Error('Signed up user select didnt work (#000005)');
      }
      const userProfile = await signedUpUser?.getProfile();
      const userEmail = signedUpUser?.email;
      const coachEmail = coachUser?.email;

      let remainingMinutesToString = getRemaingTimeslots(
        timeslot.startDate,
        participant.timezone
      );

      const emailSubject = `Vantage Sports Reminder: ${remainingMinutesToString} Until Your Next Training Session`;

      const emailToUser = {
        to: userEmail,
        from: process.env.SENDGRID_EMAIL ?? '', // Change to your verified sender
        subject: emailSubject,
        html: `
        ${beforeEmail(
          `Reminder: ${remainingMinutesToString} Until Your Next Training Session`
        )}

        <strong>Hi ${userProfile?.name || ''},</strong>
          <p>This is a reminder that your next session begins in ${remainingMinutesToString}.</p><br/>
          <h3>Here are the details of the <a href="${
            process.env.REACT_APP_API
          }/training/${event.id}">event</a></h3>.

          <table >
            <tr><td>Coach</td><td> ${coachProfile?.name || '-'}</td></tr>
            <tr><td>Coach Email:</td><td>${coachEmail || '-'}</td></tr>
            <tr><td>Coach Cell Phone Number</td><td> ${
              coachProfile?.cellphone || '-'
            }</td></tr>
            <tr><td>Title</td><td> ${event.title}</td></tr>
            <tr><td>Date</td><td> ${moment
              .tz(timeslot.startDate, participant.timezone)
              .format('LL')} </td></tr>
            <tr><td>Time</td><td> ${moment
              .tz(timeslot.startDate, participant.timezone)
              .format('h:mm A')}</td></tr>
            <tr><td>Location</td><td> ${event.location}</td></tr>
            <tr><td>Type</td><td> ${event.sessionType}</td></tr>
            <tr><td>Duration</td><td> ${timeslot.duration}</td></tr>
            <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
            <tr><td>Participants Count</td><td> ${
              timeslot.participantsCount
            }</td></tr>
            <tr><td>Max Participants</td><td> ${
              timeslot.maxParticipantsCount
            }</td></tr>
          </table>
          <br/>

          <p>If this is a virtual session you will get a zoom link sent to this email at least 5 minutes before the session begins!</p>

          <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>

          ${afterEmail}
        `,
      };

      const isNotificationSent: Notification | null =
        await Notification.findOne({
          where: {
            type: 'EV_UPCOMING_REMINDER',
            subject: emailSubject,
            userId: signedUpUser?.id,
            toEmail: signedUpUser?.email,
            eventIds: {
              [Sequelize.Op.eq]: (event?.id ? [event.id] : []) as any,
            },
            notification_medium: 'EMAIL',
            userType: '2',
          },
        });

      if (!isNotificationSent) {
        try {
          const notificationToUser = {
            type: NotificationType.EV_UPCOMING_REMINDER,
            subject: emailSubject,
            userId: signedUpUser?.id,
            deliveryStatus: NotificationDeliveryStatus.I,
            message: emailToUser.html,
            toEmail: signedUpUser?.email,
            notification_medium: NotificationMedium.EMAIL,
            eventIds: event.id ? [event.id] : [],
            userType: '2',
            createdAt: new Date(),
          };

          const notificationDataUser = await createNotificationLog(
            notificationToUser
          );

          if (!userEmail || !signedUpUser) {
            logger.error(
              `Failed to send upcoming events email to user User email is missing userEmail:${userEmail} name:${userProfile?.name}, Participant id :${participant.id}`
            );
            return;
          }
          await sendEmail(emailToUser, notificationDataUser);
        } catch (error: any) {
          logger.error(
            'Catch Error Failed to send upcoming event mail  : User email is missing.Participant id : ',
            participant?.id
          );
        }
      }

      remainingMinutesToString = getRemaingTimeslots(
        timeslot.startDate,
        event.timezone
      );

      // Send to Coach
      const coachEmailSubject = `Vantage Sports Reminder: ${remainingMinutesToString} Until Your Next Training Session`;

      if (sendToCoach && !!timeslot.participantsCount) {
        const emailToCoach = {
          to: coachEmail,
          from: process.env.SENDGRID_EMAIL ?? '', // Change to your verified sender
          subject: coachEmailSubject,
          html: `
        ${beforeEmail(
          `Reminder: ${remainingMinutesToString} Until Your Next Training Session`
        )}

        <strong>Hi ${coachProfile?.name || ''},</strong>

          <p>This is a reminder that your next session begins in ${remainingMinutesToString}. Here are the details of the <a href="${
            process.env.REACT_APP_API
          }/training/${event.id}">event.</a></p><br/>

          <h3>Here are the details of the <a href="${
            process.env.REACT_APP_API
          }/training/${event.id}">event</a></h3>.

          <table >
            <tr><td>Title</td><td> ${event.title}</td></tr>
            <tr><td>Date</td><td> ${moment
              .tz(timeslot.startDate, event.timezone)
              .format('LL')} </td></tr>
            <tr><td>Time</td><td> ${moment
              .tz(timeslot.startDate, event.timezone)
              .format('h:mm A')}</td></tr>
            <tr><td>Location</td><td> ${event.location}</td></tr>
            <tr><td>Type</td><td> ${event.sessionType}</td></tr>
            <tr><td>Duration</td><td> ${timeslot.duration}</td></tr>
            <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
            <tr><td>Participants Count</td><td>${
              timeslot.participantsCount
            }</td></tr>
            <tr><td>Max Participants</td><td>${
              timeslot.maxParticipantsCount
            }</td></tr>
          </table>
          <br/>

          <p>If this is a virtual session.Please email the client the zoom link at least 5 minutes before the session start time.</p><br/>

          <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>
          ${afterEmail}
        `,
        };

        try {
          const notificationToCoach = {
            type: NotificationType.EV_UPCOMING_REMINDER,
            subject: coachEmailSubject,
            userId: coachUser?.id,
            toEmail: coachUser?.email,
            message: emailToCoach.html,
            deliveryStatus: NotificationDeliveryStatus.I,
            notification_medium: NotificationMedium.EMAIL,
            eventIds: event.id ? [event.id] : [],
            userType: '1',
            createdAt: new Date(),
          };

          const notificationDataCoach = await createNotificationLog(
            notificationToCoach
          );
          await sendEmail(emailToCoach, notificationDataCoach);
        } catch (error: any) {
          logger.error(
            `Failed to send upcoming events mail notification to  : coach: ${coachProfile?.name}`,
            `email : ${coachEmail}`,
            `cellphone : ${coachProfile?.cellphone}`
          );
        }
      }

      try {
        if (!userEmail || !signedUpUser) {
          logger.error(
            `Failed to send upcoming events email to user User email is missing userEmail:${userEmail} name:${userProfile?.name}, Participant id :${participant.id}`
          );
          return;
        }
        const notificationToUser = {
          type: NotificationType.EV_UPCOMING_REMINDER,
          subject: coachEmailSubject,
          userId: signedUpUser?.id,
          deliveryStatus: NotificationDeliveryStatus.I,
          message: emailToUser.html,
          toEmail: signedUpUser?.email,
          notification_medium: NotificationMedium.EMAIL,
          eventIds: event.id ? [event.id] : [],
          userType: '2',
          createdAt: new Date(),
        };
        const notificationDataUser = await createNotificationLog(
          notificationToUser
        );
        await sendEmail(emailToUser, notificationDataUser);
      } catch (error: any) {
        logger.error(
          'Catch Error Failed to send upcoming event mail  : User email is missing.Participant id : ',
          participant?.id
        );
      }
    } catch (error: any) {
      logger.error(
        `Error : Failed to send send upcoming event mail error : ${error}, Stringified`,
        JSON.stringify({ error, errorMessage: error?.message }, null, 4)
      );
      return true;
    }
  };

  const dailyEmailContent = (
    events: (Event & { timeslots?: Timeslot[] })[]
  ) => {
    logger.info('Running daily email notification service');
    const todaysEvents = events;
    return todaysEvents.map((e: Event & { timeslots?: Timeslot[] }) => {
      return !e.timeslots
        ? []
        : e.timeslots
            .filter((t: Timeslot) => !!t.participantsCount)
            .map(
              (t: Timeslot) => `<h3>Event Details for event : <a href="${
                process.env.REACT_APP_API
              }/training/${e.id}">${e.title}</a></h3>.
          <table>
          <tr><td>Title</td><td> ${e.title}</td></tr>
          <tr><td>Date</td><td> ${moment
            .tz(t.startDate, e.timezone)
            .format('LL')} </td></tr>
          <tr><td>Time</td><td> ${moment
            .tz(t.startDate, e.timezone)
            .format('h:mm A')}</td></tr>
          <tr><td>Location</td><td> ${e.location}</td></tr>
          <tr><td>Type</td><td> ${e.sessionType}</td></tr>
          <tr><td>Duration</td><td> ${t.duration}</td></tr>
          <tr><td>Cost</td><td> ${t.cost} USD</td></tr>
          <tr><td>Participants Count</td><td> ${t.participantsCount}</td></tr>
          <tr><td>Max Participants</td><td> ${t.maxParticipantsCount}</td></tr>
          </table>
          <br/>
          <p>${
            (e.sessionType + '').toLocaleLowerCase().includes('virtual')
              ? 'Please email the zoom link to client at least 5 minutes prior to the session start time'
              : 'Please arrive 10 to 15 minutes early!'
          } </p>`
            );
    });
  };

  const sendDailyEventNotification = async (
    data: {
      coachUser: User;
      events: (Event & { timeslots?: Timeslot[] })[];
    }[]
  ) => {
    try {
      let coachProfile;
      let coachEmail;
      let coachName;
      let eventIds;

      for (let i = 0; i < data.length; i++) {
        const { coachUser, events } = data[i];
        eventIds = events.map((e: Event) => e.id) || [];

        coachProfile = await coachUser.getProfile();
        coachEmail = coachUser?.email;
        coachName = coachProfile?.name || '';

        logger.debug(
          `Sending daily notification email to coach coachName:${coachName}, coachEmail:${coachEmail}`
        );

        const emailSubject = 'Reminder: You have Event/s Scheduled Today';

        const filteredEvents = events.filter(
          (event) =>
            event.timeslots?.filter((t: Timeslot) => !!t.participantsCount)
              .length
        );

        if (!(Array.isArray(filteredEvents) && filteredEvents.length)) {
          logger.error(
            `No booked timeslots found for this coach: ${coachName}, coachEmail: ${coachEmail}`
          );
          continue;
        }

        const emailToCoach = {
          to: coachEmail,
          from: process.env.SENDGRID_EMAIL ?? '',
          subject: emailSubject,
          html: `${beforeEmail('Reminder: You have Event/s Scheduled Today')}

          <strong>Hi ${coachName},</strong>

          <p>This is a reminder that you have event/s scheduled today. Here are the details of the events.</p><br/>${dailyEmailContent(
            filteredEvents
          )}
          <small>If you have any questions or need support, please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908  410 5277</a>.</small><br/>
          ${afterEmail}`,
        };

        try {
          const startOfToday = new Date(new Date().setHours(0, 0, 0)).toJSON();
          const currentTime = new Date(
            new Date().setHours(23, 59, 59)
          ).toJSON();

          const isNotificationSent = await Notification.findOne({
            where: {
              type: 'EV_DAILY_REMINDER',
              userId: coachUser?.id,
              userType: '1',
              notification_medium: 'EMAIL',
              eventIds: { [Sequelize.Op.contains]: eventIds },
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
            subject: emailSubject,
            userId: coachUser?.id,
            toEmail: coachEmail,
            message: emailToCoach.html,
            deliveryStatus: NotificationDeliveryStatus.I,
            notification_medium: NotificationMedium.EMAIL,
            eventIds,
            userType: '1',
            createdAt: new Date(),
          };

          const notificationDataCoach = await createNotificationLog(
            notificationToCoach
          );

          // TODO: Historically below run for any event (with one timeslot).
          // Maybe just add dailyRemindeAt column to timeslot?
          // For now I will leave this as is.
          // Unfortunately this can cause overwrite so commenting out.
          // All information regarding certain event
          // can easily be found using Notifications table.
          // const updateBody = { dailyReminderAt: new Date() };
          // const updateWhere = {
          //   where: {
          //     dailyReminderAt: null,
          //     participantsCount: { [Sequelize.Op.gt]: 0 },
          //     id: { [Sequelize.Op.in]: notificationToCoach?.eventIds || [] },
          //   },
          // };
          // await Event.update(updateBody as any, updateWhere);

          await sendEmail(emailToCoach, notificationDataCoach);
        } catch (error: any) {
          logger.error(`
        (#000034) coachName:${coachName},
        coachEmail :${coachEmail},
        coachProfile : ${coachProfile}
        Error : ${JSON.stringify({ error }, null, 4)}
        `);
          continue;
        }
      }
    } catch (error: any) {
      logger.error(
        `Catch Error :Daily email notification to all coaches failed Error : ${JSON.stringify(
          { Error: error, errorMessage: error?.message },
          null,
          4
        )}`
      );
    }
  };

  const sendTrainingSignup = async (
    userId: number,
    event: Pick<
      Event,
      | 'profileId'
      | 'id'
      | 'title'
      | 'location'
      | 'sessionType'
      // below only for ICS
      | 'date'
      | 'description'
      | 'duration'
      | 'timezone'
    >,
    timeslot: Timeslot
  ) => {
    try {
      const coachProfile = await Profile.findByPk(event.profileId);
      const coachUser = await User.findByPk(coachProfile?.userId);
      const signedUpUser = await User.findByPk(userId);
      if (!coachUser) {
        logger.error(
          `(#000007) Failed coach select on DB. Coach Id ; ${event?.profileId} , userId : ${userId}`
        );
        throw Error('Coach select didnt work (#000007)');
      }
      if (!signedUpUser) {
        logger.error(
          `(#000008) Failed signed up user select on DB. Profile Id ; ${event?.profileId} , userId : ${userId}`
        );
        throw Error('Signed up user select didnt work (#000008)');
      }
      const userProfile = await Profile.findOne({ where: { userId } });
      let userEmail = signedUpUser?.email;
      const [participant] = await Participant.findAll({
        where: {
          clientId: userId,
          eventId: event.id,
          paid: true,
        },
        order: [['id', 'DESC']],
        limit: 1,
      });

      const coachEmail = coachUser?.email;
      const userName = (userProfile && userProfile.name) || '';

      userEmail = userEmail ? userEmail : '';
      const icsEventData = await createICSEvent(event, coachProfile, timeslot);
      const attachments = icsEventData
        ? [createICSAttachment(icsEventData.value)]
        : [];

      const emailSubject = 'Vantage Sports Training Signup Receipt';
      const emailToUser = {
        to: userEmail,
        from: process.env.SENDGRID_EMAIL ?? '',
        subject: emailSubject,
        html: `
        ${beforeEmail(
          'You Have Successfully Booked a Session on Vantage Sports'
        )}


       <strong>Hi ${userName},</strong>
        <p>You have successfully booked and paid for a <a href="${
          process.env.REACT_APP_API
        }/training/${event.id}">session</a> on vantage sports.</p><br/>

        <h3>Here are the details of the <a href="${
          process.env.REACT_APP_API
        }/training/${event.id}">event</a></h3>.<br/>

        <table >
          <tr><td>Coach</td><td> ${coachProfile?.name || '-'}</td></tr>
          <tr><td>Coach Email:</td><td>${coachEmail || '-'}</td></tr>
          <tr><td>Coach Cell Phone Number</td><td>${
            coachProfile?.cellphone || '-'
          }</td></tr>
          <tr><td>Title</td><td>${event.title}</td></tr>
          <tr><td>Date</td><td> ${moment
            .tz(timeslot.startDate, participant.timezone)
            .format('LL')} </td></tr>
          <tr><td>Time</td><td> ${moment
            .tz(timeslot.startDate, participant.timezone)
            .format('h:mm A')}</td></tr>
          <tr><td>Location</td><td> ${event.location}</td></tr>
          <tr><td>Type</td><td> ${event.sessionType}</td></tr>
          <tr><td>Duration</td><td> ${timeslot.duration} minutes</td></tr>
          <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
          <tr><td>Participants Count</td><td>${
            timeslot.participantsCount
          }</td></tr>
          <tr><td>Max Participants</td><td>${
            timeslot.maxParticipantsCount
          }</td></tr>
          <tr><td>Link</td><td><a href='${process.env.REACT_APP_API}/training/${
          event.id
        }'>${process.env.REACT_APP_API}/training/${event.id}</a></td></tr>
        </table>
        <br/>

        <p>If this is a virtual session you will get a zoom link sent to this email at least 5 minutes before the session begins!</p><br>

        <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>

        ${afterEmail}
      `,
        attachments,
      };

      const notificationToUser = {
        type: NotificationType.EV_BOOKED,
        subject: emailSubject,
        userId: signedUpUser.id,
        deliveryStatus: NotificationDeliveryStatus.I,
        message: emailToUser.html,
        toEmail: userEmail,
        notification_medium: NotificationMedium.EMAIL,
        eventIds: event?.id ? [event.id] : [],
        userType: '2',
        createdAt: new Date(),
      };
      const notificationDataUser = await createNotificationLog(
        notificationToUser
      );

      const coachEmailSubject = 'Vantage Sports Event Booked';
      // Send to coach
      const emailToCoach = {
        to: coachEmail,
        from: process.env.SENDGRID_EMAIL ?? '', // Change to your verified sender
        subject: coachEmailSubject,
        html: `
        ${beforeEmail('Congratulations - Your Session has been Booked')}

        <strong>Hi ${coachProfile?.name || ''},</strong>

        <p>Congratulations a client has booked your <a href='${
          process.env.REACT_APP_API
        }/training/${event.id}'>session</a> on Vantage Sports.</p><br/>

          <p>Here are the details of the client.</p>
          <table >
            <tr><td>Name</td><td> ${userName || '-'}</td>
            <tr><td>Email Address</td><td> ${userEmail || '-'}</td>
            <tr><td>Cell Phone</td><td> ${userProfile?.cellphone || '-'}</td>
          </table>
          <br/>

          <p>Here are the details of the event.</p>
          <table>
            <tr><td>Title</td><td>${event.title}</td></tr>
            <tr><td>Date</td><td> ${moment
              .tz(timeslot.startDate, participant.timezone)
              .format('LL')} </td></tr>
            <tr><td>Time</td><td> ${moment
              .tz(timeslot.startDate, participant.timezone)
              .format('h:mm A')}</td></tr>
            <tr><td>Location</td><td> ${event.location}</td></tr>
            <tr><td>Type</td><td> ${event.sessionType}</td></tr>
            <tr><td>Duration</td><td> ${timeslot.duration} minutes</td></tr>
            <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
            <tr><td>Participants Count</td><td>${
              timeslot.participantsCount
            }</td></tr>
            <tr><td>Max Participants</td><td>${
              timeslot.maxParticipantsCount
            }</td></tr>
            <tr><td>Link</td><td><a href='${
              process.env.REACT_APP_API
            }/training/${event.id}'>${process.env.REACT_APP_API}/training/${
          event.id
        }</a></td></tr>
          </table>
          <br/>

          <p>You currently have ${timeslot.participantsCount || 0} ${
          timeslot.participantsCount === 1 ? 'participant' : 'participants'
        } signed up for this session.</p><br/>

          <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>
          ${afterEmail}
        `,
        attachments,
      };

      const notificationToCoach = {
        type: NotificationType.EV_BOOKED,
        subject: coachEmailSubject,
        userId: coachUser?.id,
        toEmail: coachEmail,
        message: emailToCoach.html,
        deliveryStatus: NotificationDeliveryStatus.I,
        notification_medium: NotificationMedium.EMAIL,
        eventIds: event?.id ? [event.id] : [],
        userType: '1',
        createdAt: new Date(),
      };
      const notificationDataCoach = await createNotificationLog(
        notificationToCoach
      );

      try {
        await sendEmail(emailToCoach, notificationDataCoach);
      } catch (error: any) {
        logger.error(
          `Failed to send training signup mail : Coach email is missing.Participant id is ${participant.id},Coach Email:${emailToCoach}`
        );
      }

      try {
        if (!userEmail || !signedUpUser) {
          logger.error(
            'Failed to send training signup mail : User email is missing.Participant id is :',
            participant.id
          );
          return;
        }

        await sendEmail(emailToUser, notificationDataUser);
      } catch (error: any) {
        logger.error(
          `Error : Failed to send training signup email to User. Participant id is:${
            participant.id
          } UserEmail:${emailToUser.to} , Error :${JSON.stringify(
            { error, errorMessage: error?.message },
            null,
            4
          )}`
        );
        return;
      }
    } catch (error: any) {
      logger.error(
        `Error : Failed to send training signup email.User Id is:${userId}, Error :${JSON.stringify(
          { error },
          null,
          4
        )}`
      );
      return;
    }
  };

  async function sendEventReviewPendingEmail(
    participantsList: ParticipantListObject
  ) {
    participantsList.forEach(async (p) => {
      const {
        participantId,
        playerEmail,
        playerName,
        eventTitle,
        eventId,
        playerProfileId,
        playerUserId,
      } = p;

      const emailSubject = 'We would love your feedback.';

      const reviewLink =
        process.env.REACT_APP_API +
        '/signin?playerProfileId=' +
        playerProfileId +
        '&eventId=' +
        eventId +
        '&redirectFor=event-review';

      const emailToParticipant = {
        to: playerEmail,
        from: process.env.SENDGRID_EMAIL ?? '',
        subject: emailSubject,

        html: `
        ${beforeEmail(
          `${playerName ? `${playerName}, ` : ''}We care about your experience.`
        )}

        ${playerName ? `<strong>Hi ${playerName},</strong>` : 'Hi,'}

        <p>You recently booked a training <a href="${
          process.env.REACT_APP_API
        }/training/${eventId}">${eventTitle}</a> on Vantage Sports. We hope you are happy with your experience.

        <br>
        Please heip us improve our services by giving us a quick review.
        Your opinion will help us to improve our service for you and the rest of our community.
        </p>

        <br>
        <a href=${reviewLink}><button>Write a Review</button></a>
        <br>
        <small>If you have any questions or need support please email <a href="mailto:info@vantagesports.com">info@vantagesports.com</a>  or call <a href="tel:+19084105277">+1908 410 5277</a>.</small><br/>
        ${afterEmail}
        `,
      };

      const notificationToParticipant = {
        type: NotificationType.EV_REVIEW,
        subject: emailSubject,
        userId: playerUserId,
        toEmail: playerEmail,
        message: emailToParticipant.html,
        deliveryStatus: NotificationDeliveryStatus.I,
        notification_medium: NotificationMedium.EMAIL,
        eventIds: eventId ? [eventId] : [],
        userType: '2',
        createdAt: new Date(),
      };

      const notificationDataParticipant = await createNotificationLog(
        notificationToParticipant
      );

      try {
        await sendEmail(emailToParticipant, notificationDataParticipant);
      } catch (error: any) {
        logger.error(
          `Failed to send participant review mail : Coach email is missing.Participant id is ${participantId},Coach participantEmail:${playerEmail}, eventId :${eventId}`
        );
      }
    });
  }

  const sendTimeslotCancellationEmail = async (
    event: Event,
    participants: ParticipantData[],
    timeslot: Timeslot
  ) => {
    const coachProfile = await Profile.findByPk(event.profileId);
    const coachUser = await User.findByPk(coachProfile?.userId);
    const coachEmail = coachUser?.email;

    // Sending cancellation mail to participants
    participants.forEach(async (participant: ParticipantData) => {
      const { email: participantEmail, timezone } = participant;

      if (!participantEmail) {
        logger.error(
          'Error : Participant email missing. Participant id is : ',
          participant.id
        );
        return;
      }

      const emailSubject = 'Vantage Sports Event cancelled';

      const emailToParticipant = {
        to: participantEmail,
        from: process.env.SENDGRID_EMAIL ?? '',
        subject: emailSubject,
        html: `
        ${beforeEmail('Vantage Sports Event Cancelled')}

        <strong>Hi ${participant.name || ''},</strong>

        <p>We are very sorry to let you know that the below scheduled training <a href="${
          process.env.REACT_APP_API
        }/training/${event.id}">session</a> has been cancelled for date ${moment
          .tz(timeslot.startDate, timezone)
          .format(
            'LL h:mm A'
          )}. We will be reaching out with details on rescheduling.</p><br/>

         <p>Please expect a full refund within 5 to 7 days.</p>
         <p>If you have any questions you can reach to <a href="mailto:info@vantagesports.com">info@vantagesports.com</a> or call
         Patrick at <a href="tel:+1908 410 5277">+1908 410 5277</a>.</p>

        <h3>Here were the details: </h3>

        <table >
        <tr><td>Coach:</td><td> ${coachProfile?.name || '-'}</td></tr>
        <tr><td>Coach Email:</td><td>${coachEmail || '-'}</td></tr>
        <tr><td>Coach Cell Phone Number</td><td> ${
          coachProfile?.cellphone || '-'
        }</td></tr>
        <tr><td>Title:</td><td> ${event.title}</td></tr>
        <tr><td>Date:</td><td>${moment
          .tz(timeslot.startDate, timezone)
          .format('LL')} </td></tr>
        <tr><td>Time:</td><td> ${moment
          .tz(timeslot.startDate, timezone)
          .format('h:mm a')}</td></tr>
        <tr><td>Location</td><td> ${event.location}</td></tr>
        <tr><td>Type</td><td> ${event.sessionType}</td></tr>
        <tr><td>Duration</td><td> ${timeslot.duration}</td></tr>
        <tr><td>Cost</td><td> ${timeslot.cost} USD</td></tr>
        <tr><td>Participants Count</td><td> ${
          timeslot.participantsCount
        }</td></tr>
        <tr><td>Max Participants</td><td> ${
          timeslot.maxParticipantsCount
        }</td></tr>
        </table>

        ${afterEmail}
        `,
      };

      try {
        const isNotificationSent = await Notification.findOne({
          where: {
            type: NotificationType.TS_CANCELLED,
            subject: emailSubject,
            userId: participant?.id,
            toEmail: participantEmail,
            message: emailToParticipant.html,
            deliveryStatus: NotificationDeliveryStatus.I,
            notification_medium: NotificationMedium.EMAIL,
            userType: '2',
            eventIds: { [Sequelize.Op.contains]: event?.id ? [event.id] : [] },
          },
        });

        if (isNotificationSent) {
          return;
        }

        const notificationToParticipant = {
          type: NotificationType.TS_CANCELLED,
          subject: emailSubject,
          userId: participant?.id,
          toEmail: participantEmail,
          message: emailToParticipant.html,
          deliveryStatus: NotificationDeliveryStatus.I,
          notification_medium: NotificationMedium.EMAIL,
          eventIds: event?.id ? [event.id] : [],
          userType: '2',
          createdAt: new Date(),
        };

        const notificationDataParticipant = await createNotificationLog(
          notificationToParticipant
        );

        await sendEmail(emailToParticipant, notificationDataParticipant);
      } catch (error: any) {
        logger.error(
          `Failed to send cancellation email to participant. Participant id : ${participant?.id}, participantEmail:${participantEmail}`
        );
        return;
      }
    });
  };

  const sendUpdatedLocationEmailEventNotification = async (
    event: Event,
    eventData: any,
    participants: ParticipantData[]
  ) => {
    try {
      participants.forEach(async (participant: ParticipantData) => {
        const {
          name,
          email: participantEmail,
          timezone,
          id: userId,
        } = participant;

        if (!participantEmail) {
          logger.error(
            'Error : Email is missing. Participant id is : ',
            participant.id
          );
          return;
        }

        const locationText =
          event.sessionType == 'In-Person'
            ? `has changed locations to <a target="_blank" href="https://maps.google.com?q=${event.location}">${event.location}</a>`
            : `has changed to a virtual session`;
        const emailSubject = `Vantage Sports Event: ${
          eventData['Event Title']
        } Location Change to ${
          event.sessionType == 'In-Person'
            ? event.location
            : 'a Virtual Session'
        }`;
        const emailText = `
          Hi ${name},<br><br>We are letting you know that your scheduled Event: "${eventData['Event Title']}" ${locationText}.
        `;

        const emailToParticipant: MailDataRequired = {
          to: participantEmail,
          from: process.env.SENDGRID_EMAIL ?? '',
          subject: emailSubject,
          html: `${beforeEmail('Location Update!')}${emailText}${afterEmail}`,
        };

        const notificationToUser: CreationAttributes<Notification> = {
          type: NotificationType.EV_UPDATED_LOCATION,
          subject: emailSubject,
          userId,
          message: emailToParticipant.html,
          toEmail: participantEmail,
          notification_medium: NotificationMedium.EMAIL,
          deliveryStatus: NotificationDeliveryStatus.I,
          eventIds: event?.id ? [event.id] : [],
          userType: '2',
          createdAt: new Date(),
        };

        const notificationDataUser = await createNotificationLog(
          notificationToUser
        );

        try {
          await sendEmail(emailToParticipant, notificationDataUser);
        } catch (error: any) {
          logger.error(
            `Failed to send updated event location email : Something is missing.Participant id is ${participant.id}, Email:${emailToParticipant}`
          );
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

  return {
    sendEmail,
    sendPasswordResetCode,
    sendSignupWelcomeForNewUser,
    sendEventCreateConfirmation,
    sendTrainingSignup,
    sendUpcomingEventEmailNotification,
    sendDailyEventNotification,
    sendEventCancellationEmail,
    sendEventReviewPendingEmail,
    sendTimeslotCancellationEmail,
    sendUpdatedLocationEmailEventNotification,
    sendPasswordResetToCorruptedUsers,
    sendEventCreateNotificationToFavorites,
  };
};

export default EmailService;
