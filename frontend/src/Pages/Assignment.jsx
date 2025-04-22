import React, { useEffect, useState } from "react";
import Sidebar from "../Pages/Sidebar";
import axios from "axios";

const Assignment = () => {
  const [studentData, setStudentData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [classroomId, setClassroomId] = useState(0);
  let guardianId = localStorage.getItem("guardianId");

  // Fetch students when component loads
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `https://scrmapi.tranquility.org.ng/api/Student/GetGuardianStudents/${guardianId}`
        );
        setStudentData(response.data.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchStudent();
  }, [guardianId]);

  // Fetch assignments when classroomId changes
  useEffect(() => {
    if (classroomId !== 0) {
      const fetchAssignment = async () => {
        try {
          const response = await axios.get(
            `https://scrmapi.tranquility.org.ng/api/Assignment/GetAssignmentByClassId/${classroomId}`
          );
          setAssignmentData(response.data.data);
          console.log(response.data.data)
        } catch (error) {
          console.error("error", error.response);
        }
      };
      fetchAssignment();
    }
  }, [classroomId]);

  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="ml-[280px] mt-5">
        <p className="font-bold text-xl">Assignment List</p>

        {/* Student select box */}
        <select
        
          onChange={(e) => setClassroomId(e.target.value)}
          className="border px-4 py-2 mt-4"
        >
          <option value="">Select student</option>
          {studentData.map((student,index) => (
            <option key={index} value={student.classroomId}>
              {student.firstname}
            </option>
          ))}
        </select>

        {assignmentData.length > 0 ? (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Header row */}
                <tr className="bg-gray-50">
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Title
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Description
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Due Date
                  </td>
                </tr>
                {assignmentData.map((assignment,index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {assignment.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {assignment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {assignment.dueDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 text-gray-700">No assignments available.</div>
        )}
      </div>
    </div>
  );
};

export default Assignment;
