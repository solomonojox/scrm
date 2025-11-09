import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import Landing from "./pages/Landing";
import GetStarted from "./pages/Admin/GetStarted";
import AddAdmin from "./pages/Admin/AddAdmin";
import Login from "./pages/Login";
import Accountregistration from "../src/pages/Admin/Accountregristration";
import AddSchoolLisence from "../src/pages/Admin/AddSchoolLisence";
import Addschoolform from "./pages/Admin/Addschoolform";
import Terms from "./pages/Admin/Terms";
import Guardian from "./pages/Admin/guardian/guardian";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentFeePaymentTable from "./pages/StudentFeePaymentTable";
import AdminGuardian from "./pages/Admin/guardian/AdminGuardian";
import AdminStudents from "./pages/Admin/student/AdminStudents";
import AdminTeacher from "./pages/Admin/teacher/AdminTeacher";
import AdminClassroom from "./pages/Admin/classroom/AdminClassroom";
import AdminSession from "./pages/Admin/session/AdminSession";
import AdminNews from "./pages/Admin/news/AdminNews";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import AdminSchoolFee from "./pages/Admin/schoolFee/AdminSchoolFee";
import Payroll from "./pages/Admin/Payroll/Payroll";

// import Dashboard from './pages/Admin/guardian/Dashboard';
import { GuardianLayout } from "./layouts/GuardianLayout";
import GuardianDashboard from "./pages/Guardian/GuardianDashboard";
import GuardianResult from "./pages/Guardian/results/GuardianResult";
import ReportCard from "./pages/Guardian/results/ReportCard";
import GuardianProfile from "./pages/Guardian/profile/GuardianProfile";
import GuardianNews from "./pages/Guardian/news/GuardianNews";
import NewsFeed from "./pages/Guardian/news/NewsFeed";
import AssignmentDashboard from "./pages/Guardian/assignment/AssignmentDashboard";
import Loans from "./pages/Guardian/Loans/Loans";
import LoanRequestForm from "./pages/Guardian/Loans/LoanRequestForm";
import AllLoanRequests from "./pages/Guardian/Loans/AllLoanRequests";
import LoanRequestDetails from "./pages/Guardian/Loans/LoanRequestDetails";
import LoanPayment from "./pages/Guardian/Loans/LoanPayment";
import MyPupils from "./pages/Guardian/Pupils/MyPupils";
import Photo from "./components/Guardian/PhotoGallery";

import PupilProfile from "./pages/Guardian/Pupils/PupilProfile";
import AdminEvents from "./pages/Admin/events/AdminEvents";
import GuardianEvent from "./pages/Guardian/event/GuardianEvent";
import GuardianMessages from "./pages/Guardian/messages/GuardianMessages";
import AdminMessages from "./pages/Admin/messages/AdminMessages";
import TransactionDashboard from "./pages/Guardian/account/dashboard/TransactionDashboard";
import { TeacherLayout } from "./layouts/TeacherLayouts";
import TeacherDashboard from "./pages/Teachers/dashboard/TeacherDashboard";
import TeacherProfile from "./pages/Teachers/profile/TeacherProfile";
import TeacherMessages from "./pages/Teachers/messaging/TeacherMessages";
import TeacherNews from "./pages/Teachers/news/TeacherNews";
import TeacherEvent from "./pages/Teachers/events/TeacherEvent";

