import React, { useState, useEffect } from 'react';

export default function FormVariete({ onClose }) {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [plantes, setPlantes] = useState([]);
  const [formVariete, setFormVariete] = useState({
    libelle: '',
    description: '',
    nbGraines: '',
    ensoleillement: '',
    frequence_arrosage: '',
    date_debut_periode_plantation: '',
    date_fin_periode_plantation: '',
    resistance_froid: '',
    temps_avant_recolte: '',
    ph: '',
    image: '',
    idPlante: '',
  });

  useEffect(() => {
    fetch(`${Base_URL}/api/plantes`)
      .then(res => res.json())
      .then(setPlantes)
      .catch(console.error);
  }, [Base_URL]);

  const handleChange = (e) => {
    setFormVariete(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${Base_URL}/api/varietes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formVariete),
    })
      .then(res => res.json())
      .then(() => {
        setFormVariete({
          libelle: '',
          description: '',
          nbGraines: '',
          ensoleillement: '',
          frequence_arrosage: '',
          date_debut_periode_plantation: '',
          date_fin_periode_plantation: '',
          resistance_froid: '',
          temps_avant_recolte: '',
          ph: '',
          image: '',
          idPlante: '',
        });
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <h2>Ajouter une Variété</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          name="libelle"
          placeholder="Nom de la variété"
          value={formVariete.libelle}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description de la variété"
          value={formVariete.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="nbGraines"
          placeholder="Nombre de graines"
          value={formVariete.nbGraines}
          onChange={handleChange}
        />
        <textarea
          name="ensoleillement"
          placeholder="Ensoleillement"
          value={formVariete.ensoleillement}
          onChange={handleChange}
        />
        <input
          name="frequence_arrosage"
          placeholder="Fréquence d'arrosage"
          value={formVariete.frequence_arrosage}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_debut_periode_plantation"
          placeholder="Début période plantation"
          value={formVariete.date_debut_periode_plantation}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_fin_periode_plantation"
          placeholder="Fin période plantation"
          value={formVariete.date_fin_periode_plantation}
          onChange={handleChange}
        />
        <input
          name="resistance_froid"
          placeholder="Résistance au froid"
          value={formVariete.resistance_froid}
          onChange={handleChange}
        />
        <input
          name="temps_avant_recolte"
          placeholder="Temps avant la récolte"
          value={formVariete.temps_avant_recolte}
          onChange={handleChange}
        />
        <input
          name="ph"
          placeholder="pH"
          value={formVariete.ph}
          onChange={handleChange}
        />
        <input
          name="image"
          placeholder="URL de l'image"
          value={formVariete.image}
          onChange={handleChange}
        />
        <select
          name="idPlante"
          value={formVariete.idPlante}
          onChange={handleChange}
          required
        >
          <option value="">Choisir une plante</option>
          {plantes.map(p => (
            <option key={p.idPlante} value={p.idPlante}>
              {p.nom}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </>
  );
}
