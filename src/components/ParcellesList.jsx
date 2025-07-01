import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import "./parcelles-list.css"
import FabMenu from './FabMenu';
import { useNavigate } from 'react-router-dom';


export default function ParcellesList() {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleClick = (idParcelle) => {
  // On navigue en passant l'id dans state
  navigate('/parcelle', { state: { idParcelle } });
  // ET on stocke dans localStorage
  localStorage.setItem('idParcelle', idParcelle);
};


  useEffect(() => {
    fetch(`${Base_URL}/api/parcelles/simple`, {
      credentials: 'include', // important pour les cookies de session
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then((data) => setParcelles(data))
      .catch((err) => {
        console.error(err);
        setError('Erreur lors du chargement des parcelles');
      })
      .finally(() => setLoading(false));
  }, [Base_URL]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4 parcelles-list">
      <h2 className="mb-3 bloc-titre">Mes Parcelles</h2>
      {parcelles.length === 0 ? (
        <p>Aucune parcelle trouvée.</p>
      ) : (
        <ul className="list-group">
          {parcelles.map((p) => (
            <li key={p.idParcelle} className="list-group-item item">
                <div className='content-text'>
                    <h2 className='bloc-titre' >{p.libelle}</h2>
                </div>
                <div className='lien'>
                  <button onClick={() => handleClick(p.idParcelle)} className='btn mod'>Modifier</button>
                  <button className='btn supp'>Supprimer</button>
                </div>
            </li>
          ))}
        </ul>
      )}
      <FabMenu />
    </div>
    
  );
}
