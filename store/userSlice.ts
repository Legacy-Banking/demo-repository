import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface UserState {
  user_id: string;
  user_name?: string;
  user_role?: string;
}

const initialState: UserState = {
  user_id: '',
  user_name: '',
  user_role: '',
};

// Helper function to extract the non-Gmail part of an email
function extractUsernameFromEmail(email: string): string {
  if (email.endsWith('@gmail.com')) {
    return email.split('@')[0]; // Extracts everything before @gmail.com
  }
  return email; 
}

// Create user slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    updateUserRole: (state, action: PayloadAction<string>) => {
      state.user_role = action.payload;
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      const username = extractUsernameFromEmail(action.payload);
      state.user_name = username; 
    }
  },
});

export const { updateUserId, updateUserName, updateUserRole} = userSlice.actions;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const selectUserId = (state: RootState) => state.user.user_id;
export const selectUserName = (state: RootState) => state.user.user_name;
export const selectUserRole = (state: RootState) => state.user.user_role;
export default userSlice.reducer;
