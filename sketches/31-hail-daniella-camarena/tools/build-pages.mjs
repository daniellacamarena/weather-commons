// Rebuilds every drawing and page.  Usage (from the WEATHER COMMONS folder): node tools/build-pages.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';

for (const d of ['horton-cycle', 'hail-cannon', 'tiemperos'])
  execFileSync(process.execPath, [`tools/${d}-drawing.mjs`, `${d}-drawing.svg`], { stdio: 'inherit' });

const read = f => fs.readFileSync(f, 'utf8');

// one menu on every page
const PAGES = [['index.html', 'Globe'], ['comparison.html', 'Comparison'], ['hail-cannon-2018.html', 'Hail cannon'], ['tiemperos-2025.html', 'Tiemperos'], ['archive.html', 'Archive']];
const NAV_CSS = '.sitenav{display:flex;justify-content:space-between;align-items:center;gap:8px 20px;flex-wrap:wrap;border-bottom:2px solid #000;padding-bottom:10px}'
  + '.sitenav .home{font-weight:700;letter-spacing:.04em;text-decoration:none;color:#000}'
  + '.sitenav ul{display:flex;flex-wrap:wrap;gap:4px 18px;list-style:none;margin:0;padding:0;font-family:"IBM Plex Mono",Consolas,monospace;font-size:.82rem}'
  + '.sitenav a{color:#000;display:inline-block;padding:6px 0}.sitenav a[aria-current=page]{font-weight:600;text-decoration-thickness:3px}';
const nav = current => '<nav class="sitenav" aria-label="Site"><a class="home" href="index.html">WEATHER COMMONS</a><ul>'
  + PAGES.map(([h, t]) => '<li><a href="' + h + '"' + (h === current ? ' aria-current="page"' : '') + '>' + t + '</a></li>').join('') + '</ul></nav>';
const withNav = (html, current) => html.replace('</style>', NAV_CSS + '\n</style>').replace('<main>', '<main>\n  ' + nav(current));
const fill = (tpl, map) => Object.entries(map).reduce((t, [k, v]) => t.replace(k, () => v), read(tpl));

// single-plate pages
fs.writeFileSync('hail-cannon-2018.html', withNav(fill('tools/hail-cannon-page-template.html', { __SVG__: read('hail-cannon-drawing.svg') }), 'hail-cannon-2018.html'));
fs.writeFileSync('tiemperos-2025.html', withNav(fill('tools/tiemperos-page-template.html', { __SVG__: read('tiemperos-drawing.svg') }), 'tiemperos-2025.html'));

// comparison page: three SVGs on one page, so give each its own id prefix
const scope = (svg, p) => svg
  .replace(/\bid="([^"]+)"/g, `id="${p}-$1"`)
  .replace(/url\(#([^)]+)\)/g, `url(#${p}-$1)`)
  .replace(/href="#([^"]+)"/g, `href="#${p}-$1"`)
  .replace(/aria-labelledby="t d"/, `aria-labelledby="${p}-t ${p}-d"`);
fs.writeFileSync('comparison.html', withNav(fill('tools/comparison-template.html', {
  __HORTON__: scope(read('horton-cycle-drawing.svg'), 'hz'),
  __HAIL__: scope(read('hail-cannon-drawing.svg'), 'hc'),
  __TIEMP__: scope(read('tiemperos-drawing.svg'), 'tp'),
}), 'comparison.html'));
// landing page: globe, with the 2018 rainfall analysis embedded
const N = JSON.parse(read('tools/nubes-data.json'));
const data = { grid: N.grid, cells: N.cells.map(c => ({ lat: c.lat, lon: c.lon, anom: c.anom, base: c.base, y2018: c.y2018 })),
  rings: N.rings.map(r => ({ label: r.label, anom2018: r.anom2018 })), daily2018: N.daily2018 };
fs.writeFileSync('index.html', fill('tools/globe-template.html', { __DATA__: JSON.stringify(data) }));
console.log('pages written');
