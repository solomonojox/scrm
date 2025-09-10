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

export const guardianLoanAccountSlice = createSlice({
    name: "guardianLoanAccount",
    initialState,
    reducers: {
        fetchGuardiansLoanAccountStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardiansLoanAccountSuccess: (state, action: PayloadAction<Account>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchGuardiansLoanAccountFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
       
    },
});

export const { fetchGuardiansLoanAccountFailure, fetchGuardiansLoanAccountStart, fetchGuardiansLoanAccountSuccess } = guardianLoanAccountSlice.actions;
export default guardianLoanAccountSlice.reducer;