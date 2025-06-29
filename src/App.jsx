import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Parcelles from './Parcelles';
import Profile from './components/Profile';
import Plantes from './Plantes';
import Header from './components/header';
import Sidebar from './components/sidebar';
import ProtectedRoute from './components/ProtectedRoute';  // ✅ Ajouté

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';
  const hideHeader = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="app">
      {!hideHeader && <Header />}

      <div className="main">
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parcelles"
              element={
                <ProtectedRoute>
                  <Parcelles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plantes"
              element={
                <ProtectedRoute>
                  <Plantes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {!hideSidebar && <Sidebar />}
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Page d'accueil</h2>
    </div>
  );
}

export default App;
