import React, { useState, useEffect } from 'react';
import "./Form.css"
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
  <div className="Form-add">
    <h2>Ajouter une Catégorie</h2>
    <form onSubmit={handleSubmit} className="form">
      <fieldset>
        <legend>Informations sur la catégorie</legend>
        <label>
          Nom de la catégorie *
          <input
            name="libelle"
            placeholder="Ex: Légumes"
            value={formCategorie.libelle}
            onChange={handleChange}
            required
          />
        </label>
        {/* <label>
          Catégorie parente
          <select
            name="idCatParent"
            value={formCategorie.idCatParent}
            onChange={handleChange}
          >
            <option value="">Aucune catégorie parente</option>
            {categories.map(cat => (
              <option key={cat.idCat} value={cat.idCat}>
                {cat.libelle}
              </option>
            ))}
          </select>
        </label> */}
      </fieldset>

      <button className="bouton-vert" type="submit">
        Ajouter la catégorie
      </button>
    </form>
  </div>
</>

  );
}
