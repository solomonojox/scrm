import React, { useEffect } from "react";
import AdminCbtCards from "./AdminCbtCards";
import Calendar from "../../../../components/Teachers/chart/Calendar";
import AdminCbtTable from "./AdminCbtTable";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { fetchAdminCbtStudentFailure, fetchAdminCbtStudentStart, fetchAdminCbtStudentSuccess } from "../../../../Store/cbt/admin/student/adminCbtStudentSlice";
import { fetchAdminCbtTeacherFailure, fetchAdminCbtTeacherStart, fetchAdminCbtTeacherSuccess } from "../../../../Store/cbt/admin/teacher/adminCbtTeacherSlice";
import { fetchAdminCbtExaminerFailure, fetchAdminCbtExaminerStart, fetchAdminCbtExaminerSuccess } from "../../../../Store/cbt/examiner/adminCbtExaminerSlice";
import { AdminCbtExaminerService } from "../../../../Services/Cbt/Admin/examiner/AdminCbtExaminerService";

const AdminCbtDashboard = () => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedAdminCbtStudentLoading = useSelector((state: RootState) => state.getAdminCbtStudents.loading);

  // Fetch students & teachers on mount
  useEffect(() => {
    if (!fetchedAdminCbtStudentLoading && cbtUser?.schoolId) {
      fetchStudents();
    }
  }, [cbtUser?.schoolId]);

  const fetchStudents = async () => {
    dispatch(fetchAdminCbtStudentStart());
    dispatch(fetchAdminCbtTeacherStart());
    dispatch(fetchAdminCbtExaminerStart());

    try {
      const data = await cbtStudentService.getAllBySchoolId(cbtUser?.schoolId);
      const teachers = await cbtAdminService.getAllTeachers(cbtUser?.schoolId);
      const examiners = await AdminCbtExaminerService.getBySchool(cbtUser?.schoolId);

      dispatch(fetchAdminCbtStudentSuccess(data));
      dispatch(fetchAdminCbtTeacherSuccess(teachers));
      dispatch(fetchAdminCbtExaminerSuccess(examiners));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchAdminCbtStudentFailure(msg));
      dispatch(fetchAdminCbtTeacherFailure(msg));
      dispatch(fetchAdminCbtExaminerFailure(msg));
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
