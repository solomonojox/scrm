
import { combineReducers } from "@reduxjs/toolkit";

import guardianSlice from './Guardian/guardianSlice'
import studentSlice from './Student/studentSlice'
import schoolFeeSlice from './schoolFeeSlice'
import sessionSlice from './sessionSlice'
import teacherSlice from './Teachers/teacherSlice'
import NewsSlice from './newsSlice'
import EventSlice from './eventSlice'
import classroomSlice from "./Admin/classroomSlice";
import classroomStudentsSlice from './Admin/classroomStudentsSlice'
import  paymentSlice  from "./paymentSlice";
import guardianStudentSlice from "./Guardian/guardianStudentSlice";
import guardianAccountSlice from "./Guardian/accountSlice"
import MessageSlice from "./messageSlice"
import adminSlice from "./Admin/adminSlice"
import guardianLoanAccountSlice from "./Guardian/loanAccountSlice"

export const rootReducer = combineReducers({
  getGuardian: guardianSlice,
  getClassrooms: classroomSlice,
  getSchoolFee: schoolFeeSlice,
  getSession: sessionSlice,
  getStudent: studentSlice,
  getTeacher: teacherSlice,
  getNews: NewsSlice,
  getEvents: EventSlice,
  getStudentsByClassId: classroomStudentsSlice,
  getPayment: paymentSlice,
  getGuardianStudents: guardianStudentSlice,
  getGuardianAccount: guardianAccountSlice,
  getMessage: MessageSlice,
  getAdmin: adminSlice,
  getGuardianLoanAccount: guardianLoanAccountSlice
});
