import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CbtSubjectType } from "../../Types/Cbt/cbtTypes";

interface CbtSubjectTypes {
  listRecords: CbtSubjectType[];
  loading: boolean;
  error: string | null;
}

const initialState: CbtSubjectTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const CbtSubjectSlice = createSlice({
  name: "cbtSubject",
  initialState,
  reducers: {
    fetchCbtSubjectStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCbtSubjectSuccess: (state, action: PayloadAction<CbtSubjectType[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchCbtSubjectFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCbtSubjectFailure, fetchCbtSubjectStart, fetchCbtSubjectSuccess } =
  CbtSubjectSlice.actions;
export default CbtSubjectSlice.reducer;
