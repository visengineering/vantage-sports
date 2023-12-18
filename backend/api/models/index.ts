import { Note } from './Note';
import { User } from './User';
import { Position } from './Position';
import { Sport } from './Sport';
import { University } from './University';
import { Profile } from './Profile';
import { Skill } from './Skill';
import { Media } from './Media';
import { Event } from './Event';
import { Participant } from './Participant';
import { Conference } from './Conference';
import { Division } from './Division';
import { Reset } from './Reset';
import { Notification } from './Notification';
import { Review } from './Review';
import { Repeat_Booking } from './Repeat_Booking';
import { Timeslot, TimeslotTableDefinition } from './Timeslot';
import { ReferralSource } from './ReferralSource';
import { SignupStarted } from './SignupStarted';
import {
  FavoriteCoach,
  FavoriteCoachTableDefinition,
  FavoriteCoachTableName,
} from './FavoriteCoach';
import { GeoAddress } from './GeoAddress';
import { Child } from './Child';

// On the platform we have Users
// Coaches (users of type 1) have their Profiles
User.hasOne(Profile);
Profile.belongsTo(User);
// Coach users can create events,
// events are tied to the user through their profile
Profile.hasMany(Event);
Event.belongsTo(Profile, {
  as: 'coach',
  targetKey: 'id',
  foreignKey: 'profileId',
});
// Event has its promotional image
Event.belongsTo(Media, {
  as: 'media',
  targetKey: 'id',
  foreignKey: 'mediaId',
});
// Event has participants (Users of type 2), meaning trainees
Event.hasMany(Participant, { as: 'participants', foreignKey: 'eventId' });
Participant.belongsTo(Event, { as: 'events', foreignKey: 'eventId' });

// Each event may receive reviews as soon as is completed
// Each participant (trainee) can endorse coach by sending review
// Coach may receive reviews for any completed event
Event.hasMany(Review, {
  as: 'reviews',
  foreignKey: 'eventId',
});
Review.belongsTo(Event, { as: 'event', foreignKey: 'eventId' });
Review.belongsTo(Profile, { as: 'coach', foreignKey: 'coachProfileId' });
Review.belongsTo(Profile, { as: 'player', foreignKey: 'playerProfileId' });

// Each participant entry means 1to1 coach to trainee connection,
// through individual or shared event (many participants at once)
Participant.belongsTo(Review, { as: 'review', foreignKey: 'reviewId' });
Participant.belongsTo(Profile, { as: 'coach' });
Participant.belongsTo(User, { as: 'client' });

// There are notifications on the platform
// Specifically each event has number of notifications
// and each use had multiple notifications (of event approaching, ask for review, etc)
Event.hasMany(Notification, { foreignKey: 'eventIds' });
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });

// Players (maybe in future also Coaches) can add their Children
Profile.hasOne(Child, { foreignKey: 'parentProfileId' });
Child.belongsTo(Profile, { as: 'parent', foreignKey: 'parentProfileId' });
Sport.hasMany(Child, { foreignKey: 'favoriteSportId' });
Child.belongsTo(Sport, { as: 'favoriteSport', foreignKey: 'favoriteSportId' });
Position.hasMany(Child, { foreignKey: 'favoritePositionId' });
Child.belongsTo(Position, {
  as: 'favoritePosition',
  foreignKey: 'favoritePositionId',
});

// Profile has many references to dictionary tables
// like Sport, University, Player position in a sport, Skills
Sport.hasMany(Profile);
Profile.belongsTo(Sport);
University.hasMany(Profile);
ReferralSource.hasMany(Profile);

Profile.hasMany(FavoriteCoach, {
  as: 'favoriteCoaches',
  foreignKey: 'playerProfileId',
});
FavoriteCoach.belongsTo(Profile, {
  as: 'player',
  foreignKey: 'playerProfileId',
});
Profile.hasMany(FavoriteCoach, {
  as: 'favoritedBy',
  foreignKey: 'coachProfileId',
});
FavoriteCoach.belongsTo(Profile, {
  as: 'coach',
  foreignKey: 'coachProfileId',
});

Profile.belongsTo(ReferralSource, { as: 'referralSource' });
Profile.belongsTo(University);
Profile.belongsTo(Position, { as: 'secondaryPosition' });
Profile.belongsTo(Position, { as: 'primaryPosition' });
Profile.belongsTo(Skill, { as: 'skill1' });
Profile.belongsTo(Skill, { as: 'skill2' });
Profile.belongsTo(Skill, { as: 'skill3' });
Profile.belongsTo(Skill, { as: 'skill4' });

// Event has many references to dictionary tables
// like Sport, University, Player position in a sport, Skills
Event.belongsTo(Sport);
Event.belongsTo(University);
Event.belongsTo(Position, { as: 'position' });
Event.belongsTo(Skill, { as: 'skill' });

// and... each sport has its own skills
Sport.hasMany(Skill);
Skill.belongsTo(Sport);

// We have also utility tables, f.in. we track repeated bookings per Profile
Repeat_Booking.belongsTo(Profile, {
  as: 'coach',
  foreignKey: 'coachProfileId',
});
Repeat_Booking.belongsTo(Profile, {
  as: 'player',
  foreignKey: 'playerProfileId',
});

// Each event has one or more Timeslots
// meaning event can be happening repetitively on multiple dates and with different pricing.
Event.hasMany(Timeslot, { as: 'timeslots', foreignKey: 'eventId' });
Timeslot.hasMany(Participant, { as: 'participants', foreignKey: 'timeslotId' });
Participant.belongsTo(Timeslot, { as: 'timeslot', foreignKey: 'timeslotId' });
Timeslot.belongsTo(Event, {
  as: 'event',
  targetKey: 'id',
  foreignKey: 'eventId',
});

GeoAddress.hasOne(Event);
Event.belongsTo(GeoAddress);
GeoAddress.hasOne(Profile);
Profile.belongsTo(GeoAddress);

export {
  Note,
  User,
  Conference,
  Division,
  Position,
  Sport,
  University,
  Profile,
  Skill,
  Media,
  Participant,
  Event,
  Reset,
  Notification,
  Review,
  Repeat_Booking,
  Timeslot,
  TimeslotTableDefinition,
  ReferralSource,
  SignupStarted,
  FavoriteCoach,
  FavoriteCoachTableDefinition,
  FavoriteCoachTableName,
  GeoAddress,
  Child,
};

export default {
  Note,
  User,
  Conference,
  Division,
  Position,
  Sport,
  University,
  Profile,
  Skill,
  Media,
  Participant,
  Event,
  Reset,
  Notification,
  Review,
  Repeat_Booking,
  Timeslot,
  TimeslotTableDefinition,
  ReferralSource,
  SignupStarted,
  FavoriteCoach,
  FavoriteCoachTableDefinition,
  FavoriteCoachTableName,
  GeoAddress,
  Child,
} as { [a: string]: any };
