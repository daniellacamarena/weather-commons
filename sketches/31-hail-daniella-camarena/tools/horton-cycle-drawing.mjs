// Black-and-white line drawing: the hydrologic cycle, redrawn after Horton (1931, p. 193).
// A new drawing in the style of the hail-cannon and tiemperos plates, not a trace of the original figure.
// Usage: node horton-cycle-drawing.mjs out.svg
import fs from 'fs';
const out = process.argv[2];
const F = "font-family=\"'IBM Plex Sans Condensed','Arial Narrow',Arial,sans-serif\"";
const M = "font-family=\"'IBM Plex Mono',Consolas,monospace\"";
const s = []; const add = x => s.push(x);
const r1 = v => Math.round(v * 10) / 10;

// ---------- terrain
const SL = 760;                     // sea level
const SHORE = 380;                  // shoreline x
const BED = 990, BOT = 1040;        // top of impervious rock, bottom of section
const STREAM = 560;                 // stream channel x
const sig = v => 1 / (1 + Math.exp(-v));
const g = x => 755 - 0.10 * Math.max(0, x - SHORE) - 200 * sig((x - 1280) / 120) + 24 * Math.exp(-(((x - STREAM) / 20) ** 2));
const seabed = x => SL + 2 + (SHORE - x) * (178 / SHORE);
const e = x => (x < SHORE ? seabed(x) : g(x));                 // top of the earth
const wt = x => 768 - 0.5 * (768 - g(x));                        // water table
const soilBot = x => Math.min(g(x) + 36, wt(x));
const xs = (a, b, step = 8) => { const r = []; for (let x = a; x < b; x += step) r.push(x); r.push(b); return r; };
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)},${r1(y)}`).join(' ');

add(`<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
<pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#000" stroke-width="0.8"/></pattern>
<pattern id="rock" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0,0 L12,12 M12,0 L0,12" stroke="#000" stroke-width="0.9"/></pattern>
<pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r="1.1" fill="#000"/><circle cx="7" cy="8" r="1.1" fill="#000"/></pattern>
</defs>`);
add(`<rect width="1600" height="1500" fill="#fff"/>`);

// helpers
const halo = `stroke="#fff" stroke-width="5" paint-order="stroke" stroke-linejoin="round"`;
const tag = (x, y, lines, anchor = 'start') => lines.forEach((t, i) => add(`<text x="${x}" y="${y + i * 16}" text-anchor="${anchor}" font-size="${i ? 12.5 : 14}" ${i ? M : F} font-weight="${i ? 400 : 700}" ${halo}>${t}</text>`));
const num = (x, y, n) => add(`<g class="hs" data-step="${n}"><circle cx="${x}" cy="${y}" r="13" fill="#000"/><text x="${x}" y="${y + 4.5}" text-anchor="middle" font-size="13" ${F} font-weight="700" fill="#fff">${n}</text></g>`);
const wavy = (x, y0, y1, amp = 5, sw = 1.6) => {
  const n = Math.max(2, Math.round(Math.abs(y1 - y0) / 16)); const d = (y1 - y0) / n;
  let p = `M${x},${y0}`; for (let i = 0; i < n; i++) p += ` q${(i % 2 ? -1 : 1) * amp * 2},${r1(d / 2)} 0,${r1(d)}`;
  add(`<path d="${p}" fill="none" stroke="#000" stroke-width="${sw}" marker-end="url(#ah)"/>`);
};
const puff = (lobes, ox, oy, sc = 1) => {
  add(`<g fill="#000">${lobes.map(([x, y, r]) => `<circle cx="${ox + x * sc}" cy="${oy + y * sc}" r="${r * sc + 1.6}"/>`).join('')}</g>`);
  add(`<g fill="#fff">${lobes.map(([x, y, r]) => `<circle cx="${ox + x * sc}" cy="${oy + y * sc}" r="${r * sc - 1.6}"/>`).join('')}</g>`);
};
const flatBase = (x1, x2, y) => add(`<rect x="${x1 - 8}" y="${y + 1}" width="${x2 - x1 + 16}" height="60" fill="#fff"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2.6"/>`);

