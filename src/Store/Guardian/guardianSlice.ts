import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Guardian } from "../../Types/Guardian/guardianTypes";

interface GuardianTypes {
  listRecords: Guardian[];
  selectedGuardian: Guardian | null;  
  loading: boolean;
  error: string | null;
}

const initialState: GuardianTypes = {
  listRecords: [],
  selectedGuardian: null,
  loading: false,
  error: null,
};

export const guardianSlice = createSlice({
    name: "guardian",
    initialState,
    reducers: {
        fetchGuardiansStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardiansSuccess: (state, action: PayloadAction<Guardian[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchGuardiansFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchGuardianStart: (state, action: PayloadAction<Guardian>) => {
            state.loading = false;
            state.selectedGuardian = action.payload;
        },
        clearSelectedGuardian: (state) => {
            state.selectedGuardian = null;
        },
    },
});

export const { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess, fetchGuardianStart, clearSelectedGuardian } = guardianSlice.actions;
export default guardianSlice.reducer;