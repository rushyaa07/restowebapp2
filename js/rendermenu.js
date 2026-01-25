// ================= RENDER MENU =================
// Dynamically creates and displays menu cards
// Accepts menu data and target container as parameters

export function renderMenu(items, container) {
    if (!container) return;

    // Clear existing menu items
    container.innerHTML = "";

    // Empty state
    if (!items || !items.length) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No items found 😕</p>
            </div>
        `;
        return;
    }

    // Render each menu item
    items.forEach(item => {
        const card = document.createElement("article");
        card.className = "menu-card";

        card.innerHTML = `
            <div class="menu-image-wrapper">
                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    loading="lazy"
                >
            </div>

            <div class="menu-info">
                <div class="menu-header">
                    <h3>${item.name}</h3>
                    <span class="price">₹${Number(item.price).toFixed(0)}</span>
                </div>

                <p class="menu-description">
                    ${item.description}
                </p>

                <button 
                    class="btn primary btn-sm w-100 order-btn add-to-order"
                    data-id="${item.id}"
                    data-name="${item.name}"
                    data-price="${item.price}"
                >
                    <i class="fas fa-plus"></i> Add to Order
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}
