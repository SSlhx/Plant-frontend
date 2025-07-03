import React, { useState, useEffect } from 'react';
import "./Form.css"
export default function FormVariete({ onClose }) {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [plantes, setPlantes] = useState([]);

  const aujourdhui = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + 1);
  const demain = dateObj.toISOString().split('T')[0];
  const [formVariete, setFormVariete] = useState({
    libelle: '',
    description: '',
    nbGraines: '',
    ensoleillement: '',
    frequence_arrosage: '',
    date_debut_periode_plantation: aujourdhui,
    date_fin_periode_plantation: demain,
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
  const formData = new FormData();

  for (const key in formVariete) {
    if (formVariete[key] !== '') {
      if (key === 'image' && formVariete.image instanceof File) {
        formData.append(key, formVariete.image);
      } else {
        formData.append(key, formVariete[key]);
      }
    }
  }

  fetch(`${Base_URL}/api/varietes`, {
    method: 'POST',
    body: formData,
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
    window.dispatchEvent(new Event('varieteAjoutee'));
    onClose();
  })
  .catch(console.error);
};


  return (
    <>
      <div className='Form-add'>
        <h2>Ajouter une variété</h2>
        <form onSubmit={handleSubmit} className='form'>

          <fieldset>
            <legend>Informations générales</legend>
            <div className='row'>
            <label>
              Nom de la variété *
              <input
                name="libelle"
                placeholder="Ex: Tomate Roma"
                value={formVariete.libelle}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description 
              <textarea
                name="description"
                placeholder="Description de la variété"
                value={formVariete.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Plante associée *
              <select
                name="idPlante"
                value={formVariete.idPlante}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une plante</option>
                {plantes.map(p => (
                  <option key={p.idPlante} value={p.idPlante}>
                    {p.nom}
                  </option>
                ))}
              </select>
            </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Caractéristiques de culture</legend>
            <label>
              Nombre de graines
              <input
                type="number"
                name="nbGraines"
                placeholder="Ex: 20"
                
                value={formVariete.nbGraines}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                min="1"
              />
            </label>
            <label>
              Ensoleillement
              <input
                name="ensoleillement"
                placeholder="Ex: plein soleil"
                value={formVariete.ensoleillement}
                onChange={handleChange}
                
              />
            </label>
            <label>
              Fréquence d'arrosage (en jour)
              <input
              type="number"
                min="0"
                
                step="1"
                name="frequence_arrosage"
                placeholder="Ex: 2"
                value={String(formVariete.frequence_arrosage)}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </label>
            <label>
              Résistance au froid
              <select
                name="resistance_froid"
                value={formVariete.resistance_froid}
                onChange={handleChange}
              >
                <option value="">Sélectionner</option>
                <option value="Faible">Faible</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Forte">Forte</option>
              </select>
            </label>
            <label>
              pH
              <input
                type="number"
                name="ph"
                placeholder="0-14"
                min="0"
                max="14"
                step="0.1"
                value={formVariete.ph}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Semis et récolte</legend>
            <label>
              Date de début de plantation
              <input
                type="date"
                name="date_debut_periode_plantation"
                value={formVariete.date_debut_periode_plantation}
                max={formVariete.date_fin_periode_plantation || undefined}
                onChange={handleChange}
              />
            </label>
            <label>
              Date de fin de plantation
              <input
                type="date"
                name="date_fin_periode_plantation"
                value={formVariete.date_fin_periode_plantation}
                min={formVariete.date_debut_periode_plantation || undefined}
                onChange={handleChange}
              />
            </label>
            <label>
              Temps avant la récolte (en jour)
              <input
              type="number"
                min="0"
                step="1"
                name="temps_avant_recolte"
                placeholder="Ex: 90"
                value={String(formVariete.temps_avant_recolte)}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Image</legend>
            <label>
              Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFormVariete(prev => ({ ...prev, image: e.target.files[0] }))}
              />
            </label>
          </fieldset>

          <button className="bouton-vert" type="submit" >
            Ajouter la variété
          </button>
        </form>
      </div>
    </>
  );
}
