import { FaUsers, FaChalkboardTeacher, FaMoneyBillWave } from "react-icons/fa";

export default function ClassroomProfile() {
  // Dummy Data
  const classInfo = {
    className: "Grade 8 - Science",
    totalStudents: 35,
    schoolFee: 75000,
    teacher: "Mrs. Linda Johnson",
    paidStudents: [
      { name: "Alice Brown", amountPaid: 75000 },
      { name: "Bob Smith", amountPaid: 50000 },
      { name: "Charlie Adams", amountPaid: 75000 },
      { name: "Daniel Carter", amountPaid: 30000 },
    ],
    unpaidStudents: [
      { name: "Eve Clark", amountPaid: 0 },
      { name: "Frank Evans", amountPaid: 0 },
      { name: "Grace Hall", amountPaid: 20000 },
      { name: "Harry White", amountPaid: 50000 },
    ],
  };

  // Calculate financial details
  const totalExpected = classInfo.totalStudents * classInfo.schoolFee;
  const totalPaid = [...classInfo.paidStudents, ...classInfo.unpaidStudents].reduce(
    (sum, student) => sum + student.amountPaid,
    0
  );
  const balanceLeft = totalExpected - totalPaid;

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{classInfo.className} - Classroom Profile</h2>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <InfoCard icon={<FaUsers size={30} />} title="Total Students" value={classInfo.totalStudents} bg="bg-green-500" />
          <InfoCard icon={<FaMoneyBillWave size={30} />} title="School Fee" value={`₦${classInfo.schoolFee}`} bg="bg-blue-500" />
          <InfoCard icon={<FaChalkboardTeacher size={30} />} title="Class Teacher" value={classInfo.teacher} bg="bg-purple-500" />
        </div>

        {/* Payment Details */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StudentTable title="Paid Students" students={classInfo.paidStudents} status="paid" />
            <StudentTable title="Unpaid Students" students={classInfo.unpaidStudents} status="unpaid" />
          </div>
        </div>

        {/* Accounting Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Accounting Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <SummaryCard title="Total Expected" value={`₦${totalExpected.toLocaleString()}`} bg="bg-blue-600" />
            <SummaryCard title="Total Paid" value={`₦${totalPaid.toLocaleString()}`} bg="bg-green-600" />
            <SummaryCard title="Balance Left" value={`₦${balanceLeft.toLocaleString()}`} bg="bg-red-600" />
          </div>
        </div>

        {/* Full Payment Breakdown */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-lg mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Detailed Payment Breakdown</h3>
          <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Amount Paid</th>
                <th className="p-3">Balance Left</th>
              </tr>
            </thead>
            <tbody>
              {[...classInfo.paidStudents, ...classInfo.unpaidStudents].map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 text-center">{student.name}</td>
                  <td className="p-3 text-center text-green-600">₦{student.amountPaid.toLocaleString()}</td>
                  <td className="p-3 text-center text-red-600">₦{(classInfo.schoolFee - student.amountPaid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Info Card Component
function InfoCard({ icon, title, value, bg }) {
  return (
    <div className={`${bg} text-white p-6 rounded-lg shadow-md flex flex-col items-center`}>
      <div className="mb-3">{icon}</div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Student Table Component
function StudentTable({ title, students, status }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h4 className={`text-lg font-semibold mb-3 ${status === "paid" ? "text-green-600" : "text-red-600"}`}>
        {title} ({students.length})
      </h4>
      <ul className="divide-y divide-gray-300">
        {students.length > 0 ? (
          students.map((student, index) => (
            <li key={index} className="py-2 px-3 bg-gray-50 hover:bg-gray-200 rounded-md">{student.name}</li>
          ))
        ) : (
          <p className="text-gray-500">No students listed</p>
        )}
      </ul>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, bg }) {
  return (
    <div className={`${bg} text-white p-6 rounded-lg shadow-md text-center`}>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
