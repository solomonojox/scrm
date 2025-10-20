import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionTerm } from "../Types/sessionTermType";

interface SessionTypes {
  listRecords: SessionTerm[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const sessionTermSlice = createSlice({
    name: "term",
    initialState,
    reducers: {
        fetchSessionTermStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSessionTermSuccess: (state, action: PayloadAction<SessionTerm[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchSessionTermFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSessionTermFailure, fetchSessionTermStart, fetchSessionTermSuccess } = sessionTermSlice.actions;
export default sessionTermSlice.reducer;