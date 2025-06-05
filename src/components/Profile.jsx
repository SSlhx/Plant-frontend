import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from '../utils/session';
import { logoutUser } from '../utils/logout';

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

    const handleLogout = async () => {
        await logoutUser();  
        navigate('/login');  
    };

    if (!user) {
        return <p>Non connecté</p>;
        
    }

    return (
        <div>
            <h1>Bienvenue, {user.nom}</h1>
            <p>Email : {user.email}</p>
            <p>Login : {user.login}</p>
            <p>Nom : {user.nom}</p>
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
}

export default Profile;
