import { createSlice } from '@reduxjs/toolkit';
import { loadMeetingsFromStorage, saveMeetingsToStorage } from '../utils/localStorageHelpers';
import { addNotification } from './notificationsSlice';

function getOtherParticipant(createdBy, withUser, currentUser) {
  return (createdBy === currentUser) ? withUser : createdBy;
}

const initialState = loadMeetingsFromStorage() || [];

const meetingsSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    addMeeting: (state, action) => {
      const { date, meeting } = action.payload;
      const isOverlap = state.some(m =>
        m.date === date &&
        (
          (meeting.start >= m.start && meeting.start < m.end) ||
          (meeting.end > m.start && meeting.end <= m.end)
        ) &&
        (m.createdBy === m.createdBy || m.with === m.with)
      );
      if (isOverlap) {
        alert('Это время уже занято!');
      } else {
        const newMeeting = {
          ...meeting,
          date,
          accepted: false,
          status: 'pending',
          id: meeting.id ?? Date.now(),
        };
        state.push(newMeeting);
        saveMeetingsToStorage(state);
      }
    },

    cancelMeeting: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex(m => m.id === id);
      if (index !== -1) {
        state.splice(index, 1);
        saveMeetingsToStorage(state);
      }
    },

    removeMeeting: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex(m => m.id === id);
      if (index !== -1) {
        state.splice(index, 1);
        saveMeetingsToStorage(state);
      }
    },

    acceptMeeting: (state, action) => {
      const id = action.payload;
      const meeting = state.find(m => m.id === id);
      if (meeting) {
        meeting.accepted = true;
        meeting.status = 'confirmed'; 
        saveMeetingsToStorage(state);
      }
    },
  },
});

export const { addMeeting, cancelMeeting, removeMeeting, acceptMeeting } = meetingsSlice.actions;


export const addMeetingRequest = ({ date, meeting }) => (dispatch, getState) => {

  dispatch(addMeeting({ date, meeting }));

  const state = getState();
  const newlyCreatedMeeting = [...state.meetings].reverse().find(
    m =>
      m.date === date &&
      m.createdBy === meeting.createdBy &&
      m.with === meeting.with &&
      m.start === meeting.start &&
      m.end === meeting.end
  );
  if (!newlyCreatedMeeting) return;

  const { createdBy, with: withUser, start, end } = newlyCreatedMeeting;
  dispatch(addNotification({
    user: withUser,
    type: 'meetingRequest',
    message: `Пользователь ${createdBy} предлагает встречу ${date} ${start}-${end}`,
    data: {
      meetingId: newlyCreatedMeeting.id,
      date,
      start,
      end,
      createdBy,
      withUser
    },
  }));
};

export const cancelMeetingThunk = (meetingId) => (dispatch, getState) => {
  const state = getState();
  const currentUser = state.user.info?.nickname;

  const meetingIndex = state.meetings.findIndex(m => m.id === meetingId);
  if (meetingIndex === -1) return;

  const canceledMeeting = state.meetings[meetingIndex];
  const { createdBy, with: withUser, date, start, end } = canceledMeeting;

  dispatch(cancelMeeting({ id: meetingId }));

  const otherUser = getOtherParticipant(createdBy, withUser, currentUser);
  dispatch(addNotification({
    user: otherUser,
    type: 'meetingCanceled',
    message: `Встреча отменена: ${createdBy} и ${withUser} (${date} ${start}-${end})`,
    data: { canceledBy: currentUser, date, start, end, withUser, createdBy },
  }));
};

export const acceptMeetingThunk = (meetingId) => (dispatch) => {
  dispatch(acceptMeeting(meetingId));

};

export const rejectMeetingThunk = (meetingId) => (dispatch, getState) => {
  const state = getState();
  const meeting = state.meetings.find(m => m.id === meetingId);
  if (!meeting) return;

  const currentUser = state.user.info?.nickname;
  const { createdBy, with: withUser, date, start, end } = meeting;

  dispatch(removeMeeting({ id: meetingId }));

  if (currentUser === withUser) {
    dispatch(addNotification({
      user: createdBy,
      type: 'meetingRejected',
      message: `Встреча ${date} в ${start}-${end} была отклонена пользователем ${currentUser}`,
      data: {
        meetingId,
        date,
        start,
        end,
        rejectedBy: currentUser,
      }
    }));
  }
};

export default meetingsSlice.reducer;