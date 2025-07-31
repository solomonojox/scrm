import { combineReducers } from "@reduxjs/toolkit";

import instructorInfoSlice from "./Sample/InstructorInfoSlice";
import guardianSlice from './Guardian/guardianSlice'
import classroomSlice from './Teachers/classroomSlice'
import schoolFeeSlice from './Admin/schoolFeeSlice'
import sessionSlice from './Admin/sessionSlice'

export const rootReducer = combineReducers({
    instructorInfo: instructorInfoSlice,
    getGuardian: guardianSlice,
    getClassrooms: classroomSlice,
    getSchoolFee: schoolFeeSlice,
    getSession: sessionSlice
});