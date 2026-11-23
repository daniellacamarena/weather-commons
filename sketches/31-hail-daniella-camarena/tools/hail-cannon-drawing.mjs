// Builds a black-and-white line drawing of the VW Puebla hail cannon (2018) as SVG.
import fs from 'fs';
import { step, stepKey } from './horton-steps.mjs';
const out = process.argv[2];
const F = "font-family=\"'IBM Plex Sans Condensed','Arial Narrow',Arial,sans-serif\"";
const M = "font-family=\"'IBM Plex Mono',Consolas,monospace\"";
const G = 900;                       // ground line
const km = v => G - 60 * v;          // altitude (km above ground) -> y
let s = [];
const add = x => s.push(x);

// ---------- defs
add(`<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#000" stroke-width="0.8"/></pattern>
<symbol id="car" viewBox="-2 -2 124 44" overflow="visible">
 <path d="M2,30 L4,19 Q8,14 24,13 L38,3 Q42,0 50,0 L80,0 Q87,0 93,6 L104,13 Q118,14 120,21 L120,30 Z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
 <path d="M41,13 L49,4 L64,4 L64,13 Z M68,4 L84,4 Q88,4 92,9 L95,13 L68,13 Z" fill="#fff" stroke="#000" stroke-width="1.5"/>
 <line x1="66" y1="15" x2="66" y2="28" stroke="#000" stroke-width="1.2"/>
 <circle cx="26" cy="30" r="8.5" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="26" cy="30" r="3" fill="#000"/>
 <circle cx="96" cy="30" r="8.5" fill="#fff" stroke="#000" stroke-width="2"/><circle cx="96" cy="30" r="3" fill="#000"/>
</symbol>
</defs>`);
add(`<rect width="1600" height="1500" fill="#fff"/>`);

// ---------- altitude scale (right edge)
const AX = 1555;
add(`<g stroke="#000" fill="none" stroke-width="1.5"><line x1="${AX}" y1="${km(12.5)}" x2="${AX}" y2="${G}"/>`);
for (let k = 0; k <= 12; k++) add(`<line x1="${AX - (k % 2 ? 5 : 10)}" y1="${km(k)}" x2="${AX}" y2="${km(k)}"/>`);
add(`</g>`);
for (let k = 0; k <= 12; k += 2) add(`<text x="${AX - 14}" y="${km(k) + 4}" text-anchor="end" font-size="13" ${M}>${k}</text>`);
add(`<text x="${AX}" y="${km(12.5) - 12}" text-anchor="end" font-size="13" ${F} font-weight="600">km above ground</text>`);
// temperature levels (dashed, across the cloud)
const lev = [[2.7, '0 °C freezing level'], [3.6, '−10 °C'], [6.1, '−30 °C'], [6.9, '−40 °C: all ice']];
for (const [k, t] of lev) {
  add(`<line x1="1310" y1="${km(k)}" x2="${AX - 12}" y2="${km(k)}" stroke="#000" stroke-width="1" stroke-dasharray="3 5"/>`);
  add(`<text x="${AX - 20}" y="${km(k) - 6}" text-anchor="end" font-size="13" ${M}>${t}</text>`);
}

