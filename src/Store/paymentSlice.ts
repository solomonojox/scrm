import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Payment } from "../Types/Admin/PaymentType";

interface PaymentTypes {
  listRecords: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const PaymentSlice = createSlice({
    name: "Payment",
    initialState,
    reducers: {
        fetchPaymentStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPaymentSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchPaymentFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchPaymentFailure, fetchPaymentStart, fetchPaymentSuccess } = PaymentSlice.actions;
export default PaymentSlice.reducer;