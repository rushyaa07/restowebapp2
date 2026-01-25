// ================= RENDER MENU =================
// Safe, error-proof menu renderer

export function renderMenu(items, container) {
    if (!container) {
        console.error("Menu container not found");
        return;
    }

    container.innerHTML = "";

    // Empty state
    if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No items found 😕</p>
            </div>
        `;
        return;
    }

    items.forEach((item, index) => {
        try {
            // 🔒 SAFETY CHECKS
            const name = item?.name ?? "Item";
            const description = item?.description ?? "";
            const image = item?.image ?? "";
            const price = Number(item?.price);

            if (!image || isNaN(price)) {
                console.warn(`Skipped item at index ${index}`, item);
                return; // skip broken item
            }

            const card = document.createElement("article");
            card.className = "menu-card";

            card.innerHTML = `
                <div class="menu-image-wrapper">
                    <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.style.display='none'"
                    >
                </div>

                <div class="menu-info">
                    <div class="menu-header">
                        <h3>${name}</h3>
                        <span class="price">₹${price.toFixed(0)}</span>
                    </div>

                    <p class="menu-description">
                        ${description}
                    </p>

                    <button
                        class="btn primary btn-sm add-to-order"
                        data-name="${name}"
                        data-price="${price}"
                    >
                        <i class="fas fa-plus"></i> Add to Order
                    </button>
                </div>
            `;

            container.appendChild(card);

        } catch (err) {
            console.error("Failed to render menu item:", item, err);
        }
    });
}