/**
 * background.js — service worker
 * Owns the source of truth for focus sessions: chrome.storage.local.sessions
 * keyed by problem slug -> { endTime, duration, title }
 */

const MIN_MINUTES = 20;
const MAX_MINUTES = 180;

function clampMinutes(m) {
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(m)));
}

async function getSessions() {
  const { sessions } = await chrome.storage.local.get("sessions");
  return sessions || {};
}

async function saveSessions(sessions) {
  await chrome.storage.local.set({ sessions });
}

async function startSession(slug, minutes, title) {
  const clamped = clampMinutes(minutes);
  const sessions = await getSessions();
  const now = Date.now();
  const session = {
    startTime: now,
    endTime: now + clamped * 60 * 1000,
    duration: clamped * 60,
    title: title || slug,
  };
  sessions[slug] = session;
  await saveSessions(sessions);
  chrome.alarms.create(`focus-lock-${slug}`, { when: session.endTime });
  return session;
}

async function getSession(slug) {
  const sessions = await getSessions();
  const session = sessions[slug];
  if (!session) return null;
  if (Date.now() >= session.endTime) {
    delete sessions[slug];
    await saveSessions(sessions);
    return null;
  }
  return session;
}

async function cancelSession(slug) {
  const sessions = await getSessions();
  delete sessions[slug];
  await saveSessions(sessions);
  chrome.alarms.clear(`focus-lock-${slug}`);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    switch (msg.type) {
      case "START_SESSION": {
        const session = await startSession(msg.slug, msg.minutes, msg.title);
        sendResponse({ ok: true, session });
        break;
      }
      case "GET_SESSION": {
        const session = await getSession(msg.slug);
        sendResponse({ ok: true, session });
        break;
      }
      case "CANCEL_SESSION": {
        await cancelSession(msg.slug);
        sendResponse({ ok: true });
        break;
      }
      default:
        sendResponse({ ok: false, error: "unknown message type" });
    }
  })();
  return true; // keep the message channel open for the async response
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (!alarm.name.startsWith("focus-lock-")) return;
  const slug = alarm.name.replace("focus-lock-", "");
  chrome.notifications.create(`done-${slug}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Time's up! \u23F0",
    message: "Your focus session ended. Solutions are unlocked \u2014 but maybe give it one more real shot first?",
    priority: 1,
  });
});
