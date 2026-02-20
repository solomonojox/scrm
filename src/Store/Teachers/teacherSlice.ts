import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeacherType } from "../../Types/Teacher/teacherType";

interface ClassroomTypes {
  listRecords: TeacherType[];
  singleList: TeacherType;
  selectedTeacher: TeacherType | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClassroomTypes = {
  listRecords: [],
  singleList: {},
  selectedTeacher: null,
  loading: false,
  error: null,
};

export const Teacherlice = createSlice({
  name: "Teacher",
  initialState,
  reducers: {
    fetchTeacherStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTeacherSuccess: (state, action: PayloadAction<TeacherType[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchSingleTeacherSuccess: (state, action: PayloadAction<TeacherType>) => {
      state.loading = false;
      state.singleList = action.payload;
    },
    fetchTeacherFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchATeacherStart: (state, action: PayloadAction<TeacherType>) => {
      state.loading = false;
      state.selectedTeacher = action.payload;
    },

    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null;
    },
  },
});

export const { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess, fetchSingleTeacherSuccess, fetchATeacherStart, clearSelectedTeacher } = Teacherlice.actions;
export default Teacherlice.reducer;
