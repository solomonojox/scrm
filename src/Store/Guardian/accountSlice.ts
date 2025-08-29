import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "../../Types/Guardian/accountType";

interface GuardianTypes {
  listRecords: Account | null;
  loading: boolean;
  error: string | null;
}

const initialState: GuardianTypes = {
  listRecords: null,
  loading: false,
  error: null,
};

export const guardianAccountSlice = createSlice({
    name: "guardianAccount",
    initialState,
    reducers: {
        fetchGuardiansAccountStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardiansAccountSuccess: (state, action: PayloadAction<Account>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchGuardiansAccountFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
       
    },
});

export const { fetchGuardiansAccountFailure, fetchGuardiansAccountStart, fetchGuardiansAccountSuccess } = guardianAccountSlice.actions;
export default guardianAccountSlice.reducer;