// ---------- underground section
const earthTop = xs(0, 1600).map(x => [x, e(x)]);
add(`<path d="${line(earthTop)} L1600,${BOT} L0,${BOT} Z" fill="#fff"/>`);
// ground water zone (below the water table, and under the sea)
const gwTop = xs(0, 1600).map(x => [x, x < SHORE ? e(x) : wt(x)]);
add(`<path d="${line(gwTop)} L1600,${BED} L0,${BED} Z" fill="url(#hatch)" opacity="0.38"/>`);
// soil zone
const soilTop = xs(SHORE, 1600).map(x => [x, g(x)]);
const soilB = xs(SHORE, 1600).reverse().map(x => [x, soilBot(x)]);
add(`<path d="${line(soilTop)} ${line(soilB).replace('M', 'L')} Z" fill="url(#dots)" opacity="0.55"/>`);
// impervious rock
add(`<rect x="0" y="${BED}" width="1600" height="${BOT - BED}" fill="url(#rock)"/>`);
add(`<line x1="0" y1="${BED}" x2="1600" y2="${BED}" stroke="#000" stroke-width="2"/>`);
add(`<rect x="0" y="${BOT}" width="1600" height="2" fill="#000"/>`);
// water table
add(`<path d="${line(xs(SHORE + 10, 1600).map(x => [x, wt(x)]))}" fill="none" stroke="#000" stroke-width="1.6" stroke-dasharray="10 6"/>`);
{ const x = 1250, y = wt(1250); add(`<path d="M${x - 9},${y - 14} L${x + 9},${y - 14} L${x},${y - 2} Z" fill="#fff" stroke="#000" stroke-width="1.5"/><line x1="${x - 6}" y1="${y + 5}" x2="${x + 6}" y2="${y + 5}" stroke="#000" stroke-width="1.5"/>`); }

// ---------- sea
const seaPoly = [[0, SL], [SHORE, SL], ...xs(0, SHORE).reverse().map(x => [x, seabed(x)])];
add(`<path d="${line(seaPoly)} Z" fill="#fff" stroke="none"/>`);
add(`<path d="${line(xs(0, SHORE).map(x => [x, seabed(x)]))}" fill="none" stroke="#000" stroke-width="1.6"/>`);
add(`<line x1="0" y1="${SL}" x2="${SHORE + 2}" y2="${SL}" stroke="#000" stroke-width="2.4"/>`);
for (let i = 0; i < 6; i++) { const y = SL + 22 + i * 22, x0 = 20 + (i % 2) * 30, x1 = Math.min(SHORE - 40 - i * 52, 330); if (x1 > x0 + 30) add(`<path d="M${x0},${y} q12,-6 24,0 t24,0 t24,0 M${x1 - 72},${y} q12,-6 24,0 t24,0 t24,0" fill="none" stroke="#000" stroke-width="1"/>`); }
tag(30, SL + 40, ['THE SEA', 'the great store of water'], 'start');

// ---------- ground surface (on top of the fills)
add(`<path d="${line(xs(SHORE, 1600, 4).map(x => [x, g(x)]))}" fill="none" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`);
// stream channel with water
add(`<path d="M${STREAM - 14},${r1(g(STREAM) - 8)} q14,5 28,0 M${STREAM - 9},${r1(g(STREAM) - 3)} q9,4 18,0" fill="none" stroke="#000" stroke-width="1.4"/>`);
// grass ticks on the slope
for (let x = 620; x < 1600; x += 34) { if (x > 1020 && x < 1230) continue; const y = g(x); add(`<path d="M${x},${r1(y)} l-3,-8 M${x + 4},${r1(y)} l2,-9 M${x + 8},${r1(y)} l4,-7" stroke="#000" stroke-width="1" fill="none"/>`); }

// ---------- sun
add(`<g stroke="#000" stroke-width="2" fill="#fff"><circle cx="1470" cy="120" r="46"/>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${r1(1470 + Math.cos(a) * 58)}" y1="${r1(120 + Math.sin(a) * 58)}" x2="${r1(1470 + Math.cos(a) * 78)}" y2="${r1(120 + Math.sin(a) * 78)}"/>`; }).join('')}</g>`);
tag(1470, 228, ['SUN', 'energy that drives the cycle'], 'middle');

// ---------- clouds
// small cloud forming over the sea
puff([[0, 0, 30], [34, -12, 38], [72, -2, 30], [20, -44, 28], [52, -48, 30]], 150, 380);
flatBase(120, 252, 410);
// big rain cloud over the land
puff([[0, 0, 46], [60, -14, 60], [130, -10, 64], [200, 0, 50], [240, 14, 36], [-36, 14, 32], [40, -80, 50], [110, -92, 60], [170, -70, 46], [90, -150, 48]], 820, 260);
flatBase(778, 1084, 300);
add(`<path d="M880,250 q30,-26 66,-6 M980,210 q34,-30 74,-4 M900,150 q28,-22 60,-4" fill="none" stroke="#000" stroke-width="1.2"/>`);

// (1) evaporation from the sea
[60, 120, 180, 240, 300].forEach((x, i) => wavy(x, SL - 8, 470 + (i % 2) * 24));
num(345, 560, 1); tag(365, 565, ['EVAPORATION', 'from the sea']);
// (2) moist air carried inland
add(`<path d="M290,330 C420,290 560,280 720,270" fill="none" stroke="#000" stroke-width="3" marker-end="url(#ah)"/>`);
add(`<path d="M300,360 C430,330 560,322 720,316" fill="none" stroke="#000" stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#ah)"/>`);
num(470, 268, 2); tag(490, 245, ['MOIST AIR CARRIED INLAND', 'by the wind']);
// (3) condensation
num(1160, 165, 3); tag(1180, 170, ['CONDENSATION', 'rising air cools into cloud']);
// (4) precipitation
for (let x = 796; x <= 1076; x += 16) { const x2 = x + 30; add(`<line x1="${x}" y1="312" x2="${x2}" y2="${r1(g(x2) - 6)}" stroke="#000" stroke-width="1.1" stroke-dasharray="9 7"/>`); }
num(760, 470, 4); tag(668, 446, ['PRECIPITATION', 'rain, hail, snow'], 'end');

