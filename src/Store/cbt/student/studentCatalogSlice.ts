import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CatalogExam {
  examId: string;
  subjectName: string;
  description: string;
  difficulty: number;
  durationMinutes: number;
  totalQuestions: number;
  scheduledAt: string | null;
  subjectCode: string | null;
  alreadyTaken: boolean;
}

interface StudentCatalogState {
  listRecords: CatalogExam[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentCatalogState = {
  listRecords: [],
  loading: false,
  error: null,
};

export const StudentCatalogSlice = createSlice({
  name: "studentCatalog",
  initialState,
  reducers: {
    fetchStudentCatalogStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStudentCatalogSuccess: (state, action: PayloadAction<CatalogExam[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchStudentCatalogFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchStudentCatalogStart,
  fetchStudentCatalogSuccess,
  fetchStudentCatalogFailure,
} = StudentCatalogSlice.actions;

export default StudentCatalogSlice.reducer;