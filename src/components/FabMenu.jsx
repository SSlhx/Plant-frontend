import React, { useState } from 'react';
import './FabMenu.css';

import FormCategorie from './FormCategorie';
import FormPlante from './FormPlante';
import FormVariete from './FormVariete';
import FormParcelle from './FormParcelle';

export default function FabMenu() {
  const [open, setOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const toggleMenu = () => setOpen(!open);

  const openForm = (formName) => {
    setActiveForm(formName);
    setOpen(false);
  };

  const closeForm = () => setActiveForm(null);

  return (
    <>
      {open && <div className="fab-overlay" onClick={toggleMenu}></div>}
      <div className="fab-container">
        <div className={`fab-actions ${open ? 'open' : 'closed'}`}>
          <button className="fab-action" onClick={() => openForm('categorie')}>Ajouter une catégorie</button>
          <button className="fab-action" onClick={() => openForm('plante')}>Ajouter une plante</button>
          <button className="fab-action" onClick={() => openForm('variete')}>Ajouter une variété</button>
          <button className="fab-action" onClick={() => openForm('parcelles')}>Ajouter une parcelle</button>          
        </div>

        <button
          className={`fab-main ${open ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <span className="fab-icon">{open ? '×' : '+'}</span>
        </button>
      </div>

      {/* Popup modal */}
      {activeForm && (
        <div className="popup-overlay" onClick={closeForm}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeForm}>×</button>
            {activeForm === 'categorie' && <FormCategorie onClose={closeForm} />}
            {activeForm === 'plante' && <FormPlante onClose={closeForm} />}
            {activeForm === 'variete' && <FormVariete onClose={closeForm} />}
            {activeForm === 'parcelles' && <FormParcelle onClose={closeForm} />}
          </div>
        </div>
      )}
    </>
  );
}
