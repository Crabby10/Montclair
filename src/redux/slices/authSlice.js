import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.error = null;
      localStorage.removeItem('userInfo');
    }
  }
});

export const { authStart, authSuccess, authFailure, logoutUser } = authSlice.actions;
export default authSlice.reducer;
