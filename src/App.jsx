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
import Classroom from "./pages/Teachers/Classroom";
import Events from "./pages/Admin/Events";
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
import TeacherMyPupils from "./pages/Teachers/My Pupils/My Pupils";
import TeacherSettings from "./pages/Teachers/settings/Settings";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("scrmToken");
  return token ? children : <Navigate to="/login" />;
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

  return (
    <Routes>
      {/* All Auth/Onboarding routes here */}
      <Route path="/" element={<Landing />} />

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
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/session" element={<AdminSession />} />
        <Route path="/admin/schoolfee" element={<AdminSchoolFee />} />
               {/* <Route path="/admin/payroll" element={<Payroll />} /> */}
         
      </Route>

      {/* All teachers routes here */}
      <Route element={<TeacherLayout />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/messages" element={<TeacherMessages />} />
        <Route path="/teacher/news" element={<TeacherNews />} />
        <Route path="/teacher/events" element={<TeacherEvent />} />
        <Route path="/teacher/MyPupils" element={<TeacherMyPupils />} />
        <Route path="/teacher/settings" element={<TeacherSettings/>} />
         <Route path="/admin/payroll" element={<Payroll />} />
      </Route>

      {/* All Guardians routes here */}
      <Route
        element={
          <ProtectedRoute>
            <GuardianLayout />
          </ProtectedRoute>
        }
      >
        {/* <Route path="/guardian/dashboard" element={<Text />} /> */}
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
      </Route>
      <Route path="/Guardian/allguardian" element={<Guardian />} />
      <Route path="/payment" element={<StudentFeePaymentTable />} />

      {/* All students routes here */}
    </Routes>
  );
}

export default App;
