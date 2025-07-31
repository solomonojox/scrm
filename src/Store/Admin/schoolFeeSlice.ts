import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { schoolFee } from "../../Types/Admin/schoolFeeType";

interface SchoolFeeTypes {
  listRecords: schoolFee[];
  loading: boolean;
  error: string | null;
}

const initialState: SchoolFeeTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const schoolFeeSlice = createSlice({
    name: "schoolFee",
    initialState,
    reducers: {
        fetchSchoolFeeStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSchoolFeeSuccess: (state, action: PayloadAction<schoolFee[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchSchoolFeeFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSchoolFeeFailure, fetchSchoolFeeStart, fetchSchoolFeeSuccess } = schoolFeeSlice.actions;
export default schoolFeeSlice.reducer;