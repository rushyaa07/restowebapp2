import { fetchMenuData } from "./dataservice.js";
import { renderMenu } from "./rendermenu.js";

// ================= GLOBAL STATE =================
let menuItems = [];
let activeCategory = "all";
let basePrice = 0; // ✅ added for live price calculation

// ================= DOM REFERENCES =================
const menuContainer = document.getElementById("menu-items-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const mobileToggle = document.querySelector(".mobile-nav-toggle");
const navList = document.querySelector(".nav-list");
const searchInput = document.getElementById("menu-search-input");

// book table modal elements
const bookTableBtn = document.querySelector(".btn.primary");
const bookTablemodal = document.getElementById("bookTableModal");
const closeBookTable = document.getElementById("closeBookTableModal");

// order modal elements
const orderModal =
    document.getElementById("order-modal") ||
    document.getElementById("OrderModal");

const closeOrderModal = document.getElementById("closeOrderModal");
const orderItemName =
    document.getElementById("order-item-name") ||
    document.getElementById("orderItemName");

const orderitemprice =
    document.getElementById("order-item-price") ||
    document.getElementById("orderPrice");

// Quantity controls
const qtyinput =
    document.getElementById("quantity-input") ||
    document.getElementById("quantity");

const qtyincrease =
    document.getElementById("quantity-increase") ||
    document.getElementById("increaseQuantity");

const qtydecrease =
    document.getElementById("quantity-decrease") ||
    document.getElementById("decreaseQuantity");

// ================= MOBILE NAV =================
if (mobileToggle && navList) {
    mobileToggle.addEventListener("click", () => {
        navList.classList.toggle("active");

        const icon = mobileToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-times");
        }
    });
}

// ================= INIT =================
async function init() {
    try {
        menuItems = await fetchMenuData();

        if (menuItems.length && menuContainer) {
            renderMenu(menuItems, menuContainer);
            animateCards();
        }
    } catch (error) {
        console.error("Failed to load menu:", error);
    }
}

// ================= FILTER LOGIC =================
function applyFilters() {
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();

    const filteredItems = menuItems.filter(item => {
        let matchesCategory = false;

        if (activeCategory === "coffee-shop") {
            matchesCategory = item.category.toLowerCase() === "coffee-shop";
        } else {
            matchesCategory =
                activeCategory === "all" ||
                item.category.toLowerCase() === activeCategory;
        }

        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    renderMenu(filteredItems, menuContainer);
    animateCards();
}

// ================= CATEGORY BUTTONS =================
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        activeCategory = btn.dataset.category.toLowerCase();
        applyFilters();
    });
});

// ================= SEARCH =================
if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
}

// ================= ANIMATION =================
function animateCards() {
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach((card, index) => {
        card.classList.remove("fade-in");

        setTimeout(() => {
            card.classList.add("fade-in");
        }, index * 100);
    });
}

// ================= SMOOTH SCROLL =================
document.querySelectorAll(".nav-link").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
        });

        if (navList) navList.classList.remove("active");
    });
});

/* =========================================================
   BOOK TABLE MODAL HANDLERS
   ========================================================= */
if (bookTableBtn && bookTablemodal) {
    bookTableBtn.addEventListener("click", (e) => {
        e.preventDefault();
        bookTablemodal.style.display = "flex";
    });
}

if (closeBookTable && bookTablemodal) {
    closeBookTable.addEventListener("click", () => {
        bookTablemodal.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === bookTablemodal) {
        bookTablemodal.style.display = "none";
    }
});

/* =========================================================
   ORDER MODAL HANDLERS
   ========================================================= */
if (closeOrderModal && orderModal) {
    closeOrderModal.addEventListener("click", () => {
        orderModal.style.display = "none";
    });
}

// increase quantity price auto update
if (qtyincrease && qtyinput) {
    qtyincrease.addEventListener("click", () => {
        qtyinput.value = Number(qtyinput.value) + 1;

        const total = basePrice * Number(qtyinput.value);
        orderitemprice.textContent = `₹${total}`;
    });
}

// decrease quantity price auto update
if (qtydecrease && qtyinput) {
    qtydecrease.addEventListener("click", () => {
        if (qtyinput.value > 1) {
            qtyinput.value = Number(qtyinput.value) - 1;

            const total = basePrice * Number(qtyinput.value);
            orderitemprice.textContent = `₹${total}`;
        }
    });
}

// OPEN ORDER MODAL
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-order");
    if (!btn || !orderModal) return;

    basePrice = Number(btn.dataset.price); // ✅ base price stored

    orderItemName.textContent = btn.dataset.name;
    orderitemprice.textContent = `₹${basePrice}`;

    qtyinput.value = 1;
    orderModal.style.display = "flex";
});

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", init);
