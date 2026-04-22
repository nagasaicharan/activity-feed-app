import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_USERS } from '../../utils/constant';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: MOCK_USERS,
  currentUser: MOCK_USERS[0],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    loginAsUser: (state, action: PayloadAction<string>) => {
      const selectedUser = state.users.find((user) => user.id === action.payload);
      if (!selectedUser) {
        state.error = 'Selected user was not found.';
        return;
      }

      state.currentUser = selectedUser;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { setUser, loginAsUser, setLoading, setError, logout } = userSlice.actions;
export default userSlice.reducer;
