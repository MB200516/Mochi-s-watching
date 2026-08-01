/**
 * content.js — runs on leetcode.com
 * Renders:
 *  - a small floating pixel widget (set a timer / see countdown),
 *    with Mochi the study cat perched on top of it
 *  - a full-screen lock overlay when the user tries to peek at
 *    solutions / editorial / discuss while a session is active
 * Both switch between a pastel pink/purple "day" sky and a navy
 * "night" sky with a moon, based on the local time of day.
 */

function currentTheme() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

function applyTheme(el) {
  if (el) el.setAttribute("data-theme", currentTheme());
}

function assetURL(name) {
  return chrome.runtime.getURL(`assets/${name}`);
}

const CAT_IMG = assetURL("cat.png");
const MOON_IMG = assetURL("moon.png");

const PRESETS_MIN = [20, 30, 45, 60, 90, 120, 180];
const MIN_MINUTES = 20;
const MAX_MINUTES = 180;

const BLOCKED_PATH_RE = /\/(solutions|editorial|discuss)(\/|$)/i;
const PROBLEM_SLUG_RE = /\/problems\/([^/]+)/;

let widgetEl = null;
let overlayEl = null;
let lastSlug = null;
let lastIsBlocked = null;
let lastHasSession = null;

function getSlug() {
  const m = location.pathname.match(PROBLEM_SLUG_RE);
  return m ? m[1] : null;
}

function getTitle(slug) {
  const h = document.querySelector('[data-cy="question-title"], a[href*="/problems/"] > div');
  if (h && h.textContent.trim()) return h.textContent.trim();
  const docTitle = document.title.split(" - ")[0].trim();
  return docTitle || slug;
}

function isBlockedPath() {
  return BLOCKED_PATH_RE.test(location.pathname);
}

function fmtTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function sendMsg(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

/* ---------------- Floating widget ---------------- */

function ensureWidget() {
  if (widgetEl) return widgetEl;
  widgetEl = document.createElement("div");
  widgetEl.id = "flx-widget";
  widgetEl.innerHTML = `
    <div class="flx-mascot-perch"><img src="${CAT_IMG}" alt="Mochi"></div>
    <div class="flx-win">
      <div class="flx-titlebar">
        <span class="flx-dot"></span><span class="flx-dot"></span><span class="flx-dot"></span>
        <span class="flx-titletext">MOCHI IS WATCHING</span>
        <button class="flx-min" type="button" title="minimize">_</button>
      </div>
      <div class="flx-body"></div>
    </div>`;
  document.documentElement.appendChild(widgetEl);
  applyTheme(widgetEl);
  const minBtn = widgetEl.querySelector(".flx-min");
  minBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const collapsed = widgetEl.classList.toggle("flx-collapsed");
    minBtn.textContent = collapsed ? "\u25a2" : "_";
    minBtn.title = collapsed ? "restore" : "minimize";
  });
  return widgetEl;
}

function renderWidgetIdle(slug, title) {
  const body = widgetEl.querySelector(".flx-body");
  body.innerHTML = `
    <div class="flx-h">Lock in on:</div>
    <div class="flx-problem">${title}</div>
    <div class="flx-presets"></div>
    <div class="flx-custom">
      <button class="flx-step" data-d="-5">-5</button>
      <span class="flx-mins">45</span><span class="flx-unit">min</span>
      <button class="flx-step" data-d="5">+5</button>
    </div>
    <button class="flx-start">START FOCUS SESSION</button>
    <div class="flx-hint">20 min min &middot; 3 hr max</div>
  `;
  let minutes = 45;
  const minsLabel = body.querySelector(".flx-mins");
  const presetsWrap = body.querySelector(".flx-presets");
  PRESETS_MIN.forEach((p) => {
    const b = document.createElement("button");
    b.className = "flx-chip";
    b.textContent = p < 60 ? `${p}m` : `${p / 60}h`;
    b.addEventListener("click", () => {
      minutes = p;
      minsLabel.textContent = minutes;
    });
    presetsWrap.appendChild(b);
  });
  body.querySelectorAll(".flx-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      minutes = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, minutes + Number(btn.dataset.d)));
      minsLabel.textContent = minutes;
    });
  });
  body.querySelector(".flx-start").addEventListener("click", async () => {
    await sendMsg({ type: "START_SESSION", slug, minutes, title });
    refresh(true);
  });
}