// ---------- cumulonimbus
const anvil = `M738,318 C736,268 640,246 440,222 Q452,196 500,190 Q800,168 1250,178 Q1296,184 1310,204 C1120,228 924,256 904,318 Z`;
const lobes = [
  [660,745,50],[720,725,64],[800,715,74],[880,720,68],[955,735,52],[995,755,34],[625,760,34],
  [680,650,60],[760,610,84],[860,600,88],[935,650,62],
  [720,530,70],[820,490,100],[915,530,72],
  [760,400,80],[855,380,90],[815,320,82],[770,270,58],[870,272,66]
];
add(`<g fill="#000">${lobes.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r + 1.6}"/>`).join('')}</g>`);
add(`<g fill="#fff">${lobes.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r - 1.6}"/>`).join('')}</g>`);
add(`<path d="${anvil}" fill="#fff" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`);
add(`<path d="M520,206 Q800,186 1180,190 M600,222 Q860,204 1200,204 M760,250 Q880,232 1060,226" fill="none" stroke="#000" stroke-width="1"/>`);
// flat base
add(`<rect x="560" y="${km(2) + 1}" width="480" height="60" fill="#fff"/>`);
add(`<line x1="598" y1="${km(2)}" x2="1012" y2="${km(2)}" stroke="#000" stroke-width="3"/>`);
// inner texture arcs
add(`<path d="M700,690 q30,-30 70,-10 M820,640 q40,-35 85,-8 M740,560 q35,-30 80,-5 M850,450 q40,-35 80,0 M770,340 q30,-25 70,-2" fill="none" stroke="#000" stroke-width="1.2"/>`);
// hail growth zone (-10 to -30 C) hatched band clipped to the cloud core
add(`<clipPath id="core"><rect x="700" y="${km(6.1)}" width="230" height="${km(3.6) - km(6.1)}" rx="40"/></clipPath>`);
add(`<rect x="700" y="${km(6.1)}" width="230" height="${km(3.6) - km(6.1)}" rx="40" fill="url(#hatch)" opacity="0.35"/>`);
const hail = [[730,600,5],[760,570,4],[790,640,6],[830,555,5],[870,600,7],[900,575,4],[845,650,5],[760,650,4],[880,640,5],[810,600,4]];
add(hail.map(([x,y,r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#000" stroke-width="1.6"/>`).join(''));
// updraft
add(`<path d="M815,${km(2) + 40} C812,700 822,600 815,430" fill="none" stroke="#000" stroke-width="3" marker-end="url(#ah)"/>`);
add(`<path d="M780,${km(2) + 30} C770,720 790,640 782,560" fill="none" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`);
add(`<path d="M852,${km(2) + 30} C860,720 842,640 850,560" fill="none" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`);

// cloud labels (leader lines to the left/right)
const label = (x1,y1,x2,y2,lines,anchor='start') => {
  add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="1"/><circle cx="${x1}" cy="${y1}" r="3" fill="#000"/>`);
  lines.forEach((t,i) => add(`<text x="${x2 + (anchor==='start'?6:-6)}" y="${y2 + 4 + i*17}" text-anchor="${anchor}" font-size="${i?13:15}" ${i?M:F} font-weight="${i?400:700}">${t}</text>`));
};
label(1200,200,1300,70,['ANVIL','ice cirrus spread by winds','at 11–13 km']);
label(925,560,1030,470,['HAIL GROWTH ZONE','−10 to −30 °C, 3.5–6 km up','hailstones ride the updraft'], 'start');
label(815,470,1030,395,['UPDRAFT','10–25 m/s inside the tower'], 'start');
label(1005,km(2),1040,690,['CLOUD BASE','1.5–2 km above the fields'], 'start');

// ---------- the plant (left)
add(`<g stroke="#000" stroke-width="2" fill="#fff" stroke-linejoin="round">`);
// sawtooth factory hall
let saw = `M40,${G} L40,820`; for (let x = 40; x < 420; x += 48) saw += ` L${x + 36},790 L${x + 36},820 L${x + 48},820`; saw += ` L420,${G} Z`;
add(`<path d="${saw}"/>`);
for (let x = 52; x < 410; x += 48) add(`<line x1="${x}" y1="${G - 40}" x2="${x}" y2="${G}" stroke-width="1"/>`);
// radar on roof
add(`<line x1="372" y1="790" x2="372" y2="762"/><path d="M352,762 A20,20 0 0 1 392,762 Z"/>`);
add(`</g>`);
// cars: two rows
for (let i = 0; i < 4; i++) add(`<use href="#car" x="${40 + i * 108}" y="${G + 2}" width="96" height="35"/>`);
for (let i = 0; i < 4; i++) add(`<use href="#car" x="${12 + i * 120}" y="${G + 46}" width="110" height="40"/>`);
add(`<line x1="20" y1="${G + 42}" x2="500" y2="${G + 42}" stroke="#000" stroke-width="1" stroke-dasharray="10 6"/>`);
label(372,762,330,700,['WEATHER RADAR','triggers the cannon automatically'], 'end');
add(`<text x="40" y="${G + 122}" font-size="15" ${F} font-weight="700">VW PLANT · new cars parked in the open</text>`);

// ---------- hail cannon (enlarged, not to scale)
const CX = 560;
add(`<g stroke="#000" stroke-width="2.2" fill="#fff" stroke-linejoin="round">
 <rect x="${CX - 34}" y="${G - 26}" width="68" height="26"/>
 <rect x="${CX - 70}" y="${G - 30}" width="22" height="30" rx="9"/>
 <path d="M${CX - 48},${G - 16} L${CX - 34},${G - 16}" fill="none"/>
 <path d="M${CX - 9},${G - 26} L${CX - 26},${G - 78} L${CX + 26},${G - 78} L${CX + 9},${G - 26} Z"/>
 <ellipse cx="${CX}" cy="${G - 78}" rx="26" ry="5"/>
</g>`);
add(`<text x="${CX - 59}" y="${G - 10}" text-anchor="middle" font-size="9" ${M}>C₂H₂</text>`);
// shock wave rings, fading out well below the cloud
[16, 30, 44, 58, 72].forEach((r, i) => add(`<path d="M${CX - r},${G - 82} A${r},${r * 0.75} 0 0 1 ${CX + r},${G - 82}" fill="none" stroke="#000" stroke-width="${2.4 - i * 0.45}" ${i > 1 ? `stroke-dasharray="${2 + i} ${3 + i * 2}"` : ''}/>`));
// gap dimension
const gy1 = G - 140, gy2 = km(2);
add(`<line x1="${CX}" y1="${gy1}" x2="${CX}" y2="${gy2 + 4}" stroke="#000" stroke-width="1.2" stroke-dasharray="2 4"/>`);
add(`<text x="${CX - 8}" y="${(gy1 + gy2) / 2 + 5}" text-anchor="end" font-size="12" ${M}>?</text>`);
label(CX - 24, G - 64, 330, 600, ['HAIL CANNON (drawn enlarged)','acetylene blast, one every ~7 s','~120 dB at the mouth'], 'end');
label(CX - 40, G - 128, 330, 480, ['SHOCK WAVE','fades to ordinary sound within','tens of metres; cloud base is','1,500–2,000 m higher'], 'start');

// ---------- the fields (right)
// furrows in perspective
for (let i = 0; i < 9; i++) { const x = 1060 + i * 60; add(`<line x1="${x}" y1="${G}" x2="${x + (i - 4) * 22}" y2="1010" stroke="#000" stroke-width="1"/>`); }
// cracked soil
const cracks = [[1090,930],[1200,960],[1330,925],[1440,965],[1260,985],[1500,935]];
for (const [x, y] of cracks) add(`<path d="M${x - 30},${y} l14,-6 l10,8 l14,-7 l12,6 M${x - 6},${y + 2} l4,12 M${x + 10},${y - 5} l-3,-10" fill="none" stroke="#000" stroke-width="1.2"/>`);
// wilted maize
const corn = (x, b, h) => add(`<g fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round">
 <path d="M${x},${b} Q${x + 3},${b - h * .6} ${x + 10},${b - h}"/>
 <path d="M${x + 2},${b - h * .3} q-22,0 -30,22"/><path d="M${x + 4},${b - h * .5} q24,-2 30,24"/>
 <path d="M${x + 7},${b - h * .75} q-20,4 -24,26"/><path d="M${x + 10},${b - h} q10,6 12,20"/></g>`);
[[1060,G,62],[1120,G,55],[1250,G,60],[1310,G,52],[1380,G,58],[1470,G,50],[1500,G+60,70],[1110,G+62,72]].forEach(c => corn(...c));
// farmers
const farmer = (x, b, look) => add(`<g fill="#fff" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <circle cx="${x}" cy="${b - 64}" r="9"/>
 <ellipse cx="${x}" cy="${b - 70}" rx="22" ry="5"/><path d="M${x - 9},${b - 71} Q${x},${b - 90} ${x + 9},${b - 71}"/>
 <path d="M${x},${b - 55} L${x},${b - 24} M${x},${b - 24} L${x - 10},${b} M${x},${b - 24} L${x + 10},${b}" fill="none"/>
 ${look ? `<path d="M${x},${b - 48} L${x - 12},${b - 58} L${x - 6},${b - 66}" fill="none"/><path d="M${x},${b - 48} L${x + 14},${b - 34}" fill="none"/>`
        : `<path d="M${x},${b - 48} L${x + 16},${b - 38} M${x},${b - 48} L${x + 14},${b - 52}" fill="none"/><path d="M${x + 22},${b - 75} L${x + 10},${b + 2} M${x + 4},${b + 2} L${x + 18},${b + 2}" fill="none"/>`}
</g>`);
farmer(1200, G + 70, true); farmer(1260, G + 74, false); farmer(1390, G + 66, true);
// sun with no rain
add(`<g stroke="#000" stroke-width="2" fill="#fff"><circle cx="1430" cy="400" r="30"/>${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${1430 + Math.cos(a) * 40}" y1="${400 + Math.sin(a) * 40}" x2="${1430 + Math.cos(a) * 54}" y2="${400 + Math.sin(a) * 54}"/>`; }).join('')}</g>`);
// rain that never arrives: short dashed streaks stopping in mid-air under the cloud's right flank
for (let i = 0; i < 7; i++) { const x = 905 + i * 15; add(`<line x1="${x}" y1="${km(2) + 10}" x2="${x - 8}" y2="${km(2) + 40 + (i % 3) * 8}" stroke="#000" stroke-width="1.2" stroke-dasharray="4 5"/>`); }
label(965, km(2) + 52, 1130, 800, ['NO RAIN ON THE FIELDS','July 2018: 20–35% of normal rain'], 'start');
add(`<text x="1040" y="${G + 122}" font-size="15" ${F} font-weight="700">FARMLAND · ~2,000 ha of rain-fed maize claimed lost</text>`);

// ground line
add(`<line x1="20" y1="${G}" x2="1580" y2="${G}" stroke="#000" stroke-width="2.5"/>`);


// ---------- cloud name
add(`<line x1="690" y1="372" x2="566" y2="372" stroke="#000" stroke-width="1"/><circle cx="690" cy="372" r="3" fill="#000"/>`);
add(`<text x="560" y="368" text-anchor="end" font-size="30" ${F} font-weight="700" letter-spacing="1">CUMULONIMBUS (Cb)</text>`);
add(`<text x="560" y="390" text-anchor="end" font-size="13" ${M}>thunderstorm cloud · the only cloud that makes hail</text>`);

// ---------- what happened next: three-step strip
const puff = (lobes, ox, oy, sc = 1, dash = '') => {
  add(`<g fill="#000">${lobes.map(([x,y,r]) => `<circle cx="${ox + x*sc}" cy="${oy + y*sc}" r="${r*sc + 1.3}"/>`).join('')}</g>`);
  add(`<g fill="#fff">${lobes.map(([x,y,r]) => `<circle cx="${ox + x*sc}" cy="${oy + y*sc}" r="${r*sc - 1.3}"/>`).join('')}</g>`);
  if (dash) add(`<g fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="${dash}">${lobes.map(([x,y,r]) => `<circle cx="${ox + x*sc}" cy="${oy + y*sc}" r="${r*sc}"/>`).join('')}</g>`);
};
const miniCannon = (x, g, blasting) => {
  add(`<g stroke="#000" stroke-width="1.6" fill="#fff"><rect x="${x-10}" y="${g-9}" width="20" height="9"/><path d="M${x-3},${g-9} L${x-9},${g-26} L${x+9},${g-26} L${x+3},${g-9} Z"/></g>`);
  if (blasting) [7, 13, 19].forEach((r, i) => add(`<path d="M${x-r},${g-28} A${r},${r*0.75} 0 0 1 ${x+r},${g-28}" fill="none" stroke="#000" stroke-width="${1.6 - i*0.4}" ${i ? 'stroke-dasharray="2 3"' : ''}/>`));
};
const Y0 = 1090, PH = 400, PW = 500, GY = Y0 + 290;
add(`<text x="30" y="${Y0 - 14}" font-size="22" ${F} font-weight="700">WHAT HAPPENED NEXT TO THE CLOUD</text>`);
add(`<text x="470" y="${Y0 - 14}" font-size="13" ${M}>a typical Puebla summer afternoon · the blasts do not change these steps</text>`);
const panels = [
  ['1 · MINUTE 0 · TOWERING CUMULUS', ['The radar sees a cumulus congestus', 'building. The cannon fires every ~7 s.', 'The blast fades near the ground;', 'the updraft keeps feeding the cloud.']],
  ['2 · +20–40 MIN · MATURE CUMULONIMBUS', ['The tower freezes and spreads an anvil.', 'Rain, and sometimes hail, falls out of', 'the cloud. How much depends on moisture,', 'wind and updraft strength.']],
  ['3 · +1 H · DISSIPATING', ['Cold downdrafts shut off the updraft.', 'The cloud rains out or evaporates, and the', 'wind carries what is left away. From the', 'ground it looks as if the cloud broke up.']]
];
panels.forEach(([title, lines], i) => {
  const x0 = 30 + i * (PW + 20), cx = x0 + PW / 2;
  add(`<rect x="${x0}" y="${Y0}" width="${PW}" height="${PH}" fill="#fff" stroke="#000" stroke-width="2"/>`);
  add(`<text x="${x0 + 14}" y="${Y0 + 26}" font-size="15" ${F} font-weight="700">${title}</text>`);
  add(`<line x1="${x0 + 10}" y1="${GY}" x2="${x0 + PW - 10}" y2="${GY}" stroke="#000" stroke-width="2"/>`);
  lines.forEach((l, j) => add(`<text x="${x0 + 14}" y="${GY + 24 + j * 17}" font-size="13" ${M}>${l}</text>`));
  if (i < 2) add(`<path d="M${x0 + PW + 2},${Y0 + PH/2} l16,0" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`);
  const base = GY - 60;
  if (i === 0) {
    puff([[-40,0,26],[-10,-6,32],[24,-2,28],[46,4,18],[-20,-40,26],[10,-48,30],[-2,-82,24],[14,-104,18]], cx, base - 14);
    add(`<rect x="${cx - 80}" y="${base + 1}" width="160" height="30" fill="#fff"/><line x1="${cx - 68}" y1="${base}" x2="${cx + 66}" y2="${base}" stroke="#000" stroke-width="2"/>`);
    [-20, 10].forEach(dx => add(`<path d="M${cx + dx},${base + 30} L${cx + dx},${base - 60}" stroke="#000" stroke-width="1.6" marker-end="url(#ah)"/>`));
    miniCannon(x0 + 70, GY, true);
    add(`<text x="${x0 + 70}" y="${GY - 54}" text-anchor="middle" font-size="11" ${M}>BOOM</text>`);
  } else if (i === 1) {
    puff([[-50,0,26],[-18,-6,32],[18,-4,32],[50,2,24],[-30,-44,30],[6,-50,36],[30,-40,26],[-10,-92,30],[16,-100,28],[0,-124,22]], cx, base - 14);
    add(`<path d="M${cx - 26},${base - 128} C${cx - 30},${base - 150} ${cx - 90},${base - 158} ${cx - 150},${base - 164} Q${cx - 120},${base - 178} ${cx - 60},${base - 180} L${cx + 140},${base - 182} Q${cx + 176},${base - 176} ${cx + 186},${base - 166} C${cx + 100},${base - 156} ${cx + 30},${base - 150} ${cx + 26},${base - 128} Z" fill="#fff" stroke="#000" stroke-width="2"/>`);
    add(`<rect x="${cx - 80}" y="${base + 1}" width="160" height="30" fill="#fff"/><line x1="${cx - 78}" y1="${base}" x2="${cx + 76}" y2="${base}" stroke="#000" stroke-width="2"/>`);
    for (let k = 0; k < 9; k++) add(`<line x1="${cx - 50 + k * 13}" y1="${base + 6}" x2="${cx - 58 + k * 13}" y2="${GY - 4}" stroke="#000" stroke-width="1.2" stroke-dasharray="5 4"/>`);
    [[-30,40],[6,58],[32,30]].forEach(([dx, dy]) => add(`<circle cx="${cx + dx}" cy="${base + dy}" r="3.5" fill="#fff" stroke="#000" stroke-width="1.4"/>`));
    miniCannon(x0 + 70, GY, true);
  } else {
    puff([[-30,0,22],[4,-6,26],[36,0,20],[-8,-38,20],[20,-44,16]], cx + 20, base - 30, 1, '6 10');
    add(`<path d="M${cx - 170},${base - 150} Q${cx - 60},${base - 170} ${cx + 120},${base - 160} Q${cx + 40},${base - 146} ${cx - 170},${base - 150} Z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-dasharray="8 5"/>`);
    add(`<text x="${cx - 160}" y="${base - 174}" font-size="11" ${M}>anvil remnant</text>`);
    [-20, 30].forEach(dx => add(`<path d="M${cx + dx},${base + 4} L${cx + dx},${base + 56}" stroke="#000" stroke-width="1.6" marker-end="url(#ah)"/>`));
    add(`<text x="${cx - 10}" y="${base + 74}" text-anchor="middle" font-size="11" ${M}>downdraft</text>`);
    add(`<path d="M${cx + 90},${base - 70} l90,0" stroke="#000" stroke-width="2" marker-end="url(#ah)"/><text x="${cx + 92}" y="${base - 78}" font-size="11" ${M}>wind</text>`);
    for (let k = 0; k < 5; k++) add(`<line x1="${cx + 150 + k * 12}" y1="${base - 40}" x2="${cx + 144 + k * 12}" y2="${GY - 4}" stroke="#000" stroke-width="1.1" stroke-dasharray="4 5"/>`);
    add(`<text x="${cx + 200}" y="${base - 48}" text-anchor="end" font-size="11" ${M}>rain falls elsewhere</text>`);
    miniCannon(x0 + 70, GY, false);
  }
});

// ---------- fact box (top-left)
add(`<g ${F}>
 <rect x="30" y="28" width="400" height="300" fill="#fff" stroke="#000" stroke-width="2"/>
 <text x="48" y="62" font-size="22" font-weight="700">HOW THE HAIL CANNON WORKED</text>
 <text x="48" y="84" font-size="13" ${M}>VW Puebla plant · Cuautlancingo · 2018</text>
 <line x1="48" y1="98" x2="412" y2="98" stroke="#000"/>
 <text x="48" y="122" font-size="14" font-weight="700">TARGET CLOUD</text>
 <text x="48" y="140" font-size="13" ${M}>Cumulonimbus (Cb), fired on as soon</text>
 <text x="48" y="156" font-size="13" ${M}>as cumulus congestus began to tower</text>
 <text x="48" y="182" font-size="14" font-weight="700">FIRING</text>
 <text x="48" y="200" font-size="13" ${M}>3 devices · 1 blast / ~7 s = 514 / h each</text>
 <text x="48" y="216" font-size="13" ${M}>Automatic: May → 20 Aug 2018</text>
 <text x="48" y="242" font-size="14" font-weight="700">HOW MANY TIMES?</text>
 <text x="48" y="260" font-size="13" ${M}>No public count. Permit: 2 h/yr</text>
 <text x="48" y="276" font-size="13" ${M}>≈ 3,100 blasts. 66 rainy days in the</text>
 <text x="48" y="292" font-size="13" ${M}>automatic period; at 1 h per storm</text>
 <text x="48" y="308" font-size="13" ${M}>≈ 100,000 blasts (estimate)</text>
</g>`);

// ---------- Horton steps (see horton-cycle-drawing.svg)
add(step(650, 690, 3, true)); add(step(680, 712, 4, true));          // what the cannon claims to change, inside the cloud
add(step(1010, 828, 4));                                             // rain that did not reach the fields
add(step(512, 944, 9));                                              // paved car lot
add(step(1160, 968, 8)); add(step(1548, 930, 10));                   // dry fields
add(stepKey(574, 912, 452, [
  [[3, 4], true,  'claimed: blasts break up hail in the cloud'],
  [[4], false,    'what happened: little rain on the fields'],
  [[9], false,    'paved lot: rain runs off, does not soak in'],
  [[8, 10], false,'dry fields: no infiltration, no soil water'],
]));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 1500" role="img" aria-labelledby="t d">
<title id="t">How the VW Puebla hail cannon worked, 2018</title>
<desc id="d">Line drawing: a hail cannon at the car plant fires shock waves toward a cumulonimbus cloud; new cars are parked on the left, farmers stand in dry maize fields on the right.</desc>
${s.join('\n')}
</svg>`;
fs.writeFileSync(out, svg);
console.log((svg.length / 1024).toFixed(1) + ' KB');
