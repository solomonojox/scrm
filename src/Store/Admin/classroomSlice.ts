import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { classrooms } from "../../Types/classroomTypes";

interface ClassroomTypes {
  listRecords: classrooms[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassroomTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const classroomSlice = createSlice({
  name: "classrooms",
  initialState,
  reducers: {
    fetchClassroomsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClassroomsSuccess: (state, action: PayloadAction<classrooms[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchClassroomsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} = classroomSlice.actions;
export default classroomSlice.reducer;
