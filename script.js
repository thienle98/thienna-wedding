const weddingData = window.WEDDING_DATA || {};

const WISH_KEY = "wedding-wishes-v1";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const el = {
  cover: document.getElementById("cover"),
  envelope: document.getElementById("envelope"),
  main: document.getElementById("mainContent"),
  openBtn: document.getElementById("openInvitation"),
  coverNames: document.getElementById("coverNames"),
  coverDate: document.getElementById("coverDate"),
  footerNames: document.getElementById("footerNames"),
  footerDate: document.getElementById("footerDate"),
  coupleGrid: document.getElementById("coupleGrid"),
  invitationText: document.getElementById("invitationText"),
  calendarMonthYear: document.getElementById("calendarMonthYear"),
  calendarGrid: document.getElementById("calendarGrid"),
  eventInfo: document.getElementById("eventInfo"),
  venueName: document.getElementById("venueName"),
  venueAddress: document.getElementById("venueAddress"),
  mapButton2: document.getElementById("mapButton2"),
  timeline: document.getElementById("timeline"),
  galleryGrid: document.getElementById("galleryGrid"),
  wishForm: document.getElementById("wishForm"),
  wishList: document.getElementById("wishList"),
  petalLayer: document.getElementById("petal-layer")
};

function createImage(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = () => {
    img.remove();
  };
  return img;
}

function renderMainData() {
  const coverBride = weddingData.brideDisplayName || weddingData.brideName || "";
  const coverGroom = weddingData.groomDisplayName || weddingData.groomName || "";
  el.coverNames.innerHTML = `
    <span class="cover-name-line">${escapeHtml(coverBride)}</span>
    <span class="cover-amp">&amp;</span>
    <span class="cover-name-line">${escapeHtml(coverGroom)}</span>
  `;
  const names = `${weddingData.groomName} & ${weddingData.brideName}`;
  el.coverDate.textContent = weddingData.weddingDate;
  el.footerNames.textContent = names;
  el.footerDate.textContent = weddingData.weddingDate;

  el.coupleGrid.innerHTML = "";
  const row1Photo = personPhoto(weddingData.groomName, weddingData.groomImage, "Chú rể");
  const row1Info = personInfo(weddingData.groomName, "Chú rể");
  const row2Info = personInfo(weddingData.brideName, "Cô dâu");
  const row2Photo = personPhoto(weddingData.brideName, weddingData.brideImage, "Cô dâu");
  row1Photo.classList.add("row1-photo");
  row1Info.classList.add("row1-info");
  row2Info.classList.add("row2-info");
  row2Photo.classList.add("row2-photo");
  el.coupleGrid.append(row1Photo, row1Info, row2Info, row2Photo);
  el.invitationText.textContent = weddingData.invitationText;

  el.venueName.textContent = weddingData.venueName;
  el.venueAddress.textContent = weddingData.venueAddress;
  el.mapButton2.href = weddingData.googleMapUrl;

  renderCalendar();
  renderEventInfo();
  renderSchedule();
  renderGallery();
}

function personInfo(name, role) {
  const info = document.createElement("article");
  info.className = "person-info reveal";
  info.innerHTML = `
    <p class="person-role">${escapeHtml(role)}</p>
    <h3 class="person-name">${escapeHtml(name)}</h3>
  `;
  return info;
}

function personPhoto(name, imageUrl, role) {
  const wrap = document.createElement("article");
  wrap.className = "person-photo-wrap reveal";
  const photo = document.createElement("div");
  photo.className = "person-photo";
  photo.append(createImage(imageUrl, `${role} ${name}`));
  wrap.append(photo);
  return wrap;
}

