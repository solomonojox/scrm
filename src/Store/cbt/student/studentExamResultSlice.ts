import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudentExamResult {
  id: string | number;
  examId?: string;
  subject: string;
  date: string;
  score: number;
  grade: string;
  status: string;
}

interface StudentExamResultState {
  listRecords: StudentExamResult[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentExamResultState = {
  listRecords: [],
  loading: false,
  error: null,
};

export const StudentExamResultSlice = createSlice({
  name: "studentExamResult",
  initialState,
  reducers: {
    fetchStudentExamResultsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentExamResultsSuccess: (state, action: PayloadAction<StudentExamResult[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchStudentExamResultsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStudentExamResultsStart,
  fetchStudentExamResultsSuccess,
  fetchStudentExamResultsFailure,
} = StudentExamResultSlice.actions;

export default StudentExamResultSlice.reducer;
