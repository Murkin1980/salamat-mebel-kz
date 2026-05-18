/* Salamat Mebel — script.js v2 */

// ── Header scroll state ──
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav a");

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

// ── Mobile menu ──
menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (header.classList.contains("menu-open") && !header.contains(e.target)) {
    header.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// ── Hero image subtle zoom on load ──
const heroImg = document.querySelector(".hero-media img");
if (heroImg) {
  heroImg.addEventListener("load", () => heroImg.classList.add("loaded"));
  if (heroImg.complete) heroImg.classList.add("loaded");
}

// ── Scroll reveal animations ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Counter animation for hero stats ──
function animateCounter(el, target) {
  let start = 0;
  const duration = 1600;
  const startTime = performance.now();
  const originalText = el.textContent;
  const suffix = originalText.replace(/[0-9]/g, "");
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const dt = entry.target.querySelector("dt");
        const val = parseInt(dt.textContent);
        if (!isNaN(val)) animateCounter(dt, val);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".hero-stats div").forEach((div) =>
  statsObserver.observe(div)
);

// ── Portfolio Lightbox ──
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".work-grid img").forEach((img) => {
  img.setAttribute("role", "button");
  img.setAttribute("tabindex", "0");
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
  img.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openLightbox(img.src, img.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});