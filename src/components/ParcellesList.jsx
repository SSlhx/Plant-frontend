import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./parcelles-list.css";
import FabMenu from './FabMenu';

export default function ParcellesList() {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [parcelleToDelete, setParcelleToDelete] = useState(null); 
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleClick = (idParcelle) => {
    navigate('/parcelle', { state: { idParcelle } });
    localStorage.setItem('idParcelle', idParcelle);
  };

  const fetchParcelles = () => {
    setLoading(true);
    setError('');
    fetch(`${Base_URL}/api/parcelles/simple`, { credentials: 'include' })
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
  };

  useEffect(() => {
    fetchParcelles();

    const handleParcelleAjoutee = () => {
      fetchParcelles();
    };

    const handleCategorieAjoutee = () => {
      console.log('Une catégorie a été ajoutée !');
      setSuccessMessage('Catégorie ajoutée avec succès !');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    };

    const handlePlanteAjoutee = () => {
      console.log('Une plante a été ajoutée !');
      setSuccessMessage('Plante ajoutée avec succès !');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    };

    const handleVarieteAjoutee = () => {
      console.log('Une variété a été ajoutée !');
      setSuccessMessage('Variété ajoutée avec succès !');
      // setTimeout(() => {
      //   setSuccessMessage('');
      // }, 3000);
    };

    window.addEventListener('parcelleAjoutee', handleParcelleAjoutee);
    window.addEventListener('categorieAjoutee', handleCategorieAjoutee);
    window.addEventListener('planteAjoutee', handlePlanteAjoutee);
    window.addEventListener('varieteAjoutee', handleVarieteAjoutee);

    return () => {
      window.removeEventListener('parcelleAjoutee', handleParcelleAjoutee);
      window.removeEventListener('categorieAjoutee', handleCategorieAjoutee);
      window.removeEventListener('planteAjoutee', handlePlanteAjoutee);
      window.removeEventListener('varieteAjoutee', handleVarieteAjoutee);
    };
  }, [Base_URL]);


  const confirmDelete = (idParcelle) => {
    setParcelleToDelete(idParcelle);
  };

  const deleteParcelle = () => {
    fetch(`${Base_URL}/api/parcelles/${parcelleToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur suppression');
        return res.json();
      })
      .then(() => {
        setParcelleToDelete(null);
        fetchParcelles();
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Erreur, votre parcelle contient des pousses.");
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  const cancelDelete = () => {
    setParcelleToDelete(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4 parcelles-list">
      <h1 className="mb-3 bloc-titre">Mes Parcelles</h1>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}


      <div className='item-liste'>
        {parcelles.length === 0 ? (
          <p>Vous n’avez encore créé aucune parcelle. Cliquez sur le bouton <strong className='btn-none-parcelle'> + </strong> pour commencer !</p>
        ) : (
          <ul className="list-group">
            {parcelles.map((p) => (
              <li key={p.idParcelle} className="list-group-item item">
                <div className='content-text'>
                  <h2 className='bloc-titre'>{p.libelle}</h2>
                </div>
                <div className='lien'>
                  <button onClick={() => handleClick(p.idParcelle)} className='btn mod'>Modifier</button>
                  <button onClick={() => confirmDelete(p.idParcelle)} className='btn supp'>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {parcelleToDelete && (
        <div className="popup-confirmation">
          <div className="popup-content">
            <p>Confirmez-vous la suppression de cette parcelle ?</p>
            {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
            )}
            <button onClick={deleteParcelle} className="delete ">Oui, supprimer</button>
            <button onClick={cancelDelete} className="cancel bouton-vert">Annuler</button>
          </div>
        </div>
      )}

      <FabMenu />
    </div>
  );
}
