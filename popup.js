const PRESETS_MIN = [20, 30, 45, 60, 90, 120, 180];
const MIN_MINUTES = 20;
const MAX_MINUTES = 180;
const PROBLEM_SLUG_RE = /\/problems\/([^/]+)/;

const app = document.getElementById("app");

function sendMsg(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

function fmtTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function renderNoProblem() {
  app.innerHTML = `
    <div class="head">
      <div class="mascot">${window.oogwaySVG("idle", 64)}</div>
      <div>
        <div class="headline">OOGWAY AWAITS</div>
        <div class="subline">Open a LeetCode problem to start a focus session.</div>
      </div>
    </div>
  `;
}

function renderSetup(slug, title) {
  let minutes = 45;
  app.innerHTML = `
    <div class="head">
      <div class="mascot">${window.oogwaySVG("idle", 64)}</div>
      <div>
        <div class="headline">LOCK IN</div>
        <div class="subline">no peeking till the timer's done</div>
      </div>
    </div>
    <div class="problem-title">${title}</div>
    <div class="presets"></div>
    <div class="custom">
      <button class="step" data-d="-5">-5</button>
      <span class="mins">45</span><span class="unit">min</span>
      <button class="step" data-d="5">+5</button>
    </div>
    <button class="start-btn">START FOCUS SESSION</button>
    <div class="hint">20 min min &middot; 3 hr max</div>
  `;
  const presetsWrap = app.querySelector(".presets");
  const minsLabel = app.querySelector(".mins");
  const chips = [];
  PRESETS_MIN.forEach((p) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = p < 60 ? `${p}m` : `${p / 60}h`;
    b.addEventListener("click", () => {
      minutes = p;
      minsLabel.textContent = minutes;
      chips.forEach((c) => c.classList.remove("active"));
      b.classList.add("active");
    });
    presetsWrap.appendChild(b);
    chips.push(b);
  });
  app.querySelectorAll(".step").forEach((btn) => {
    btn.addEventListener("click", () => {
      minutes = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, minutes + Number(btn.dataset.d)));
      minsLabel.textContent = minutes;
      chips.forEach((c) => c.classList.remove("active"));
    });
  });
  app.querySelector(".start-btn").addEventListener("click", async () => {
    await sendMsg({ type: "START_SESSION", slug, minutes, title });
    boot();
  });
}

let tickHandle = null;

function renderActive(session, slug) {
  if (tickHandle) clearInterval(tickHandle);
  app.innerHTML = `
    <div class="head">
      <div class="mascot">${window.oogwaySVG("focus", 64)}</div>
      <div>
        <div class="headline">FOCUSING</div>
        <div class="subline">patience, young coder &mdash; solve it yourself first</div>
      </div>
    </div>
    <div class="problem-title">${session.title}</div>
    <div class="countdown">--:--</div>
    <div class="status-msg">solutions &amp; discussion are locked</div>
    <button class="giveup-btn">give up early</button>
  `;
  const cdEl = app.querySelector(".countdown");
  const tick = () => {
    const remain = session.endTime - Date.now();
    if (remain <= 0) {
      clearInterval(tickHandle);
      boot();
      return;
    }
    cdEl.textContent = fmtTime(remain);
  };
  tick();
  tickHandle = setInterval(tick, 1000);

  app.querySelector(".giveup-btn").addEventListener("click", async () => {
    if (confirm("Really give up? Oogway believes in you. This ends your focus session early.")) {
      await sendMsg({ type: "CANCEL_SESSION", slug });
      boot();
    }
  });
}

async function boot() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || "";
  const match = url.match(PROBLEM_SLUG_RE);
  if (!url.includes("leetcode.com") || !match) {
    renderNoProblem();
    return;
  }
  const slug = match[1];
  const title = (tab.title || slug).split(" - ")[0].trim();
  const { session } = await sendMsg({ type: "GET_SESSION", slug });
  if (session) {
    renderActive(session, slug);
  } else {
    renderSetup(slug, title);
  }
}

boot();
