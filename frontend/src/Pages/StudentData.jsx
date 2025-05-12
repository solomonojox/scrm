import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "../Pages/Sidebar";
import defaultAvatar from "../Assets/woman.jpeg";
import axios from 'axios';
import { IoClose } from "react-icons/io5";
import { AppContext } from '../context/AppContext';

const baseUrl = process.env.REACT_APP_BASEURL;

export default function StudentData() {
  const { showOverlay, hideOverlay } = useContext(AppContext);
  const guardianData = JSON.parse(localStorage.getItem('guardian')) || {};
  const guardianId = guardianData.guardianId;

  const [students, setStudents] = useState([]);
  const [teacherMap, setTeacherMap] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(-1);

  useEffect(() => {
    if (!guardianId) return;
    async function fetchStudents() {
      showOverlay();
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/Student/GetGuardianStudents/${guardianId}`
        );
        const studentList = data.data || [];
        setStudents(studentList);

        // Fetch all teacher details in parallel
        const teacherIds = Array.from(
          new Set(
            studentList
              .filter((s) => s.teacherId)
              .map((s) => s.teacherId)
          )
        );

        const teacherResponses = await Promise.all(
          teacherIds.map((tid) => axios.get(
            `${baseUrl}/api/Teacher/GetTeacherById/${tid}`
          ))
        );

        const map = {};
        teacherResponses.forEach((res) => {
          const t = res.data.data;
          map[t.teacherId] = t;
        });
        setTeacherMap(map);
      } catch (err) {
        console.error('Error loading students or teachers', err);
      } finally {
        hideOverlay();
      }
    }
    fetchStudents();
  }, [guardianId, showOverlay, hideOverlay]);

  const toggleDetails = (idx) => {
    setExpandedIndex(prev => (prev === idx ? -1 : idx));
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 mt-10 ml-64 px-8">
        {students.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No students available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {students.map((student, idx) => {
              const teacher = teacherMap[student.teacherId] || {};
              const isOpen = expandedIndex === idx;
              return (
                <div key={student.studentId} className="relative border rounded-lg shadow p-4 flex">
                  <img
                    src={student.imagePath || defaultAvatar}
                    alt={`${student.firstname} ${student.lastname}`}
                    className="w-32 h-32 rounded-md object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {student.firstname} {student.lastname}
                    </h2>
                    <p>Student No: {student.studentNo}</p>
                    <p>Class: {student.classroomId ? `Class ${student.classroomId}` : 'Not assigned'}</p>
                    <button
                      onClick={() => toggleDetails(idx)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      {isOpen ? 'Close Details' : 'View Teacher Details'}
                    </button>

                    {isOpen && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        onClick={() => toggleDetails(idx)}
                      >
                        <div
                          className="bg-white rounded-lg p-6 w-96 relative shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IoClose
                            className="absolute top-4 right-4 text-2xl cursor-pointer"
                            onClick={() => toggleDetails(idx)}
                          />
                          <h3 className="text-2xl font-bold mb-4">Class Teacher</h3>
                          <img
                            src={teacher.imagePath || defaultAvatar}
                            alt={`${teacher.firstName} ${teacher.lastName}`}
                            className="w-40 h-40 object-cover rounded-md mb-4"
                          />
                          {teacher.teacherId ? (
                            <div className="space-y-2">
                              <p><strong>Name:</strong> {teacher.firstName} {teacher.lastName}</p>
                              <p><strong>Email:</strong> {teacher.email || 'N/A'}</p>
                              <p><strong>Phone:</strong> {teacher.phoneNumber || 'N/A'}</p>
                              <p><strong>Gender:</strong> {teacher.gender || 'N/S'}</p>
                              <p><strong>Class:</strong> {student.classroomId ? `Class ${student.classroomId}` : 'N/A'}</p>
                            </div>
                          ) : (
                            <p className="text-gray-500">Teacher info unavailable.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
