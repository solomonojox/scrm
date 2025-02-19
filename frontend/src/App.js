import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Auth/Login.jsx'
import MainLogin from './Auth/MainLogin.jsx';
// import Student from './StudentDashboard/Student.jsx'
import Welcome from './Pages/Welcome.jsx';
import Dashboard from './Pages/Welcome.jsx';
import RegisterationWiz from './Auth/RegisterationWiz.jsx';

// Admin
import AdminDashboard from './Admin/AdminDashboard.jsx';
import ViewStudents from './Admin/DashboardComponents/Student/ViewStudents.jsx';
import ViewTeachers from './Admin/DashboardComponents/ViewTeachers.jsx';
import ViewGuardians from './Admin/DashboardComponents/ViewGuardians.jsx';
import AdminStudentProfile from './Admin/DashboardComponents/Student/Admin_StudentProfile.jsx';
import AdminTeacherProfile from './Admin/DashboardComponents/Teachers/Admin_TeacherProfile.jsx';
import AdminGuardianProfile from './Admin/DashboardComponents/Guardian/Admin_GuardianProfile.jsx';

import TeachersDashboard from './Teacher/TeachersDashboard.jsx';
import TeacherViewStudents from './Teacher/TeachersComponents/Student/TeacherViewStudents.jsx';

import StudentDashboard from './Pages/StudentDashboard.jsx';
import StudentData from './Pages/StudentData.jsx';
import Assignment from './Pages/Assignment.jsx';
import Sidebar from './Pages/Sidebar.jsx';
import News from './Pages/News.jsx';
import EventPage from './Pages/Event.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/login' element={<MainLogin />} />
        {/* <Route path='/student' element={<Student />} /> */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/registrationwiz' element={<RegisterationWiz />} />
        
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/students' element={<ViewStudents />} />
        <Route path='/admin/student/:studentId' element={<AdminStudentProfile />} />
        {/* Use the teacher-specific component for teacher students */}
        <Route path='/Teacher/students' element={<TeacherViewStudents />} />
        <Route path='/admin/teachers' element={<ViewTeachers />} />
        <Route path='/admin/teacher/:teacherId' element={<AdminTeacherProfile />} />
        <Route path='/admin/guardians' element={<ViewGuardians />} />
        <Route path='/admin/guardian/:guardianId' element={<AdminGuardianProfile />} />
        
        <Route path='/studentdashboard' element={<StudentDashboard />} />
        <Route path='/studentdata' element={<StudentData />} />
        <Route path='/assignment' element={<Assignment />} />
        <Route path='/sidebar' element={<Sidebar />} />
        <Route path='/news' element={<News />} />
        <Route path='/event' element={<EventPage />} />
        <Route path='/teacher/dashboard' element={<TeachersDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
