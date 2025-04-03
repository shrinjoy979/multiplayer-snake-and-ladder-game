import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage"; // Rename App.js to LandingPage.js
import Game from "./Game"; // Make sure Game.js exists

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
