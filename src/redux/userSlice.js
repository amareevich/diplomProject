import { createSlice } from '@reduxjs/toolkit';
import {
  loadUserFromStorage,
  saveUserToStorage,
  loadUsers,
  saveUsers
} from '../utils/localStorageHelpers';

const storedUser = loadUserFromStorage();

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: !!storedUser,
    info: storedUser || null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.info = action.payload;
      if (!state.info.avatarColor) {
        state.info.avatarColor = '';
      }
      saveUserToStorage(state.info);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.info = null;
      localStorage.removeItem('user');
    },
    updateProfile(state, action) {
      state.info = { ...state.info, ...action.payload };
      saveUserToStorage(state.info);

      const allUsers = loadUsers();
      if (!allUsers) return;

      const index = allUsers.findIndex(u => u.nickname === state.info.nickname);
      if (index !== -1) {
        allUsers[index] = { ...allUsers[index], ...state.info };
        saveUsers(allUsers);
      }
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;