function renderWidgetActive(session, blocked) {
  const perchImg = widgetEl.querySelector(".flx-mascot-perch img");
  perchImg.classList.toggle("flx-alert", !!blocked);
  const body = widgetEl.querySelector(".flx-body");
  body.innerHTML = `
    <div class="flx-h">${blocked ? "NO PEEKING!" : "Focus session running"}</div>
    <div class="flx-problem">${session.title}</div>
    <div class="flx-countdown">${fmtTime(session.endTime - Date.now())}</div>
    <button class="flx-giveup">give up early</button>
  `;
  body.querySelector(".flx-giveup").addEventListener("click", async () => {
    if (confirm("Really give up? Mochi believes in you. This ends your focus session early.")) {
      const slug = getSlug();
      await sendMsg({ type: "CANCEL_SESSION", slug });
      refresh(true);
    }
  });
}

/* ---------------- Full screen lock overlay ---------------- */

function ensureOverlay() {
  if (overlayEl) return overlayEl;
  overlayEl = document.createElement("div");
  overlayEl.id = "flx-overlay";
  overlayEl.innerHTML = `
    <img class="flx-moon" src="${MOON_IMG}" alt="">
    <div class="flx-lockcard">
      <div class="flx-speech">"I caught you."</div>
      <div class="flx-mascot-big"><img src="${CAT_IMG}" alt="Mochi"></div>
      <div class="flx-lock-title">MOCHI IS WATCHING</div>
      <div class="flx-lock-sub">Solutions stay sealed until your timer runs out. Go back and try again &mdash; your future self will thank you.</div>
      <div class="flx-lock-countdown">00:00</div>
      <div class="flx-lock-bar"><div class="flx-lock-bar-fill"></div></div>
      <div class="flx-lock-buttons">
        <button class="flx-back" type="button">BACK TO PROBLEM</button>
        <button class="flx-fs" type="button">ENTER FULLSCREEN LOCK</button>
      </div>
    </div>`;
  document.documentElement.appendChild(overlayEl);
  overlayEl.querySelector(".flx-back").addEventListener("click", () => {
    const slug = getSlug();
    location.href = `https://leetcode.com/problems/${slug}/description/`;
  });
  overlayEl.querySelector(".flx-fs").addEventListener("click", () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  });
  return overlayEl;
}

function showOverlay(session) {
  ensureOverlay();
  applyTheme(overlayEl);
  overlayEl.classList.add("flx-show");
  document.documentElement.style.overflow = "hidden";
  const totalMs = session.duration * 1000;
  const remainMs = session.endTime - Date.now();
  const pct = Math.max(0, Math.min(100, (remainMs / totalMs) * 100));
  overlayEl.querySelector(".flx-lock-countdown").textContent = fmtTime(remainMs);
  overlayEl.querySelector(".flx-lock-bar-fill").style.width = `${pct}%`;
}

function hideOverlay() {
  if (!overlayEl) return;
  overlayEl.classList.remove("flx-show");
  document.documentElement.style.overflow = "";
}

/* ---------------- Main refresh loop ---------------- */

async function refresh(force) {
  const slug = getSlug();
  const blocked = isBlockedPath();

  if (!slug) {
    if (widgetEl) widgetEl.style.display = "none";
    hideOverlay();
    lastSlug = null;
    return;
  }

  ensureWidget();
  applyTheme(widgetEl);
  widgetEl.style.display = "";

  const { session } = await sendMsg({ type: "GET_SESSION", slug });
  const hasSession = !!session;

  if (blocked && hasSession) {
    showOverlay(session);
  } else {
    hideOverlay();
  }

  const changed =
    force || slug !== lastSlug || blocked !== lastIsBlocked || hasSession !== lastHasSession;

  if (changed) {
    if (hasSession) {
      renderWidgetActive(session, blocked);
    } else {
      renderWidgetIdle(slug, getTitle(slug));
    }
  } else if (hasSession) {
    // just refresh the ticking countdown text without a full re-render
    const cd = widgetEl.querySelector(".flx-countdown");
    if (cd) cd.textContent = fmtTime(session.endTime - Date.now());
    if (blocked) {
      const lockCd = overlayEl?.querySelector(".flx-lock-countdown");
      if (lockCd) lockCd.textContent = fmtTime(session.endTime - Date.now());
    }
  }

  lastSlug = slug;
  lastIsBlocked = blocked;
  lastHasSession = hasSession;
}

setInterval(() => refresh(false), 1000);
refresh(true);
