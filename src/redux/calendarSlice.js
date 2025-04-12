import { createSlice } from '@reduxjs/toolkit';

function formatDate(date) {

  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

const todayStr = formatDate(new Date());

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    selectedDay: todayStr,  
  },
  reducers: {
    selectDay: (state, action) => {
      state.selectedDay = action.payload;
    },
  },
});

export const { selectDay } = calendarSlice.actions;
export default calendarSlice.reducer;