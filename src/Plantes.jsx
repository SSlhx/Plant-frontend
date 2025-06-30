import React, { useState, useEffect } from 'react';

function Plantes() {
  const [plantes, setPlantes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formPlante, setFormPlante] = useState({
    nom: '',
    description: '',
    idCat: '',
  });

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

  const [formCategorie, setFormCategorie] = useState({
    libelle: '',
    idCatParent: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/plantes')
      .then((res) => res.json())
      .then(setPlantes)
      .catch(console.error);

    fetch('http://localhost:8000/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (setter) => (e) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitPlante = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/plantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formPlante)
    })
      .then(res => res.json())
      .then(() => {
        setFormPlante({ nom: '', description: '', idCat: '' });
        return fetch('http://localhost:8000/api/plantes').then(res => res.json());
      })
      .then(setPlantes)
      .catch(console.error);
  };

  const handleSubmitVariete = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/varietes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formVariete)
    })
      .then(res => res.json())
      .then(() => {
        setFormVariete({ 
          libelle: '', description: '', nbGraines: '', ensoleillement: '',
          frequence_arrosage: '', date_debut_periode_plantation: '', date_fin_periode_plantation: '',
          resistance_froid: '', temps_avant_recolte: '', ph: '', image: '', idPlante: '',
        });
      })
      .catch(console.error);
  };

  const handleSubmitCategorie = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formCategorie)
    })
      .then(res => res.json())
      .then(() => {
        setFormCategorie({ libelle: '', idCatParent: '' });
        return fetch('http://localhost:8000/api/categories').then(res => res.json());
      })
      .then(setCategories)
      .catch(console.error);
  };

  return (
    <div className='row' style={{ padding: "2rem" }}>
      <div className='col-12 col-md-6 col-xl-4 offset-xl-2'>
      <h2>Ajouter une Catégorie</h2>
      <form onSubmit={handleSubmitCategorie} style={{ display: "flex", gap: "20px", flexWrap: "wrap", flexDirection: "column" }}>
        <input
          name="libelle"
          placeholder="Nom de la catégorie"
          value={formCategorie.libelle}
          onChange={handleChange(setFormCategorie)}
          required
        />
        <select
          name="idCatParent"
          value={formCategorie.idCatParent}
          onChange={handleChange(setFormCategorie)}
        >
          <option value="">Aucune catégorie parente</option>
          {categories.map((cat) => (
            <option key={cat.idCat} value={cat.idCat}>
              {cat.libelle}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
      </div>

      <div className='col-12 col-md-6 col-xl-4'>
      <h2>Ajouter une Plante</h2>
      <form onSubmit={handleSubmitPlante} style={{ display: "flex", gap: "20px", flexWrap: "wrap", flexDirection: "column" }}>
        <input
          name="nom"
          placeholder="Nom de la plante"
          value={formPlante.nom}
          onChange={handleChange(setFormPlante)}
          required
        />
        <textarea
          name="description"
          placeholder="Description  de la plante"
          value={formPlante.description}
          onChange={handleChange(setFormPlante)}
        />
        <select
          name="idCat"
          value={formPlante.idCat}
          onChange={handleChange(setFormPlante)}
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.idCat} value={cat.idCat}>
              {cat.libelle}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
      </div>

      <div className='col-12 col-md-6 col-xl-4 offset-md-3 offset-xl-4 mt-5'>
      <h2>Ajouter une Variété</h2>
      <form onSubmit={handleSubmitVariete} style={{ display: "flex", gap: "20px", flexWrap: "wrap", flexDirection: "column" }}>
        <input
          name="libelle"
          placeholder="Nom de la variété"
          value={formVariete.libelle}
          onChange={handleChange(setFormVariete)}
          required
        />
        <textarea
          name="description"
          placeholder="Description de la variété"
          value={formVariete.description}
          onChange={handleChange(setFormVariete)}
        />
        <input
          type="number"
          name="nbGraines"
          placeholder="Nombre de graines"
          value={formVariete.nbGraines}
          onChange={handleChange(setFormVariete)}
        />
        <textarea
          name="ensoleillement"
          placeholder="Ensoleillement"
          value={formVariete.ensoleillement}
          onChange={handleChange(setFormVariete)}
        />
        <input
          name="frequence_arrosage"
          placeholder="Frequence d'arrosage"
          value={formVariete.frequence_arrosage}
          onChange={handleChange(setFormVariete)}
        />
        <input
          type="date"
          name="date_debut_periode_plantation"
          placeholder="Date du debut de la periode de plantation"
          value={formVariete.date_debut_periode_plantation}
          onChange={handleChange(setFormVariete)}
        />
        <input
          type="date"
          name="date_fin_periode_plantation"
          placeholder="Date de la fin de la periode de plantation"
          value={formVariete.date_fin_periode_plantation}
          onChange={handleChange(setFormVariete)}
        />
        <input
          name="resistance_froid"
          placeholder="Resistance au froid"
          value={formVariete.resistance_froid}
          onChange={handleChange(setFormVariete)}
        />
        <input
          name="temps_avant_recolte"
          placeholder="Temps avant la recolte"
          value={formVariete.temps_avant_recolte}
          onChange={handleChange(setFormVariete)}
        />
        <input
          name="ph"
          placeholder="Ph"
          value={formVariete.ph}
          onChange={handleChange(setFormVariete)}
        />
        <input
          name="image"
          placeholder="URL de l'image"
          value={formVariete.image}
          onChange={handleChange(setFormVariete)}
        />
        <select
          name="idPlante"
          value={formVariete.idPlante}
          onChange={handleChange(setFormVariete)}
          required
        >
          <option value="">Choisir une plante</option>
          {plantes.map((p) => (
            <option key={p.idPlante} value={p.idPlante}>
              {p.nom}
            </option>
          ))}
        </select>
        <button type="submit">Ajouter</button>
      </form>
      </div>
    </div>
  );
}

export default Plantes;
