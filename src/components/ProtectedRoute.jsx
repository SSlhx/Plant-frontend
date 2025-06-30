import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSession from '../utils/useSession';

function ProtectedRoute({ children }) {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return <p>Chargement de la session...</p>;
  }

  if (!user) {
    // Redirige vers /login, mais garde la page d'origine en state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // L'utilisateur est connecté
  return children;
}

export default ProtectedRoute;
