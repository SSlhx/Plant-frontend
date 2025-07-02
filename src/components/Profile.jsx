import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from '../utils/session';
import { logoutUser } from '../utils/logout';

function Profile() {
    const Base_URL = import.meta.env.VITE_URL_API;

    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ nom: '', email: '', login: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSession() {
            const sessionUser = await CheckUser();
            if (!sessionUser) {
                alert('Session invalide ou expirée');
                navigate('/connexion');
            } else {
                setUser(sessionUser);
                setFormData(sessionUser);
            }
        }

        fetchSession();
    }, [navigate]);

    const handleLogout = async () => {
        await logoutUser();
        navigate('/connexion');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await fetch(Base_URL + '/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Erreur inconnue');
            }

            setUser((prev) => ({ ...prev, ...formData }));
            setEditMode(false);
            setSuccess(result.message || 'Modifications enregistrées.');
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) return <p>Non connecté</p>;

    return (
        <div className="container my-4 profile">
            <h1 className="mb-3">Mon Compte</h1>
            <div className='contenu'>
                <h3>Informations Personnelles :</h3>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {!editMode ? (
                    <>
                        <p><strong>Nom :</strong> {user.nom}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Login :</strong> {user.login}</p>
                        <button className="bouton-vert" onClick={() => setEditMode(true)}>Modifier</button>
                        <button className="bouton-rouge ms-2" onClick={handleLogout}>Se déconnecter</button>
                    </>
                ) : (
                    <form id="modif-compte" onSubmit={handleSubmit}>
                        <label for="nom"><strong>Nom :</strong><input id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" /></label>
                        <label for="email"><strong>Email :</strong><input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" /></label>
                        <label for="login"><strong>Login :</strong><input id="login" name="login" value={formData.login} onChange={handleChange} placeholder="Login" /></label>
                        <div>
                            <button className="bouton-vert" type="submit">Enregistrer</button>
                            <button className="bouton-rouge ms-2" type="button" onClick={() => setEditMode(false)}>Annuler</button>
                        </div>
                    </form>
                )}
                <div className="mdp-info">Pour changer votre mot de passe, merci de contacter un administrateur.</div>
            </div>
        </div>
    );

}

export default Profile;
