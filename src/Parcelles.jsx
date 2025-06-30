import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from './utils/session';
function Parcelles() {
  const [user, setUser] = useState(null);
    const navigate = useNavigate();

    
  const [parcelles, setParcelles] = useState([]);
  const [form, setForm] = useState({
    libelle: '',
    longueur: '',
    largeur: '',
    taille_carres: '',
    idUser: '' // À remplacer par le user connecté quand ça sera dev
  });
  const [zooms, setZooms] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formPousse, setFormPousse] = useState({
    nbPlants: '',
    idVariete: '',
    datePlantation: ''
  });
  const getPousseAtSelectedCell = () => {
  const parcelle = parcelles.find(p => p.idParcelle === selectedCell?.parcelleId);
    return parcelle?.pousses.find(pousse => pousse.x === selectedCell.x && pousse.y === selectedCell.y);
  };
  const pousseExistante = getPousseAtSelectedCell();
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [varietes, setVarietes] = useState([]);
  const [formData, setFormData] = useState({
    nbPlants: 1,
    idVariete: '',
    datePlantation: new Date().toISOString().split('T')[0],
  });
  useEffect(() => {
  if (user?.user_id) {
    setForm(form => ({ ...form, idUser: user.user_id }));
  }
}, [user]);
  useEffect(() => {
        async function fetchSession() {
            const sessionUser = await CheckUser();
            if (!sessionUser) {
                alert('Session invalide ou expirée');
                navigate('/login');  
            } else {
                setUser(sessionUser);  
            }
        }
    
        fetchSession();
    }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:8000/api/varietes")
      .then((res) => res.json())
      .then(setVarietes)
      .catch(console.error);
  }, []);

  useEffect(() => {
  fetch('http://localhost:8000/api/parcelles', {
    credentials: 'include',  // <-- essentiel pour envoyer les cookies de session
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Erreur HTTP ' + res.status);
      }
      return res.json();
    })
    .then(setParcelles)
    .catch(console.error);
}, []);


  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   fetch('http://localhost:8000/api/parcelles', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(form)
  //   })
  //     .then(res => res.json())
  //     .then(() => window.location.reload())
  //     .catch(console.error);
  // };
  const handleSubmit = e => {
  e.preventDefault();

  // Crée les données à envoyer en ajoutant user.user_id
  const dataToSend = { ...form, idUser: user?.user_id };

  fetch('http://localhost:8000/api/parcelles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(dataToSend),
  credentials: 'include'  // <-- ajoute cette ligne pour envoyer les cookies de session
})
.then(res => {
  if (!res.ok) {
    throw new Error('Erreur HTTP ' + res.status);
  }
  return res.json();
})
.then(() => window.location.reload())
.catch(console.error);

};

  const handleZoomChange = (idParcelle, value) => {
    setZooms(prev => ({ ...prev, [idParcelle]: parseFloat(value) }));
  };

  const handleAddPousse = (e) => {
    e.preventDefault();
    const data = {
      x: selectedCell.x,
      y: selectedCell.y,
      nbPlants: formPousse.nbPlants,
      datePlantation: formPousse.datePlantation,
      idParcelle: selectedCell.parcelleId,
      idVariete: formData.idVariete,
    };

    fetch('http://localhost:8000/api/pousses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(() => {
        setShowForm(false);
        setSelectedCell(null);
        setFormPousse({ nbPlants: '', idVariete: '', datePlantation: '' });
      })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const handleDeletePousse = () => {
    if (!selectedCell) return;

    const { x, y, parcelleId } = selectedCell;
    const url = `http://localhost:8000/api/pousses/${x}/${y}/${parcelleId}`;

    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la suppression');
        return res.json();
      })
      .then(() => {
        // Rechargement auto
        setParcelles(prevParcelles =>
          prevParcelles.map(p =>
            p.idParcelle === parcelleId
              ? {
                  ...p,
                  pousses: p.pousses.filter(
                    pousse => !(pousse.x === x && pousse.y === y)
                  ),
                }
              : p
          )
        );
        setSelectedCell(null);
      })
      .catch(console.error);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  let dateRecolte = null;
  if (pousseExistante?.datePlantation && pousseExistante.variete?.temps_avant_recolte != null) {
    const d = new Date(pousseExistante.datePlantation);
    d.setDate(d.getDate() + parseInt(pousseExistante.variete.temps_avant_recolte));
    dateRecolte = d.toLocaleDateString();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
      <h2>Parcelles</h2>
        <h3>Ajouter une parcelle</h3>
        <form onSubmit={handleSubmit} style={{ marginBottom: "3rem"}}>
          <input name="libelle" placeholder="Nom" onChange={handleChange} required />
          <input name="longueur" type="number" placeholder="Longueur" onChange={handleChange} required />
          <input name="largeur" type="number" placeholder="Largeur" onChange={handleChange} required />
          <input name="taille_carres" type="number" step="0.1" placeholder="Taille des carrés" onChange={handleChange} required />
          <button type="submit">Ajouter</button>
        </form>
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
                <div style={{ overflow: "auto", maxWidth: "90vw", minWidth: "60vw", maxHeight: "100vw", minHeight: "10vw" }}>
                  
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
                                  onClick={(e) => {
                                    const rect = e.target.getBoundingClientRect();
                                    setMenuPosition({
                                      top: rect.top + window.scrollY,
                                      left: rect.left + window.scrollX + rect.width + 10, // '- rect.width - 10' pour mettre à gauche
                                    });
                                    setSelectedCell({ x: row, y: col, parcelleId: p.idParcelle });
                                    setShowForm(false); // reset formulaire
                                  }}
                                  style={{
                                    border: selectedCell?.x === row && selectedCell?.y === col && selectedCell?.parcelleId === p.idParcelle
                                      ? "2px solid #9C2828"
                                      : "1px solid black",
                                    width: "75px",
                                    height: "75px",
                                    textAlign: "center",
                                    backgroundColor: pousse ? "#198754" : "#543D35"
                                  }}
                                >
                                  {/* {row},{col} */}
                                  {/* {pousse ? <div>{pousse.idPousse}</div> : null} */}
                                  {pousse?.variete?.image && (
                                    <div style={{cursor: "pointer"}}>
                                    <div style={{ width: "55px", height: "55px", marginLeft: "auto", marginRight: "auto"}}>
                                      <img
                                        src={`${pousse.variete.image}`}
                                        alt={pousse.variete.libelle || 'Plante'}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                      />
                                    </div>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {selectedCell && (
                  <div style={{
                    position: 'absolute',
                    top: `${menuPosition.top}px`,
                    left: `${menuPosition.left}px`,
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    padding: '1rem',
                    zIndex: 1000,
                  }}>
                    {!showForm ? (
                      <>
                        {/* <h4>Actions pour la case ({selectedCell.x}, {selectedCell.y})</h4> */}

                        {pousseExistante && (
                          <div style={{ marginBottom: "1rem" }}>
                            <p><strong>Nombre de plants :</strong> {pousseExistante.nbPlants}</p>
                            <p><strong>Date de plantation :</strong> {new Date(pousseExistante.datePlantation).toLocaleDateString()}</p>
                            <p><strong>Variété :</strong> {pousseExistante.variete?.libelle || "Non renseignée"}</p>
                            <p><strong>Date de la future récolte :</strong>{dateRecolte || "Inconnue"}</p>
                          </div>
                        )}

                        <button onClick={() => setShowForm(true)} disabled={!!pousseExistante}>
                          Ajouter une pousse
                        </button>
                        <button onClick={handleDeletePousse} disabled={!pousseExistante}>
                          Supprimer la pousse
                        </button>
                        <button onClick={() => setSelectedCell(null)}>
                          Fermer
                        </button>
                      </>
                    ) : (
                      <form onSubmit={handleAddPousse}>
                        <h4>Ajouter une pousse</h4>
                        <input
                          type="number"
                          placeholder="Nb de plants"
                          value={formPousse.nbPlants}
                          onChange={(e) => setFormPousse({ ...formPousse, nbPlants: e.target.value })}
                          required
                        />
                        <select
                          name="idVariete"
                          value={formData.idVariete}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Choisir une variété</option>
                          {varietes.map((v) => (
                            <option key={v.idVariete} value={v.idVariete}>
                              {v.libelle}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={formPousse.datePlantation}
                          onChange={(e) => setFormPousse({ ...formPousse, datePlantation: e.target.value })}
                          required
                        />
                        <button type="submit">Valider</button>
                        <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )
          })}
    </div>
  );
  
}

export default Parcelles;
