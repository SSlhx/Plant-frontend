import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckUser } from './utils/session';
import { Link } from 'react-router-dom';


function Parcelles() {
  const Base_URL = import.meta.env.VITE_URL_API;

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [nouveauNom, setNouveauNom] = useState('');
  

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
  useEffect(() => {
        async function fetchSession() {
            const sessionUser = await CheckUser();
            if (!sessionUser) {
                alert('Session invalide ou expirée');
                navigate('/connexion');  
            } else {
                setUser(sessionUser);  
            }
        }
    
        fetchSession();
    }, [navigate]);

  useEffect(() => {
    fetch(`${Base_URL}/api/varietes`)
      .then((res) => res.json())
      .then(setVarietes)
      .catch(console.error);
  }, [Base_URL]);

  // Charge toutes les parcelles
  useEffect(() => {
    fetch(`${Base_URL}/api/parcelles`, {
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
  }, [Base_URL]);

  // Trouve la parcelle courante selon l'idParcelle
  const parcelleCourante = parcelles.find(p => p.idParcelle.toString() === idParcelle);

  useEffect(() => {
    if (parcelleCourante) {
      setNouveauNom(parcelleCourante.libelle);
    }
  }, [parcelleCourante]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${Base_URL}/api/parcelles/${parcelleCourante.idParcelle}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ libelle: nouveauNom }),
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Échec de la mise à jour');
        return res.json();
      })
      .then(() => {
        // Mise à jour locale
        setParcelles(prev =>
          prev.map(p =>
            p.idParcelle === parcelleCourante.idParcelle
              ? { ...p, libelle: nouveauNom }
              : p
          )
        );
        setEditMode(false);
      })
      .catch(console.error);
  };

  // const handleChange = e => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   fetch('http://141.94.71.30:8080/api/parcelles', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(form)
  //   })
  //     .then(res => res.json())
  //     .then(() => window.location.reload())
  //     .catch(console.error);
  // };
  // const handleSubmit = e => {
  //   e.preventDefault();

  //   // Crée les données à envoyer en ajoutant user.user_id
  //   const dataToSend = { ...form, idUser: user?.user_id };

  //   fetch(`${Base_URL}/api/parcelles`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(dataToSend),
  //   credentials: 'include'  // <-- ajoute cette ligne pour envoyer les cookies de session
  // })
  // .then(res => {
  //   if (!res.ok) {
  //     throw new Error('Erreur HTTP ' + res.status);
  //   }
  //   return res.json();
  // })
  // .then(() => window.location.reload())
  // .catch(console.error);

  // };

  // const handleZoomChange = (idParcelle, value) => {
  //   setZooms(prev => ({ ...prev, [idParcelle]: parseFloat(value) }));
  // };
  
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

    fetch(`${Base_URL}/api/pousses`, {
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
      .then(() => window.location.reload())
      .catch(console.error);
  };

  // Suppression pousse
  const handleDeletePousse = () => {
    if (!selectedCell) return;

    const { x, y, parcelleId } = selectedCell;
    const url = `${Base_URL}/api/pousses/${x}/${y}/${parcelleId}`;

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
    <div className="container my-4 page">
      {/* <h2>Parcelles</h2> */}
      {/* <h3>Ajouter une parcelle</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: "3rem", display: "flex", gap: "20px", flexWrap: "wrap", flexDirection: "column" }}>
        <input name="libelle" placeholder="Nom" onChange={handleChange} required />
        <input name="longueur" type="number" placeholder="Longueur" onChange={handleChange} required />
        <input name="largeur" type="number" placeholder="Largeur" onChange={handleChange} required />
        <input name="taille_carres" type="number" step="0.1" placeholder="Taille des carrés" onChange={handleChange} required />
        <button type="submit">Ajouter</button>
      </form> */}

      {parcelleCourante ? (
        <div>
          <a className="bouton-retour" href="/">RETOUR</a>
          <div class="titre-parcelle mt-4">
            <div className="entete">
              <h1>{parcelleCourante.libelle}</h1>
              <button className="bouton-edit bouton-vert" onClick={() => setEditMode(true)}><svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="#ffffff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
            </div>
            { editMode ? (
              <form id="modif-parcelle" onSubmit={handleSubmit}>
                  <label for="titre"><strong>Changer le nom de la parcelle pour :</strong><input id="titre" name="titre" value={nouveauNom} onChange={(e) => setNouveauNom(e.target.value)} placeholder="Titre de la parcelle" /></label>
                  <div>
                      <button className="bouton-vert" type="submit">Enregistrer</button>
                      <button className="bouton-rouge ms-2" type="button" onClick={() => setEditMode(false)}>Annuler</button>
                  </div>
              </form>
            ): (
              <div></div>
            )}
          </div>
          <div className="card-single-parcelle mt-3">
            <div>
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
            <div style={{ overflow: "auto", maxWidth: "90vw", minWidth: "60vw", maxHeight: "100vw", minHeight: "50vw" }}>
              <div style={{ transform: `scale(${zooms[parcelleCourante.idParcelle] || 0.6})`, transformOrigin: "left top" }}>
                <table style={{ borderCollapse: "collapse", width: "max-content", height: "max-content" }}>
                  <tbody>
                    {[...Array(parcelleCourante.longueur / parcelleCourante.taille_carres)].map((_, row) => (
                      <tr key={row}>
                        {[...Array(parcelleCourante.largeur / parcelleCourante.taille_carres)].map((_, col) => {
                          const pousse = parcelleCourante.pousses.find(pousse => pousse.x === row && pousse.y === col);
                          const idVariete = pousse?.variete?.idVariete;

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
                                setSelectedCell({ x: row, y: col, parcelleId: parcelleCourante.idParcelle, idVariete});
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
          </div>
          {selectedCell && (
            <div className="modal-parcelle" style={{
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
                     <Link to={`/variete/${selectedCell.idVariete}`} disabled={!pousseExistante}>
                    <button className="bouton-vert" disabled={!pousseExistante}>
                      Info Plante
                    </button>
                  </Link>
                    </div>
                    
                  )}

                  <button className="bouton-vert" onClick={() => setShowForm(true)} disabled={!!pousseExistante}>
                    Ajouter une pousse
                  </button>
                  <button className="bouton-vert" onClick={handleDeletePousse} disabled={!pousseExistante}>
                    Supprimer la pousse
                  </button>
                  <button className="bouton-rouge" onClick={() => setSelectedCell(null)}>
                    Fermer
                  </button>
                </>
              ) : (
                <form onSubmit={handleAddPousse}>
                  <h4>Ajouter une pousse</h4>
                  <input
                    type="number"
                    placeholder="Nb de plants"
                    min="1"
                    value={formPousse.nbPlants}
                    onChange={(e) => setFormPousse({ ...formPousse, nbPlants: e.target.value })}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
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
