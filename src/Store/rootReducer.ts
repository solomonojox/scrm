
import { combineReducers } from "@reduxjs/toolkit";

import guardianSlice from './Guardian/guardianSlice'
import studentSlice from './Student/studentSlice'
import schoolFeeSlice from './schoolFeeSlice'
import sessionSlice from './sessionSlice'
import teacherSlice from './Teachers/teacherSlice'
import NewsSlice from './newsSlice'
import classroomSlice from "./Admin/classroomSlice";
import classroomStudentsSlice from './Admin/classroomStudentsSlice'
import  paymentSlice  from "./paymentSlice";
import guardianStudentSlice from "./Guardian/guardianStudentSlice";
import guardianAccountSlice from "./Guardian/accountSlice"

export const rootReducer = combineReducers({
  getGuardian: guardianSlice,
  getClassrooms: classroomSlice,
  getSchoolFee: schoolFeeSlice,
  getSession: sessionSlice,
  getStudent: studentSlice,
  getTeacher: teacherSlice,
  getNews: NewsSlice,
  getStudentsByClassId: classroomStudentsSlice,
  getPayment: paymentSlice,
  getGuardianStudents: guardianStudentSlice,
  getGuardianAccount: guardianAccountSlice
});
