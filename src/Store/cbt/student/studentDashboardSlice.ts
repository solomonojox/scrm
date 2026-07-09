import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudentDashboardRecentResult {
  id?: string | number;
  subject: string;
  date: string;
  score: number;
  grade: string;
  status: string;
}

export interface StudentDashboardData {
  studentName: string;
  schoolName: string;
  totalExamsTaken: number;
  totalExamsAvailable: number;
  averageScore: number;
  recentResults: StudentDashboardRecentResult[];
}

interface StudentDashboardState {
  listRecords: StudentDashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentDashboardState = {
  listRecords: null,
  loading: false,
  error: null,
};

export const StudentDashboardSlice = createSlice({
  name: "studentDashboard",
  initialState,
  reducers: {
    fetchStudentDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentDashboardSuccess: (state, action: PayloadAction<StudentDashboardData>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchStudentDashboardFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStudentDashboardStart,
  fetchStudentDashboardSuccess,
  fetchStudentDashboardFailure,
} = StudentDashboardSlice.actions;

export default StudentDashboardSlice.reducer;