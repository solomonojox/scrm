import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllExamQuestionType, PaginatedExamResponse } from "../../Types/Cbt/cbtTypes";

interface AllExamQuestionState {
  listRecords: AllExamQuestionType[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: AllExamQuestionState = {
  listRecords: [],
  pageNumber: 1,
  pageSize: 10,
  totalRecords: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

const allExamQuestionSlice = createSlice({
  name: "getAllExamQuestion",
  initialState,
  reducers: {
    fetchAllExamQuestionStart(state) {
      state.loading = true;
      state.error = null;
    },
    // UPDATED: payload is now the full paginated response
    fetchAllExamQuestionSuccess(state, action: PayloadAction<PaginatedExamResponse>) {
      state.loading = false;
      state.listRecords = action.payload.result;
      state.pageNumber = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalRecords = action.payload.totalRecords;
      state.totalPages = action.payload.totalPages;
    },
    fetchAllExamQuestionFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllExamQuestionStart,
  fetchAllExamQuestionSuccess,
  fetchAllExamQuestionFailure,
} = allExamQuestionSlice.actions;

export default allExamQuestionSlice.reducer;
