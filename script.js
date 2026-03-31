const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });
}

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (form && formMessage) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    formMessage.textContent = "Envoi en cours...";

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        formMessage.textContent = "Message envoyé avec succès. Je vous recontacte rapidement.";
        form.reset();
      } else {
        formMessage.textContent = "Une erreur est survenue. Réessayez ou contactez-moi directement.";
      }
    } catch (error) {
      formMessage.textContent = "Impossible d’envoyer le message pour le moment.";
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
}

const counters = document.querySelectorAll(".counter");
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target || 0);
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 50));

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          return;
        }
        counter.textContent = current;
        requestAnimationFrame(updateCounter);
      };

      updateCounter();
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));
}

const newPhonesGrid = document.getElementById("newPhonesGrid");
const usedPhonesGrid = document.getElementById("usedPhonesGrid");
const pcGrid = document.getElementById("pcGrid");
const screenGrid = document.getElementById("screenGrid");
const accessoryGrid = document.getElementById("accessoryGrid");

const modal = document.getElementById("productModal");
const modalOverlay = document.getElementById("productModalOverlay");
const modalClose = document.getElementById("productModalClose");
const modalMainImage = document.getElementById("modalMainImage");
const modalThumbs = document.getElementById("modalThumbs");
const modalBadge = document.getElementById("modalBadge");
const modalStatus = document.getElementById("modalStatus");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalCategory = document.getElementById("modalCategory");
const modalType = document.getElementById("modalType");
const modalGrade = document.getElementById("modalGrade");
const modalYear = document.getElementById("modalYear");
const modalDetails = document.getElementById("modalDetails");
const modalPrice = document.getElementById("modalPrice");
const modalCta = document.getElementById("modalCta");

const newPhoneBrandFilters = document.getElementById("newPhoneBrandFilters");
const usedPhoneBrandFilters = document.getElementById("usedPhoneBrandFilters");
const usedPhoneGradeFilters = document.getElementById("usedPhoneGradeFilters");

let allProducts = [];
let newPhoneBrand = "all";
let usedPhoneBrand = "all";
let usedPhoneGrade = "all";

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(price);
}

function sortRecent(products) {
  return [...products].sort((a, b) => b.annee - a.annee || a.nom.localeCompare(b.nom, "fr"));
}

function getGradeClass(grade) {
  if (grade === "A") return "grade-pill grade-pill-a";
  if (grade === "B") return "grade-pill grade-pill-b";
  if (grade === "C") return "grade-pill grade-pill-c";
  return "";
}

function openProductModal(product) {
  if (!modal) return;

  const images = product.images && product.images.length
    ? product.images
    : ["images/accessoire/placeholder.jpg"];

  modalMainImage.src = images[0];
  modalMainImage.alt = product.nom;

  modalBadge.textContent = product.badge || "Produit";
  modalStatus.textContent = product.etat || "Disponible";
  modalTitle.textContent = product.nom || "Produit";
  modalDescription.textContent = product.longDescription || product.description || "";
  modalCategory.textContent = product.categorie || "";
  modalType.textContent = product.typeProduit || "";
  modalGrade.textContent = product.grade ? `Grade ${product.grade}` : "";
  modalYear.textContent = product.annee ? `Année : ${product.annee}` : "";
  modalPrice.textContent = formatPrice(product.prix || 0);

  modalDetails.innerHTML = (product.details || [])
    .map(detail => `<li>${detail}</li>`)
    .join("");

  modalThumbs.innerHTML = images.map((img, index) => `
    <button class="modal-thumb ${index === 0 ? "active" : ""}" data-image="${img}" type="button">
      <img src="${img}" alt="${product.nom}">
    </button>
  `).join("");

  modalThumbs.querySelectorAll(".modal-thumb").forEach((thumb) => {
    thumb.addEventListener("click", (event) => {
      event.stopPropagation();
      modalMainImage.src = thumb.dataset.image;
      modalThumbs.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });

  modalCta.setAttribute("href", "#contact-produit");
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeProductModal() {
  if (!modal) return;
  modal.classList.remove("open");
  document.body.classList.remove("modal-open");
}

if (modalOverlay) modalOverlay.addEventListener("click", closeProductModal);
if (modalClose) modalClose.addEventListener("click", closeProductModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductModal();
});

function createProductCard(product) {
  const image = product.images && product.images.length
    ? product.images[0]
    : "images/accessoire/placeholder.jpg";

  const gradeHtml = product.grade
    ? `<span class="${getGradeClass(product.grade)}">Grade ${product.grade}</span>`
    : "";

  return `
    <article class="apple-product-card" data-id="${product.id}">
      ${product.bestChoice ? '<span class="best-choice-badge">Meilleur choix</span>' : ''}

      <div class="apple-product-image-wrap">
        <img src="${image}" alt="${product.nom}" class="apple-product-image">
      </div>

      <div class="apple-product-info">
        <div class="apple-product-top">
          <span class="apple-product-category">${product.categorie}</span>
          <span class="apple-product-status">${product.etat}</span>
        </div>

        <h3>${product.nom}</h3>
        <p>${product.description}</p>

        <div class="apple-product-meta">
          <span>${product.annee}</span>
          <span>${product.typeProduit}</span>
        </div>

        ${gradeHtml ? `<div class="product-grade-row">${gradeHtml}</div>` : ""}

        <div class="apple-product-bottom">
          <strong>${formatPrice(product.prix)}</strong>
          <button class="apple-detail-btn" type="button">Voir détails</button>
        </div>
      </div>
    </article>
  `;
}

function attachCardEvents(container) {
  if (!container) return;

  container.querySelectorAll(".apple-product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = Number(card.dataset.id);
      const product = allProducts.find((item) => item.id === id);
      if (product) openProductModal(product);
    });
  });

  container.querySelectorAll(".apple-detail-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = button.closest(".apple-product-card");
      if (!card) return;
      const id = Number(card.dataset.id);
      const product = allProducts.find((item) => item.id === id);
      if (product) openProductModal(product);
    });
  });
}

