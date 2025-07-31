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
    },
});

export const { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } = guardianSlice.actions;
export default guardianSlice.reducer;