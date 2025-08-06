import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../Types/sessionType";

interface SessionTypes {
  listRecords: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const sessionSlice = createSlice({
    name: "schoolFee",
    initialState,
    reducers: {
        fetchSessionStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSessionSuccess: (state, action: PayloadAction<Session[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchSessionFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } = sessionSlice.actions;
export default sessionSlice.reducer;