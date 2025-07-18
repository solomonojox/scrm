import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';

import RegisSch from './pages/Admin/RegisSch';
import AddSchool from './pages/Admin/AddSchoolLisence';
import AddAdmin from './pages/Admin/AddAdmin';
import Login from './pages/Login'
import Accountregistration from '../src/pages/Admin/Accountregristration'


import Addschoolform from './pages/Admin/Addschoolform'
import Terms from './pages/Admin/Terms'

function App() {

  return (
    <Routes>
      {/* All Auth/Onboarding routes here */}
      <Route path="/" element={<Landing />} />

      <Route path="GetStarted" element={<RegisSch />} />
          <Route path="AddSchool" element={<AddSchool/>} />
               <Route path="AddAdmin" element={<AddAdmin/>} />
      <Route path="Login" element={<Login />} />
      <Route path="AddAccount" element={<Accountregistration/>} />

      {/* All admin routes here */}
  <Route path="addschoolform" element={<Addschoolform />} />
        <Route path="Terms" element={<Terms/>} />

      {/* All teachers routes here */}

      {/* All Guardians routes here */}

      {/* All students routes here */}
      

    </Routes>
  );
}

export default App
