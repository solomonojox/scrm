import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminType } from "../../Types/Admin/adminType";


interface AdminTypes {
  listRecords: AdminType[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    fetchAdminStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAdminSuccess: (state, action: PayloadAction<AdminType[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchAdminFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchAdminFailure,fetchAdminStart,fetchAdminSuccess } = adminSlice.actions;

export default adminSlice.reducer;
