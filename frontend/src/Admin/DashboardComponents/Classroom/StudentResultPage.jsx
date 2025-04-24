import React, { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import assets from "../../../Assets/assets";
import axios from "axios";
import './print.css'

const studentResult = {
    const baseUrl = process.env.REACT_APP_BASEURL;
    id: 'SRC-25189BA',
    name: "Alice Johnson",
    class: "SS 2A",
    results: {
        firstTerm: {
            Mathematics: 85,
            English: 78,
            Science: 92,
            History: 80,
            Geography: 75,
            Physics: 88,
            Chemistry: 84,
            Biology: 90,
            Computer: 95,
        },
        secondTerm: {
            Mathematics: 88,
            English: 81,
            Science: 95,
            History: 82,
            Geography: 78,
            Physics: 90,
            Chemistry: 87,
            Biology: 93,
            Computer: 98,
        },
        thirdTerm: {
            Mathematics: 90,
            English: 85,
            Science: 97,
            History: 85,
            Geography: 80,
            Physics: 92,
            Chemistry: 89,
            Biology: 95,
            Computer: 99,
        },
    },
};

const getGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
};

const StudentResultPage = ({ studentId }) => {
    const { capitalizeText } = useContext(AppContext)
    useEffect(() => {
        const getResult = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/Result/GetStudentResult/${studentId}`)
                console.log(res.data)
            } catch (err) {
                console.log(err.response.data)
            }
        }

        if (studentId) {
            getResult()
        }
    });

    const [selectedTerm, setSelectedTerm] = useState("firstTerm");
    const printRef = useRef();

    // Function to print only the result table
    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore the original content
    };

    const scores = studentResult.results[selectedTerm];
    const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);
    const avgScore = totalScore / Object.keys(scores).length;

    return (
        <div className="container mx-auto p-6 bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                {studentResult.name}'s Result Sheet
            </h2>

            {/* Term Selection */}
            <div className="mb-4 text-center">
                <label className="mr-2 font-medium">Select Term:</label>
                <select
                    className="border border-primary-bg rounded px-3 py-2 w-80"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                >
                    <option value="firstTerm">First Term</option>
                    <option value="secondTerm">Second Term</option>
                    <option value="thirdTerm">Third Term</option>
                </select>
            </div>

            {/* Printable Section */}
            <div ref={printRef} className="print-section bg-white border p-6 rounded-lg">
                {/* Student Details */}
                <div className="mb-4 border-b pb-4">
                    <h3 className="text-xl font-semibold text-center mb-2">Student Information</h3>
                    <div className="flex items-center gap-6">
                        <img src={assets.avatar} alt="student" className="w-20" />
                        <div className="text-sm font-medium">
                            <p>Name: {studentResult.name}</p>
                            <p>Student ID: {studentResult.id}</p>
                            <div className="flex items-center">
                                <p>Class: {studentResult.class}</p>
                                <p>Term: {capitalizeText(selectedTerm)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Table */}
                <h3 className="text-xl font-semibold mb-2 text-center">
                    {capitalizeText(selectedTerm)} Results
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-6 text-left">Subject</th>
                                <th className="py-3 px-6 text-center">Score</th>
                                <th className="py-3 px-6 text-center">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {Object.entries(scores).map(([subject, score]) => (
                                <tr key={subject} className="hover:bg-gray-100">
                                    <td className="py-3 px-6">{subject}</td>
                                    <td className="py-3 px-6 text-center">{score}</td>
                                    <td className="py-3 px-6 text-center font-bold">
                                        {getGrade(score)}
                                    </td>
                                </tr>
                            ))}
                            {/* Total & Average */}
                            <tr className="font-semibold bg-gray-100">
                                <td className="py-3 px-6">Total Score</td>
                                <td className="py-3 px-6 text-center">{totalScore}</td>
                                <td className="py-3 px-6 text-center">-</td>
                            </tr>
                            <tr className="font-semibold bg-gray-100">
                                <td className="py-3 px-6">Average Score</td>
                                <td className="py-3 px-6 text-center">{avgScore.toFixed(2)}</td>
                                <td className="py-3 px-6 text-center">{getGrade(avgScore)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Signature Section (Hidden on Screen, Shown in Print) */}
                <div className="print-only">
                    <div className="mt-8 text-center">
                        <p className="font-semibold mb-6">Principal’s Signature:</p>
                        {/* <img src={assets.signature} alt="Principal's Signature" className="w-40 mt-2" /> */}
                        <p>______________________________________</p>
                        <p className="mt-1 font-medium">Dr. John Smith</p>
                    </div>
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

export default StudentResultPage;
