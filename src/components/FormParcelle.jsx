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

    if (!form.taille_carres) {
      alert("Merci de sélectionner la taille des carrés !");
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
        window.dispatchEvent(new Event('parcelleAjoutee'));
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
            min ="1"
            max="30"
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
            min ="1"
            max="30"
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
          <select
            name="taille_carres"
            value={form.taille_carres}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
          </select>
        </label>
      </fieldset>
      <button className="bouton-vert" type="submit">
        Ajouter la parcelle
      </button>
    </form>
  </div>
</>

  );
}

export default FormParcelle;
