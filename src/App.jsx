import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Parcelles from './Parcelles';
import Profile from './components/Profile';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour le formulaire de connexion */}
          <Route path="/login" element={<LoginForm />} />
          {/* Route pour le formulaire d'inscription */}
          <Route path="/register" element={<RegisterForm />} />

          <Route path="/" element={<Home />} />
          <Route path="/parcelles" element={<Parcelles />} />
          {/* Route pour le Profile */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

// Composant pour la page d'accueil
function Home() {
  return <div><h2>Page d'accueil</h2></div>;
}

export default App;