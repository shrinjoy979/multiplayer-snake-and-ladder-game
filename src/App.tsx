import { Routes, Route } from "react-router-dom";
import LandingPage from './Landing';
import './App.css';

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
