import { createNote, updateNote, deleteNote } from './NoteMutation';
import { updateUser, deleteUser } from './UserMutation';
import { createReview, updateReview } from './ReviewMutation';
import { updateCoach } from './CoachMutation';
import { createMedia, deleteMedia } from './MediaMutation';
import {
  createEventWithTimeslots,
  deleteEvent,
  updateEvent,
  cancelEvent,
} from './EventMutation';
import {
  cancelTimeslot,
  deleteTimeslot,
  updateTimeslot,
} from './TimeslotMutation';
import { addFavoriteCoach, removeFavoriteCoach } from './FavoriteCoachMutation';
import { createChild, updateChild, deleteChild } from './ChildMutation';

export {
  createNote,
  updateNote,
  deleteNote,
  updateUser,
  createReview,
  updateReview,
  deleteUser,
  updateCoach,
  createMedia,
  deleteMedia,
  createEventWithTimeslots,
  deleteEvent,
  updateEvent,
  cancelEvent,
  deleteTimeslot,
  updateTimeslot,
  cancelTimeslot,
  addFavoriteCoach,
  removeFavoriteCoach,
  createChild,
  deleteChild,
  updateChild,
};
