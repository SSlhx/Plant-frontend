import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm()
{
    const [nom, setNom] = useState('');
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e)=> {
        e.preventDefault();

        try
        {
            const res = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                credentials: 'include',
                body: JSON.stringify({nom, login, email, password}),
            });

            if(!res)
            {
                const data = await res.json();
                throw new Error(data.message || 'Erreur de connexion');
            }
            const data = await res.json();
            alert("Connexion réussie ! Voici les données envoyé :\n\n" + JSON.stringify(data, null, 2));  
            navigate('/login');      
        }catch (err) {
            setError(err.message);
          }
    };
    return(
        <form onSubmit={handleSubmit}>
            <h2>
                Inscription
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input type="input" value={nom} onChange={e => setNom(e.target.value)} placeholder='Nom' required />
            </div>
            <div>
                <input type="mail" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
            </div>
            <div>
                <input type="input" value={login} onChange={e => setLogin(e.target.value)} placeholder='Login' required />
            </div>
            <div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Passeword' required />
            </div>
            <button type="submit">S'inscrire</button>
        </form>
    );
}
export default RegisterForm;
