import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionType } from "../../Types/Guardian/transactionType";


interface GuardianTypes {
  listRecords: TransactionType[];
  loading: boolean;
  error: string | null;
}

const initialState: GuardianTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const guardianTransactionsSlice = createSlice({
    name: "guardianTransaction",
    initialState,
    reducers: {
        fetchGuardiansTransactionStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGuardiansTransactionSuccess: (state, action: PayloadAction<TransactionType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchGuardiansTransactionFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
       
    },
});

export const { fetchGuardiansTransactionFailure, fetchGuardiansTransactionStart, fetchGuardiansTransactionSuccess } = guardianTransactionsSlice.actions;
export default guardianTransactionsSlice.reducer;