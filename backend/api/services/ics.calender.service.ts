import { createEvent, DateArray, EventAttributes } from 'ics';
import moment from 'moment-timezone';
import {
  Event,
  University,
  Sport,
  Profile,
  Skill,
  Position,
  Timeslot,
} from '../models';
import { v4 as uuidv4 } from 'uuid';
import logger from '../helpers/logger';

export const ICSService = () => {
  const createICSAttachment = (data: any) => {
    const attachment = {
      filename: 'invite.ics',
      name: 'invite.ics',
      content: Buffer.from(data).toString('base64'),
      disposition: 'attachment',
      contentId: uuidv4(),
      type: 'text/calendar; method=REQUEST',
    };

    return attachment;
  };

  const createICSEvent = async (
    event: Pick<
      Event,
      'description' | 'title' | 'location' | 'duration' | 'timezone'
    >,
    coachProfile: Profile | null,
    timeslot: Timeslot
  ) => {
    try {
      const { timezone = 'America/New_York' } = event;
      const duration = timeslot.duration.toString();
      const hours = +(duration.slice(0, duration.lastIndexOf('.')) || 0);
      const minutes =
        +(duration.slice(duration.lastIndexOf('.'), duration.length) || 0) * 60;
      const d = moment.tz(new Date(timeslot.startDate), timezone).toDate();

      const start = [
        d.getFullYear(),
        d.getMonth() || 1,
        d.getDate() || 1,
        d.getHours(),
        d.getMinutes(),
      ] as DateArray;

      const eventParams: EventAttributes = {
        start,
        duration: { hours, minutes },
        description: event.description,
        title: event.title,
        location: event.location,
        organizer: { name: coachProfile ? coachProfile.name : undefined },
        status: 'CONFIRMED',
        method: 'REQUEST',
      };

      const icsEventData = await createEvent(eventParams);
      return icsEventData;
    } catch (error) {
      logger.error(
        'Error: createICSEvent - failed to create ICS eventData (#000031)'
      );
      return undefined;
    }
  };

  const getEventEmailData = async (event: Event) => {
    const data = await Event.findOne({
      where: {
        id: event.id,
      },
      include: [
        { model: Sport, as: 'sport' },
        { model: Skill, as: 'skill' },
        { model: Profile, as: 'coach' },
        { model: University, as: 'university' },
        { model: Position, as: 'position' },
      ],
    });

    if (!data) {
      logger.error(
        `(#000011) getEventEmailData ; Profile Id ; ${event?.profileId} , event : ${event}`
      );
      throw Error('getEventEmailData (#000011)');
    }
    if (!data.coach) {
      logger.error(
        `(#000011) coach missing in getEventEmailData ; Profile Id ; ${
          event?.profileId
        } , event : ${JSON.stringify(event)}`
      );
      throw Error('getEventEmailData (#000029)');
    }

    const eventDisplayData = {
      'Event-Id': event.id,
      timezone: event.timezone,
      'Event Title': data.title,
      'Coach Name': data.coach.name,
      Sport: (data.sport && data.sport.name) || '',
      Skill: (data.skill && data.skill.name) || '',
      Position: (data.position && data.position.name) || '',
      'Maximum Participants': event.max,
      'Participants Count': event.participantsCount,
      Duration: `${event.duration} hrs`,
      'Session Type': data.sessionType,
      Location: data.location,
      Description: data.description,
      Cost: `${data.cost} USD`,
      coach: data.coach,
    };

    return eventDisplayData;
  };

  return {
    createICSEvent,
    createICSAttachment,
    getEventEmailData,
  };
};

export default ICSService;
