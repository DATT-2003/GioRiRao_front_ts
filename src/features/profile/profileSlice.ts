import { createAppSlice } from "../../app/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IProfile } from "../profile/types/profileTypes"; // Import the IProfile type for type safety

export interface ProfileSliceState {
  profile: IProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileSliceState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileSlice = createAppSlice({
  name: "profile",
  initialState,
  reducers: create => ({
    setProfile: create.reducer((state, action: PayloadAction<IProfile>) => {
      state.profile = action.payload;
    }),
    setLoading: create.reducer((state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }),
    setError: create.reducer((state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }),
    clearProfile: create.reducer(state => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    }),
  }),
  selectors: {
    selectProfile: state => state.profile,
    selectProfileLoading: state => state.loading,
    selectProfileError: state => state.error,
  },
  extraReducers: (builder) => {
    // Optional: Add async thunk handlers here later if needed
  }
});

export const {
  setProfile,
  setLoading,
  setError,
  clearProfile
} = profileSlice.actions;

export const {
  selectProfile,
  selectProfileLoading,
  selectProfileError
} = profileSlice.selectors;

export default profileSlice.reducer;
