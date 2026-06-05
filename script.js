const setupData = {
  garage: {
    kicker: "Personal hitting lab",
    title: "Garage setup",
    body: "Transform a garage into a hitting lab with a tee, net or impact screen, and the R10 set 6 feet behind the batter.",
    monitor: "6 feet behind batter",
    flight: "8+ feet before net or screen",
    addon: "Projector and impact screen",
    image: "assets/garage-swing.jpeg",
    alt: "Garage hitting setup with projector and tee",
    required: ["Garmin Approach R10", "Height adjustable tripod", "Batting tee", "Net or impact screen"],
    optional: ["Projector", "Impact screen"],
    link: "https://dropnlaunch.com/garage-setup"
  },
  cage: {
    kicker: "Team training facility",
    title: "Batting cage setup",
    body: "Turn a batting cage into a high-tech hitting facility. Cage netting does not interfere with radar tracking, and players can see data live on a TV, monitor, or projector.",
    monitor: "6 feet behind hitter",
    flight: "Cage or net is fine",
    addon: "TV, monitor, or projector",
    image: "assets/cage-setup.jpeg",
    alt: "Batting cage swing analysis with Drop N Launch metrics overlay",
    required: ["Garmin Approach R10", "Height adjustable tripod"],
    optional: ["Batting tee", "TV, monitor, or projector"],
    link: "https://dropnlaunch.com/batting-cage-setup"
  },
  field: {
    kicker: "Live BP feedback",
    title: "On field setup",
    body: "Use Drop N Launch on the field with a coach or teammate throwing traditional batting practice. The app captures exit velocity, launch angle, and carry distance after every swing.",
    monitor: "6 feet behind home plate",
    flight: "Open field ball flight",
    addon: "Batting tee for warmup",
    image: "assets/founder-field.jpeg",
    alt: "Baseball field setup for live batting practice",
    required: ["Garmin Approach R10", "Height adjustable tripod"],
    optional: ["Batting tee"],
    link: "https://dropnlaunch.com/field-setup"
  }
};

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector("[data-header]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 32);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  });
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

function renderList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function updateSetup(key) {
  const data = setupData[key];
  if (!data) return;

  document.querySelector("[data-setup-kicker]").textContent = data.kicker;
  document.querySelector("[data-setup-title]").textContent = data.title;
  document.querySelector("[data-setup-body]").textContent = data.body;
  document.querySelector("[data-setup-monitor]").textContent = data.monitor;
  document.querySelector("[data-setup-flight]").textContent = data.flight;
  document.querySelector("[data-setup-addon]").textContent = data.addon;

  const image = document.querySelector("[data-setup-image]");
  image.src = data.image;
  image.alt = data.alt;

  const link = document.querySelector("[data-setup-link]");
  link.href = data.link;

  renderList(document.querySelector("[data-setup-required]"), data.required);
  renderList(document.querySelector("[data-setup-optional]"), data.optional);

  document.querySelectorAll("[data-setup]").forEach((button) => {
    const isActive = button.dataset.setup === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

document.querySelectorAll("[data-setup]").forEach((button) => {
  button.addEventListener("click", () => updateSetup(button.dataset.setup));
});

const performanceCards = document.querySelectorAll(".performance-card");
const performanceMediaQuery = window.matchMedia("(max-width: 680px)");

function syncPerformanceCards() {
  const isMobile = performanceMediaQuery.matches;
  performanceCards.forEach((card) => {
    card.open = !isMobile;
  });
}

performanceCards.forEach((card) => {
  card.addEventListener("toggle", () => {
    if (!performanceMediaQuery.matches || !card.open) return;

    performanceCards.forEach((otherCard) => {
      if (otherCard !== card) otherCard.open = false;
    });
  });
});

window.addEventListener("resize", syncPerformanceCards, { passive: true });
syncPerformanceCards();

const galleryCarousel = document.querySelector(".app-gallery-carousel");
const galleryTrack = document.querySelector(".app-gallery-track");
const gallerySlides = Array.from(document.querySelectorAll(".app-gallery-slide"));
const galleryCaption = document.querySelector(".app-gallery-caption");
const galleryPrevious = document.querySelector(".app-gallery-arrow-prev");
const galleryNext = document.querySelector(".app-gallery-arrow-next");
let galleryIndex = 0;
let galleryTimer;

function updateGallery() {
  if (!galleryTrack || gallerySlides.length === 0) return;

  const galleryGap = Number(window.getComputedStyle(galleryTrack).columnGap.replace("px", "")) || 0;
  galleryTrack.style.transform = `translateX(calc(-${galleryIndex * 100}% - ${galleryIndex * galleryGap}px))`;
  gallerySlides.forEach((slide, index) => {
    const isActive = index === galleryIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  if (galleryCaption) {
    galleryCaption.textContent = gallerySlides[galleryIndex].dataset.caption || "";
  }
}

function showGallerySlide(nextIndex) {
  if (gallerySlides.length === 0) return;
  galleryIndex = (nextIndex + gallerySlides.length) % gallerySlides.length;
  updateGallery();
}

function startGalleryAutoScroll() {
  window.clearInterval(galleryTimer);
  galleryTimer = window.setInterval(() => showGallerySlide(galleryIndex + 1), 4200);
}

function pauseGalleryAutoScroll() {
  window.clearInterval(galleryTimer);
  window.setTimeout(startGalleryAutoScroll, 5200);
}

if (galleryCarousel && gallerySlides.length > 0) {
  galleryPrevious?.addEventListener("click", () => {
    pauseGalleryAutoScroll();
    showGallerySlide(galleryIndex - 1);
  });

  galleryNext?.addEventListener("click", () => {
    pauseGalleryAutoScroll();
    showGallerySlide(galleryIndex + 1);
  });

  galleryCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      pauseGalleryAutoScroll();
      showGallerySlide(galleryIndex - 1);
    } else if (event.key === "ArrowRight") {
      pauseGalleryAutoScroll();
      showGallerySlide(galleryIndex + 1);
    }
  });

  galleryCarousel.addEventListener("pointerenter", () => window.clearInterval(galleryTimer));
  galleryCarousel.addEventListener("pointerleave", startGalleryAutoScroll);
  updateGallery();
  startGalleryAutoScroll();
}
