import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from './components/User';
import Game from './components/Game';
import './App.css'; // Keep your existing styles if you want

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Aviator Game</h1>
          <Routes>
            <Route path="/" element={<User />} />
            <Route path="/games" element={<Game />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
