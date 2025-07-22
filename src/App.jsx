import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';

import RegisSch from './pages/Admin/RegisSch';
import AddSchool from './pages/Admin/AddSchoolLisence';
import AddAdmin from './pages/Admin/AddAdmin';
import Login from './pages/Login'
import Accountregistration from '../src/pages/Admin/Accountregristration'
import AddSchoolLisence from '../src/pages/Admin/AddSchoolLisence'

import Addschoolform from './pages/Admin/Addschoolform'
import Terms from './pages/Admin/Terms'
import Guard from './pages/Guardian/guardian'

function App() {

  return (
    <Routes>
      {/* All Auth/Onboarding routes here */}
      <Route path="/" element={<Landing />} />

      <Route path="GetStarted" element={<RegisSch />} />
          <Route path="AddSchool" element={<AddSchool/>} />
               <Route path="AddAdmin" element={<AddAdmin/>} />
      <Route path="Login" element={<Login />} />
      <Route path="accountregistration" element={<Accountregistration/>} />

      {/* All admin routes here */}
  <Route path="addschoolform" element={<Addschoolform />} />
        <Route path="Terms" element={<Terms/>} />
        <Route path="upload-license" element={<AddSchoolLisence/>} />
        



      {/* All teachers routes here */}

      {/* All Guardians routes here */}
       <Route path="guardian" element={<Guard/>} />

      {/* All students routes here */}
      

    </Routes>
  );
}

export default App