// trees (interception and transpiration)
const tree = (x, sc = 1) => {
  const b = g(x), h = 70 * sc;
  add(`<line x1="${x}" y1="${r1(b)}" x2="${x}" y2="${r1(b - h)}" stroke="#000" stroke-width="${3 * sc}"/>`);
  puff([[0, 0, 22], [-20, 8, 16], [20, 8, 16], [-10, -16, 18], [12, -18, 18]], x, b - h - 10, sc);
  return b - h - 10;
};
const t1 = tree(1100, 1), t2 = tree(1155, 1.15), t3 = tree(1208, 0.95);
// rain caught in the crowns (interception)
num(1050, r1(t1 + 6), 5); tag(1030, r1(t1 + 46), ['INTERCEPTION', 'leaves hold back rain'], 'end');
// (6) transpiration
[[1100, t1], [1155, t2], [1208, t3]].forEach(([x, y]) => wavy(x + 4, r1(y - 26), r1(y - 120), 4, 1.4));
num(1240, r1(t2 - 128), 6); tag(1260, r1(t2 - 124), ['TRANSPIRATION', 'plants breathe water out']);
// (7) evaporation from soil and water surfaces
[650, 690, 730].forEach(x => wavy(x, r1(g(x) - 8), r1(g(x) - 120), 4, 1.4));
num(690, r1(g(690) - 150), 7); tag(668, r1(g(690) - 146), ['EVAPORATION', 'from soil and ponds'], 'end');
// (8) infiltration
[880, 910, 940, 970].forEach(x => add(`<line x1="${x}" y1="${r1(g(x) + 4)}" x2="${x}" y2="${r1(g(x) + 44)}" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`));
num(925, r1(g(925) + 74), 8); tag(946, r1(g(925) + 80), ['INFILTRATION', 'rain soaks into the soil']);
// (9) surface runoff
add(`<path d="${line(xs(600, 1440, 10).reverse().map(x => [x, g(x) - 14]))}" fill="none" stroke="#000" stroke-width="2.8" marker-end="url(#ah)"/>`);
num(1420, r1(g(1420) - 34), 9); tag(1590, r1(g(1590) - 76), ['SURFACE RUNOFF', 'water that cannot soak in', 'runs downhill'], 'end');
// (10) soil moisture
num(1470, r1(g(1470) + 20), 10); tag(1490, r1(g(1470) + 48), ['SOIL MOISTURE', 'held for roots']);
// (11) percolation
[1300, 1330].forEach(x => add(`<line x1="${x}" y1="${r1(soilBot(x) + 4)}" x2="${x}" y2="${r1(wt(x) - 6)}" stroke="#000" stroke-width="1.6" stroke-dasharray="6 4" marker-end="url(#ah)"/>`));
num(1355, r1((soilBot(1355) + wt(1355)) / 2), 11); tag(1375, r1((soilBot(1355) + wt(1355)) / 2 + 5), ['PERCOLATION', 'down to the water table']);
tag(1268, r1(wt(1250) + 22), ['WATER TABLE']);
// (12) ground-water flow
add(`<path d="${line(xs(600, 1420, 10).reverse().map(x => [x, wt(x) + 70 + 40 * Math.sin((x - 600) / 820 * Math.PI)]))} Q${STREAM + 20},${r1(wt(600) + 50)} ${STREAM + 4},${r1(g(STREAM) + 14)}" fill="none" stroke="#000" stroke-width="2.4" marker-end="url(#ah)"/>`);
add(`<path d="M${STREAM - 30},${r1(wt(STREAM) + 60)} C${STREAM - 90},${r1(wt(STREAM) + 90)} 300,880 180,900" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="8 5" marker-end="url(#ah)"/>`);
num(980, r1(wt(980) + 120), 12); tag(1000, r1(wt(980) + 125), ['GROUND-WATER FLOW', 'slow, through soil and rock,', 'to streams and the sea']);
tag(130, 950, ['GROUND WATER', 'seeps out under the sea']);
// (13) stream flow
num(STREAM, 680, 13); tag(STREAM - 20, 674, ['STREAM FLOW', 'back to the sea'], 'end');
add(`<path d="M${STREAM - 18},${r1(g(STREAM) - 22)} C${STREAM - 80},${r1(g(STREAM) - 34)} ${SHORE + 30},${SL - 30} ${SHORE - 10},${SL - 10}" fill="none" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`);
// zone labels
tag(1590, 1018, ['IMPERVIOUS ROCK'], 'end');
add(`<text x="1590" y="${BED - 12}" text-anchor="end" font-size="14" ${F} font-weight="700" ${halo}>GROUND-WATER ZONE</text>`);
add(`<text x="1590" y="${r1(g(1590) + 22)}" text-anchor="end" font-size="11" ${M} ${halo}>soil zone</text>`);

