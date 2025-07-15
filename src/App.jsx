import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import RegisSch from './pages/Admin/RegisSch';
import Login from './pages/Login'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="GetStarted" element={<RegisSch/>} />
            <Route path="Login" element={<Login/>} />
    </Routes>
  );
}

export default App
