import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';

import GetStarted from './pages/Admin/GetStarted';
import AddAdmin from './pages/Admin/AddAdmin';
import Login from './pages/Login';
import Accountregistration from '../src/pages/Admin/Accountregristration';
import AddSchoolLisence from '../src/pages/Admin/AddSchoolLisence';
import AddSession from '../src/pages/Admin/AddSessions'
import Addschoolform from './pages/Admin/Addschoolform';
import Terms from './pages/Admin/Terms';
import Guardian from './pages/Guardian/guardian';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Classroom from './pages/Teachers/Classroom';
import News from './pages/Admin/News';
import Events from './pages/Admin/Events';
import Schoolfee from './pages/Admin/Schoolfee'

function App() {

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
      <Route path="/Schoolfee" element={<Schoolfee/>} />

      {/* All admin routes here */}
      <Route path="/admin/admindashboard" element={<AdminDashboard />} />
      <Route path="/admin/news" element={<News />} />
      <Route path="/admin/events" element={<Events />} />
   <Route path="/admin/session" element={<AddSession />} />
      {/* All teachers routes here */}
      <Route path="/teacher/class" element={<Classroom />} />

      {/* All Guardians routes here */}
      <Route path="/Guardian/allguardian" element={<Guardian />} />

      {/* All students routes here */}


    </Routes>
  );
}

export default App
