import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NappsChapter } from "../Types/nappsChapter";

interface NewsTypes {
  listRecords: NappsChapter[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const nappsChapterSlice = createSlice({
    name: "nappsChapter",
    initialState,
    reducers: {
        fetchNappsChapterStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchNappsChapterSuccess: (state, action: PayloadAction<NappsChapter[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchNappsChapterFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchNappsChapterFailure, fetchNappsChapterStart, fetchNappsChapterSuccess } = nappsChapterSlice.actions;
export default nappsChapterSlice.reducer;