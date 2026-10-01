import { WORKS } from './content.js';

export function initializeGallery() {
  const controller = new AbortController();
  const timers = new Set();
  const frames = new Set();
  let disposed = false;
  function on(target, type, callback, options = {}) {
    target.addEventListener(type, callback, { ...(typeof options === 'boolean' ? { capture: options } : options), signal: controller.signal });
  }
  function scheduleTimeout(callback, delay) {
    const id = window.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
    timers.add(id);
    return id;
  }
  function scheduleFrame(callback) {
    const id = window.requestAnimationFrame(time => { frames.delete(id); if (!disposed) callback(time); });
    frames.add(id);
    return id;
  }
const N = WORKS.length;
const stage = document.getElementById("stage");
const workList = document.getElementById("work-list");

let currentIndex = 4;
let stagePosition = 4;
let stageTarget = 4;
let browseFrame = 0;
let pickedSlot = null;
function clearPick() {
  pickedSlot?.el.classList.remove("picked");
  pickedSlot = null;
  stage.classList.remove("has-pick");
  listEls.forEach(el => el.classList.remove("hover"));
}
const slots = []; 
const listEls = [];

const SLOT_LAYOUT = [];
for (let k = 81; k >= 1; k--) {
  SLOT_LAYOUT.push({ offset: -k, x: -21 - (k - 1) * 0.42, z: 82 - k });
}
SLOT_LAYOUT.push({ offset: 0, x: 0, z: 100, featured: true });
for (let k = 1; k <= 81; k++) {
  SLOT_LAYOUT.push({ offset: k, x: 21 + (k - 1) * 0.42, z: k });
}

SLOT_LAYOUT.forEach((layout, si) => {
  const el = document.createElement("div");
  el.className = "photo";
  const img = document.createElement("img");
  img.draggable = false;
  const slot = { el, img, wi: si % N, offset: layout.offset };
  el.appendChild(img);
  on(el, "click", () => openLightbox(slot.wi, slot.offset > 0));
  stage.appendChild(el);
  slots.push(slot);
});

let hoverPointer = { x: null, y: null };
on(stage, "pointermove", e => {
  if (e.clientX === hoverPointer.x && e.clientY === hoverPointer.y) return;
  hoverPointer = { x: e.clientX, y: e.clientY };
  if (isMobile() || e.pointerType === "touch" || e.buttons || lbOpen || detailTransition ||
      stage.classList.contains("is-browsing") || stage.classList.contains("is-entering")) return;
  const el = e.target.closest(".photo");
  const slot = slots.find(item => item.el === el);
  if (slot && slot === pickedSlot) return;
  clearPick();
  if (!slot) return;
  listEls[slot.wi]?.classList.add("hover");
  if (el.classList.contains("featured")) return;
  const r = el.getBoundingClientRect();
  const liftRatio = slot.offset > 0 ? .88 : 1.45;
  const lift = Math.min(el.offsetHeight * liftRatio, Math.max(0, r.top - 16));
  el.style.setProperty("--pick-lift", `${-lift}px`);
  el.classList.add("picked");
  pickedSlot = slot;
  stage.classList.add("has-pick");
});
on(stage, "pointerleave", () => {
  hoverPointer = { x: null, y: null };
  clearPick();
});

function isMobile() {
  return window.matchMedia("(max-width: 600px), (max-width: 860px) and (orientation: portrait)").matches;
}

function renderStage(animate) {
  const mobile = isMobile();
  slots.forEach((slot, si) => {
    const base = 26 + si - 81;
    const worldIndex = base + Math.round((stagePosition - base) / slots.length) * slots.length;
    const offset = worldIndex - stagePosition;
    const distance = Math.abs(offset);
    const x = Math.sign(offset) * (distance < 1 ? distance * 21 : 21 + (distance - 1) * .42);
    const L = { x, offset, featured: distance < .5,
      z: distance < .5 ? 100 : offset < 0 ? Math.round(82 + offset) : Math.round(offset) };
    if (mobile && si >= N) {
      slot.el.style.display = "none";
      return;
    }
    slot.wi = mobile ? si : ((worldIndex % N) + N) % N;
    slot.offset = mobile ? si - currentIndex : L.offset;
    const work = WORKS[slot.wi];
    if (slot.img.getAttribute("src") !== work.src) {
      slot.img.src = work.src;
      slot.el.style.setProperty("--reflection-image", `url("${slot.img.src}")`);
    }
    slot.img.alt = work.title;
    slot.el.style.display = "";
    slot.el.classList.toggle("featured", !!L.featured);
    slot.el.style.left = (50 + L.x) + "%";
    
    slot.el.style.top = `calc(50% + ${L.x * 0.56}vw)`;
    slot.el.style.zIndex = L.z;
  });
}

on(window, "resize", () => { clearPick(); renderStage(false); });

let lastSeries = null;
WORKS.forEach((work, i) => {
  if (work.series !== lastSeries) {
    const label = document.createElement("span");
    label.className = "series-label";
    label.textContent = work.series;
    workList.appendChild(label);
    lastSeries = work.series;
  }
  const item = document.createElement("button");
  item.className = "work-item";
  item.textContent = work.title;
  on(item, "click", () => openLightbox(i, false));
  workList.appendChild(item);
  listEls.push(item);
});

function setCurrent(i, animate, shiftStage = true) {
  currentIndex = ((i % N) + N) % N;
  listEls.forEach((el, k) => el.classList.toggle("current", k === currentIndex));
  const item = listEls[currentIndex];
  workList.scrollTo({
    top: item.offsetTop - workList.clientHeight / 2 + item.clientHeight / 2,
    behavior: "smooth",
  });
  if (shiftStage) {
    clearTimeout(browseEndTimer);
    let delta = (currentIndex - ((stageTarget % N) + N) % N + N) % N;
    if (delta > N / 2) delta -= N;
    stageTarget += delta;
    clearPick();
    cancelAnimationFrame(browseFrame);
    if (!animate || isMobile() || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stagePosition = stageTarget;
      stage.classList.remove("is-browsing");
      renderStage();
      return;
    }
    const start = stagePosition;
    const started = performance.now();
    stage.classList.add("is-browsing");
    function frame(now) {
      const t = Math.min(1, (now - started) / 460);
      stagePosition = start + (stageTarget - start) * (1 - Math.pow(1 - t, 3));
      renderStage();
      if (t < 1) browseFrame = scheduleFrame(frame);
      else stage.classList.remove("is-browsing");
    }
    browseFrame = scheduleFrame(frame);
  }
}

let browseEndTimer;
let drag = null;
let suppressClick = false;
const AXIS_SLOPE = .56;
function syncSelection() {
  const index = ((Math.round(stagePosition) % N) + N) % N;
  if (index !== currentIndex) setCurrent(index, false, false);
}
function travelTo(target, immediate = false) {
  clearTimeout(browseEndTimer);
  cancelAnimationFrame(browseFrame);
  clearPick();
  stageTarget = target;
  stage.classList.add("is-browsing");
  if (immediate) {
    stagePosition = target;
    renderStage();
    syncSelection();
    return;
  }
  const start = stagePosition;
  const started = performance.now();
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
  function frame(now) {
    const t = duration ? Math.min(1, (now - started) / duration) : 1;
    stagePosition = start + (target - start) * (1 - Math.pow(1 - t, 3));
    renderStage();
    syncSelection();
    if (t < 1) browseFrame = scheduleFrame(frame);
    else if (!drag) stage.classList.remove("is-browsing");
  }
  browseFrame = scheduleFrame(frame);
}
function settleQueue() {
  cancelAnimationFrame(browseFrame);
  stageTarget = stagePosition;
  stage.classList.remove("is-browsing");
  syncSelection();
}
let wheelAxis = null;
let lastWheelTime = 0;
on(stage, "wheel", e => {
  if (isMobile() || lbOpen || detailTransition || e.ctrlKey || drag || stage.classList.contains("is-entering")) return;
  e.preventDefault();
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
  
  const now = performance.now();
  if (!wheelAxis || now - lastWheelTime > 220) {
    wheelAxis = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? "x" : "y";
  }
  lastWheelTime = now;
  const delta = (wheelAxis === "x" ? e.deltaX : e.deltaY) * unit;
  if (!delta) return;

  travelTo(stagePosition + delta / 96, true);
  browseEndTimer = scheduleTimeout(settleQueue, 180);
}, { passive: false });
on(stage, "pointerdown", e => {
  if (isMobile() || lbOpen || detailTransition || e.button !== 0 || stage.classList.contains("is-entering")) return;
  clearTimeout(browseEndTimer);
  cancelAnimationFrame(browseFrame);
  stageTarget = stagePosition;
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, start: stagePosition, moved: false, axis: null };
  suppressClick = false;
});
on(window, "pointermove", e => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  
  if (!drag.axis) {
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
    drag.axis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
  }
  const alongAxis = drag.axis === "x" ? dx : dy;
  if (!drag.moved) {
    stage.setPointerCapture(e.pointerId);
    
    stage.classList.add("is-dragging");
    clearPick();
  }
  drag.moved = true;
  suppressClick = true;
  stage.classList.add("is-dragging");
  travelTo(drag.start - alongAxis / Math.max(180, innerWidth * .125), true);
});
function endDrag(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const moved = drag.moved;
  if (stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
  drag = null;
  stage.classList.remove("is-dragging");
  if (moved) settleQueue();
  else stage.classList.remove("is-browsing");
}
on(window, "pointerup", endDrag);
on(window, "pointercancel", endDrag);
on(stage, "click", e => {
  if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; }
}, true);

