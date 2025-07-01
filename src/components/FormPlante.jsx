import React, { useState, useEffect } from 'react';

export default function FormPlante({ onClose }) {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [categories, setCategories] = useState([]);
  const [formPlante, setFormPlante] = useState({
    nom: '',
    description: '',
    idCat: '',
  });

  useEffect(() => {
    fetch(`${Base_URL}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, [Base_URL]);

  const handleChange = (e) => {
    setFormPlante(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${Base_URL}/api/plantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPlante),
    })
      .then(res => res.json())
      .then(() => {
        setFormPlante({ nom: '', description: '', idCat: '' });
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <h2>Ajouter une Plante</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          name="nom"
          placeholder="Nom de la plante"
          value={formPlante.nom}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description de la plante"
          value={formPlante.description}
          onChange={handleChange}
        />
        <select
          name="idCat"
          value={formPlante.idCat}
          onChange={handleChange}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map(cat => (
            <option key={cat.idCat} value={cat.idCat}>
              {cat.libelle}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </>
  );
}
