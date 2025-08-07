import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { News } from "../Types/newsType";
interface NewsTypes {
  listRecords: News[];
  loading: boolean;
  error: string | null;
}

const initialState: NewsTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const NewsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        fetchNewsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchNewsSuccess: (state, action: PayloadAction<News[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchNewsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchNewsFailure, fetchNewsStart, fetchNewsSuccess } = NewsSlice.actions;
export default NewsSlice.reducer;