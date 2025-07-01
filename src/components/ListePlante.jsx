import React, { useEffect, useState } from "react";
import "./ListePlante.css";
import { Link } from "react-router-dom";

const Base_URL = import.meta.env.VITE_URL_API;

const PlantesList = () => {
  const [plantes, setPlantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const [categories, setCategories] = useState([{ id: null, libelle: "Toutes" }]);

  const FetchCat = async () => {
    try {
      const res = await fetch(`${Base_URL}/catPlant`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement des catégories");
      setCategories([{ id: null, libelle: "Toutes" }, ...data]);
    } catch (err) {
      console.error(err);
      alert("Erreur chargement catégories : " + err.message);
    }
  };

  const FetchPlantes = async (idCat = null) => {
    try {
      setLoading(true);

      // On force l'URL selon si c'est vraiment null ou pas
      const url = idCat === null ? `${Base_URL}/ListePlant` : `${Base_URL}/ListePlant/${idCat}`;
      console.log("FetchPlantes -> idCat:", idCat, "URL:", url);

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement des plantes");
      setPlantes(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchCat();
    FetchPlantes();
  }, []);

  useEffect(() => {
    FetchPlantes(selectedCat);
  }, [selectedCat]);

  return (
    <div className="container Liste py-4">
      <h1 className="mb-3">Bibliothèque de plantes</h1>
      {/* Boutons Catégories */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id ?? "all"}
            className={`btn ${selectedCat === cat.id ? "btn-active" : "btn-none"}`}
            onClick={() => setSelectedCat(cat.id ?? null)} // Forcer null si besoin
          >
            {cat.libelle}
          </button>
        ))}
      </div>

      {/* Chargement */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="row">
          {plantes.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
              <Link to={`/plante/${item.id}`} className="text-decoration-none text-dark">
                <div className="card h-100">
                  <div className="bloc-image">
                    <img
                      src={item.image || "https://www.svgrepo.com/show/407629/tomato.svg"}
                      className="card-img-top"
                      alt={item.nom}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title bloc-titre">{item.nom}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantesList;
