import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important pour les cookies
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur de connexion');
      }

      const data = await res.json();
      alert("Connexion réussie !");
      // Redirige ou stocke les infos utilisateur si besoin
      navigate('/Profile')
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input type="input" value={login} onChange={e => setLogin(e.target.value)} placeholder="Login" required />
      </div>
      <div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required />
      </div>
      <button type="submit">Se connecter</button>
      <p>Pas de compte ?<a href="/register">Inscrivez-vous</a></p>
    </form>

  );
}

export default LoginForm;
