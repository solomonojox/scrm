import { combineReducers } from "@reduxjs/toolkit";

import instructorInfoSlice from "./instructor/InstructorInfoSlice";

export const rootReducer = combineReducers({
    instructorInfo: instructorInfoSlice
});