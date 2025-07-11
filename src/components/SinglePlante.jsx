import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./SiglePlante.css"
import { Link } from "react-router-dom";
import planteNot from '../assets/media/plante-not.png';


const SinglePlante = () => {
  const Base_URL = import.meta.env.VITE_URL_API;
  
  const { id } = useParams();
  const [plante, setPlante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlante = async () => {
      try {
        const res = await fetch(`${Base_URL}/api/plantes/${id}`);
        if (!res.ok) throw new Error('Plante non trouvée');
        const data = await res.json();
        setPlante(data);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlante();
  }, [id, Base_URL]);

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (!plante) return <p className="text-center mt-5">Plante non trouvée</p>;

  return (
    <div className="container siglePlante my-4">
      {/* Section IMAGE + TEXTE */}
      <div className="row mb-4">
        <div className="col-md-6 bloc-image">
          <img
            src={plante.image ?? 'https://img.freepik.com/vecteurs-libre/tomates-fraiches_1053-566.jpg'}
            alt={plante.nom}
            className="img-fluid rounded mb-3 img-principal"
          />
          {/* <div className="d-flex justify-content-between">
            {[1, 2, 3].map((_, idx) => (
              <img
                key={idx}
                src="https://via.placeholder.com/100x100?text=Mini"
                alt="Mini"
                className="img-thumbnail"
              />
            ))}
          </div> */}
        </div>

        {/* Titre + description */}
        <div className="col-md-6 text-desc">
          <h2 className='bloc-titre'>{plante.nom}</h2>
          <h3 className='bloc-titre'><span >Famille : </span>{plante.categorie?.libelleCat}</h3>
          <p className='bloc-text'>{plante.description}</p>
        </div>
      </div>

     

      {/* Section VARIÉTÉS */}
      <h3 className="mb-3 bloc-titre var-titre">VARIÉTÉ</h3>
       <hr />
      <div className="row">
        {plante.varietes && plante.varietes.length > 0 ? (
          plante.varietes.map((v) => (
            <div className="col-md-4 mb-4" key={v.idVariete}>
                <Link to={`/variete/${v.idVariete}`} className="text-decoration-none text-dark">
                    <div className="card h-100">
                        <div className='bloc-image'>
                            <img
                            src={v.image ?? planteNot}
                            alt={v.libelle}
                            className="card-img-top"
                            style={{ objectFit: 'cover', height: '200px' }}
                            />
                        </div>
                    
                        <div className="card-body">
                        <h5 className="card-title bloc-titre">{v.libelle}</h5>
                        <p className="card-text bloc-text">{v.description}</p>
                        </div>
                    </div>
                </Link>
            </div>
          ))
        ) : (
          <p>Aucune variété disponible</p>
        )}
      </div>
    </div>
  );
};

export default SinglePlante;
