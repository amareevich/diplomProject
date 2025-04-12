import { createSlice } from '@reduxjs/toolkit';

let lastId = 0;
const getNextId = () => ++lastId;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
  },
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.list.push(action.payload);
      },
      prepare: (notification) => {
        return {
          payload: {
            id: getNextId(),
            user: notification.user,
            type: notification.type,
            message: notification.message,
            data: notification.data || {},
            read: false,
          },
        };
      },
    },
    removeNotification: (state, action) => {

      const index = state.list.findIndex(n => n.id === action.payload);
      if (index !== -1) state.list.splice(index, 1);
    },

    markRead: (state, action) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },

    removeNotificationByFilter: {
      reducer: (state, action) => {
        const { user, filterFn } = action.payload;
        state.list = state.list.filter(notif => {
          if (notif.user !== user) return true;
          return !filterFn(notif);
        });
      },
      prepare: (payload) => ({ payload }),
    },
  },
});

export const {
  addNotification,
  removeNotification,
  markRead,
  removeNotificationByFilter
} = notificationsSlice.actions;

export default notificationsSlice.reducer;