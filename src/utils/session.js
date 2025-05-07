export async function CheckUser() {
    try {
        const response = await fetch('http://localhost:8000/api/profile', {
            method: 'GET',
            credentials: 'include',  
        });

        if (!response.ok) {
            return null; 
        }

        const data = await response.json();
        return data;  
    } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        return null;
    }
}
