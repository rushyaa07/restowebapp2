import { fetchMenuData } from "./dataservice.js";
import { renderMenu } from "./rendermenu.js";

/* ================= GLOBAL STATE ================= */
let menuItems = [];
let activeCategory = "all";
let basePrice = 0;

/* ================= MOBILE SAFETY ================= */
if (window.innerWidth <= 768) {
  document.querySelectorAll(".reveal").forEach(el => {
    el.classList.add("reveal-active");
  });
}

/* ================= DOM REFERENCES ================= */
const menuContainer = document.getElementById("menu-items-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const mobileToggle = document.querySelector(".mobile-nav-toggle");
const navList = document.querySelector(".nav-list");
const searchInput = document.getElementById("menu-search-input");

// Book table modal
const bookTableBtn = document.querySelector(".btn.primary");
const bookTableModal = document.getElementById("bookTableModal");
const closeBookTable = document.getElementById("closeBookTableModal");

// Order modal
const orderModal =
  document.getElementById("order-modal") ||
  document.getElementById("OrderModal");

const closeOrderModal = document.getElementById("closeOrderModal");

const orderItemName =
  document.getElementById("order-item-name") ||
  document.getElementById("orderItemName");

const orderItemPrice =
  document.getElementById("order-item-price") ||
  document.getElementById("orderPrice");

// Quantity
const qtyInput =
  document.getElementById("quantity-input") ||
  document.getElementById("quantity");

const qtyIncrease =
  document.getElementById("quantity-increase") ||
  document.getElementById("increaseQuantity");

const qtyDecrease =
  document.getElementById("quantity-decrease") ||
  document.getElementById("decreaseQuantity");

/* ================= MOBILE NAV ================= */
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

/* ================= INIT ================= */
async function init() {
  try {
    if (!menuContainer) {
      console.error("❌ menu-items-container not found in HTML");
      return;
    }

    menuItems = await fetchMenuData();
    console.log("✅ Menu Loaded:", menuItems);

    if (menuItems.length > 0) {
      renderMenu(menuItems, menuContainer);
      animateCards();
    } else {
      console.warn("⚠️ Menu data is empty");
    }
  } catch (error) {
    console.error("❌ Failed to load menu:", error);
  }
}



/* ================= FILTER LOGIC ================= */
function applyFilters() {
  if (!searchInput || !menuContainer) return;

  const searchTerm = searchInput.value.toLowerCase();

  const filteredItems = menuItems.filter(item => {
    const matchesCategory =
      activeCategory === "all" ||
      item.category.toLowerCase() === activeCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  renderMenu(filteredItems, menuContainer);
  animateCards();
}

/* ================= CATEGORY BUTTONS ================= */
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeCategory = btn.dataset.category.toLowerCase();
    applyFilters();
  });
});

/* ================= SEARCH ================= */
if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

/* ================= CARD ANIMATION ================= */
function animateCards() {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach((card, index) => {
    card.classList.remove("fade-in");
    setTimeout(() => card.classList.add("fade-in"), index * 80);
  });
}

/* ================= SMOOTH SCROLL ================= */
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    window.scrollTo({
      top: target.offsetTop - 90,
      behavior: "smooth"
    });

    if (navList) navList.classList.remove("active");
  });
});

/* ================= BOOK TABLE MODAL ================= */
if (bookTableBtn && bookTableModal) {
  bookTableBtn.addEventListener("click", e => {
    e.preventDefault();
    bookTableModal.classList.add("active");
  });
}

if (closeBookTable && bookTableModal) {
  closeBookTable.addEventListener("click", () => {
    bookTableModal.classList.remove("active");
  });
}

window.addEventListener("click", e => {
  if (e.target === bookTableModal) {
    bookTableModal.classList.remove("active");
  }
});

/* ================= ORDER MODAL ================= */
document.addEventListener("click", e => {
  const btn = e.target.closest(".add-to-order");
  if (!btn || !orderModal) return;

  basePrice = Number(btn.dataset.price);

  orderItemName.textContent = btn.dataset.name;
  orderItemPrice.textContent = `₹${basePrice}`;
  qtyInput.value = 1;

  orderModal.classList.add("active");
});

if (closeOrderModal && orderModal) {
  closeOrderModal.addEventListener("click", () => {
    orderModal.classList.remove("active");
  });
}

window.addEventListener("click", e => {
  if (e.target === orderModal) {
    orderModal.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const designermoddal = document.getElementById("designerModal");
  const hasSeenDesignerIntro = localStorage.getItem("DesignerIntroseen");

  if (!hasSeenDesignerIntro && designermoddal) {
    designermoddal.classList.add("active");
    localStorage.setItem("DesignerIntroseen", "true");
  }

  init(); // safe to call here

});

/* ================= QUANTITY CONTROLS ================= */
if (qtyIncrease && qtyInput) {
  qtyIncrease.addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value) + 1;
    orderItemPrice.textContent = `₹${basePrice * qtyInput.value}`;
  });
}

if (qtyDecrease && qtyInput) {
  qtyDecrease.addEventListener("click", () => {
    if (qtyInput.value > 1) {
      qtyInput.value = Number(qtyInput.value) - 1;
      orderItemPrice.textContent = `₹${basePrice * qtyInput.value}`;
    }
  });
}
const ownerModal = document.getElementById("ownerModal");
const closeOwnerModal = document.getElementById("closeOwnerModal");

if (ownerModal && closeOwnerModal) {
  closeOwnerModal.addEventListener("click", () => {
    ownerModal.classList.remove("active");
  });

  window.addEventListener("click", (e) => {
    if (e.target === ownerModal) {
      ownerModal.classList.remove("active");
    }
  });
}

// ================= DESIGNER MODAL =================
/* ================= INTRO MODAL ================= */
function initIntroModal() {
  const introModal = document.getElementById("introModal");
  const closeBtn = document.getElementById("closeIntro");
  const startBtn = document.getElementById("introGetStarted");

  if (!introModal) return;

  const seen = sessionStorage.getItem("introShown");

  if (!seen) {
    setTimeout(() => {
      introModal.classList.add("show");
      document.body.style.overflow = "hidden";
    }, 400);
  }

  function closeIntro() {
    introModal.classList.remove("show");
    document.body.style.overflow = "";
    sessionStorage.setItem("introShown", "true");
  }

  closeBtn?.addEventListener("click", closeIntro);
  startBtn?.addEventListener("click", closeIntro);

  introModal.addEventListener("click", e => {
    if (e.target === introModal) closeIntro();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeIntro();
  });
}

/* CALL IT ON LOAD */
document.addEventListener("DOMContentLoaded", () => {
  initIntroModal();
});

/* ================= SCROLL REVEAL ================= */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach(el => {
  revealObserver.observe(el);
});

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", init);