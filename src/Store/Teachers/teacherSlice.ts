import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TeacherType } from "../../Types/Teacher/teacherType";

interface ClassroomTypes {
  listRecords: TeacherType[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassroomTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const Teacherlice = createSlice({
    name: "Teacher",
    initialState,
    reducers: {
        fetchTeacherStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchTeacherSuccess: (state, action: PayloadAction<TeacherType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchTeacherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } = Teacherlice.actions;
export default Teacherlice.reducer;