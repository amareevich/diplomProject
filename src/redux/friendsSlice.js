import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], 
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends(state, action) {
      state.list = action.payload;
    },
    clearFriends(state) {
      state.list = [];
    },
  },
});

export const { setFriends, clearFriends } = friendsSlice.actions;
export default friendsSlice.reducer;