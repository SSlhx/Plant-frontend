import React, { useState, useEffect } from 'react';
import "./Form.css"
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
  <div className="Form-add">
    <h2>Ajouter une Plante</h2>
    <form onSubmit={handleSubmit} className="form">
      <fieldset>
        <legend>Informations générales</legend>
        <label>
          Nom de la plante *
          <input
            name="nom"
            placeholder="Ex: Tomate"
            value={formPlante.nom}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            placeholder="Description de la plante"
            value={formPlante.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Catégorie *
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
        </label>
      </fieldset>

      <button className="bouton-vert" type="submit">
        Ajouter la plante
      </button>
    </form>
  </div>
</>

  );
}
