import React, { useState, useRef } from "react";

const studentResults = [
  {
    id: 1,
    name: "Alice Johnson",
    results: {
      firstTerm: { Mathematics: 85, English: 78, Science: 92 },
      secondTerm: { Mathematics: 88, English: 81, Science: 95 },
      thirdTerm: { Mathematics: 90, English: 85, Science: 97 },
    },
  },
  {
    id: 2,
    name: "Bob Smith",
    results: {
      firstTerm: { Mathematics: 70, English: 72, Science: 65 },
      secondTerm: { Mathematics: 75, English: 78, Science: 70 },
      thirdTerm: { Mathematics: 80, English: 83, Science: 75 },
    },
  },
];

const getGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

const StudentResultsTable = () => {
  const [selectedTerm, setSelectedTerm] = useState("firstTerm");
  const printRef = useRef();

  // Function to print only the result table
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload page to restore original content
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Student Results</h2>

      {/* Term Selection */}
      <div className="mb-4 text-center">
        <label className="mr-2 font-medium">Select Term:</label>
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
        >
          <option value="firstTerm">First Term</option>
          <option value="secondTerm">Second Term</option>
          <option value="thirdTerm">Third Term</option>
        </select>
      </div>

      {/* Table to Print */}
      <div ref={printRef} className="print-section bg-white p-4 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-center">
          {selectedTerm.replace(/([A-Z])/g, " $1")} Results
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-center">Mathematics</th>
                <th className="py-3 px-6 text-center">English</th>
                <th className="py-3 px-6 text-center">Science</th>
                <th className="py-3 px-6 text-center">Average</th>
                <th className="py-3 px-6 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentResults.map((student) => {
                const scores = student.results[selectedTerm];
                const avgScore =
                  (scores.Mathematics + scores.English + scores.Science) / 3;

                return (
                  <tr key={student.id} className="hover:bg-gray-100">
                    <td className="py-3 px-6">{student.name}</td>
                    <td className="py-3 px-6 text-center">{scores.Mathematics}</td>
                    <td className="py-3 px-6 text-center">{scores.English}</td>
                    <td className="py-3 px-6 text-center">{scores.Science}</td>
                    <td className="py-3 px-6 text-center font-bold">
                      {avgScore.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-center font-bold">
                      {getGrade(avgScore)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md"
        >
          Print Results
        </button>
      </div>
    </div>
  );
};

export default StudentResultsTable;
