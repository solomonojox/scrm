import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing';

const chatbase = 'HRrTN8AyFPOVdyqc6wdv7';

function App() {

  return (
    <Routes>
      {/* <Route path="/" element={<UpgradePage />} /> */}
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App
