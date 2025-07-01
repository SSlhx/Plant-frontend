import React, { useState, useEffect } from 'react';

export default function FormPlante({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [formPlante, setFormPlante] = useState({
    nom: '',
    description: '',
    idCat: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormPlante(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/plantes', {
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
