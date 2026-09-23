import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SchoolAccountType } from "../../Types/Admin/schoolAccountType";

interface SchoolAccountState {
  record: SchoolAccountType | null;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolAccountState = {
  record: null,
  loading: false,
  error: null,
};

const schoolAccountSlice = createSlice({
  name: "getSchoolAccounts",
  initialState,
  reducers: {
    fetchSchoolAccountsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSchoolAccountsSuccess: (
      state,
      action: PayloadAction<SchoolAccountType | null>
    ) => {
      state.loading = false;
      state.record = action.payload ?? null;
      state.error = null;
    },
    fetchSchoolAccountsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSchoolAccountsStart,
  fetchSchoolAccountsSuccess,
  fetchSchoolAccountsFailure,
} = schoolAccountSlice.actions;

export default schoolAccountSlice.reducer;