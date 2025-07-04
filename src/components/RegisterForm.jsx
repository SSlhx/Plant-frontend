import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';  
import { Link } from 'react-router-dom';

function RegisterForm() {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [nom, setNom] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  setLoading(true);

    try {
      const res = await fetch(`${Base_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nom, login, email, password }),
      });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de l\'inscription');
    }

      // alert("Inscription réussie ! Voici les données envoyées :\n\n" + JSON.stringify(data, null, 2));  
      navigate('/connexion');      
    } catch (err) {
        setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <span className="logo"><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 512 512" data-name="Layer 1" id="Layer_1"><title/><path d="M474.47,229a6,6,0,0,0-5.65-4.75c-56.4-1.66-101,13.15-131.83,44.46-16.46,16.73-26.92,36-33.67,54.23V294.75c.44-6.78,6.62-123.9-68.78-200.34-45-45.61-109.49-66.58-191.86-62.23A6,6,0,0,0,37.13,37c-.82,4.31-19.31,106.35,44.2,183.05,43.33,52.34,114.1,79.24,210.07,80.35v86.14c0,1.64,0,3,0,4v83.9a6,6,0,1,0,11.92,0V398.73a285.14,285.14,0,0,0,44.43,4c41.42,0,73.52-11.47,95.75-34.31C492.37,318.27,475.22,232.62,474.47,229ZM90.58,212.55C38,149.12,45.41,64.39,48.14,43.85,124.78,40.58,184.36,60.57,226,102.73c51.81,52.48,63,127.53,65.13,166.26-67-125.45-162.78-165.85-167.06-167.61a6,6,0,0,0-4.5,11c1,.44,103,43.75,168,176.06C197.35,286.75,131,261.32,90.58,212.55ZM435,360.12c-26.38,27.09-69.23,36.14-127.22,27.32,11.69-15.83,44.58-55.18,111.24-100.76a6,6,0,0,0-6.74-9.85C353,317.32,320.1,352.62,304.29,372.3c2.45-23.76,11.12-64.71,41.27-95.3,27.51-27.89,66.91-42.14,118-40.93C466.35,254.12,473.36,320.72,435,360.12Z"/></svg></span>
        <h1 className='bloc-titre'>Inscription</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Nom"
            required
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Login"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <label id="champ-rgpd" for="rgpd"><input
            id="rgpd"
            type="checkbox"
            required
          /><i>En cochant cette case, j’accepte le traitement de mes données personnelles conformément au <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees" target="_blank">Règlement Général sur la Protection des Données (RGPD)</a>.</i></label>
           <button type="submit" disabled={loading}>
            {loading ? 'inscription...' : "S'inscrire"}
          </button>
        </form>
        <p>Déjà inscrit ? <Link className="link" to="/connexion">Connectez-vous</Link> </p>
      </div>
    </div>
  );
}

export default RegisterForm;
