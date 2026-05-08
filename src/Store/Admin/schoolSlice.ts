import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SchoolType } from "../../Types/Admin/schoolType";


interface SchoolTypes {
  listRecords: SchoolType;
  loading: boolean;
  error: string | null;
}

const initialState: SchoolTypes = {
  listRecords: {} as SchoolType,
  loading: false,
  error: null,
};

export const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    fetchSchoolStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSchoolSuccess: (state, action: PayloadAction<SchoolType>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchSchoolFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSchoolFailure,fetchSchoolStart,fetchSchoolSuccess } = schoolSlice.actions;

export default schoolSlice.reducer;
