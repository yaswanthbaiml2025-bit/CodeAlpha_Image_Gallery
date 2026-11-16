const cards = [...document.querySelectorAll(".photo-card")];
const filters = [...document.querySelectorAll(".filter-btn")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let visibleCards = cards;
let currentIndex = 0;

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.filter;
    cards.forEach(card => card.classList.toggle("hidden",
      category !== "all" && card.dataset.category !== category));
    visibleCards = cards.filter(card => !card.classList.contains("hidden"));
  });
});

function showImage(index) {
  if (!visibleCards.length) return;
  currentIndex = (index + visibleCards.length) % visibleCards.length;
  const card = visibleCards[currentIndex];
  const image = card.querySelector("img");
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = card.dataset.title;
}
function openLightbox(card) {
  visibleCards = cards.filter(item => !item.classList.contains("hidden"));
  currentIndex = visibleCards.indexOf(card);
  showImage(currentIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
cards.forEach(card => card.addEventListener("click", () => openLightbox(card)));
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevImage").addEventListener("click", () => showImage(currentIndex - 1));
document.getElementById("nextImage").addEventListener("click", () => showImage(currentIndex + 1));
lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(currentIndex - 1);
  if (event.key === "ArrowRight") showImage(currentIndex + 1);
});
