// Shared markers that link the case plates to the Horton hydrologic-cycle plate.
// Solid black circle = what happens to the water. Dashed circle = what the actors say they change.
const F = "font-family=\"'IBM Plex Sans Condensed','Arial Narrow',Arial,sans-serif\"";
const M = "font-family=\"'IBM Plex Mono',Consolas,monospace\"";

export const step = (x, y, n, claimed = false, r = 13) => claimed
  ? `<g class="hs" data-step="${n}"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#000" stroke-width="2" stroke-dasharray="4 3"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" ${F} font-weight="700">${n}</text></g>`
  : `<g class="hs" data-step="${n}"><circle cx="${x}" cy="${y}" r="${r}" fill="#000" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" ${F} font-weight="700" fill="#fff">${n}</text></g>`;

// rows: [[numbers[], claimed, text], ...]
export const stepKey = (x, y, w, rows, title = 'HORTON STEPS') => {
  const RH = 19, h = 36 + rows.length * RH + 6;
  const cols = Math.max(...rows.map(r => r[0].length));
  let o = `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="2"/>`;
  o += `<text x="${x + 14}" y="${y + 22}" font-size="14" ${F} font-weight="700">${title}</text>`;
  o += `<text x="${x + w - 14}" y="${y + 22}" text-anchor="end" font-size="11" ${M}>numbers from the hydrologic cycle plate</text>`;
  rows.forEach(([nums, claimed, text], i) => {
    const cy = y + 44 + i * RH;
    nums.forEach((n, j) => { o += step(x + 24 + j * 24, cy, n, claimed, 10); });
    o += `<text x="${x + 22 + cols * 24}" y="${cy + 4.5}" font-size="12" ${M}>${text}</text>`;
  });
  return o + `</g>`;
};
