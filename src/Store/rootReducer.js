import { combineReducers } from "@reduxjs/toolkit";

import instructorInfoSlice from "./Sample/InstructorInfoSlice";

export const rootReducer = combineReducers({
    instructorInfo: instructorInfoSlice
});