import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    recordData: null,
    loading: false,
    error: null
}

const instructorInfoSlice = createSlice({
    name: "instructorInfo",
    initialState,
    reducers: {
        fetchInstructorInfoStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchInstructorInfoSuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchInstructorInfoFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchInstructorInfoStart, fetchInstructorInfoSuccess, fetchInstructorInfoFailure } = instructorInfoSlice.actions;
export default instructorInfoSlice.reducer;