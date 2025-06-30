export async function CheckUser() {
    try {
        const response = await fetch('http://141.94.71.30:8080/api/profile', {
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
