import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckUser } from './utils/session';

function Parcelles() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération idParcelle depuis location.state ou localStorage
  const idParcelle = location.state?.idParcelle || localStorage.getItem('idParcelle');

  const [parcelles, setParcelles] = useState([]);
  // const [form, setForm] = useState({
  //   libelle: '',
  //   longueur: '',
  //   largeur: '',
  //   taille_carres: '',
  //   idUser: ''
  // });
  const [zooms, setZooms] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formPousse, setFormPousse] = useState({
    nbPlants: '',
    idVariete: '',
    datePlantation: new Date().toISOString().split('T')[0]
  });
  const [varietes, setVarietes] = useState([]);
  const [formData, setFormData] = useState({
    nbPlants: 1,
    idVariete: '',
    datePlantation: new Date().toISOString().split('T')[0],
  });
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Si pas d'idParcelle, redirection vers la liste
  useEffect(() => {
    if (!idParcelle) {
      navigate('/parcelles-list');
    } else {
      localStorage.setItem('idParcelle', idParcelle);
    }
  }, [idParcelle, navigate]);

  // Mets à jour idUser dans form quand user chargé
  useEffect(() => {
    if (user?.user_id) {
      // setForm(form => ({ ...form, idUser: user.user_id }));
    }
  }, [user]);

  // Vérification session utilisateur
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

  // Charge variétés
  useEffect(() => {
    fetch("http://localhost:8000/api/varietes")
      .then((res) => res.json())
      .then(setVarietes)
      .catch(console.error);
  }, []);

  // Charge toutes les parcelles
  useEffect(() => {
    fetch('http://localhost:8000/api/parcelles', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
        return res.json();
      })
      .then(setParcelles)
      .catch(console.error);
  }, []);

  // Trouve la parcelle courante selon l'idParcelle
  const parcelleCourante = parcelles.find(p => p.idParcelle.toString() === idParcelle);

  // Trouve la pousse à la cellule sélectionnée
  const getPousseAtSelectedCell = () => {
    const parcelle = parcelles.find(p => p.idParcelle === selectedCell?.parcelleId);
    return parcelle?.pousses.find(pousse => pousse.x === selectedCell.x && pousse.y === selectedCell.y);
  };
  const pousseExistante = getPousseAtSelectedCell();

  // Gestion formulaire ajout pousse
  const handleAddPousse = (e) => {
    e.preventDefault();
    if (!selectedCell) return;

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
      .then(newPousse => {
        // Mise à jour locale des pousses dans la parcelle
        setParcelles(prevParcelles => prevParcelles.map(p => {
          if (p.idParcelle === selectedCell.parcelleId) {
            return {
              ...p,
              pousses: [...p.pousses, newPousse]
            };
          }
          return p;
        }));
        setShowForm(false);
        setSelectedCell(null);
        setFormPousse({ nbPlants: '', idVariete: '', datePlantation: '' });
      })
      .catch(console.error);
  };

  // Suppression pousse
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
        setParcelles(prevParcelles =>
          prevParcelles.map(p =>
            p.idParcelle === parcelleId
              ? {
                  ...p,
                  pousses: p.pousses.filter(pousse => !(pousse.x === x && pousse.y === y)),
                }
              : p
          )
        );
        setSelectedCell(null);
      })
      .catch(console.error);
  };

  // Formulaire ajout parcelle
  // const handleChange = e => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };
  // const handleSubmit = e => {
  //   e.preventDefault();
  //   const dataToSend = { ...form, idUser: user?.user_id };
  //   fetch('http://localhost:8000/api/parcelles', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(dataToSend),
  //     credentials: 'include'
  //   })
  //     .then(res => {
  //       if (!res.ok) throw new Error('Erreur HTTP ' + res.status);
  //       return res.json();
  //     })
  //     .then(newParcelle => {
  //       // Ajoute la nouvelle parcelle localement
  //       setParcelles(prev => [...prev, newParcelle]);
  //     })
  //     .catch(console.error);
  // };

  const handleZoomChange = (idParcelle, value) => {
    setZooms(prev => ({ ...prev, [idParcelle]: parseFloat(value) }));
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Synchroniser aussi formPousse.idVariete si on change idVariete
    if (e.target.name === 'idVariete') {
      setFormPousse(p => ({ ...p, idVariete: e.target.value }));
    }
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
      {/* <h3>Ajouter une parcelle</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: "3rem", display: "flex", gap: "20px", flexWrap: "wrap", flexDirection: "column" }}>
        <input name="libelle" placeholder="Nom" onChange={handleChange} required />
        <input name="longueur" type="number" placeholder="Longueur" onChange={handleChange} required />
        <input name="largeur" type="number" placeholder="Largeur" onChange={handleChange} required />
        <input name="taille_carres" type="number" step="0.1" placeholder="Taille des carrés" onChange={handleChange} required />
        <button type="submit">Ajouter</button>
      </form> */}

      {parcelleCourante ? (
        <div style={{ marginBottom: "5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Zoom: </label>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.01"
              value={zooms[parcelleCourante.idParcelle] || 0.6}
              onChange={(e) => handleZoomChange(parcelleCourante.idParcelle, e.target.value)}
            />
            <span> {Math.round((zooms[parcelleCourante.idParcelle] || 0.6) * 100)}%</span>
          </div>
          <h3>{parcelleCourante.libelle}</h3>
          <div style={{ overflow: "auto", maxWidth: "90vw", minWidth: "60vw", maxHeight: "100vw", minHeight: "10vw" }}>
            <div style={{ transform: `scale(${zooms[parcelleCourante.idParcelle] || 0.6})`, transformOrigin: "left top" }}>
              <table style={{ borderCollapse: "collapse", width: "max-content", height: "max-content" }}>
                <tbody>
                  {[...Array(parcelleCourante.longueur / parcelleCourante.taille_carres)].map((_, row) => (
                    <tr key={row}>
                      {[...Array(parcelleCourante.largeur / parcelleCourante.taille_carres)].map((_, col) => {
                        const pousse = parcelleCourante.pousses.find(pousse => pousse.x === row && pousse.y === col);
                        return (
                          <td
                            key={col}
                            className={`${row}-${col}`}
                            onClick={(e) => {
                              const rect = e.target.getBoundingClientRect();
                              setMenuPosition({
                                top: rect.top + window.scrollY,
                                left: rect.left + window.scrollX + rect.width + 10,
                              });
                              setSelectedCell({ x: row, y: col, parcelleId: parcelleCourante.idParcelle });
                              setShowForm(false);
                            }}
                            style={{
                              border: selectedCell?.x === row && selectedCell?.y === col && selectedCell?.parcelleId === parcelleCourante.idParcelle
                                ? "2px solid #9C2828"
                                : "1px solid black",
                              width: "75px",
                              height: "75px",
                              textAlign: "center",
                              backgroundColor: pousse ? "#198754" : "#543D35"
                            }}
                          >
                            {pousse?.variete?.image && (
                              <div style={{ cursor: "pointer" }}>
                                <div style={{ width: "55px", height: "55px", marginLeft: "auto", marginRight: "auto" }}>
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
                    <option value="">Sélectionnez une variété</option>
                    {varietes.map(v => (
                      <option key={v.idVariete} value={v.idVariete}>{v.libelle}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="datePlantation"
                    value={formPousse.datePlantation}
                    onChange={(e) => setFormPousse({ ...formPousse, datePlantation: e.target.value })}
                    required
                  />
                  <button type="submit">Ajouter</button>
                  <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Parcelle non trouvée.</p>
      )}
    </div>
  );
}

export default Parcelles;
