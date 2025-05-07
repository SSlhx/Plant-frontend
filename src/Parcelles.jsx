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

  return (
    <div>
      <h2>Parcelles</h2>
      <ul>
        {parcelles.map(p => (
          <table key={p.idParcelle} style={{ borderCollapse: "collapse" }}>
            <caption>{p.libelle}</caption>
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
                          width: "30px",
                          height: "30px",
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
        ))}
      </ul>
  
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
