# Oogway's Watching 🐢👀

Stop peeking at solutions before you've actually tried. Set a timer per question
(20 min – 3 hr), and if you try to sneak into the **Solutions**, **Editorial**,
or **Discuss** tab before it's up, you get a full-screen lock screen where
Oogway, a wise old pixel tortoise, catches you red-handed.

## What it does

- **Per-question timer** — set anywhere from 20 minutes to 3 hours for the
  problem you're currently on.
- **Full-screen block** — if you navigate to that problem's Solutions,
  Editorial, or Discuss page while a session is running, a full-viewport
  pixel-art lock screen covers everything: a "you got caught" speech bubble,
  Oogway giving you a stern look, a live countdown, and a progress bar. A
  button also lets you trigger real browser Fullscreen mode.
- **Floating widget** — a small retro window sits in the corner of every
  problem page showing your countdown so you always know how much longer you
  need to hang in there.
- **Oogway, the pixel tortoise** — idle (eyes closed, meditating), studying
  (little reading glasses), and "I caught you" (stern brow, wide eyes) moods,
  all hand-drawn as crisp pixel-grid SVGs (see `pixelart.js`).
- **Notification** when your timer ends.
- **Give up early** is possible (this is a discipline tool, not a prison) but
  it always asks you to confirm first.

## Install (unpacked, for personal use)

1. Download/unzip this folder somewhere permanent (don't delete it after —
   Chrome loads the extension directly from these files).
2. Open `chrome://extensions` in Chrome (or any Chromium browser — Edge,
   Brave, etc.).
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the `leetcode-focus-lock` folder.
5. Pin the extension (puzzle-piece icon in the toolbar → pin) so it's easy to
   reach.

## How to use it

1. Open any problem on `leetcode.com/problems/...`.
2. Click the extension icon (or use the widget in the bottom-right corner of
   the page), pick a time with the quick presets or the +/- stepper, and hit
   **Start Focus Session**.
3. Solve! The widget shows your countdown the whole time.
4. If you click into Solutions / Editorial / Discuss before time's up, Oogway
   catches you and the lock screen takes over the whole tab until the timer
   runs out.
5. When time's up you get a notification and the lock lifts automatically.

## Project structure

```
leetcode-focus-lock/
├── manifest.json      # Manifest V3 config
├── background.js      # Service worker: owns session state + alarms
├── content.js          # Injected on leetcode.com: widget + lock overlay
├── content.css          # Styling for the injected UI
├── popup.html/.css/.js  # Extension toolbar popup
├── pixelart.js           # Shared pixel-mascot SVG renderer ("Oogway")
├── icons/                # Generated pixel-art toolbar/store icons
└── README.md
```

## Notes / limitations

- Chrome's Fullscreen API requires an actual user click to trigger, so true
  fullscreen is offered as a button on the lock screen rather than forced
  automatically — browsers block auto-fullscreen for good security reasons.
  The CSS overlay itself still fully covers the tab regardless.
- This only blocks LeetCode's own Solutions/Editorial/Discuss tabs in this
  browser profile — it's meant as a friction/commitment device, not a strict
  parental-control lock. (Disabling the extension entirely is always possible
  in Chrome; the goal is to remove the *easy, one-click* temptation.)
- Sessions are tracked per problem slug, so switching problems mid-session
  doesn't dodge the timer for the one you're actually locked into — but each
  problem can have its own independent session.
- Oogway here is an original pixel-tortoise mascot inspired by the general
  "wise old turtle" archetype, not a reproduction of any specific copyrighted
  character design.
