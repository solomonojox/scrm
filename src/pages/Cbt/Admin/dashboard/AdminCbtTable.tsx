import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useAuth } from "../../../../Context/Auth/useAuth";
import {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
} from "../../../../Store/Student/studentSlice";
import {
  fetchTeacherStart,
  fetchTeacherSuccess,
  fetchTeacherFailure,
} from "../../../../Store/Teachers/teacherSlice";

interface Student {
  name: string;
  email: string;
  class: string;
  status: string;
}

interface Teacher {
  name: string;
  email: string;
  subject: string;
  status: string;
}

const AdminCbtTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");

  const tabs = [
    { id: "teachers", label: "Teachers" },
    { id: "students", label: "Students" },
  ]

  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const fetchedStudentRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedTeacherRecord = useSelector((state: RootState) => state.getTeacher.listRecords);
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
      const data = await cbtAdminService.getAllStudents(cbtUser?.schoolId);
      const teachers = await cbtAdminService.getAllTeachers(cbtUser?.schoolId);

      dispatch(fetchStudentsSuccess(data?.data));
      dispatch(fetchTeacherSuccess(teachers?.data));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchStudentsFailure(msg));
      dispatch(fetchTeacherFailure(msg));
    }
  };

  return (
    <div className="border shadow-md rounded-lg">
      <h1 className="text-xl p-6 font-semibold mb-6">Users</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab.id as "students" | "teachers")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Students Table */}
      {activeTab === "students" && (
        <table className="w-full border-collapse shadow-sm overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm">Name</th>
              <th className="p-3 text-sm">Email</th>
              {/* <th className="p-3 text-sm">Class</th> */}
              {/* <th className="p-3 text-sm">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {fetchedStudentRecord.map((student, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{student.firstname} {student.lastname}</td>
                {/* <td className="p-3 text-sm">{student.email}</td> */}
                {/* <td className="p-3 text-sm">{student.class}</td> */}
                {/* <td className="p-3 text-sm capitalize">{student.status}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Teachers Table */}
      {activeTab === "teachers" && (
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm">Name</th>
              <th className="p-3 text-sm">Email</th>
              <th className="p-3 text-sm">Phone Number</th>
              {/* <th className="p-3 text-sm">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {fetchedTeacherRecord.map((teacher, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{teacher.firstname} {teacher.lastname}</td>
                <td className="p-3 text-sm">{teacher.email}</td>
                <td className="p-3 text-sm">{teacher.phone}</td>
                {/* <td className="p-3 text-sm capitalize">{teacher.status}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate("/cbt/admin/userManagement")}
        className="px-6 py-2 bg-orange-600 text-white m-4 rounded-lg"
      >
        View all
      </button>
    </div>
  );
};

export default AdminCbtTable;
