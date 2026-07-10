import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubjectPerformanceRaw {
  subject?: string;
  subjectName?: string;
  score?: number;
  averageScore?: number;
}

export interface StudentPerformanceData {
  studentId: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  totalExamsTaken: number;
  bySubject: SubjectPerformanceRaw[];
}

interface StudentPerformanceState {
  listRecords: StudentPerformanceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentPerformanceState = {
  listRecords: null,
  loading: false,
  error: null,
};

export const StudentPerformanceSlice = createSlice({
  name: "studentPerformance",
  initialState,
  reducers: {
    fetchStudentPerformanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentPerformanceSuccess: (state, action: PayloadAction<StudentPerformanceData>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchStudentPerformanceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStudentPerformanceStart,
  fetchStudentPerformanceSuccess,
  fetchStudentPerformanceFailure,
} = StudentPerformanceSlice.actions;

export default StudentPerformanceSlice.reducer;