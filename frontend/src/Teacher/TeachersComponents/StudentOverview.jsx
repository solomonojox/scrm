import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Award, MessageCircle } from 'lucide-react';
import assets from '../../Assets/assets';

const baseUrl = process.env.REACT_APP_BASEURL;

function StudentOverview() {
  const [studentCount, setStudentCount] = useState(null);
  const [username, setUsername] = useState("Teacher");
  const [email, setEmail] = useState("email@not-found.com");
  const [assignments, setAssignments] = useState([]);
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);
  const [teacherId, setTeacherId] = useState(null);
  const [classroomIds, setClassroomIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load teacher data
  useEffect(() => {
    if (!baseUrl) {
      console.error("REACT_APP_BASEURL is not set.");
      setError("Base URL missing in environment config.");
      return;
    }

    const storedTeacherData = localStorage.getItem("teacherData");
    if (storedTeacherData) {
      try {
        const teacher = JSON.parse(storedTeacherData);
        console.log("Loaded teacher data:", teacher);

        setUsername(teacher.username || teacher.adminName || "Teacher");
        setEmail(teacher.email || "email@not-found.com");
        setTeacherId(teacher.id ?? teacher.teacherId ?? null);
      } catch (err) {
        console.error("Failed to parse teacherData:", err);
        setError("Failed to load teacher data.");
      }
    } else {
      console.warn("No teacherData found in localStorage.");
      setError("Teacher data not found.");
    }
  }, []);

  // Fetch data pipeline
  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) return;

      try {
        // Fetch Students
        const studentRes = await fetch(`${baseUrl}/api/Student/GetTotalStudentCount`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          console.log("Student API Data:", studentData);
          setStudentCount(studentData?.count ?? studentData);
        } else {
          throw new Error('Failed to fetch student count');
        }

        // Fetch Classrooms
        const classroomRes = await fetch(`${baseUrl}/api/Classroom/GetClassroomsByTeacherId/${teacherId}`);
        let ids = [];
        if (classroomRes.ok) {
          const classroomData = await classroomRes.json();
          ids = classroomData.map(cls => cls.id);
        } else {
          console.warn('Failed to fetch classrooms');
          ids = []; // Empty array if no classrooms are found or request fails
        }
        setClassroomIds(ids);

        // Fetch Assignments
        let allAssignments = [];
        if (classroomRes.ok) {
          for (const classId of ids) {
            const assignRes = await fetch(`${baseUrl}/api/Assignment/GetAssignmentByClassId/${classId}`);
            if (assignRes.ok) {
              const assignmentData = await assignRes.json();
              if (Array.isArray(assignmentData)) {
                allAssignments = [...allAssignments, ...assignmentData];
              }
            } else {
              console.warn(`Failed to fetch assignments for class ${classId}`);
            }
          }
        }

        // Set Assignments
        setAssignments(allAssignments);

        // Pending Assignments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const pending = allAssignments.filter(assignment => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today;
        });
        setPendingAssignmentsCount(pending.length);

        console.log("Assignments Loaded:", allAssignments);
        console.log("Pending Assignments:", pending.length);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="bg-gray-900 text-white">
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>

      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          {/* Profile Section */}
          <div className="flex flex-col items-start gap-4 lg:mr-20">
            <img
              src={assets.woman}
              alt="Profile"
              className="w-16 h-16 rounded-full bg-white object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold">{username}</h3>
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <table>
              <tbody>
                <tr className="border-b">
                  <td className="pb-6 pr-20 border-r">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">
                          {studentCount ?? 0}
                        </div>
                        <div className="text-gray-400 text-sm">Total Students</div>
                      </div>
                    </div>
                  </td>
                  <td className="pb-6 pl-20">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500/20 p-2 rounded-lg">
                        <Calendar className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">
                          {pendingAssignmentsCount ?? 0}
                        </div>
                        <div className="text-gray-400 text-sm">Pending Assignments</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="pt-6 pr-20 border-r">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-500/20 p-2 rounded-lg">
                        <Clock className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">62h</div>
                        <div className="text-gray-400 text-sm">Watch Time</div>
                      </div>
                    </div>
                  </td>
                  <td className="pt-6 pl-20">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <Award className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold">08</div>
                        <div className="text-gray-400 text-sm">Certificates</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentOverview;
