import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import RegisSch from './pages/Admin/RegisSch';
import AddSchLisence from './pages/Admin/AddSchoolLisence';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="GetStarted" element={<RegisSch />} />
      <Route path="AddSchool" element={<AddSchLisence />} />
    </Routes>
  );
}

export default App
