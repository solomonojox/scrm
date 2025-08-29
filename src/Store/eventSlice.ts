import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { event } from "../Types/Admin/eventType";

interface NewsTypes {
  listRecords: event[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const EventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        fetchEventStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchEventSuccess: (state, action: PayloadAction<event[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchEventFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchEventFailure, fetchEventStart, fetchEventSuccess } = EventSlice.actions;
export default EventSlice.reducer;