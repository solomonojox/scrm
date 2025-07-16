import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import RegisSch from './pages/Admin/RegisSch';
import Login from './pages/Login'

function App() {

  return (
    <Routes>
      {/* All Auth/Onboarding routes here */}
      <Route path="/" element={<Landing />} />
      <Route path="GetStarted" element={<RegisSch />} />
      <Route path="Login" element={<Login />} />

      {/* All admin routes here */}

      {/* All teachers routes here */}

      {/* All Guardians routes here */}

      {/* All students routes here */}
      
    </Routes>
  );
}

export default App
