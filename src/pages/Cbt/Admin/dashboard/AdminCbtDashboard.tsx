import React, { useEffect } from "react";
import AdminCbtCards from "./AdminCbtCards";
import Calendar from "../../../../components/Teachers/chart/Calendar";
import AdminCbtTable from "./AdminCbtTable";
import { fetchStudentsFailure, fetchStudentsStart, fetchStudentsSuccess } from "../../../../Store/Student/studentSlice";
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from "../../../../Store/Teachers/teacherSlice";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../Context/Auth/useAuth";

const AdminCbtDashboard = () => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedStudentLoading = useSelector((state: RootState) => state.getStudent.loading);
  // Fetch students & teachers on mount
  useEffect(() => {
    if (!fetchedStudentLoading && cbtUser?.schoolId) {
      fetchStudents();
    }
  }, [cbtUser?.schoolId]);

  const fetchStudents = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchTeacherStart());

    try {
      const data = await cbtStudentService.getAllBySchoolId(cbtUser?.schoolId);
      const teachers = await cbtAdminService.getAllTeachers(cbtUser?.schoolId);

      dispatch(fetchStudentsSuccess(data));
      dispatch(fetchTeacherSuccess(teachers));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchStudentsFailure(msg));
      dispatch(fetchTeacherFailure(msg));
    }
  };

  return (
    <div className="px-6 py-4">
      <AdminCbtCards />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2">
        <AdminCbtTable />
        <Calendar />
      </div>
    </div>
  );
};

export default AdminCbtDashboard;