function renderCalendar() {
  const month = String(weddingData.weddingMonth).padStart(2, "0");
  el.calendarMonthYear.textContent = `Tháng ${month} / ${weddingData.weddingYear}`;

  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  el.calendarGrid.innerHTML = "";
  weekdays.forEach((d) => {
    const head = document.createElement("div");
    head.className = "cal-cell cal-head";
    head.textContent = d;
    el.calendarGrid.append(head);
  });

  const firstDay = new Date(weddingData.weddingYear, weddingData.weddingMonth - 1, 1).getDay();
  const daysInMonth = new Date(weddingData.weddingYear, weddingData.weddingMonth, 0).getDate();

  for (let i = 0; i < firstDay; i += 1) {
    const blank = document.createElement("div");
    blank.className = "cal-cell";
    el.calendarGrid.append(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("div");
    cell.className = "cal-cell cal-day";
    cell.textContent = String(day);
    if (day === weddingData.weddingDay) {
      cell.classList.add("is-wedding");
    }
    el.calendarGrid.append(cell);
  }
}

function renderEventInfo() {
  el.eventInfo.innerHTML = `
    <p><strong>Giờ làm lễ:</strong> ${weddingData.ceremonyTime}</p>
    <p><strong>Giờ khai tiệc:</strong> ${weddingData.partyTime}</p>
    <p><strong>Địa điểm:</strong> ${weddingData.venueName}</p>
    <p><strong>Địa chỉ:</strong> ${weddingData.venueAddress}</p>
    <a class="btn" target="_blank" rel="noopener" href="${weddingData.googleMapUrl}">Mở bản đồ</a>
  `;
}

function renderSchedule() {
  el.timeline.innerHTML = "";
  weddingData.schedule.forEach((item, idx) => {
    const row = document.createElement("article");
    row.className = "timeline-item reveal";
    row.style.transitionDelay = `${idx * 80}ms`;
    row.innerHTML = `<div class="time">${item.time}</div><h3>${item.title}</h3><p>${item.note}</p>`;
    el.timeline.append(row);
  });
}

function renderGallery() {
  el.galleryGrid.innerHTML = "";
  weddingData.galleryImages.forEach((src, idx) => {
    const item = document.createElement("figure");
    item.className = "gallery-item reveal";
    item.style.transitionDelay = `${idx * 70}ms`;
    item.append(createImage(src, `Album cưới ${idx + 1}`));
    el.galleryGrid.append(item);
  });
}

function loadWishes() {
  const defaultWishes = Array.isArray(weddingData.wishes) ? weddingData.wishes : [];
  try {
    const stored = JSON.parse(localStorage.getItem(WISH_KEY) || "[]");
    if (Array.isArray(stored) && stored.length) return stored;
  } catch (_e) {
    // Ignore parse error and return defaults.
  }
  return defaultWishes;
}

function saveWishes(wishes) {
  localStorage.setItem(WISH_KEY, JSON.stringify(wishes));
}

function renderWishes(wishes) {
  el.wishList.innerHTML = "";
  wishes.slice().reverse().forEach((wish) => {
    const card = document.createElement("article");
    card.className = "wish-item reveal in-view";
    card.innerHTML = `<h4>${escapeHtml(wish.name)}</h4><p>${escapeHtml(wish.message)}</p>`;
    el.wishList.append(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function bindWishForm() {
  let wishes = loadWishes();
  renderWishes(wishes);

  el.wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(el.wishForm);
    const name = String(formData.get("name") || "").trim();
    const message = String(formData.get("message") || "").trim();
    if (!name || !message) return;

    wishes.push({ name, message });
    wishes = wishes.slice(-50);
    saveWishes(wishes);
    renderWishes(wishes);
    el.wishForm.reset();
  });
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((node, index) => {
    node.style.transitionTimingFunction = EASE;
    node.style.transitionDelay = node.style.transitionDelay || `${(index % 6) * 45}ms`;
    observer.observe(node);
  });
}

function createFloatingPetals() {
  const amount = Math.min(42, Math.max(22, Math.floor(window.innerWidth / 42)));
  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    const startX = -10 + Math.random() * 120;
    const startY = -8 + Math.random() * 116;
    const endX = startX + (-36 + Math.random() * 72);
    const endY = startY + (-28 + Math.random() * 56);
    petal.style.left = "0";
    petal.style.top = "0";
    petal.style.animationDuration = `${14 + Math.random() * 16}s`;
    petal.style.animationDelay = `${Math.random() * 18}s`;
    petal.style.setProperty("--x1", `${startX}vw`);
    petal.style.setProperty("--y1", `${startY}vh`);
    petal.style.setProperty("--x2", `${endX}vw`);
    petal.style.setProperty("--y2", `${endY}vh`);
    petal.style.setProperty("--xs", `${-12 + Math.random() * 24}vw`);
    petal.style.setProperty("--ys", `${-8 + Math.random() * 16}vh`);
    petal.style.setProperty("--r1", `${Math.random() * 360}deg`);
    petal.style.setProperty("--r2", `${Math.random() * 360}deg`);
    petal.style.opacity = `${0.16 + Math.random() * 0.34}`;
    el.petalLayer.append(petal);
  }
}

function triggerPetalBurst(originX, originY) {
  for (let i = 0; i < 14; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal burst";
    petal.style.left = `${originX}px`;
    petal.style.top = `${originY}px`;
    petal.style.setProperty("--bx", `${-130 + Math.random() * 260}px`);
    petal.style.setProperty("--by", `${-120 + Math.random() * 160}px`);
    petal.style.setProperty("--br", `${-180 + Math.random() * 360}deg`);
    el.petalLayer.append(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

function setupOpenInteraction() {
  el.openBtn.addEventListener("click", () => {
    const rect = el.openBtn.getBoundingClientRect();
    triggerPetalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

    el.cover.classList.add("is-leaving");
    setTimeout(() => {
      el.cover.style.display = "none";
      el.main.classList.remove("is-hidden");
      el.main.removeAttribute("aria-hidden");
      setupReveal();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 720);
  });
}

function init() {
  renderMainData();
  bindWishForm();
  createFloatingPetals();
  setupOpenInteraction();
}

init();

