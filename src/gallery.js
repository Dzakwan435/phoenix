import { WORKS as DEFAULT_WORKS, UI as DEFAULT_UI } from './content.js';

export function initializeGallery(customWorks, customUI, customSettings) {
  const WORKS = Array.isArray(customWorks) && customWorks.length > 0 ? customWorks : DEFAULT_WORKS;
  const UI = customUI || DEFAULT_UI;
  const settings = customSettings || {};

  // Apply dynamic theme styling
  if (settings.bg_color) document.documentElement.style.setProperty('--bg', settings.bg_color);
  if (settings.ink_color) document.documentElement.style.setProperty('--ink', settings.ink_color);
  if (settings.gray_color) document.documentElement.style.setProperty('--gray', settings.gray_color);
  if (settings.site_title) document.title = settings.site_title;

  // Custom CSS injection
  let customStyleEl = document.getElementById('custom-injected-css');
  if (settings.custom_css) {
    if (!customStyleEl) {
      customStyleEl = document.createElement('style');
      customStyleEl.id = 'custom-injected-css';
      document.head.appendChild(customStyleEl);
    }
    customStyleEl.textContent = settings.custom_css;
  } else if (customStyleEl) {
    customStyleEl.remove();
  }

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

  if (!stage || !workList || N === 0) {
    return () => {};
  }

  // Clear any existing DOM nodes
  stage.replaceChildren();
  workList.replaceChildren();

  let currentIndex = Math.min(4, Math.max(0, N - 1));
  let stagePosition = currentIndex;
  let stageTarget = currentIndex;
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
      if (!work) return;

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

  let isAnimating = false;
  let velocity = 0;
  let lastFrameTime = 0;
  const STIFFNESS = 36;
  const DAMPING = 12.2;

  function stepSpring(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const dt = Math.min(0.04, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stagePosition = stageTarget;
      velocity = 0;
    } else {
      const diff = stageTarget - stagePosition;
      const springForce = STIFFNESS * diff;
      const dampingForce = -DAMPING * velocity;
      const accel = springForce + dampingForce;
      velocity += accel * dt;
      stagePosition += velocity * dt;
    }

    renderStage();
    syncSelection();

    const dist = Math.abs(stageTarget - stagePosition);
    const speed = Math.abs(velocity);

    if (dist < 0.0005 && speed < 0.001) {
      stagePosition = stageTarget;
      velocity = 0;
      renderStage();
      syncSelection();
      isAnimating = false;
      browseFrame = 0;
      lastFrameTime = 0;
      clearTimeout(browseEndTimer);
      browseEndTimer = scheduleTimeout(() => {
        if (!isAnimating && !drag) {
          stage.classList.remove("is-browsing");
        }
      }, 70);
    } else {
      browseFrame = scheduleFrame(stepSpring);
    }
  }

  function startSpring() {
    clearPick();
    clearTimeout(browseEndTimer);
    stage.classList.add("is-browsing");
    if (!isAnimating) {
      isAnimating = true;
      lastFrameTime = performance.now();
      browseFrame = scheduleFrame(stepSpring);
    }
  }

  function syncSelection() {
    const index = ((Math.round(stagePosition) % N) + N) % N;
    if (index !== currentIndex) {
      currentIndex = index;
      listEls.forEach((el, k) => el.classList.toggle("current", k === currentIndex));
      const item = listEls[currentIndex];
      if (item) {
        workList.scrollTo({
          top: item.offsetTop - workList.clientHeight / 2 + item.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }

  function travelTo(target, immediate = false) {
    clearTimeout(browseEndTimer);
    stageTarget = target;
    if (immediate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stagePosition = target;
      velocity = 0;
      isAnimating = false;
      if (browseFrame) {
        cancelAnimationFrame(browseFrame);
        browseFrame = 0;
      }
      renderStage();
      syncSelection();
      stage.classList.remove("is-browsing");
      return;
    }
    startSpring();
  }

  function setCurrent(i, animate = true, shiftStage = true) {
    currentIndex = ((i % N) + N) % N;
    listEls.forEach((el, k) => el.classList.toggle("current", k === currentIndex));
    const item = listEls[currentIndex];
    if (item) {
      workList.scrollTo({
        top: item.offsetTop - workList.clientHeight / 2 + item.clientHeight / 2,
        behavior: "smooth",
      });
    }
    if (shiftStage) {
      let delta = (currentIndex - ((Math.round(stageTarget) % N) + N) % N + N) % N;
      if (delta > N / 2) delta -= N;
      travelTo(stageTarget + delta, !animate);
    }
  }

  let browseEndTimer;
  let drag = null;
  let suppressClick = false;
  const AXIS_SLOPE = .56;

  // Intelligent Wheel Pacing System
  let wheelAccumulator = 0;
  let lastWheelTime = 0;
  let lastStepTime = 0;
  const WHEEL_STEP_THRESHOLD = 45;
  const MIN_STEP_INTERVAL = 180; // ms minimum cadence so each card is showcased in center

  on(stage, "wheel", e => {
    if (isMobile() || lbOpen || detailTransition) return;
    e.preventDefault();
    clearPick();

    const now = performance.now();
    if (now - lastWheelTime > 220) {
      wheelAccumulator = 0;
    }
    lastWheelTime = now;

    let rawDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) rawDelta *= 24;
    else if (e.deltaMode === 2) rawDelta *= 400;

    wheelAccumulator += rawDelta;

    if (Math.abs(wheelAccumulator) >= WHEEL_STEP_THRESHOLD) {
      if (now - lastStepTime >= MIN_STEP_INTERVAL) {
        const dir = wheelAccumulator > 0 ? 1 : -1;
        stageTarget = Math.round(stageTarget) + dir;
        lastStepTime = now;
        wheelAccumulator = wheelAccumulator > 0
          ? Math.max(0, wheelAccumulator - WHEEL_STEP_THRESHOLD)
          : Math.min(0, wheelAccumulator + WHEEL_STEP_THRESHOLD);
        startSpring();
      }
    }
  }, { passive: false });

  on(stage, "pointerdown", e => {
    if (isMobile() || lbOpen || detailTransition || e.button !== 0) return;
    clearPick();
    if (browseFrame) {
      cancelAnimationFrame(browseFrame);
      browseFrame = 0;
      isAnimating = false;
    }
    velocity = 0;
    drag = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: stagePosition,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
      locked: false,
      pointerId: e.pointerId,
    };
    stage.setPointerCapture(e.pointerId);
    stage.classList.add("is-dragging");
    stage.classList.add("is-browsing");
  });

  on(stage, "pointermove", e => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    const dist = Math.hypot(dx, dy);
    if (!drag.locked && dist > 6) {
      const angle = Math.atan2(Math.abs(dy), Math.abs(dx));
      const axisAngle = Math.atan(AXIS_SLOPE);
      if (Math.abs(angle - axisAngle) < Math.PI / 4) {
        drag.locked = true;
      } else {
        drag = null;
        stage.releasePointerCapture(e.pointerId);
        stage.classList.remove("is-dragging");
        stage.classList.remove("is-browsing");
        return;
      }
    }
    if (drag.locked) {
      suppressClick = true;
      const now = performance.now();
      const dt = Math.max(0.001, (now - drag.lastTime) / 1000);
      const projDelta = (dx + dy * AXIS_SLOPE) / Math.hypot(1, AXIS_SLOPE);
      const posDelta = -projDelta / (window.innerWidth * .14);
      const prevPos = stagePosition;
      stagePosition = drag.startPos + posDelta;
      stageTarget = stagePosition;
      const instantVel = (stagePosition - prevPos) / dt;
      velocity = velocity * 0.4 + instantVel * 0.6;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.lastTime = now;
      renderStage();
      syncSelection();
    }
  });

  function endDrag(e) {
    if (!drag || drag.pointerId !== e.pointerId) return;
    stage.releasePointerCapture(e.pointerId);
    stage.classList.remove("is-dragging");
    const wasLocked = drag.locked;
    drag = null;
    if (wasLocked) {
      scheduleTimeout(() => { suppressClick = false; }, 50);
      const throwSteps = Math.max(-2, Math.min(2, Math.round(velocity * 0.22)));
      stageTarget = Math.round(stagePosition + throwSteps);
      startSpring();
    } else {
      stage.classList.remove("is-browsing");
    }
  }

  on(stage, "pointerup", endDrag);
  on(stage, "pointercancel", endDrag);

  on(stage, "click", e => {
    if (suppressClick) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);

  function revealStage() {
    stage.classList.add("is-entering");
    renderStage();
    const ordered = slots.slice().sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
    ordered.forEach((s, idx) => {
      scheduleTimeout(() => {
        s.el.classList.add("shown");
        if (idx === ordered.length - 1) {
          scheduleTimeout(() => stage.classList.remove("is-entering"), 650);
        }
      }, 40 + idx * 16);
    });
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
    if (!lbOpen || !lightboxFigure) return;
    const r = lightboxFigure.getBoundingClientRect();
    const cy = r.top + r.height / 2;
    document.querySelectorAll(".lb-side").forEach((b) => (b.style.top = cy + "px"));
  }
  on(window, "resize", positionSideArrows);

  function fillLightbox(i) {
    const work = WORKS[i];
    if (!work) return;
    lightboxImg.src = work.src;
    lightboxImg.alt = work.title;
    lbSeries.textContent = work.series;
    lbTitle.textContent = work.title;
    lbEn.textContent = work.en;
    lbDesc.textContent = work.desc;
    lbIndex.textContent = String(i + 1).padStart(2, "0") + " / " + N;

    const linkContainer = document.getElementById("lb-link-container");
    if (linkContainer) {
      if (work.link && work.link.trim() !== "") {
        linkContainer.innerHTML = `<a href="${work.link}" target="_blank" rel="noopener noreferrer" class="lb-project-link">Buka Tautan Proyek ↗</a>`;
      } else {
        linkContainer.innerHTML = "";
      }
    }
  }

  let detailTransition = false;
  const nextFrame = () => new Promise(resolve => scheduleFrame(resolve));

  async function waitForStage() {
    while (stage.classList.contains("is-entering") || stage.classList.contains("is-browsing") || isAnimating) await nextFrame();
  }

  function selectedSlot() {
    return isMobile() ? slots[currentIndex] : (slots.find(slot => slot.el.classList.contains("featured")) || slots[0]);
  }

  function imageGeometry(img, projected = false) {
    const rect = img.getBoundingClientRect();
    let matrix = new DOMMatrix();
    if (projected && img.parentElement) {
      matrix = new DOMMatrix(getComputedStyle(img.parentElement).transform)
        .multiply(new DOMMatrix(getComputedStyle(img).transform));
    }
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

  async function openLightbox(i, wasRightStack = false) {
    if (detailTransition || lbOpen) return;
    detailTransition = true;
    await waitForStage();
    if (i !== currentIndex || Math.abs(stagePosition - Math.round(stagePosition)) > .001) {
      setCurrent(i, true);
      await waitForStage();
    }
    const slot = selectedSlot();
    if (!slot) {
      detailTransition = false;
      return;
    }
    stage.classList.add("detail-active");
    const from = isMobile() ? imageGeometry(slot.img) : imageGeometry(slot.img, true);
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
    if (isMobile() && slot) slot.el.scrollIntoView({ block: "center", behavior: "instant" });
    const from = imageGeometry(lightboxImg);
    const to = slot ? imageGeometry(slot.img, true) : from;
    if (slot) slot.img.style.visibility = "hidden";
    lightbox.classList.add("is-morphing");
    lightbox.classList.remove("open");
    await flyPhoto(lightboxImg.src, from, to);
    if (slot) slot.img.style.visibility = "";
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

  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lb-prev");
  const nextBtn = document.getElementById("lb-next");

  if (closeBtn) on(closeBtn, "click", closeLightbox);
  if (prevBtn) on(prevBtn, "click", () => lightboxGo(-1));
  if (nextBtn) on(nextBtn, "click", () => lightboxGo(1));
  if (lightbox) {
    on(lightbox, "click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  on(document, "keydown", (e) => {
    if (detailTransition) return;
    if (e.key === "Escape" && lbOpen) closeLightbox();
    if (e.key === "ArrowLeft") lbOpen ? lightboxGo(-1) : setCurrent(currentIndex - 1, true);
    if (e.key === "ArrowRight") lbOpen ? lightboxGo(1) : setCurrent(currentIndex + 1, true);
    if (e.key === "Enter" && !lbOpen) openLightbox(currentIndex);
  });

  setCurrent(currentIndex, false); 
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
    if (browseFrame) {
      cancelAnimationFrame(browseFrame);
      browseFrame = 0;
    }
    if (stage) {
      stage.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      stage.replaceChildren();
    }
    if (workList) {
      workList.replaceChildren();
    }
    document.querySelectorAll('.photo-flight').forEach(element => element.remove());
  };
}
