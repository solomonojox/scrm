import { combineReducers } from "@reduxjs/toolkit";

import instructorInfoSlice from "./Sample/InstructorInfoSlice";
import guardianSlice from './Guardian/guardianSlice'
import studentSlice from './Student/studentSlice'
import classroomSlice from './classroomSlice'
import schoolFeeSlice from './schoolFeeSlice'
import sessionSlice from './sessionSlice'
import teacherSlice from './Teachers/teacherSlice'

export const rootReducer = combineReducers({
  instructorInfo: instructorInfoSlice,
  getGuardian: guardianSlice,
  getClassrooms: classroomSlice,
  getSchoolFee: schoolFeeSlice,
  getSession: sessionSlice,
  getStudent: studentSlice,
  getTeacher: teacherSlice,
});