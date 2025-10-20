import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subject } from "../Types/subjectTypes";


interface SubjectTypes {
  listRecords: Subject[];
  loading: boolean;
  error: string | null;
}

const initialState: SubjectTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const subjectSlice = createSlice({
    name: "subjects",
    initialState,
    reducers: {
        fetchSubjectStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSubjectSuccess: (state, action: PayloadAction<Subject[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchSubjectFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSubjectFailure, fetchSubjectStart, fetchSubjectSuccess } = subjectSlice.actions;
export default subjectSlice.reducer;