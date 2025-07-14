import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';
import RegisSch from './pages/Admin/RegisSch';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="GetStarted" element={<RegisSch/>} />
    </Routes>
  );
}

export default App
