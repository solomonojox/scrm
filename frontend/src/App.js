import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLogin from './Auth/MainLogin.jsx';
// import Student from './StudentDashboard/Student.jsx'
// import Welcome from './Pages/Welcome.jsx';
import Dashboard from './Pages/Welcome.jsx';
import RegisterationWiz from './Auth/RegisterationWiz.jsx';

// Admin
import AdminDashboard from './Admin/AdminDashboard.jsx';
import ViewStudents from './Admin/DashboardComponents/Student/ViewStudents.jsx';
import ViewTeachers from './Admin/DashboardComponents/ViewTeachers.jsx';
import ViewGuardians from './Admin/DashboardComponents/ViewGuardians.jsx';
import AdminStudentProfile from './Admin/DashboardComponents/Student/Admin_StudentProfile.jsx';
import AdminTeacherProfile from './Admin/DashboardComponents/Teachers/Teacher_TeacherProfile.jsx';
import AdminGuardianProfile from './Admin/DashboardComponents/Guardian/Admin_GuardianProfile.jsx';

// Teacher Imports
import TeacherDashboard from './Teacher/TeachersDashboard.jsx';
import TeacherViewStudents from './Teacher/TeachersComponents/Student/TeacherViewStudents.jsx';
import TeacherViewTeachers from './Teacher/TeachersComponents/ViewTeachers.jsx';
import TeacherViewGuardians from './Teacher/TeachersComponents/ViewGuardians.jsx';
import TeacherStudentProfile from './Teacher/TeachersComponents/Student/Teacher_StudentProfile.jsx';
import TeacherTeacherProfile from './Teacher/TeachersComponents/Teachers/Admin_TeacherProfile.jsx';
import TeacherGuardianProfile from './Teacher/TeachersComponents/Guardian/Teacher_GuardianProfile.jsx'; // corrected to match file name "Teacher_GuardianProfile.jsx"

import StudentDashboard from './Pages/GuardianDashboard.jsx';
import StudentData from './Pages/StudentData.jsx';
import Assignment from './Pages/Assignment.jsx';
import Sidebar from './Pages/Sidebar.jsx';
import News from './Pages/News.jsx';
import EventPage from './Pages/Event.jsx';
import TeacherStudentProfile from './Teacher/TeachersComponents/Student/Teacher_StudentProfile.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<MainLogin />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/registrationwiz' element={<RegisterationWiz />} />
        
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/students' element={<ViewStudents />} />
        <Route path='/admin/student/:studentId' element={<AdminStudentProfile />} />
        <Route path='/admin/teachers' element={<ViewTeachers />} />
        
  
        <Route path='/admin/teacher/:teacherId' element={<AdminTeacherProfile />} />
        <Route path='/admin/guardians' element={<ViewGuardians />} />
        <Route path='/admin/guardian/:guardianId' element={<AdminGuardianProfile />} />
        
        <Route path='/student/dashboard' element={<StudentDashboard />} />
        <Route path='/guardian/dashboard' element={<StudentDashboard />} />
        <Route path='/studentdata' element={<StudentData />} />
        <Route path='/assignment' element={<Assignment />} />
        <Route path='/sidebar' element={<Sidebar />} />
        <Route path='/news' element={<News />} />
        <Route path='/event' element={<EventPage />} />

        <Route path='/teacher/dashboard' element={<TeachersDashboard />} />
        <Route path='/teacher/students' element={<TeacherViewStudents />} />
        <Route path='/teacher/student/:studentId' element={<TeacherStudentProfile />} />
      
      
        {/* Teacher Routes */}
        <Route path='/teacher/dashboard' element={<TeacherDashboard />} />
        <Route path='/teacher/students' element={<TeacherViewStudents />} />
        <Route path='/teacher/student/:studentId' element={<TeacherStudentProfile />} />
        <Route path='/teacher/teachers' element={<TeacherViewTeachers />} />
        <Route path='/teacher/teacher/:teacherId' element={<TeacherTeacherProfile />} />
        <Route path='/teacher/guardians' element={<TeacherViewGuardians />} />
        <Route path='/teacher/guardian/:guardianId' element={<TeacherGuardianProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
