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
        // Tu peux faire une redirection ou reset du formulaire ici
        setForm({ libelle: '', longueur: '', largeur: '', taille_carres: '' });
      })
      .then(() => window.location.reload())
      .catch(err => {
        alert('Erreur lors de l\'ajout : ' + err.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <input
        name="libelle"
        placeholder="Nom de la parcelle"
        value={form.libelle}
        onChange={handleChange}
        required
      />
      <input
        name="longueur"
        type="number"
        placeholder="Longueur"
        value={form.longueur}
        onChange={handleChange}
        required
      />
      <input
        name="largeur"
        type="number"
        placeholder="Largeur"
        value={form.largeur}
        onChange={handleChange}
        required
      />
      <input
        name="taille_carres"
        type="number"
        step="0.1"
        placeholder="Taille des carrés"
        value={form.taille_carres}
        onChange={handleChange}
        required
      />
      <button type="submit">Ajouter la parcelle</button>
    </form>
  );
}

export default FormParcelle;
