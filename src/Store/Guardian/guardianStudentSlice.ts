import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Guardian } from "../../Types/Guardian/guardianTypes";

interface GuardianTypes {
  listRecords: Guardian[];
  loading: boolean;
  error: string | null;
}

const initialState: GuardianTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const guardianStudentSlice = createSlice({
    name: "guardianStudent",
    initialState,
    reducers: {
        fetchGuardiansStudentStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardiansStudentSuccess: (state, action: PayloadAction<Guardian[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchGuardiansStudentFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchGuardiansStudentFailure, fetchGuardiansStudentStart, fetchGuardiansStudentSuccess } = guardianStudentSlice.actions;
export default guardianStudentSlice.reducer;