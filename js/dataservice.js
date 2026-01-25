// ================= MENU DATA SERVICE =================
// Fetches menu data from local JSON file
// Handles network + parsing errors safely

export async function fetchMenuData() {
    try {
        const response = await fetch("/data/menu.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure valid array
        if (!Array.isArray(data)) {
            throw new Error("Menu data is not an array");
        }

        return data;

    } catch (error) {
        console.error("Menu fetch error:", error);
        return [];
    }
}
