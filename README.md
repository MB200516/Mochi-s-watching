# Mochi is Watching 🐱🌙

Stop peeking at solutions before you've actually tried. Set a timer per question
(20 min – 3 hr), and if you try to sneak into the **Solutions**, **Editorial**,
or **Discuss** tab before it's up, you get a full-screen lock screen where
Mochi, your real pixel-art cat, catches you red-handed.

## What it does

- **Per-question timer** — set anywhere from 20 minutes to 3 hours for the
  problem you're currently on.
- **Full-screen block** — if you navigate to that problem's Solutions,
  Editorial, or Discuss page while a session is running, a full-viewport
  lock screen covers everything: a "I caught you" speech bubble, Mochi
  giving you a shocked look (red glow + shake), a live countdown, and a
  progress bar. A button also lets you trigger real browser Fullscreen mode.
- **Floating widget** — a small pixel window sits in the corner of every
  problem page with Mochi perched right on top of it, showing your countdown.
- **Day / night theme with real art** — the whole UI switches automatically
  based on your local time: a pastel pink sky with pixel clouds/stars from
  6am–6pm, and a deep-purple night sky with the same style the rest of the
  time, plus a pixel moon in the corner at night. All four background/mascot
  images are the actual art you provided (`assets/`), not generated pixel
  grids.
- **Black-outline "sticker" buttons** — white/pastel fill, black border,
  black text (auto-inverts to cream-on-navy for the night theme so it stays
  legible against the darker art).
- **Notification** when your timer ends.
- **Give up early** is possible (this is a discipline tool, not a prison) but
  it always asks you to confirm first.

## What changed in this version

- **Real images instead of hand-coded pixel SVGs.** Mochi (`assets/cat.png`),
  the moon (`assets/moon.png`), and both sky backgrounds
  (`assets/bg-day.png`, `assets/bg-night.png`) are now the actual artwork
  you uploaded — resized and palette-optimized to keep the extension small
  (~350KB total), but visually the same art. The old `pixelart.js`
  SVG-grid engine has been removed entirely.
- **Fixed the minimize button.** The real bug: `content.css` applied
  `all: revert` to `#flx-widget *` (every descendant of the widget), and
  because that selector carries the `#flx-widget` ID's specificity, it was
  silently beating plain class rules like `.flx-titlebar` and `.flx-min`
  further down the file — CSS specificity wins by ID > class regardless of
  source order, so those elements were losing their styling/layout
  underneath the revert. `all: revert` is now scoped to only the two root
  containers (`#flx-widget`, `#flx-overlay`), and the minimize button's
  click handler was also hardened (`type="button"`, `stopPropagation`, and
  it now swaps its glyph between `_` and `▢` so it's obvious it worked).
- **Backgrounds now use the real sky art with `background-size: cover`**
  instead of a small tiled pattern, in the popup, the in-page widget, and
  the full-screen lock screen.

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
3. Solve! The widget shows your countdown the whole time, with Mochi
   perched on top studying alongside you. Click **`_`** on the widget's
   titlebar to minimize it down to just the titlebar; click **`▢`** to
   bring it back.
4. If you click into Solutions / Editorial / Discuss before time's up, Mochi
   catches you and the lock screen takes over the whole tab until the timer
   runs out.
5. When time's up you get a notification and the lock lifts automatically.

## Project structure

```
leetcode-focus-lock/
├── manifest.json      # Manifest V3 config (declares assets/ as web-accessible)
├── background.js      # Service worker: owns session state + alarms
├── content.js          # Injected on leetcode.com: widget + lock overlay
├── content.css          # Themed styling (day/night skies, real art)
├── popup.html/.css/.js  # Extension toolbar popup (same theme system)
├── assets/               # Your real art: cat.png, moon.png, bg-day.png, bg-night.png
├── icons/                # Toolbar/store icons (generated from cat.png)
└── README.md
```

## Notes / limitations

- Chrome's Fullscreen API requires an actual user click to trigger, so true
  fullscreen is offered as a button on the lock screen rather than forced
  automatically — browsers block auto-fullscreen for good security reasons.
  The CSS overlay itself still fully covers the tab regardless.
- Day theme runs 6am–6pm local time, night theme the rest of the day. The
  in-page widget re-checks this every second so it flips live if you're
  mid-session across the boundary; the popup checks once when opened.
- Since there's one cat photo (not separate idle/focus/caught art), mood is
  conveyed with CSS instead of swapping images: a red glow + gentle shake
  when Mochi "catches" you peeking.
- This only blocks LeetCode's own Solutions/Editorial/Discuss tabs in this
  browser profile — it's a friction/commitment device, not a strict
  parental-control lock. Disabling the extension entirely is always possible
  in Chrome; the goal is to remove the *easy, one-click* temptation.
- Sessions are tracked per problem slug, so switching problems mid-session
  doesn't dodge the timer for the one you're actually locked into — but each
  problem can have its own independent session.
