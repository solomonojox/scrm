import React, { useEffect } from "react";
import { Printer, Download, ArrowLeft } from "lucide-react";
import imageAssets from "../../../assets/imageAssets";
import { useLocation, useNavigate } from "react-router-dom";

interface Subject {
  name: string;
  score?: number;
  grade?: string;
}

interface StudentInfo {
  name: string;
  studentId: string;
  class: string;
  session: string;
  position: string;
  term: string;
  sex: string;
  attendance: string;
  assessment: string;
  dateIssued: string;
  photo?: string;
}

interface AttendanceRecord {
  totalDays: number;
  daysPresent: number;
  daysAbsent: number;
  lateArrivals: number;
}

interface BehaviouralRating {
  punctuality: string;
  classParticipation: string;
  teamwork: string;
  respectForRules: string;
  neatness: string;
}

interface GradeScale {
  grade: string;
  description: string;
  score: string;
}

const ReportCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result || {};

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const studentInfo: StudentInfo = {
    name: "Jason Ethan",
    studentId: "1001",
    class: "Jss1",
    session: "2024/2025",
    position: "3rd",
    term: "First Term",
    sex: "Male",
    attendance: "80%",
    assessment: "First Term Examination",
    dateIssued: "23-5-2024",
    photo: "/api/placeholder/120/150",
  };

  // All subjects array that gets split between left and right
  const allSubjects: Subject[] = [
    { name: "English Language" },
    { name: "Mathematics" },
    { name: "Basic Science" },
    { name: "ICT" },
    { name: "Home Economics" },
    { name: "Civic Education" },
    { name: "Social Studies" },
    { name: "Literature in English" },
    { name: "Agricultural Science" },
    { name: "Physical & Health Education" },
    { name: "Cultural & Creative Art" },
    { name: "French Language" },
  ];

  // Split subjects into left and right arrays
  const midPoint = Math.ceil(allSubjects.length / 2);
  const leftSubjects = allSubjects.slice(0, midPoint);
  const rightSubjects = allSubjects.slice(midPoint);

  const attendanceRecord: AttendanceRecord = {
    totalDays: 45,
    daysPresent: 43,
    daysAbsent: 2,
    lateArrivals: 7,
  };

  const behaviouralRatings: BehaviouralRating = {
    punctuality: "Fair",
    classParticipation: "Good",
    teamwork: "Excellent",
    respectForRules: "Good",
    neatness: "Poor",
  };

  const gradeScale: GradeScale[] = [
    { grade: "A", description: "Excellent", score: "Excellent" },
    { grade: "B", description: "Very Good", score: "Very Good" },
    { grade: "C", description: "Good", score: "Good" },
    { grade: "D", description: "Fair", score: "Fair" },
    { grade: "E", description: "Poor", score: "Poor" },
    { grade: "F", description: "Fail", score: "Fail" },
  ];

  return (
    <div className="font-[inter]">
      {/* Header */}
      <div className=" bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-lg sm:text-2xl font-semibold">Report Card</h1>
            <ArrowLeft
              onClick={() => navigate(-1)}
              className="w-4 h-4 sm:w-5 sm:h-5 hover:text-gray-500 cursor-pointer"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded flex items-center gap-2 text-sm flex-1 sm:flex-initial justify-center">
              <Printer className="w-4 h-4" />
              <span className="">Print</span>
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded flex items-center gap-2 text-sm flex-1 sm:flex-initial justify-center">
              <Download className="w-4 h-4" />
              <span className="">Download</span>
            </button>
          </div>
        </div>

        {/* Report Card Content */}
        <div className="p-3 sm:p-6 lg:p-8 border-2 sm:border-4 border-[#124A71] m-2 sm:m-4">
          {/* School Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="text-right text-xs sm:text-sm text-gray-600 mb-4">No - 0000123</div>

            {/* School Logo and Info */}
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 sm:w-[120px] sm:h-[120px] rounded-full flex items-center justify-center">
                <img src={imageAssets.reportLogo} className="object-cover" alt="" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-[48px] font-bold text-[#124A71]">
              REPORT CARD
            </h2>
            <h3 className="text-lg sm:text-xl lg:text-[32px] font-semibold text-[#124A71] mb-1">
              Gold International Academy
            </h3>
            <p className="text-sm sm:text-base text-[#124A71] italic">
              21, Woodgreen Road Lagos, Nigeria
            </p>
          </div>

          {/* Student Info Section */}
          <div className="bg-[#44A0B0] text-white rounded-[10px] mb-4 sm:mb-6 flex flex-col sm:flex-row">
            <div className="w-24 h-32 sm:w-[190px] sm:h-[190px] bg-gray-300 rounded-[10px] mb-3 sm:mb-0 sm:mr-4 overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=150&fit=crop&crop=face"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 m-2 gap-2 sm:gap-4 text-xs sm:text-[16px]">
              <div className="space-y-1 font-light">
                <p>
                  <span className="font-bold mr-2">Name:</span> {studentInfo.name}
                </p>
                <p>
                  <span className="font-bold mr-2">Class:</span> {result?.Class}
                </p>
                <p>
                  <span className="font-bold mr-2">Position:</span> {studentInfo.position}
                </p>
                <p>
                  <span className="font-bold mr-2">Sex:</span> {studentInfo.sex}
                </p>
                <p>
                  <span className="font-bold mr-2">Assessment:</span> {result?.Assessment}
                </p>
              </div>
              <div className="space-y-1 font-light">
                <p>
                  <span className="font-bold mr-2">Student ID:</span> {studentInfo.studentId}
                </p>
                <p>
                  <span className="font-bold mr-2">Session:</span> {result?.Session}
                </p>
                <p>
                  <span className="font-bold mr-2">Term:</span> {result?.Term}
                </p>
                <p>
                  <span className="font-bold mr-2">Attendance:</span> {studentInfo.attendance}
                </p>
                <p>
                  <span className="font-bold mr-2">Date Issued:</span> {studentInfo.dateIssued}
                </p>
              </div>
            </div>
          </div>

          {/* Subjects Grid - Left and Right on desktop, single column on mobile */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-0 sm:gap-6">
              {/* Left Subjects */}
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Subject
                  </div>
                  <div className="bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Score
                  </div>
                  <div className="bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Grade
                  </div>

                  {leftSubjects.map((subject, index) => (
                    <React.Fragment key={index}>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm">
                        {subject.name}
                      </div>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm text-center">
                        {subject.score || ""}
                      </div>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm text-center">
                        {subject.grade || ""}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Right Subjects */}
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Headers for desktop only */}
                  <div className="hidden md:block bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Subject
                  </div>
                  <div className="hidden md:block bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Score
                  </div>
                  <div className="hidden md:block bg-[#124A71] text-white p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm border border-gray-300">
                    Grade
                  </div>

                  {rightSubjects.map((subject, index) => (
                    <React.Fragment key={index}>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm">
                        {subject.name}
                      </div>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm text-center">
                        {subject.score || ""}
                      </div>
                      <div className="border border-gray-300 p-2 sm:p-3 bg-white text-xs sm:text-sm text-center">
                        {subject.grade || ""}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-4 md:mb-6 mt-10 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-row-3 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <p className="text-[#124A71] font-bold mb-2">
                  Total Average Score: _______________
                </p>
                <p className="text-[#124A71] font-bold mb-2">Percentage: _______________</p>
                <p className="text-[#124A71] font-bold">CGPA: _______________</p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 text-xs sm:text-sm">
            {/* Grading System */}
            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Grading System</h4>
              <div className="space-y-1">
                {gradeScale.map((scale, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {scale.grade} – {scale.description}
                    </span>
                    <span>{scale.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance Record */}
            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Attendance Record</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total School Days</span>
                  <span>{attendanceRecord.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days Present</span>
                  <span>{attendanceRecord.daysPresent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Days Absent</span>
                  <span>{attendanceRecord.daysAbsent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Late Arrivals</span>
                  <span>{attendanceRecord.lateArrivals}</span>
                </div>
              </div>
            </div>

            {/* Behavioural & Skill Ratings */}
            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Behavioural & Skill Ratings</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Punctuality</span>
                  <span>{behaviouralRatings.punctuality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class Participation</span>
                  <span>{behaviouralRatings.classParticipation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teamwork / Collaboration</span>
                  <span>{behaviouralRatings.teamwork}</span>
                </div>
                <div className="flex justify-between">
                  <span>Respect for Rules / Peers</span>
                  <span>{behaviouralRatings.respectForRules}</span>
                </div>
                <div className="flex justify-between">
                  <span>Neatness / Organization</span>
                  <span>{behaviouralRatings.neatness}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Principal's Comment */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-[#124A71] font-bold mb-3 text-xs sm:text-sm">
              Principal's Comment
            </h4>
            <div className="border border-[#124A71] rounded-md p-3 sm:p-4 h-24 sm:h-32 bg-white"></div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm">
            <div>
              <p className="text-[#124A71] font-bold">Class Teacher's Signature: _______________</p>
            </div>
            <div>
              <p className="text-[#124A71] font-bold">Principal's Signature: _______________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
