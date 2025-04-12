import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import meetingsReducer from './meetingsSlice';
import friendsReducer from './friendsSlice';
import notificationsReducer from './notificationsSlice';
import calendarReducer from './calendarSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    meetings: meetingsReducer,
    friends: friendsReducer,
    notifications: notificationsReducer,
    calendar: calendarReducer,
  },
});