/**
 * pixelart.js
 * Tiny shared pixel-art engine for "Mochi", the study cat mascot of
 * this extension. Each mood is stored as half-width rows (left half
 * only) and mirrored at render time for a perfectly symmetric face.
 */

const MOCHI_W = 11; // half-width in pixels (mirrored -> 22 wide)

function mochiBaseRows() {
  return [
    ".KK........",
    ".KPPK.......",
    "KPPPPK......",
    "KTPPTK......",
    ".KTTTTK.....",
    "..KCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCECCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KPCCCCCCCC.",
    ".KCCCCCCCCN.",
    ".KCCCCCCCNN.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    ".KCCCCCCCCC.",
    "KKKKKKKKKKKK",
  ].map((r) => r.slice(0, MOCHI_W));
}

const MOCHI_PALETTE = {
  ".": null,
  K: "#231e1c",
  C: "#f7e5d1",
  T: "#dbaa70",
  P: "#f9aec9",
  N: "#ee6e9e",
  E: "#2d2321",
  G: "#a8e8ff",
  R: "#c8283c",
  M: "#f05a78",
};

const MOCHI_STATES = {
  idle: (rows) => rows,
  focus: (rows) => {
    rows[8] = ".KCGGGCCCCC".slice(0, MOCHI_W);
    rows[9] = ".KCGGGCCCCC".slice(0, MOCHI_W);
    return rows;
  },
  caught: (rows) => {
    rows[8] = ".KTCCCCCCCC".slice(0, MOCHI_W);
    rows[12] = ".KCCCCCCCCC".slice(0, MOCHI_W); // no blush, shocked
    rows[13] = ".KCCRRRRCCC".slice(0, MOCHI_W);
    rows[14] = ".KCRRRRRRCC".slice(0, MOCHI_W);
    rows[15] = ".KCRMMMMRCC".slice(0, MOCHI_W);
    rows[16] = ".KCCRRRRCCC".slice(0, MOCHI_W);
    return rows;
  },
};

/**
 * Build an <svg> string for the given mascot mood.
 * @param {"idle"|"focus"|"caught"} state
 * @param {number} size - rendered pixel WIDTH; height auto-follows the grid's aspect ratio so pixels stay square.
 */
function mochiSVG(state, size = 128) {
  const transform = MOCHI_STATES[state] || MOCHI_STATES.idle;
  const rows = transform(mochiBaseRows());
  const fullRows = rows.map((half) => half + half.split("").reverse().join(""));
  const cols = fullRows[0].length;
  const rowCount = fullRows.length;
  const cell = size / cols;
  const height = cell * rowCount;
  let rects = "";
  fullRows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const color = MOCHI_PALETTE[ch];
      if (!color) continue;
      rects += `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${color}"/>`;
    }
  });
  return `<svg viewBox="0 0 ${size} ${height.toFixed(2)}" width="${size}" height="${height.toFixed(2)}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

if (typeof window !== "undefined") {
  window.mochiSVG = mochiSVG;
}
