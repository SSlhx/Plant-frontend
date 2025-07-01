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
import ProtectedRoute from './components/ProtectedRoute';  
import ListePlante from './components/ListePlante';  
import SinglePlante from "./components/SinglePlante";
import SingleVariete from "./components/SingleVariete";
import ParcellesList from "./components/ParcellesList";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  
  const hideSidebar = location.pathname === '/connexion' || location.pathname === '/register';
  const hideHeader = location.pathname === '/connexion' || location.pathname === '/register';

  return (
    <div className="app">
      {!hideHeader && <Header />}

      <div className="main">
        <div className="content">
          <Routes>
            <Route path="/connexion" element={<LoginForm />} />
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
              path="/parcelle"
              element={
                <ProtectedRoute>
                  <Parcelles />
                </ProtectedRoute>
              }
            />
            <Route
            path="/parcelles-list"
            element={
              <ProtectedRoute>
                <ParcellesList />
              </ProtectedRoute>
            }
          />
            <Route
              path="/ListePlante"
              element={
                <ProtectedRoute>
                  <ListePlante />
                </ProtectedRoute>
              }
            />
            <Route path="/plante/:id" element={<SinglePlante />} />
            <Route path="/variete/:id" element={<SingleVariete />} />
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