import TeacherMyPupils from "./pages/Teachers/My Pupils/ViewMyPupils";
import TeacherSettings from "./pages/Teachers/settings/Settings";
import MyPupil from "./pages/Teachers/MyPupil";
import ViewMyPupils from "./pages/Teachers/My Pupils/ViewMyPupils";
import TeacherAttendance from "./pages/Teachers/attendance/TeacherAttendance";
import NewAttendance from "./pages/Teachers/attendance/NewAttendance";
import AttendanceReport from "./pages/Teachers/attendance/AttendanceReport";
import AccountSetup from "./pages/Guardian/account/AccountSetup";
import AdminSessionTerm from "./pages/Admin/sessionTerm/AdminSessionTerm";
import TeacherResult from "./pages/Teachers/results/TeacherResult";
import NewResult from "./pages/Teachers/results/NewResult";
import TeacherAssignment from "./pages/Teachers/assignment/TeacherAssignment";
import { NoRoute } from "./pages/NoRoute";
import { NotFound } from "./pages/NotFound";
import StudentCbtLogin from "./pages/Cbt/Login page";
import AdminCbtLogin from "./pages/Cbt/AdminCbt";
import { AdminCbtLayout } from "./layouts/cbt/AdminCbtLayout";
import AdminCbtDashboard from "./pages/Cbt/Admin/dashboard/AdminCbtDashboard";
import AdminCbtUserManagement from "./pages/Cbt/Admin/userManagement/AdminCbtUserManagement";
import { StudentCbtLayout } from "./layouts/cbt/StudentCbtLayout";
import StudentCbtDashboard from "./pages/Cbt/Students/dashboard/StudentCbtDashboard";
import StudentExamDashboard from "./pages/Cbt/Students/exam/StudentExamdashboard";
import ExamInterface from "./pages/Cbt/Students/exam/ExamInterface";
import ExamResultDetails from "./pages/Cbt/Students/exam/ExamResultDetails";
import RegisterSchool from "./pages/Cbt/RegisterSchool";
import CbtLogin from "./pages/Cbt/CbtLogin";
import { TeacherCbtLayout } from "./layouts/cbt/TeacherCbtLayout";
import TeacherCbtDashboard from "./pages/Cbt/Teacher/dashboard/TeacherCbtDashboard";
import TeacherCbtExam from "./pages/Cbt/Teacher/ManageQuestion/TeacherCbtExam";
import SuperAdminLogin from "./pages/SuperAdmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SchoolInfoPage from "./pages/SuperAdmin/SchoolInfoPage";
import ViewReportCardExample from "./pages/Teachers/results/ViewReportCardExample";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("scrmToken");
  return token ? children : <Navigate to="/login" />;
};
const ProtectedRoute2 = ({ children }) => {
  const token = localStorage.getItem("scrmToken");
  return token ? children : <Navigate to="/cbt/login" />;
};