// ---------- title box (top-left)
add(`<g ${F}>
 <rect x="30" y="28" width="440" height="196" fill="#fff" stroke="#000" stroke-width="2"/>
 <text x="48" y="62" font-size="22" font-weight="700">THE HYDROLOGIC CYCLE</text>
 <text x="48" y="84" font-size="13" ${M}>redrawn after Robert E. Horton, 1931, p. 193</text>
 <line x1="48" y1="98" x2="452" y2="98" stroke="#000"/>
 <text x="48" y="122" font-size="14" font-weight="700">THE BASELINE</text>
 <text x="48" y="140" font-size="13" ${M}>Water leaves the sea as vapour, falls as</text>
 <text x="48" y="156" font-size="13" ${M}>rain, and splits at the ground: part soaks</text>
 <text x="48" y="172" font-size="13" ${M}>in, part runs off, part goes back to the</text>
 <text x="48" y="188" font-size="13" ${M}>air. Nothing in this diagram belongs</text>
 <text x="48" y="204" font-size="13" ${M}>to anyone.</text>
</g>`);

// ---------- legend strip
const Y0 = 1092;
add(`<line x1="30" y1="${Y0 - 34}" x2="1570" y2="${Y0 - 34}" stroke="#000" stroke-width="2"/>`);
add(`<text x="30" y="${Y0}" font-size="22" ${F} font-weight="700">THIRTEEN STEPS OF THE CYCLE</text>`);
add(`<text x="1570" y="${Y0}" text-anchor="end" font-size="13" ${M}>the same numbers mark where the hail cannon and the tiemperos act</text>`);
const legend = [
  ['EVAPORATION', 'the sun lifts water vapour off the sea'],
  ['MOIST AIR CARRIED INLAND', 'wind moves the vapour over the land'],
  ['CONDENSATION', 'rising air cools and the vapour becomes cloud'],
  ['PRECIPITATION', 'rain, hail or snow falls from the cloud'],
  ['INTERCEPTION', 'leaves and crops catch part of the rain'],
  ['TRANSPIRATION', 'plants return water to the air through leaves'],
  ['EVAPORATION FROM LAND', 'soil, ponds and puddles dry under the sun'],
  ['INFILTRATION', 'rain soaks in through the ground surface'],
  ['SURFACE RUNOFF', 'what cannot soak in flows downhill over the ground'],
  ['SOIL MOISTURE', 'water held in the soil, where roots take it up'],
  ['PERCOLATION', 'water drains deeper, down to the water table'],
  ['GROUND-WATER FLOW', 'slow flow underground to springs, streams, the sea'],
  ['STREAM FLOW', 'channels carry the water back to the sea'],
];
legend.forEach(([t, d], i) => {
  const col = i < 7 ? 0 : 1, row = i < 7 ? i : i - 7;
  const x = 30 + col * 790, y = Y0 + 44 + row * 52;
  num(x + 14, y, i + 1);
  add(`<text x="${x + 40}" y="${y - 2}" font-size="15" ${F} font-weight="700">${t}</text>`);
  add(`<text x="${x + 40}" y="${y + 16}" font-size="13" ${M}>${d}</text>`);
});
add(`<text x="820" y="${Y0 + 44 + 6 * 52 + 4}" font-size="12" ${M}>Wording and layout are new; check the terms against Horton’s original figure.</text>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1500" role="img" aria-labelledby="t d">
<title id="t">The hydrologic cycle, redrawn after Horton (1931)</title>
<desc id="d">Line drawing: a cross-section from the sea to a hillside. Water evaporates from the sea, is carried inland as cloud, falls as rain on trees and fields, soaks into the soil or runs off downhill, and returns to the sea through streams and ground water. Thirteen numbered steps are listed below.</desc>
${s.join('\n')}
</svg>`;
fs.writeFileSync(out, svg);
console.log((svg.length / 1024).toFixed(1) + ' KB');
