import React, { useState, useEffect } from 'react';

export default function FormCategorie({ onClose }) {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [categories, setCategories] = useState([]);
  const [formCategorie, setFormCategorie] = useState({ libelle: '', idCatParent: '' });

  useEffect(() => {
    fetch(`${Base_URL}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, [Base_URL]);

  const handleChange = (e) => {
    setFormCategorie(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${Base_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formCategorie)
    })
      .then(res => res.json())
      .then(() => {
        setFormCategorie({ libelle: '', idCatParent: '' });
        onClose();
      })
      .catch(console.error);
  };

  return (
    <>
      <h2>Ajouter une Catégorie</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          name="libelle"
          placeholder="Nom de la catégorie"
          value={formCategorie.libelle}
          onChange={handleChange}
          required
        />
        <select
          name="idCatParent"
          value={formCategorie.idCatParent}
          onChange={handleChange}
        >
          <option value="">Aucune catégorie parente</option>
          {categories.map(cat => (
            <option key={cat.idCat} value={cat.idCat}>{cat.libelle}</option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </>
  );
}
