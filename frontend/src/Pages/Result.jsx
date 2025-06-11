import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../Pages/Sidebar";
import axios from "axios";

const getGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const StudentReportCard = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(1);
  const printRef = useRef();

  const schoolName = "Greenfield International School";
  const schoolAddress = "101 Education Lane, Booktown, LearnState";

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(`/api/Result/GetStudentResult/${studentId}`);
        if (response.data.status && response.data.data.length > 0) {
          setStudentData(response.data.data[0]);
        } else {
          setStudentData(null);
          console.error("No student result found");
        }
      } catch (error) {
        console.error("Failed to fetch student result:", error);
        setStudentData(null);
      }
    };

    if (studentId) loadData();
  }, [studentId]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  // if (!studentData) return <p className="p-8 text-lg">Loading student result...</p>;


  const subjectsForTerm = studentData?.subjects.filter(sub => sub.term === selectedTerm);

  const total = subjectsForTerm?.reduce((acc, sub) => acc + sub.totalScore, 0);
  const avg = subjectsForTerm?.length ? total / subjectsForTerm.length : 0;


  const attendanceForTerm = studentData?.student.attendances.filter(
    att => new Date(att.date).getMonth() === selectedTerm - 1 && att.isPresent
  ).length;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto ml-56">

        <div ref={printRef} className="bg-white rounded-xl shadow-md p-8">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-blue-800">{schoolName}</h1>
            <p className="text-gray-700">{schoolAddress}</p>
            <div className="mt-4">
              <hr className="border-t-2 border-gray-300" />
            </div>
          </div>


          <h2 className="text-2xl font-bold mb-6 text-blue-700">Student Report Card</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-lg">
            <p><strong>Name:</strong> {studentData?.student?.firstname} {studentData?.student?.lastname}</p>
            <p><strong>ID:</strong> {studentData?.student?.studentId}</p>
            <p><strong>Class:</strong> {studentData?.student?.classroom?.name || "N/A"}</p>
            <p>
              <strong>Term:</strong>{" "}
              {selectedTerm === 1 ? "First Term" : selectedTerm === 2 ? "Second Term" : "Third Term"}
            </p>
            <p><strong>Position:</strong> {/* Add position logic if available */} N/A</p>
            <p><strong>Attendance:</strong> {attendanceForTerm}</p>
          </div>


          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="border px-4 py-2 text-left">Subject</th>
                  <th className="border px-4 py-2 text-center">Score</th>
                  <th className="border px-4 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {subjectsForTerm?.length > 0 ? (
                  subjectsForTerm?.map(({ subjectResultId, subjectName, totalScore }) => (
                    <tr key={subjectResultId} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 text-left">{subjectName}</td>
                      <td className="border px-4 py-2">{totalScore}</td>
                      <td className="border px-4 py-2">{getGrade(totalScore)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border px-4 py-2 text-center text-gray-500">
                      No results available for this term.
                    </td>
                  </tr>
                )}

                <tr className="bg-gray-100 font-semibold">
                  <td className="border px-4 py-2 text-left">Total</td>
                  <td className="border px-4 py-2">{total}</td>
                  <td className="border px-4 py-2"></td>
                </tr>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border px-4 py-2 text-left">Average</td>
                  <td className="border px-4 py-2">{avg.toFixed(2)}</td>
                  <td className="border px-4 py-2">{getGrade(avg)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <strong>Remarks:</strong>{" "}
            {subjectsForTerm?.length > 0 ? subjectsForTerm[0].remarks || "No remarks available" : "No remarks available"}
          </div>

          <div className="mt-12 text-right">
            <p className="font-semibold text-gray-700">Principal's Signature</p>
            <div className="mt-6 border-t-2 border-gray-400 w-48 ml-auto" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <label className="mr-3 font-medium text-lg">Select Term:</label>
            <select
              className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(parseInt(e.target.value, 10))}
            >
              <option value={1}>First Term</option>
              <option value={2}>Second Term</option>
              <option value={3}>Third Term</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md shadow-md transition duration-200"
          >
            Print Report Card
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentReportCard;
