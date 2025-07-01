export async function logoutUser() {
    const Base_URL = import.meta.env.VITE_URL_SITE;
    try {
        const response = await fetch(`${Base_URL}/logout`, {
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
