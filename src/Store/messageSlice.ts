import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageType } from "../Types/message";


interface MessageTypes {
  listRecords: MessageType[];
  loading: boolean;
  error: string | null;
}

const initialState: MessageTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const MessageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        fetchMessageStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchMessageSuccess: (state, action: PayloadAction<MessageType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchMessageFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchMessageFailure, fetchMessageStart, fetchMessageSuccess } = MessageSlice.actions;
export default MessageSlice.reducer;