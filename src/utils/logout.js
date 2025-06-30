export async function logoutUser() {
    try {
        const response = await fetch('http://141.94.71.30:8080/logout', {
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
