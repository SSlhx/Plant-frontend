export async function logoutUser() {
    try {
        const response = await fetch('http://localhost:8000/logout', {
            method: 'GET',
            credentials: 'include', 
        });

        if (!response.ok) {
            console.error("Erreur de logout", await response.text());
        }
    } catch (error) {
        console.error("Erreur de déconnexion :", error);
    }
}