let scrollTicking = false;
on(window, "scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  scheduleFrame(() => {
    scrollTicking = false;
    if (!isMobile()) return;
    const mid = window.innerHeight / 2;
    let bestSlot = null; 
    let bestDist = Infinity;
    slots.forEach((s, wi) => {
      if (s.el.style.display === "none") return;
      const r = s.el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestDist) { bestDist = d; bestSlot = wi; }
    });
    if (bestSlot !== null && bestSlot !== currentIndex) {
      setCurrent(bestSlot, false, false);
    }
  });
}, { passive: true });

async function revealStage() {
  stage.classList.add("is-entering");
  const active = slots.filter(slot => slot.el.style.display !== "none");
  await Promise.allSettled(active.map(slot => slot.img.decode()));
  if (disposed) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = isMobile();
  const animations = [];
  slots.forEach((slot, i) => {
    slot.el.classList.add("shown");
    const rect = slot.el.getBoundingClientRect();
    if (reduceMotion || rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth || slot.el.style.display === "none") return;
    const featured = slot.el.classList.contains("featured");
    const direction = slot.offset < 0 ? -1 : 1;
    const shift = mobile ? 0 : featured ? 0 : direction * 72;
    const delay = mobile ? Math.min(i, 6) * 90 : featured ? 640 : 80 + (1 - Math.min(Math.abs(slot.offset), 81) / 81) * 480;
    const animation = slot.el.animate([
      { opacity: 0, translate: `${shift}px ${mobile || featured ? 28 : shift * AXIS_SLOPE}px` },
      { opacity: 1, translate: "0px 0px" }
    ], { duration: 950, delay, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
    animations.push(animation.finished);
  });
  await Promise.allSettled(animations);
  stage.classList.remove("is-entering");
}

const lightbox = document.getElementById("lightbox");
const lightboxInner = document.getElementById("lightbox-inner");
const lightboxFigure = document.getElementById("lightbox-figure");
const lightboxImg = document.getElementById("lightbox-img");
const lbSeries = document.getElementById("lb-series");
const lbTitle = document.getElementById("lb-title");
const lbEn = document.getElementById("lb-en");
const lbDesc = document.getElementById("lb-desc");
const lbIndex = document.getElementById("lb-index");
let lbOpen = false;
let swapping = false;

function positionSideArrows() {
  if (!lbOpen) return;
  const r = lightboxFigure.getBoundingClientRect();
  const cy = r.top + r.height / 2;
  document.querySelectorAll(".lb-side").forEach((b) => (b.style.top = cy + "px"));
}
on(window, "resize", positionSideArrows);

function fillLightbox(i) {
  const work = WORKS[i];
  lightboxImg.src = work.src;
  lightboxImg.alt = work.title;
  lbSeries.textContent = work.series;
  lbTitle.textContent = work.title;
  lbEn.textContent = work.en;
  lbDesc.textContent = work.desc;
  lbIndex.textContent = String(i + 1).padStart(2, "0") + " / " + N;
}

let detailTransition = false;
const nextFrame = () => new Promise(resolve => scheduleFrame(resolve));
async function waitForStage() {
  while (stage.classList.contains("is-entering") || stage.classList.contains("is-browsing")) await nextFrame();
}
function selectedSlot() {
  return isMobile() ? slots[currentIndex] : slots.find(slot => slot.el.classList.contains("featured"));
}
function imageGeometry(img, projected = false) {
  const rect = img.getBoundingClientRect();
  let matrix = new DOMMatrix();
  if (projected) matrix = new DOMMatrix(getComputedStyle(img.parentElement).transform)
    .multiply(new DOMMatrix(getComputedStyle(img).transform));
  return {
    left: `${rect.left + rect.width / 2}px`, top: `${rect.top + rect.height / 2}px`,
    width: `${img.offsetWidth}px`, height: `${img.offsetHeight}px`,
    transform: `translate(-50%, -50%) matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},0,0)`
  };
}
async function flyPhoto(src, from, to) {
  const flight = document.createElement("img");
  flight.className = "photo-flight";
  flight.src = src;
  flight.alt = "";
  Object.assign(flight.style, from);
  document.body.appendChild(flight);
  const animation = flight.animate([from, to], {
    duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 800,
    easing: "cubic-bezier(.22, 1, .36, 1)", fill: "forwards"
  });
  await animation.finished;
  flight.remove();
}
async function openLightbox(i) {
  if (detailTransition || lbOpen) return;
  detailTransition = true;
  await waitForStage();
  if (i !== currentIndex || Math.abs(stagePosition - Math.round(stagePosition)) > .001) {
    setCurrent(i, true);
    await waitForStage();
  }
  const slot = selectedSlot();
  
  const from = imageGeometry(slot.img, true);
  stage.classList.add("detail-active");
  clearPick();
  fillLightbox(currentIndex);
  await lightboxImg.decode().catch(() => {});
  lightbox.classList.add("is-morphing", "open");
  lightbox.setAttribute("aria-hidden", "false");
  lbOpen = true;
  slot.img.style.visibility = "hidden";
  await flyPhoto(lightboxImg.src, from, imageGeometry(lightboxImg));
  lightbox.classList.remove("is-morphing");
  slot.img.style.visibility = "";
  detailTransition = false;
  positionSideArrows();
}
async function closeLightbox() {
  if (!lbOpen || detailTransition || swapping) return;
  detailTransition = true;
  await waitForStage();
  const slot = selectedSlot();
  if (isMobile()) slot.el.scrollIntoView({ block: "center", behavior: "instant" });
  const from = imageGeometry(lightboxImg);
  const to = imageGeometry(slot.img, true);
  slot.img.style.visibility = "hidden";
  lightbox.classList.add("is-morphing");
  lightbox.classList.remove("open");
  await flyPhoto(lightboxImg.src, from, to);
  slot.img.style.visibility = "";
  lightbox.classList.remove("is-morphing");
  lightbox.setAttribute("aria-hidden", "true");
  stage.classList.remove("detail-active");
  lbOpen = false;
  detailTransition = false;
}

function lightboxGo(dir) {
  if (swapping || detailTransition) return;
  swapping = true;
  const next = ((currentIndex + dir) % N + N) % N;
  lightboxFigure.classList.add("swap-out");
  scheduleTimeout(() => {
    setCurrent(next, true);
    fillLightbox(next);
    lightboxFigure.classList.remove("swap-out");
    positionSideArrows();
    scheduleTimeout(() => { swapping = false; }, 500);
  }, 300);
}

on(document.getElementById("lightbox-close"), "click", closeLightbox);
on(document.getElementById("lb-prev"), "click", () => lightboxGo(-1));
on(document.getElementById("lb-next"), "click", () => lightboxGo(1));
on(lightbox, "click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

on(document, "keydown", (e) => {
  if (detailTransition) return;
  if (e.key === "Escape" && lbOpen) closeLightbox();
  if (e.key === "ArrowLeft") lbOpen ? lightboxGo(-1) : setCurrent(currentIndex - 1, true);
  if (e.key === "ArrowRight") lbOpen ? lightboxGo(1) : setCurrent(currentIndex + 1, true);
  if (e.key === "Enter" && !lbOpen) openLightbox(currentIndex);
});

setCurrent(4, false); 
revealStage();
const openParam = new URLSearchParams(location.search).get("open");
if (openParam !== null) {
  const i = Math.min(Math.max(parseInt(openParam, 10) || 0, 0), N - 1);
  openLightbox(i, false);
}

  return () => {
    disposed = true;
    controller.abort();
    timers.forEach(window.clearTimeout);
    frames.forEach(window.cancelAnimationFrame);
    stage.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    stage.replaceChildren();
    workList.replaceChildren();
    document.querySelectorAll('.photo-flight').forEach(element => element.remove());
  };
}
