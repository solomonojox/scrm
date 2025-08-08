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

export const classroomStudentsSlice = createSlice({
  name: "classroomStudents",
  initialState,
  reducers: {
    fetchClassroomStudentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClassroomStudentsSuccess: (state, action: PayloadAction<classrooms[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchClassroomStudentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchClassroomStudentsFailure, fetchClassroomStudentsStart,fetchClassroomStudentsSuccess } = classroomStudentsSlice.actions;
export default classroomStudentsSlice.reducer;
