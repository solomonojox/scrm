import React, { useEffect } from "react";
import { Printer, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/* ✅ Interfaces */
/* ------------------------------------------------------------------ */

interface RawSubject {
  subjectName: string;
  ca: number;
  cA2: number;
  examScore: number;
  totalScore: number;
  remarks: string;
}

interface Subject {
  name: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
}

interface StudentInfo {
  name?: string;
  studentName?: string;
  firstname?: string;
  lastname?: string;
  studentId?: string;
  studentNo?: string;
  subjects?: RawSubject[];
  class?: string;
  classname?: string;
  session?: string;
  currentSession?: string;
  position?: string;
  term?: string;
  gender?: string;
  currentTerm?: number;
  sex?: string;
  attendance?: string;
  assessment?: string;
  dateIssued?: string;
  photo?: string;
  totalScore?: number;
  totalAverage?: number;
  teacherComment?: string;
  principalComment?: string;
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

interface School {
  schoolName?: string;
  address?: string;
}

interface TeacherReportCardProps {
  studentData?: StudentInfo;
  attendanceRecord?: AttendanceRecord;
  behaviouralRatings?: BehaviouralRating;
  school?: School;
  schoolName?: string;
  schoolAddress?: string;
  schoolLogo?: string;
  onBack?: () => void;
}

/* ------------------------------------------------------------------ */
/* ✅ Main Component */
/* ------------------------------------------------------------------ */

const TeacherReportCard: React.FC<TeacherReportCardProps> = ({
  studentData,
  school,
  attendanceRecord,
  behaviouralRatings,
  schoolLogo,
  onBack,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const safeStudent: StudentInfo = studentData ?? {};

  /* ✅ Full name */
  const studentName =
    `${safeStudent.studentName || ""} `.trim() || safeStudent.name || "Student Name";

  const studentId = safeStudent.studentNo || "N/A";
  const className = safeStudent.classname || "N/A";
  const session = safeStudent.session || safeStudent.currentSession || "N/A";
  const position = safeStudent.position || "N/A";

  const getTerm = () => {
    if (safeStudent.term === "1") return "First Term";
    if (safeStudent.term === "2") return "Second Term";
    if (safeStudent.term === "3") return "Third Term";
    return "N/A";
  };

  const term = getTerm();
  const sex = safeStudent.gender || "N/A";
  const attendance = safeStudent.attendance || "N/A";
  const assessment = safeStudent.assessment || "Results";
  const dateIssued = safeStudent.dateIssued || new Date().toLocaleDateString();

  const photo =
    safeStudent.photo ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  /* ✅ SUBJECT NORMALIZATION (IMPORTANT) */
  const normalizedSubjects: Subject[] = (safeStudent.subjects || []).map((s) => ({
    name: s.subjectName,
    ca: s.ca,
    exam: s.examScore,
    total: s.totalScore,
    grade: s.remarks || "",
  }));

  /* ✅ Split subject list into two for left/right columns */
  const allSubjects = normalizedSubjects;
  const midPoint = Math.ceil(allSubjects.length / 2);
  const leftSubjects = allSubjects.slice(0, midPoint);
  const rightSubjects = allSubjects.slice(midPoint);

  /* ✅ Attendance fallback */
  const defaultAttendance: AttendanceRecord = {
    totalDays: 45,
    daysPresent: 43,
    daysAbsent: 2,
    lateArrivals: 7,
  };
  const attendance_record = attendanceRecord ?? defaultAttendance;

  /* ✅ Behaviour fallback */
  const defaultBehavioural: BehaviouralRating = {
    punctuality: "Fair",
    classParticipation: "Good",
    teamwork: "Excellent",
    respectForRules: "Good",
    neatness: "Poor",
  };
  const behavioural_ratings = behaviouralRatings ?? defaultBehavioural;

  const average = safeStudent.totalAverage;

  /* ✅ Grade scale */
  const gradeScale: GradeScale[] = [
    { grade: "A", description: "Excellent", score: "90-100" },
    { grade: "B", description: "Very Good", score: "80-89" },
    { grade: "C", description: "Good", score: "70-79" },
    { grade: "D", description: "Fair", score: "60-69" },
    { grade: "E", description: "Poor", score: "50-59" },
    { grade: "F", description: "Fail", score: "0-49" },
  ];

  const handlePrint = () => window.print();

  return (
    <div className="font-[inter]">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          {onBack && (
            <ArrowLeft onClick={onBack} className="w-5 h-5 hover:text-gray-500 cursor-pointer" />
          )}
          <h1 className="text-2xl font-semibold">Report Card</h1>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="p-6 border-4 border-[#124A71] m-4">
          {/* SCHOOL HEADER */}
          <div className="text-center mb-6">
            <div className="text-right text-sm text-gray-600 mb-4">No - {studentId}</div>

            {schoolLogo && (
              <div className="flex justify-center mb-2">
                <img src={schoolLogo} className="w-[90px] h-[90px] rounded-full" />
              </div>
            )}

            <h2 className="text-2xl font-bold text-[#124A71]">REPORT CARD</h2>
            <h3 className="text-xl font-semibold text-[#124A71]">{school?.schoolName}</h3>
            <p className="text-base text-[#124A71] italic">{school?.address}</p>
          </div>

          {/* STUDENT INFO */}
          <div className="bg-[#44A0B0] text-white rounded-[10px] mb-6 flex flex-row p-4 gap-4">
            <div className="w-[190px] h-[190px] bg-gray-300 rounded-[10px] overflow-hidden">
              <img src={photo} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
              <InfoRow label="Name" value={studentName} />
              <InfoRow label="Student ID" value={studentId} />
              <InfoRow label="Class" value={className} />
              <InfoRow label="Session" value={session} />
              <InfoRow label="Position" value={position} />
              <InfoRow label="Term" value={term} />
              <InfoRow label="Sex" value={sex} />
              <InfoRow label="Attendance" value={attendance} />
              <InfoRow label="Assessment" value={assessment} />
              <InfoRow label="Date Issued" value={dateIssued} />
            </div>
          </div>

          {/* ✅ SUBJECT TABLE */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SubjectTable subjects={leftSubjects} />
              <SubjectTable subjects={rightSubjects} />
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mb-6 text-sm grid grid-cols-3 gap-4">
            <p className="text-[#124A71] font-bold">Total Average Score: {average}%</p>
            <p className="text-[#124A71] font-bold">Percentage: {average}%</p>
            <p className="text-[#124A71] font-bold">CGPA: {average}</p>
          </div>

          {/* GRADES, ATTENDANCE, BEHAVIOUR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 text-sm">
            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Grading System</h4>
              {gradeScale.map((scale, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {scale.grade} – {scale.description}
                  </span>
                  <span>{scale.score}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Attendance Record</h4>
              <InfoRow label="Total School Days" value={attendance_record.totalDays} />
              <InfoRow label="Days Present" value={attendance_record.daysPresent} />
              <InfoRow label="Days Absent" value={attendance_record.daysAbsent} />
              <InfoRow label="Late Arrivals" value={attendance_record.lateArrivals} />
            </div>

            <div>
              <h4 className="text-[#124A71] font-bold mb-3">Behavioural & Skill Ratings</h4>
              <InfoRow label="Punctuality" value={behavioural_ratings.punctuality} />
              <InfoRow label="Class Participation" value={behavioural_ratings.classParticipation} />
              <InfoRow label="Teamwork" value={behavioural_ratings.teamwork} />
              <InfoRow label="Respect for Rules" value={behavioural_ratings.respectForRules} />
              <InfoRow label="Neatness" value={behavioural_ratings.neatness} />
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mb-6 space-y-4">
            <CommentSection
              title="Class Teacher's Comment"
              text={safeStudent.teacherComment || "Satisfactory"}
            />
            <CommentSection
              title="Principal's Comment"
              text={safeStudent.principalComment || "Very Good and well behaved."}
            />
          </div>

          {/* SIGNATURES */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <p className="text-[#124A71] font-bold">Class Teacher's Signature: _______________</p>
            <p className="text-[#124A71] font-bold">Principal's Signature: _______________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReportCard;

/* ------------------------------------------------------------------ */
/* ✅ SUBJECT TABLE COMPONENT */
/* ------------------------------------------------------------------ */

const SubjectTable = ({ subjects }: { subjects: Subject[] }) => (
  <div className="grid grid-cols-5 border text-xs sm:text-sm truncate">
    <TableHeader label="Subject" />
    <TableHeader label="CA" />
    <TableHeader label="Exam" />
    <TableHeader label="Total" />
    <TableHeader label="Grade" />

    {subjects.map((s, i) => (
      <React.Fragment key={i}>
        <Cell>{s.name}</Cell>
        <Cell center>{s.ca}</Cell>
        <Cell center>{s.exam}</Cell>
        <Cell center>{s.total}</Cell>
        <Cell center>{s.grade}</Cell>
      </React.Fragment>
    ))}
  </div>
);

const TableHeader = ({ label }: { label: string }) => (
  <div className="bg-[#124A71] text-white py-2 text-center font-semibold border">{label}</div>
);

const Cell = ({ children, center }: { children: any; center?: boolean }) => (
  <div className={`p-2 bg-white border truncate ${center ? "text-center" : "text-left"}`}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* ✅ Reusable Components */
/* ------------------------------------------------------------------ */

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <p className="flex justify-between">
    <span className="font-semibold">{label}:</span> <span>{value}</span>
  </p>
);

const CommentSection = ({ title, text }: { title: string; text: string }) => (
  <div>
    <h4 className="text-[#124A71] font-bold mb-2">{title}</h4>
    <div className="border border-[#124A71] rounded-md p-4 bg-white min-h-24">
      <p className="text-sm text-gray-700 italic">{text}</p>
    </div>
  </div>
);
