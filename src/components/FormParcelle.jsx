import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from '../utils/session';

function FormParcelle() {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    libelle: '',
    longueur: '',
    largeur: '',
    taille_carres: '',
  });
  const navigate = useNavigate();

  // Vérification session utilisateur
  useEffect(() => {
    async function fetchSession() {
      const sessionUser = await CheckUser();
      if (!sessionUser) {
        alert('Session invalide ou expirée');
        navigate('/login');
      } else {
        setUser(sessionUser);
      }
    }
    fetchSession();
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = e => {
  e.preventDefault();
  if (!user) {
    alert("Utilisateur non connecté");
    return;
  }
  const dataToSend = { ...form, idUser: user.user_id };
  fetch(`${Base_URL}/api/parcelles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
      return res.json();
    })
    .then(newParcelle => {
      alert('Parcelle ajoutée avec succès !');
      setForm({ libelle: '', longueur: '', largeur: '', taille_carres: '' });
      window.dispatchEvent(new Event('parcelleAjoutee'));  // <-- ajouté ici
    })
    .catch(err => {
      alert('Erreur lors de l\'ajout : ' + err.message);
    });
};

  return (
    <>
  <div className="Form-add">
    <h2>Ajouter une Parcelle</h2>
    <form onSubmit={handleSubmit} className="form">
      <fieldset>
        <legend>Informations sur la parcelle</legend>
        <label>
          Nom de la parcelle *
          <input
            name="libelle"
            placeholder="Ex: Parcelle Nord"
            value={form.libelle}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Longueur (m) *
          <input
            name="longueur"
            type="number"
            min ="0"
            placeholder="Ex: 10"
            value={form.longueur}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />
        </label>
        <label>
          Largeur (m) *
          <input
            name="largeur"
            type="number"
            min ="0"
            placeholder="Ex: 5"
            value={form.largeur}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />
        </label>
        <label>
          Taille des carrés (m) *
          <input
            name="taille_carres"
            type="number"
            min ="0"
            step="0.1"
            placeholder="Ex: 0.5"
            value={form.taille_carres}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            required
          />
        </label>
      </fieldset>
      <button type="submit">
        Ajouter la parcelle
      </button>
    </form>
  </div>
</>

  );
}

export default FormParcelle;
