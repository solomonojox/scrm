import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Result = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const [selectedTerm, setSelectedTerm] = useState("First Term");

  // Options arrays for session and term.
  const sessionOptions = ["2023/2024", "2024/2025", "2025/2026"];
  const termOptions = ["First Term", "Second Term", "Third Term"];

  // Results data for each student stored as objects keyed by term.
  const johnResults = {
    "First Term": [
      { subject: "Polymer Sci.", theory: "30/40", practical: "38/40", assignment: "8/10", attendance: "73%", total: "88/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "30/40", practical: "38/40", assignment: "8/10", attendance: "73%", total: "75/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "30/40", practical: "38/40", assignment: "8/10", attendance: "73%", total: "64/100", totalClass: "text-yellow-600" }
    ],
    "Second Term": [
      { subject: "Polymer Sci.", theory: "32/40", practical: "39/40", assignment: "9/10", attendance: "75%", total: "90/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "31/40", practical: "37/40", assignment: "8/10", attendance: "74%", total: "80/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "29/40", practical: "35/40", assignment: "7/10", attendance: "70%", total: "70/100", totalClass: "text-yellow-600" }
    ],
    "Third Term": [
      { subject: "Polymer Sci.", theory: "33/40", practical: "40/40", assignment: "10/10", attendance: "80%", total: "95/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "34/40", practical: "39/40", assignment: "9/10", attendance: "78%", total: "92/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "32/40", practical: "38/40", assignment: "10/10", attendance: "82%", total: "90/100", totalClass: "text-yellow-600" }
    ]
  };

  const janeResults = {
    "First Term": [
      { subject: "Polymer Sci.", theory: "26/40", practical: "36/40", assignment: "8/10", attendance: "80%", total: "85/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "27/40", practical: "35/40", assignment: "9/10", attendance: "82%", total: "80/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "28/40", practical: "34/40", assignment: "7/10", attendance: "75%", total: "78/100", totalClass: "text-yellow-600" }
    ],
    "Second Term": [
      { subject: "Polymer Sci.", theory: "25/40", practical: "35/40", assignment: "9/10", attendance: "80%", total: "85/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "28/40", practical: "36/40", assignment: "8/10", attendance: "78%", total: "72/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "29/40", practical: "37/40", assignment: "7/10", attendance: "75%", total: "66/100", totalClass: "text-yellow-600" }
    ],
    "Third Term": [
      { subject: "Polymer Sci.", theory: "30/40", practical: "37/40", assignment: "10/10", attendance: "85%", total: "90/100", totalClass: "text-green-600" },
      { subject: "Solar Sci.", theory: "29/40", practical: "38/40", assignment: "9/10", attendance: "80%", total: "88/100", totalClass: "text-blue-600" },
      { subject: "Urban Dev.", theory: "31/40", practical: "39/40", assignment: "8/10", attendance: "77%", total: "85/100", totalClass: "text-yellow-600" }
    ]
  };

  // Helper functions to get the correct results and header info.
  const getResults = () => {
    if (selectedStudent === "John") return johnResults[selectedTerm] || [];
    if (selectedStudent === "Jane") return janeResults[selectedTerm] || [];
    return [];
  };

  const getStudentHeader = () => {
    if (selectedStudent === "John") return { name: "John Doe", class: "SS 3", teacher: "Mr. Smith" };
    if (selectedStudent === "Jane") return { name: "Jane Smith", class: "SS 2", teacher: "Mrs. Johnson" };
    return {};
  };

  const studentHeader = getStudentHeader();
  const results = getResults();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1 p-8">
          <header className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Student Results</h1>
            <p className="mt-2 text-gray-600">
              Select a student and filter results by session and term.
            </p>
          </header>

          {/* Student Cards */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <div
                onClick={() => setSelectedStudent("John")}
                className={`cursor-pointer p-4 bg-white rounded shadow transition hover:shadow-md ${
                  selectedStudent === "John" ? "border-2 border-blue-500" : "border border-gray-200"
                }`}
              >
                <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
               
              </div>
              
              <div
                onClick={() => setSelectedStudent("Jane")}
                className={`cursor-pointer p-4 bg-white rounded shadow transition hover:shadow-md ${
                  selectedStudent === "Jane" ? "border-2 border-blue-500" : "border border-gray-200"
                }`}
            
              >
                 
                <h2 className="text-xl font-semibold text-gray-800">Jane Smith</h2>
              </div>
              

            </div>
          </div>
                     <p className=' mb-5'>2 student found</p>
          {/* Results Section */}
          {selectedStudent && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {studentHeader.name}'s Result
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Class: <span className="font-medium">{studentHeader.class}</span> | Teacher: <span className="font-medium">{studentHeader.teacher}</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
                  <div className="flex items-center">
                    <label className="mr-2 text-gray-700">Session:</label>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {sessionOptions.map((session, index) => (
                        <option key={index} value={session}>
                          {session}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2 text-gray-700">Term:</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {termOptions.map((term, index) => (
                        <option key={index} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">SUBJECT NAME</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">THEORY</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PRACTICAL</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ASSIGNMENT</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ATTENDANCE</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800">{result.subject}</td>
                        <td className="px-4 py-2 text-gray-800">{result.theory}</td>
                        <td className="px-4 py-2 text-gray-800">{result.practical}</td>
                        <td className="px-4 py-2 text-gray-800">{result.assignment}</td>
                        <td className="px-4 py-2 text-gray-800">{result.attendance}</td>
                        <td className={`px-4 py-2 font-semibold ${result.totalClass}`}>{result.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Print Button */}
              <div className="mt-6 text-right">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded focus:outline-none shadow">
                  Print Result
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;