function renderIntoGrid(container, products) {
  if (!container) return;

  if (!products.length) {
    container.innerHTML = '<div class="empty-products">Aucun produit disponible dans cette section pour le moment.</div>';
    return;
  }

  container.innerHTML = products.map(createProductCard).join("");
  attachCardEvents(container);
}

function updateNewPhones() {
  let products = allProducts.filter(
    (product) => product.famille === "telephone" && product.typeProduit === "neuf"
  );

  if (newPhoneBrand !== "all") {
    products = products.filter((product) => product.categorie === newPhoneBrand);
  }

  renderIntoGrid(newPhonesGrid, sortRecent(products));
}

function updateUsedPhones() {
  let products = allProducts.filter(
    (product) => product.famille === "telephone" && product.typeProduit === "occasion"
  );

  if (usedPhoneBrand !== "all") {
    products = products.filter((product) => product.categorie === usedPhoneBrand);
  }

  if (usedPhoneGrade !== "all") {
    products = products.filter((product) => product.grade === usedPhoneGrade);
  }

  renderIntoGrid(usedPhonesGrid, sortRecent(products));
}

function updateOtherSections() {
  renderIntoGrid(
    pcGrid,
    sortRecent(allProducts.filter((product) => product.famille === "pc"))
  );

  renderIntoGrid(
    screenGrid,
    sortRecent(allProducts.filter((product) => product.famille === "ecran"))
  );

  renderIntoGrid(
    accessoryGrid,
    sortRecent(allProducts.filter((product) => product.famille === "accessoire"))
  );
}

function activateChip(group, button) {
  group.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");
}

if (newPhoneBrandFilters) {
  newPhoneBrandFilters.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      newPhoneBrand = button.dataset.filter;
      activateChip(newPhoneBrandFilters, button);
      updateNewPhones();
    });
  });
}

if (usedPhoneBrandFilters) {
  usedPhoneBrandFilters.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      usedPhoneBrand = button.dataset.filter;
      activateChip(usedPhoneBrandFilters, button);
      updateUsedPhones();
    });
  });
}

if (usedPhoneGradeFilters) {
  usedPhoneGradeFilters.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      usedPhoneGrade = button.dataset.grade;
      activateChip(usedPhoneGradeFilters, button);
      updateUsedPhones();
    });
  });
}

async function initProductsCatalog() {
  const hasProductsPage = newPhonesGrid || usedPhonesGrid || pcGrid || screenGrid || accessoryGrid;
  if (!hasProductsPage) return;

  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    updateNewPhones();
    updateUsedPhones();
    updateOtherSections();
  } catch (error) {
    if (newPhonesGrid) newPhonesGrid.innerHTML = '<div class="empty-products">Impossible de charger le catalogue.</div>';
    if (usedPhonesGrid) usedPhonesGrid.innerHTML = '<div class="empty-products">Impossible de charger le catalogue.</div>';
    if (pcGrid) pcGrid.innerHTML = '<div class="empty-products">Impossible de charger le catalogue.</div>';
    if (screenGrid) screenGrid.innerHTML = '<div class="empty-products">Impossible de charger le catalogue.</div>';
    if (accessoryGrid) accessoryGrid.innerHTML = '<div class="empty-products">Impossible de charger le catalogue.</div>';
  }
}

initProductsCatalog();