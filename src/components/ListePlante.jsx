import React, { useEffect, useState } from "react";



const Base_URL = "http://localhost:8000"

const PlantesList =()=>{

    const [plantes, setPlantes] =useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCat, setselectedCat] = useState(null);
    const [categorie, setcategorie] = useState([{id : null, libelle : "Toutes"}]);

    const FetchCat = async()=>{
        try{
            const res = await fetch(`${Base_URL}/catPlant`)
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur lors du chargement des catégories");

            setcategorie([{id : null, libelle : "Toutes"}, ...data]);
        }catch (err) {
            console.error(err);
            alert("Erreur chargement catégories : " + err.message);
        }
    };
    
    const FetchPlantes = async(idCat = null)=>{
        try{
            const url = idCat !=null ? `${Base_URL}/ListePlant/${idCat}` : `${Base_URL}/ListePlant`;
            const res = await fetch(url);
            const data = await res.json();
            if(!res)
            {
                throw new Error(data.message || 'Erreur lors du chargement des plantes');
            }
            setPlantes(data);
        }
        catch (err) {
            console.setError(err.message);
        }
        finally{
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
    <div>
      <div>
        {categorie.map((cat) => (
          <button
            key={cat.id ?? "all"}
            onClick={() => setselectedCat(cat.id)}
          >
            {cat.libelle}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        plantes.map((item) => (
          <div key={item.id}>
            <h3 >{item.nom}</h3>
            <p >{item.desc}</p>
            <p ><strong>Catégorie :</strong> {item.cat}</p>
            <p >Variétés :</p>
            <ul>
              {item.varietes.map((v, idx) => (
                <li key={idx} >• {v.libelle} ({v.description})</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );


};
export default PlantesList;
