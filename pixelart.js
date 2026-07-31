/**
 * pixelart.js
 * Tiny shared pixel-art engine for "Oogway", the wise tortoise mascot of
 * Oogway's Watching. Grid is stored as 8 half-width rows (left half only)
 * and mirrored at render time for a symmetric little shelled buddy.
 */

// Shell dome — constant across every mood.
const OOGWAY_SHELL = [
  "..DDDD..", // r0 apex
  ".DSSSSD.", // r1
  "DSSSSSSD", // r2
  "DSSHSSSD", // r3 hex-plate accent
  "DSSSSHSD", // r4 hex-plate accent
  "DSSSSSSD", // r5
  "DSSSSSSD", // r6
  "DDDDDDDD", // r7 shell rim
];

// Little legs peeking out at the base — constant across every mood.
const OOGWAY_LEGS = [
  "GG......", // r13
  "G.......", // r14
  "........", // r15 (ground shadow, left transparent)
];

const OOGWAY_STATES = {
  idle: {
    head: [
      "DDDDDDGG", // r8 neck
      "DDDDDGDG", // r9 eyes closed (peaceful)
      "DDDDDGGG", // r10
      "DDDDDGGG", // r11
      "DDDDGGGG", // r12 chin
    ],
    palette: {
      D: "#2f4a1e",
      S: "#7fae52",
      H: "#5c8a3a",
      G: "#c9a24a",
    },
  },
  focus: {
    head: [
      "DDDDDDGG",
      "DDDDDGLG", // r9 glasses lens
      "DDDDDGLG", // r10 glasses lens
      "DDDDDGGG",
      "DDDDGGGG",
    ],
    palette: {
      D: "#2f4a1e",
      S: "#7fae52",
      H: "#5c8a3a",
      G: "#c9a24a",
      L: "#a0e8ff",
    },
  },
  caught: {
    head: [
      "DDDDDEGG", // r8 stern brow
      "DDDDDGWG", // r9 eyes wide open
      "DDDDDGRG", // r10 intense pupils
      "DDDDDGGG",
      "DDDDGGGG",
    ],
    palette: {
      D: "#2f4a1e",
      S: "#8fbf5c",
      H: "#6a9c44",
      G: "#c9a24a",
      E: "#6b3a12",
      W: "#ffffff",
      R: "#c81d1d",
    },
  },
};

function mirrorRow(half) {
  return half + half.split("").reverse().join("");
}

/**
 * Build an <svg> string for the given mascot state.
 * @param {"idle"|"focus"|"caught"} state
 * @param {number} size - rendered pixel width/height (square)
 */
function oogwaySVG(state, size = 128) {
  const cfg = OOGWAY_STATES[state] || OOGWAY_STATES.idle;
  const rows = [...OOGWAY_SHELL, ...cfg.head, ...OOGWAY_LEGS];
  const n = rows.length; // 16
  const cell = size / n;
  let rects = "";
  rows.forEach((half, y) => {
    const full = mirrorRow(half);
    for (let x = 0; x < full.length; x++) {
      const ch = full[x];
      if (ch === "." || !ch) continue;
      const color = cfg.palette[ch];
      if (!color) continue;
      rects += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${color}"/>`;
    }
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

// Expose to both popup (window) and content-script contexts.
if (typeof window !== "undefined") {
  window.oogwaySVG = oogwaySVG;
}
