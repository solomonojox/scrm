import React, { useEffect, useState } from "react";
import Sidebar from "../Pages/Sidebar";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASEURL;

const Assignment = () => {
  const [studentData, setStudentData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [classroomId, setClassroomId] = useState(0);
  const guardianId = localStorage.getItem("guardianId");

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/Student/GetGuardianStudents/${guardianId}`
        );
        setStudentData(res.data.data);
      } catch (err) {
        console.error("Error fetching students: ", err);
      }
    };
    fetchStudents();
  }, [guardianId]);

  // Fetch assignments when classroom changes
  useEffect(() => {
    if (!classroomId) return;
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/Assignment/GetAssignmentByClassId/${classroomId}`
        );
        setAssignmentData(res.data.data);
        console.log(res.data.data)
      } catch (err) {
        console.error("Error fetching assignments: ", err);
      }
    };
    fetchAssignments();
  }, [classroomId]);

  return (
    <div className="flex h-screen ">
      <aside className="w-72">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800">Assignment List</h1>

        <div className="mt-4">
          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
            Select Student
          </label>
          <select
            id="student"
            onChange={(e) => setClassroomId(e.target.value)}
            className="mt-1 block w-full max-w-xs border border-gray-300 bg-white py-2 px-3 rounded-md shadow-sm focus:outline-none"
          >
            <option value="">-- choose --</option>
            {studentData.map((student) => (
              <option key={student.studentId} value={student.classroomId}>
                {student.firstname} {student.lastname}
              </option>
            ))}
          </select>
        </div>

        {assignmentData.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <div className="inline-block min-w-full shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-500">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignmentData.map((assignment) => (
                    <tr
                      key={assignment.assignmentId}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {assignment.title}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xl">
                        {assignment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(assignment.dueDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-gray-600">No assignments available for this student.</p>
        )}
      </main>
    </div>
  );
};

export default Assignment;