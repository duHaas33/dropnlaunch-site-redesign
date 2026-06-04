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

const galleryRail = document.querySelector(".app-gallery-rail");
const galleryImages = Array.from(document.querySelectorAll(".app-gallery-track img"));
let galleryTimer;
let galleryResumeTimer;
let gallerySnapTimer;
let galleryDragStartX = 0;
let galleryDragStartScroll = 0;
let isGalleryDragging = false;

function updateGalleryActiveImage() {
  if (!galleryRail || galleryImages.length === 0) return;

  const railCenter = galleryRail.getBoundingClientRect().left + galleryRail.clientWidth / 2;
  let activeImage = galleryImages[0];
  let shortestDistance = Number.POSITIVE_INFINITY;

  galleryImages.forEach((image) => {
    const imageRect = image.getBoundingClientRect();
    const imageCenter = imageRect.left + imageRect.width / 2;
    const distance = Math.abs(railCenter - imageCenter);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      activeImage = image;
    }
  });

  galleryImages.forEach((image) => image.classList.toggle("is-active", image === activeImage));
}

function getClosestGalleryImage() {
  if (!galleryRail || galleryImages.length === 0) return null;

  const railCenter = galleryRail.getBoundingClientRect().left + galleryRail.clientWidth / 2;
  let closestImage = galleryImages[0];
  let shortestDistance = Number.POSITIVE_INFINITY;

  galleryImages.forEach((image) => {
    const imageRect = image.getBoundingClientRect();
    const imageCenter = imageRect.left + imageRect.width / 2;
    const distance = Math.abs(railCenter - imageCenter);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestImage = image;
    }
  });

  return closestImage;
}

function centerGalleryImage(image, behavior = "smooth") {
  if (!galleryRail || !image) return;

  const targetLeft = image.offsetLeft - (galleryRail.clientWidth - image.clientWidth) / 2;
  galleryRail.scrollTo({ left: targetLeft, behavior });
}

function getGalleryStep() {
  if (galleryImages.length < 2) return 0;
  return galleryImages[1].offsetLeft - galleryImages[0].offsetLeft;
}

function wrapGalleryScroll() {
  if (!galleryRail || galleryImages.length < 3) return;

  const uniqueCount = Math.floor(galleryImages.length / 3);
  const loopWidth = getGalleryStep() * uniqueCount;

  if (!loopWidth) return;

  if (galleryRail.scrollLeft < loopWidth * 0.5) {
    galleryRail.scrollLeft += loopWidth;
  } else if (galleryRail.scrollLeft > loopWidth * 1.5) {
    galleryRail.scrollLeft -= loopWidth;
  }
}

function advanceGallery() {
  const step = getGalleryStep();
  if (!galleryRail || !step) return;

  galleryRail.scrollBy({ left: step, behavior: "smooth" });
}

function startGalleryAutoScroll() {
  window.clearInterval(galleryTimer);
  galleryTimer = window.setInterval(advanceGallery, 3200);
}

function pauseGalleryAutoScroll() {
  window.clearInterval(galleryTimer);
  window.clearTimeout(galleryResumeTimer);
  galleryResumeTimer = window.setTimeout(startGalleryAutoScroll, 4200);
}

if (galleryRail && galleryImages.length > 0) {
  const uniqueCount = Math.floor(galleryImages.length / 3);
  const initializeGallery = () => {
    galleryRail.scrollLeft = getGalleryStep() * uniqueCount;
    updateGalleryActiveImage();
    startGalleryAutoScroll();
  };

  galleryRail.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
      wrapGalleryScroll();
      updateGalleryActiveImage();
    });

    if (!isGalleryDragging) {
      window.clearTimeout(gallerySnapTimer);
      gallerySnapTimer = window.setTimeout(() => {
        centerGalleryImage(getClosestGalleryImage());
      }, 220);
    }
  }, { passive: true });

  ["pointerdown", "wheel", "touchstart"].forEach((eventName) => {
    galleryRail.addEventListener(eventName, pauseGalleryAutoScroll, { passive: true });
  });

  galleryRail.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    isGalleryDragging = true;
    galleryDragStartX = event.clientX;
    galleryDragStartScroll = galleryRail.scrollLeft;
    galleryRail.classList.add("is-dragging");
    galleryRail.setPointerCapture(event.pointerId);
    pauseGalleryAutoScroll();
  });

  galleryRail.addEventListener("pointermove", (event) => {
    if (!isGalleryDragging) return;

    event.preventDefault();
    galleryRail.scrollLeft = galleryDragStartScroll - (event.clientX - galleryDragStartX);
  });

  function stopGalleryDrag(event) {
    if (!isGalleryDragging) return;

    isGalleryDragging = false;
    galleryRail.classList.remove("is-dragging");
    if (galleryRail.hasPointerCapture(event.pointerId)) {
      galleryRail.releasePointerCapture(event.pointerId);
    }
    centerGalleryImage(getClosestGalleryImage());
    pauseGalleryAutoScroll();
  }

  galleryRail.addEventListener("pointerup", stopGalleryDrag);
  galleryRail.addEventListener("pointercancel", stopGalleryDrag);
  galleryRail.addEventListener("pointerleave", stopGalleryDrag);

  window.addEventListener("resize", initializeGallery, { passive: true });
  window.setTimeout(initializeGallery, 120);
}
