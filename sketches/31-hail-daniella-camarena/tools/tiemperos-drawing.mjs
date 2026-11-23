// Black-and-white line drawing: tiemperos / graniceros calling rain at the volcanoes.
// Usage: node tiemperos-drawing.mjs out.svg
import fs from 'fs';
import { step, stepKey } from './horton-steps.mjs';
const out = process.argv[2];
const F = "font-family=\"'IBM Plex Sans Condensed','Arial Narrow',Arial,sans-serif\"";
const M = "font-family=\"'IBM Plex Mono',Consolas,monospace\"";
const G = 900;                                  // valley floor, ~2,200 m
const alt = m => G - (m - 2200) * 0.21;         // metres above sea level -> y
const s = []; const add = x => s.push(x);

add(`<defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#000"/></marker>
<clipPath id="lens"><circle cx="235" cy="560" r="148"/></clipPath>
</defs>`);
add(`<rect width="1600" height="1500" fill="#fff"/>`);

// ---------- helpers
const label = (x1, y1, x2, y2, lines, anchor = 'start') => {
  add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="1"/><circle cx="${x1}" cy="${y1}" r="3" fill="#000"/>`);
  lines.forEach((t, i) => add(`<text x="${x2 + (anchor === 'start' ? 6 : -6)}" y="${y2 + 4 + i * 17}" text-anchor="${anchor}" font-size="${i ? 13 : 15}" ${i ? M : F} font-weight="${i ? 400 : 700}">${t}</text>`));
};
const puff = (lobes, ox, oy, sc = 1) => {
  add(`<g fill="#000">${lobes.map(([x, y, r]) => `<circle cx="${ox + x * sc}" cy="${oy + y * sc}" r="${r * sc + 1.5}"/>`).join('')}</g>`);
  add(`<g fill="#fff">${lobes.map(([x, y, r]) => `<circle cx="${ox + x * sc}" cy="${oy + y * sc}" r="${r * sc - 1.5}"/>`).join('')}</g>`);
};
const flatBase = (x1, x2, y) => add(`<rect x="${x1 - 6}" y="${y + 1}" width="${x2 - x1 + 12}" height="40" fill="#fff"/><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#000" stroke-width="2.4"/>`);
const cross = (x, b, h, flowers = true, sw = 2) => {
  add(`<g stroke="#000" stroke-width="${sw}" stroke-linecap="round" fill="#fff"><line x1="${x}" y1="${b}" x2="${x}" y2="${b - h}"/><line x1="${x - h * .32}" y1="${b - h * .7}" x2="${x + h * .32}" y2="${b - h * .7}"/>`);
  if (flowers) for (const [dx, dy] of [[0, -h - 4], [-h * .38, -h * .7], [h * .38, -h * .7], [-5, -h * .45], [6, -h * .52]])
    add(`<circle cx="${x + dx}" cy="${b + dy}" r="${Math.max(2.5, h * .06)}"/><circle cx="${x + dx}" cy="${b + dy}" r="${Math.max(1, h * .02)}" fill="#000"/>`);
  add(`</g>`);
};
// person: pose = call | carry | kneel | stand ; scale 1 = 80px tall
const person = (x, b, pose, sc = 1, hat = true) => {
  const k = v => v * sc;
  let p = `<g fill="#fff" stroke="#000" stroke-width="${2 * Math.max(.7, sc)}" stroke-linecap="round" stroke-linejoin="round">`;
  const hy = pose === 'kneel' ? b - k(52) : b - k(70);
  p += `<circle cx="${x}" cy="${hy}" r="${k(9)}"/>`;
  if (hat) p += `<ellipse cx="${x}" cy="${hy - k(6)}" rx="${k(17)}" ry="${k(4)}"/><path d="M${x - k(8)},${hy - k(7)} Q${x},${hy - k(24)} ${x + k(8)},${hy - k(7)}"/>`;
  const sh = hy + k(14), hip = pose === 'kneel' ? b - k(16) : b - k(28);
  p += `<path d="M${x},${hy + k(9)} L${x},${hip}" fill="none"/>`;
  if (pose === 'kneel') p += `<path d="M${x},${hip} L${x + k(16)},${b} L${x + k(32)},${b}" fill="none"/>`;
  else p += `<path d="M${x},${hip} L${x - k(10)},${b} M${x},${hip} L${x + k(10)},${b}" fill="none"/>`;
  if (pose === 'call') p += `<path d="M${x},${sh} L${x - k(18)},${sh - k(22)} M${x},${sh} L${x + k(18)},${sh - k(22)}" fill="none"/>`;
  if (pose === 'carry') p += `<path d="M${x},${sh} L${x + k(16)},${sh + k(8)} M${x},${sh} L${x + k(12)},${sh + k(12)}" fill="none"/><path d="M${x + k(8)},${sh + k(6)} h${k(26)} l${-k(4)},${k(14)} h${-k(18)} z"/><path d="M${x + k(12)},${sh + k(6)} q${k(9)},${-k(12)} ${k(18)},0" fill="none"/>`;
  if (pose === 'kneel') p += `<path d="M${x},${sh} L${x - k(14)},${sh + k(14)} M${x},${sh} L${x + k(14)},${sh + k(14)}" fill="none"/>`;
  if (pose === 'stand') p += `<path d="M${x},${sh} L${x - k(10)},${sh + k(22)} M${x},${sh} L${x + k(10)},${sh + k(22)}" fill="none"/>`;
  add(p + `</g>`);
};

// ---------- Iztaccíhuatl (behind, right): the sleeping woman, 5,230 m
const iz = `M960,${G} C1000,760 1030,560 1070,430 Q1100,372 1150,352 Q1185,330 1215,${alt(5050)} Q1250,${alt(4980)} 1280,${alt(5100)} Q1320,${alt(5230)} 1360,${alt(5200)} Q1400,${alt(5000)} 1435,${alt(4900)} Q1470,${alt(4950)} 1495,${alt(4800)} Q1530,430 1560,560 L1600,${G} Z`;
add(`<path d="${iz}" fill="#fff" stroke="#000" stroke-width="2.4" stroke-linejoin="round"/>`);
add(`<path d="M1110,375 q40,10 70,-10 M1230,${alt(4900)} q40,12 80,-6 q40,-14 80,10 M1450,${alt(4800)} q25,8 50,0" fill="none" stroke="#000" stroke-width="1.2" stroke-dasharray="5 4"/>`);
add(`<text x="1360" y="${alt(5230) - 22}" text-anchor="middle" font-size="16" ${F} font-weight="700">IZTACCÍHUATL · 5,230 m</text>`);
add(`<text x="1360" y="${alt(5230) - 6}" text-anchor="middle" font-size="12" ${M}>“Rosita”, Rosa Manuela</text>`);

// ---------- Popocatépetl (front, left): 5,426 m with crater and plume
const top = alt(5426);
const popo = `M330,${G} C400,760 500,470 620,${top + 6} L640,${top} Q672,${top + 14} 700,${top} L722,${top + 6} C860,440 1000,720 1120,${G} Z`;
add(`<path d="${popo}" fill="#fff" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`);
// snow line and ravines
add(`<path d="M560,${alt(4800)} q30,14 60,0 q30,-14 60,4 q30,14 70,-2 q24,-10 44,8" fill="none" stroke="#000" stroke-width="1.3" stroke-dasharray="6 4"/>`);
add(`<path d="M612,${top + 30} l-30,110 l-18,120 M650,${top + 16} l-6,150 l8,140 M700,${top + 26} l26,130 l30,120 M590,${alt(4500)} l-40,130 l-50,150 M760,${alt(4400)} l50,140" fill="none" stroke="#000" stroke-width="1"/>`);
// fumarole
add(`<path d="M668,${top - 4} c-10,-30 20,-40 6,-70 c-12,-26 18,-40 12,-66 M684,${top - 4} c14,-26 -6,-46 16,-74 c18,-22 6,-40 22,-58" fill="none" stroke="#000" stroke-width="1.6" stroke-dasharray="2 5"/>`);
add(`<rect x="560" y="${alt(4650) - 18}" width="224" height="40" fill="#fff"/>`);
add(`<text x="672" y="${alt(4650)}" text-anchor="middle" font-size="16" ${F} font-weight="700">POPOCATÉPETL · 5,426 m</text>`);
add(`<text x="672" y="${alt(4650) + 16}" text-anchor="middle" font-size="12" ${M}>“Don Goyo”, Gregorio Popocatépetl</text>`);

// ---------- upslope wind and new clouds (orographic lift)
[[860, 760, 800, 560], [930, 700, 870, 520], [1010, 760, 1040, 560], [470, 800, 520, 640]].forEach(([x1, y1, x2, y2]) =>
  add(`<path d="M${x1},${y1} Q${(x1 + x2) / 2 + 20},${(y1 + y2) / 2} ${x2},${y2}" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="8 5" marker-end="url(#ah)"/>`));
// cumulonimbus building over Paso de Cortés, between the two volcanoes
const cb = [[860, 360, 46], [905, 345, 56], [960, 350, 50], [1000, 368, 34], [830, 372, 30], [880, 290, 50], [935, 280, 56], [905, 220, 50], [930, 165, 40], [890, 175, 34]];
puff(cb, 0, 0);
flatBase(822, 1018, 384);
add(`<path d="M888,190 C884,150 830,130 760,118 Q820,96 1000,96 Q1090,100 1120,114 C1040,124 978,150 972,190 Z" fill="#fff" stroke="#000" stroke-width="2.2"/>`);
// rain shaft to the fields
for (let i = 0; i < 12; i++) add(`<line x1="${838 + i * 14}" y1="392" x2="${820 + i * 14}" y2="${G + 60 + (i % 3) * 10}" stroke="#000" stroke-width="1.1" stroke-dasharray="7 6"/>`);
// small cumulus on the flanks

puff([[0, 0, 16], [20, -6, 20], [40, 0, 14]], 1150, 250); flatBase(1136, 1196, 264);

label(1000, 300, 1180, 160, ['CUMULONIMBUS forming over the pass', 'moist air forced up the slopes cools,', 'condenses and builds afternoon storms'], 'start');

// ---------- ritual sites on the mountains
const ox = 486, oy = alt(4200);
add(`<path d="M${ox - 14},${oy + 2} q14,-14 28,0" fill="#fff" stroke="#000" stroke-width="2"/>`);
cross(ox - 4, oy, 16, false, 1.6); cross(ox + 6, oy, 16, false, 1.6);
add(`<line x1="${ox - 20}" y1="${oy}" x2="400" y2="${oy}" stroke="#000" stroke-width="1" stroke-dasharray="2 4"/>`);
const ax = 1022, ay = alt(3200);
add(`<path d="M${ax - 16},${ay + 4} q16,-22 32,0 z" fill="#000"/>`); cross(ax + 22, ay + 4, 20, false, 1.8);
label(ax + 26, ay - 10, 1120, 640, ['CUEVA DE ALCALICAN · ~3,200 m', 'cave shrine with a large cross,', 'paper flowers, pottery and food', '(as described by a local blog)'], 'start');

// ---------- magnifier: the ceremony at El Ombligo
add(`<line x1="383" y1="545" x2="${ox - 16}" y2="${oy + 4}" stroke="#000" stroke-width="1.2"/>`);
add(`<circle cx="235" cy="560" r="150" fill="#fff" stroke="#000" stroke-width="3"/>`);
add(`<g clip-path="url(#lens)">`);
add(`<path d="M80,640 Q200,610 300,600 Q360,594 400,570 L400,720 L80,720 Z" fill="#fff" stroke="#000" stroke-width="2"/>`);
add(`<path d="M270,600 q20,-30 50,-28 q30,2 40,22" fill="#fff" stroke="#000" stroke-width="2"/><path d="M285,596 q16,-18 38,-16" fill="none" stroke="#000" stroke-width="1"/>`);
cross(300, 604, 70); cross(338, 598, 62);
// offerings on a cloth
add(`<path d="M200,628 l70,-8 l8,16 l-72,8 z" fill="#fff" stroke="#000" stroke-width="1.6"/>`);
[[218, 628], [240, 625], [262, 622]].forEach(([x, y]) => add(`<path d="M${x - 8},${y - 4} q8,10 16,0 z" fill="#fff" stroke="#000" stroke-width="1.5"/><path d="M${x - 4},${y - 8} q4,-6 8,0" fill="none" stroke="#000" stroke-width="1"/>`));
person(175, 632, 'call', 1.05, true);
person(120, 648, 'carry', .9, true);
person(240, 655, 'kneel', .85, false);
person(90, 655, 'stand', .8, true);
add(`</g>`);
add(`<text x="235" y="430" text-anchor="middle" font-size="14" ${F} font-weight="700">EL OMBLIGO · ~4,200 m</text>`);
add(`<text x="235" y="730" text-anchor="middle" font-size="12" ${M}>two crosses with red flowers,</text>`);
add(`<text x="235" y="746" text-anchor="middle" font-size="12" ${M}>facing the fields below</text>`);
label(160, 592, 40, 800, ['THE TIEMPERO CALLS THE CLOUDS', '“Yo les grito y ellos vienen”', '(I call out to them and they come)', 'Cenobio Jiménez, Ozolco, 2025'], 'start');
label(128, 670, 40, 878, [], 'start');
add(`<text x="46" y="882" font-size="13" ${M}>villagers carry mole, tacos and fruit</text>`);
add(`<text x="46" y="898" font-size="13" ${M}>to feed the volcano, then pray and sing</text>`);


// ---------- valley and green fields
add(`<line x1="0" y1="${G}" x2="1600" y2="${G}" stroke="#000" stroke-width="2.5"/>`);
for (let i = 0; i < 14; i++) { const x = 560 + i * 70; add(`<line x1="${x}" y1="${G}" x2="${x + (i - 7) * 24}" y2="1010" stroke="#000" stroke-width="1"/>`); }
const corn = (x, b, h) => add(`<g fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round">
 <path d="M${x},${b} L${x},${b - h}"/><path d="M${x},${b - h} l-6,-12 M${x},${b - h} l6,-12 M${x},${b - h} l0,-14"/>
 <path d="M${x},${b - h * .3} q-24,-10 -34,-30"/><path d="M${x},${b - h * .45} q24,-10 32,-32"/><path d="M${x},${b - h * .65} q-18,-8 -26,-26"/>
 <path d="M${x + 1},${b - h * .55} q10,-4 8,-22 q-10,6 -8,22 z" fill="#fff"/></g>`);
[[620, G + 10, 70], [700, G + 30, 80], [790, G + 6, 66], [880, G + 40, 86], [980, G + 12, 70], [1070, G + 36, 84], [1170, G + 8, 66], [1270, G + 34, 82], [1370, G + 10, 70], [1470, G + 38, 86], [1540, G + 6, 64]].forEach(c => corn(...c));
add(`<text x="1040" y="1032" font-size="15" ${F} font-weight="700">RAIN-FED MILPA · maize, beans and squash, ~2,200 m</text>`);
// ethnographic quote (Glockner 2008, Ciencias 90, p. 75)
add(`<g>
 <rect x="30" y="928" width="480" height="116" fill="#fff" stroke="#000" stroke-width="2"/>
 <line x1="30" y1="928" x2="30" y2="1044" stroke="#000" stroke-width="6"/>
 <text x="50" y="952" font-size="12" ${F} font-weight="700">FROM THE ETHNOGRAPHY</text>
 <text x="50" y="976" font-size="17" ${F} font-weight="700">“Una nube, quieta o en movimiento,</text>
 <text x="50" y="996" font-size="17" ${F} font-weight="700">es la expresión de una voluntad”</text>
 <text x="50" y="1015" font-size="12" ${M}>(a cloud, still or moving, is the expression of a will)</text>
 <text x="50" y="1033" font-size="12" ${M}>Julio Glockner, “La nube y el sueño”, Ciencias 90, 2008</text>
</g>`)

// ---------- fact box (top-left)
add(`<g ${F}>
 <rect x="30" y="28" width="420" height="330" fill="#fff" stroke="#000" stroke-width="2"/>
 <text x="48" y="62" font-size="22" font-weight="700">CALLING THE RAIN</text>
 <text x="48" y="84" font-size="13" ${M}>Popocatépetl and Iztaccíhuatl, Puebla–Morelos</text>
 <line x1="48" y1="98" x2="432" y2="98" stroke="#000"/>
 <text x="48" y="122" font-size="14" font-weight="700">WHO</text>
 <text x="48" y="140" font-size="13" ${M}>Tiemperos, graniceros, aureros; in</text>
 <text x="48" y="156" font-size="13" ${M}>Nahuatl quiapequi, “the one who makes rain”</text>
 <text x="48" y="182" font-size="14" font-weight="700">HOW THEY ARE CHOSEN</text>
 <text x="48" y="200" font-size="13" ${M}>Struck by lightning and survived (rayados),</text>
 <text x="48" y="216" font-size="13" ${M}>or called by the volcanoes in dreams</text>
 <text x="48" y="242" font-size="14" font-weight="700">WHAT THEY DO</text>
 <text x="48" y="260" font-size="13" ${M}>Climb to caves and crosses, feed the</text>
 <text x="48" y="276" font-size="13" ${M}>volcanoes, pray in Nahuatl, read the clouds</text>
 <text x="48" y="292" font-size="13" ${M}>and steer hail away from the fields</text>
 <text x="48" y="318" font-size="14" font-weight="700">THE OPPOSITE OF THE CANNON</text>
 <text x="48" y="336" font-size="13" ${M}>The cannon tried to stop clouds; they invite them</text>
</g>`);

// ---------- ritual year strip
const Y0 = 1090, PH = 380, PW = 375, GY = Y0 + 250;
add(`<text x="30" y="${Y0 - 14}" font-size="22" ${F} font-weight="700">THE RITUAL YEAR FOLLOWS THE RAINY SEASON</text>`);
add(`<text x="600" y="${Y0 - 14}" font-size="13" ${M}>in Puebla almost all rain falls from May to October</text>`);
const mini = (cx, g, h = 120) => add(`<path d="M${cx - 120},${g} C${cx - 70},${g - 40} ${cx - 30},${g - h + 10} ${cx - 10},${g - h} L${cx + 10},${g - h} C${cx + 30},${g - h + 10} ${cx + 70},${g - 40} ${cx + 120},${g} Z" fill="#fff" stroke="#000" stroke-width="2"/>`);
const panels = [
  ['12 MARCH · SAN GREGORIO', ['Don Goyo’s saint’s day, deep in the', 'dry season. Tiemperos climb with food', 'and gifts for the volcano.'], 'dry'],
  ['3 MAY · SANTA CRUZ', ['Crosses are placed on peaks and at', 'springs to ask for rain. The first', 'afternoon storms start to build.'], 'start'],
  ['30 AUGUST · SANTA ROSA', ['Day of Rosita (Iztaccíhuatl), at the', 'height of the rains and the hail', 'season. Graniceros turn hail aside.'], 'peak'],
  ['EARLY NOVEMBER · THANKSGIVING', ['The rains end. Communities give', 'thanks for the harvest and close', 'the ritual cycle.'], 'end']
];
panels.forEach(([title, lines, kind], i) => {
  const x0 = 30 + i * (PW + 16), cx = x0 + PW / 2;
  add(`<rect x="${x0}" y="${Y0}" width="${PW}" height="${PH}" fill="#fff" stroke="#000" stroke-width="2"/>`);
  add(`<text x="${x0 + 14}" y="${Y0 + 26}" font-size="15" ${F} font-weight="700">${title}</text>`);
  mini(cx - 30, GY, 120);
  add(`<line x1="${x0 + 10}" y1="${GY}" x2="${x0 + PW - 10}" y2="${GY}" stroke="#000" stroke-width="2"/>`);
  lines.forEach((l, j) => add(`<text x="${x0 + 14}" y="${GY + 26 + j * 17}" font-size="13" ${M}>${l}</text>`));
  if (i < 3) add(`<path d="M${x0 + PW + 1},${Y0 + PH / 2} l13,0" stroke="#000" stroke-width="2" marker-end="url(#ah)"/>`);
  if (kind === 'dry') {
    add(`<g stroke="#000" stroke-width="2" fill="#fff"><circle cx="${x0 + PW - 60}" cy="${Y0 + 80}" r="18"/>${[...Array(10)].map((_, a) => { const t = a * Math.PI / 5; return `<line x1="${x0 + PW - 60 + Math.cos(t) * 25}" y1="${Y0 + 80 + Math.sin(t) * 25}" x2="${x0 + PW - 60 + Math.cos(t) * 33}" y2="${Y0 + 80 + Math.sin(t) * 33}"/>`; }).join('')}</g>`);
    person(cx - 70, GY - 34, 'carry', .5, true); person(cx - 50, GY - 46, 'stand', .5, true);
  }
  if (kind === 'start') {
    cross(cx - 30, GY - 120, 26); cross(cx + 90, GY, 30);
    puff([[0, 0, 16], [20, -8, 20], [40, 0, 14], [18, -30, 14]], cx + 30, GY - 160); flatBase(cx + 16, cx + 74, GY - 144);
    add(`<text x="${cx + 108}" y="${GY - 4}" font-size="10" ${M}>spring</text>`);
    add(`<path d="M${cx + 70},${GY - 2} q12,-8 24,0" fill="none" stroke="#000" stroke-width="1.4"/>`);
  }
  if (kind === 'peak') {
    puff([[0, 0, 22], [28, -8, 28], [58, 0, 22], [16, -40, 22], [40, -46, 24], [28, -76, 20]], cx + 20, GY - 140); flatBase(cx - 2, cx + 102, GY - 118);
    for (let k = 0; k < 6; k++) add(`<line x1="${cx + 10 + k * 14}" y1="${GY - 112}" x2="${cx + 2 + k * 14}" y2="${GY - 4}" stroke="#000" stroke-width="1" stroke-dasharray="5 5"/>`);
    add(`<path d="M${cx + 104},${GY - 100} q50,10 60,70" fill="none" stroke="#000" stroke-width="1.6" stroke-dasharray="4 3" marker-end="url(#ah)"/>`);
    [[cx + 120, GY - 86], [cx + 140, GY - 70], [cx + 150, GY - 48]].forEach(([x, y]) => add(`<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="#000" stroke-width="1.4"/>`));
    add(`<text x="${cx + 168}" y="${GY - 14}" text-anchor="end" font-size="10" ${M}>hail to the ravine</text>`);
  }
  if (kind === 'end') {
    add(`<path d="M${cx - 60},${GY - 112} q20,-8 40,0 q20,8 40,0" fill="none" stroke="#000" stroke-width="1.3" stroke-dasharray="4 3"/>`);
    for (let k = 0; k < 4; k++) { const x = cx + 70 + k * 18; add(`<g fill="#fff" stroke="#000" stroke-width="1.6"><path d="M${x},${GY} L${x - 6},${GY - 50} L${x + 6},${GY - 50} Z"/><ellipse cx="${x}" cy="${GY - 60}" rx="6" ry="14"/></g>`); }
    person(cx - 90, GY, 'carry', .55, true);
  }
});

// ---------- Horton steps (see horton-cycle-drawing.svg)
add(step(540, 700, 2));                                              // moist air pushed up the slopes
add(step(1030, 322, 3));                                             // cloud builds over the pass
add(step(410, 446, 3, true)); add(step(440, 446, 4, true));          // the tiempero calls the clouds and the rain
add(step(800, 800, 4));                                              // rain falls on the slopes and fields
add(step(1170, 828, 6)); add(step(760, 1000, 8)); add(step(1000, 1000, 10)); // milpa: transpiration, infiltration, soil water
{ const cx = 30 + 1 * (375 + 16) + 187.5; add(step(cx + 128, 1340 - 36, 12)); }       // Santa Cruz: crosses at the springs
{ const cx = 30 + 2 * (375 + 16) + 187.5; add(step(cx + 160, 1340 - 118, 4, true)); } // Santa Rosa: hail turned to the ravine
add(stepKey(1130, 12, 450, [
  [[2, 3], false, 'moist air rises up the volcano and builds cloud'],
  [[3, 4], true,  'claimed: the tiempero calls cloud and rain, turns hail'],
  [[4], false,    'rain falls on the slopes and the milpa'],
  [[6, 8, 10], false, 'milpa: soaks in, held in soil, breathed out'],
  [[12], false,   'springs: crosses mark where ground water comes out'],
]));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1500" role="img" aria-labelledby="t d">
<title id="t">Tiemperos calling the rain at Popocatépetl and Iztaccíhuatl</title>
<desc id="d">Line drawing: villagers led by a tiempero pray at two flower-covered crosses at El Ombligo on Popocatépetl while storm clouds form over the volcanoes and rain falls on green maize fields; a strip below shows the ritual calendar from March to November.</desc>
${s.join('\n')}
</svg>`;
fs.writeFileSync(out, svg);
console.log((svg.length / 1024).toFixed(1) + ' KB');
