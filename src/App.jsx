import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import Addschoolform from './pages/Admin/Addschoolform'
import Terms from './pages/Admin/Terms'
function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="addschoolform" element={<Addschoolform />} />
        <Route path="Terms" element={<Terms/>} />
    </Routes>
  );
}

export default App
