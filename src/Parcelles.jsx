import React, { useState, useEffect } from 'react';

function Parcelles() {
  const [parcelles, setParcelles] = useState([]);
  const [form, setForm] = useState({
    libelle: '',
    longueur: '',
    largeur: '',
    taille_carres: '',
    idUser: 'U001' // Remplacer par l'id réel de l'utilisateur
  });
  // const [zoom, setZoom] = useState(0.6); // 1 = 100%
  const [zooms, setZooms] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/api/parcelles')
      .then(res => res.json())
      .then(setParcelles)
      .catch(console.error);
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch('http://localhost:8000/api/parcelles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => window.location.reload()) // Pour rafraîchir la liste
      .catch(console.error);
  };

  const handleZoomChange = (idParcelle, value) => {
    setZooms(prev => ({ ...prev, [idParcelle]: parseFloat(value) }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Parcelles</h2>
          {parcelles.map(p => {
            const zoom = zooms[p.idParcelle] || 0.6;
            return (
              <div style={{ marginBottom: "5rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label>Zoom: </label>
                  <input
                    type="range"
                    min="0.3"
                    max="2"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => handleZoomChange(p.idParcelle, e.target.value)}
                  />
                  <span> {Math.round(zoom * 100)}%</span>
                </div>
                <h3>{p.libelle}</h3>
                <div style={{ overflow: "auto", maxWidth: "90vw", minWidth: "60vw", maxHeight: "100vw", minHeight: "30vw" }}>
                  
                  <div style={{ transform: `scale(${zoom})`, transformOrigin: "left top" }}>
                    <table key={p.idParcelle} style={{ borderCollapse: "collapse", width: "max-content", height: "max-content" }}>
                      {/* <caption>{p.libelle}</caption> */}
                      <tbody>
                        {[...Array(p.longueur / p.taille_carres)].map((_, row) => (
                          <tr key={row}>
                            {[...Array(p.largeur / p.taille_carres)].map((_, col) => {
                              const pousse = p.pousses.find(pousse => pousse.x === row && pousse.y === col);
                              return (
                                <td
                                  key={col}
                                  className={`${row}-${col}`}
                                  style={{
                                    border: "1px solid black",
                                    width: "75px",
                                    height: "75px",
                                    textAlign: "center",
                                    backgroundColor: pousse ? "#198754" : "#543D35"
                                  }}
                                >
                                  {/* {row},{col} */}
                                  {/* {pousse ? <div>{pousse.idPousse}</div> : null} */}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })}
  
      <h3>Ajouter une parcelle</h3>
      <form onSubmit={handleSubmit}>
        <input name="libelle" placeholder="Nom" onChange={handleChange} required />
        <input name="longueur" type="number" placeholder="Longueur" onChange={handleChange} required />
        <input name="largeur" type="number" placeholder="Largeur" onChange={handleChange} required />
        <input name="taille_carres" type="number" step="0.1" placeholder="Taille des carrés" onChange={handleChange} required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
  
}

export default Parcelles;