const ProtectedRoute3 = ({ children }) => {
  const token = localStorage.getItem("scrmToken");
  return token ? children : <Navigate to="/super-admin/login" />;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem("scrmToken");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        <Navigate to="/login" />;
        localStorage.removeItem("scrmToken");
      }
    }
  }, []);

  const hasRoutes = true; // Could check if routes array is empty

  if (!hasRoutes) {
    return <NoRoute />;
  }

  return (
    <Routes>
      {/* All Auth/Onboarding routes here */}
      <Route path="/" element={<Landing />} />
      {/* 404 - catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />

      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/add-school-form" element={<Addschoolform />} />
      <Route path="/upload-license" element={<AddSchoolLisence />} />
      <Route path="/account-registration" element={<Accountregistration />} />
      <Route path="/add-admin" element={<AddAdmin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/terms" element={<Terms />} />

      {/* All admin routes here */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/teachers" element={<AdminTeacher />} />
        <Route path="/admin/guardians" element={<AdminGuardian />} />
        <Route path="/admin/classrooms" element={<AdminClassroom />} />
        <Route path="/admin/session" element={<AdminSession />} />
        <Route path="/admin/terms" element={<AdminSessionTerm />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/schoolfee" element={<AdminSchoolFee />} />
        <Route path="/admin/payroll" element={<Payroll />} />
      </Route>

      {/* All teachers routes here */}
      <Route
        element={
          <ProtectedRoute>
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/assignments" element={<TeacherAssignment />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/new-attendance" element={<NewAttendance />} />
        <Route path="/teacher/attendance-report" element={<AttendanceReport />} />
        <Route path="/teacher/messages" element={<TeacherMessages />} />
        <Route path="/teacher/news" element={<TeacherNews />} />
        <Route path="/teacher/events" element={<TeacherEvent />} />
        <Route path="/teacher/pupil" element={<MyPupil />} />
        <Route path="/teacher/pupil/:id" element={<ViewMyPupils />} />
        <Route path="/teacher/MyPupils" element={<TeacherMyPupils />} />
        <Route path="/teacher/settings" element={<TeacherSettings />} />

        <Route path="/teacher/results" element={<TeacherResult />} />
        <Route path="/teacher/new-result" element={<NewResult />} />
        <Route path="/teacher/report-card" element={<ViewReportCardExample />} />
      </Route>

      {/* All Guardians routes here */}
      <Route
        element={
          <ProtectedRoute>
            <GuardianLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/guardian/dashboard" element={<GuardianDashboard />} />
        <Route path="/guardian/profile" element={<GuardianProfile />} />
        <Route path="/guardian/pupils" element={<MyPupils />} />
        <Route path="/guardian/pupil/profile" element={<PupilProfile />} />
        <Route path="/guardian/assignments" element={<AssignmentDashboard />} />
        <Route path="/guardian/news" element={<GuardianNews />} />
        <Route path="/newsfeed/:id" element={<NewsFeed />} />
        <Route path="/guardian/events" element={<GuardianEvent />} />
        <Route path="/guardian/event/photo" element={<Photo />} />
        <Route path="/guardian/loans" element={<Loans />} />
        <Route path="/guardian/loan-request-form" element={<LoanRequestForm />} />
        <Route path="/guardian/all-loan-request" element={<AllLoanRequests />} />
        <Route path="/guardian/loan-request-details" element={<LoanRequestDetails />} />
        <Route path="/guardian/loan-payment" element={<LoanPayment />} />
        <Route path="/guardian/result" element={<GuardianResult />} />
        <Route path="/guardian/report-card" element={<ReportCard />} />
        <Route path="/guardian/report-card" element={<ReportCard />} />
        <Route path="/guardian/result" element={<GuardianResult />} />
        <Route path="/guardian/message" element={<GuardianMessages />} />
        <Route path="/guardian/transactions" element={<TransactionDashboard />} />
        <Route path="/guardian/account-setup" element={<AccountSetup />} />
      </Route>
      <Route path="/Guardian/allguardian" element={<Guardian />} />
      <Route path="/payment" element={<StudentFeePaymentTable />} />

      {/* All students routes here */}
      <Route path="/studentscbt" element={<StudentCbtLogin />} />
      <Route path="/admincbt" element={<AdminCbtLogin />} />
      {/* <Route path="/registerschool" element={<RegisterSchool />} /> */}

      {/* CBT */}
      <Route path="/cbt/login" element={<CbtLogin />} />
      <Route path="/cbt/registerschool" element={<RegisterSchool />} />

      {/* Admin CBT */}
      <Route
        element={
          <ProtectedRoute2>
            <AdminCbtLayout />
          </ProtectedRoute2>
        }
      >
        <Route path="/cbt/admin/dashboard" element={<AdminCbtDashboard />} />
        <Route path="/cbt/admin/userManagement" element={<AdminCbtUserManagement />} />
      </Route>

      {/* Student */}
      <Route
        element={
          <ProtectedRoute2>
            <StudentCbtLayout />
          </ProtectedRoute2>
        }
      >
        <Route path="/cbt/student/dashboard" element={<StudentCbtDashboard />} />
        <Route path="/cbt/student/exams" element={<StudentExamDashboard />} />
        <Route path="/cbt/student/exam/:id" element={<ExamInterface />} />
        <Route path="/cbt/student/exams/result" element={<ExamResultDetails />} />
      </Route>

      {/* Teacher */}
      <Route
        element={
          <ProtectedRoute2>
            <TeacherCbtLayout />
          </ProtectedRoute2>
        }
      >
        <Route path="/cbt/teacher/dashboard" element={<TeacherCbtDashboard />} />
        <Route path="/cbt/teacher/exams" element={<TeacherCbtExam />} />
      </Route>
      {/* <Route path="/registerschool" element={<RegisterSchool />} /> */}

      {/* <Route
        element={
          <ProtectedRoute>
            <GuardianLayout />
          </ProtectedRoute>
        }
      >
      </Route> */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route path="/super-admin/dashboard" element={<ProtectedRoute3><SuperAdminDashboard /></ProtectedRoute3>} />
        <Route path="/super-admin/school-info" element={<ProtectedRoute3><SchoolInfoPage /></ProtectedRoute3>} />
    </Routes>
  );
}

export default App;
