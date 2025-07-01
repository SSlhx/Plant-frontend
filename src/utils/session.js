export async function CheckUser() {
    const Base_URL = import.meta.env.VITE_URL_API;
    try {
        const response = await fetch(`${Base_URL}/api/profile`, {
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
