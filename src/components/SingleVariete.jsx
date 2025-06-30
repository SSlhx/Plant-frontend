import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleVariete.css';

const SingleVariete = () => {
  const { id } = useParams();
  const [variete, setVariete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariete = async () => {
      try {
const res = await fetch(`http://141.94.71.30:8080/api/varietes/${id}`);
        if (!res.ok) throw new Error('Variété non trouvée');
        const data = await res.json();
        setVariete(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVariete();
  }, [id]);

  if (loading) return <p className="center-text">Chargement...</p>;
  if (!variete) return <p className="center-text">Variété non trouvée</p>;

  return (
    <div className="single-variete-container">
      <h1 className="variete-title">{variete.libelle}</h1>

      <div className="variete-top">
        <div className="variete-image">
          <img
            src={variete.image ?? 'https://via.placeholder.com/400x300?text=Image'}
            alt={variete.libelle}
          />
        </div>

        <div className="variete-info">
          <h2>Plante : {variete.planteNom ?? 'N/A'}</h2>
          <p>{variete.description}</p>
          <ul>
            {variete.nbGraines && <li><strong>Nombre de graines :</strong> {variete.nbGraines}</li>}
            {variete.ensoleillement && <li><strong>Ensoleillement :</strong> {variete.ensoleillement}</li>}
            {variete.frequence_arrosage && <li><strong>Arrosage :</strong> {variete.frequence_arrosage}</li>}
            {variete.date_debut_periode_plantation && (
              <li>
                <strong>Début plantation :</strong> {variete.date_debut_periode_plantation}
              </li>
            )}
            {variete.date_fin_periode_plantation && (
              <li>
                <strong>Fin plantation :</strong> {variete.date_fin_periode_plantation}
              </li>
            )}
            {variete.resistance_froid && <li><strong>Résistance au froid :</strong> {variete.resistance_froid}</li>}
            {variete.temps_avant_recolte && <li><strong>Temps avant récolte :</strong> {variete.temps_avant_recolte} jours</li>}
            {variete.ph && <li><strong>pH :</strong> {variete.ph}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SingleVariete;
