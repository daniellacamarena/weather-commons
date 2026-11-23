import { fromArrayBuffer } from 'geotiff';
import fs from 'fs'; import zlib from 'zlib';
const dir = process.argv[2], out = process.argv[3];
const LAT0=19.112, LON0=-98.258, R=0.55; // ventana ±0.55°
const res = {}; let grid=null;
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.gz')).sort()) {
  const buf = zlib.gunzipSync(fs.readFileSync(dir+'/'+f));
  const tif = await fromArrayBuffer(buf.buffer.slice(buf.byteOffset, buf.byteOffset+buf.length));
  const img = await tif.getImage();
  const [ox, oy] = img.getOrigin(); const [rx, ry] = img.getResolution();
  const x0 = Math.floor((LON0-R-ox)/rx), x1 = Math.ceil((LON0+R-ox)/rx);
  const y0 = Math.floor((LAT0+R-oy)/ry), y1 = Math.ceil((LAT0-R-oy)/ry);
  const [r] = await img.readRasters({ window:[x0,y0,x1,y1] });
  if(!grid) grid={w:x1-x0,h:y1-y0,lon0:ox+x0*rx,lat0:oy+y0*ry,dx:rx,dy:ry};
  const k = f.match(/(\d{4})\.(\d{2})/); res[k[1]+'-'+k[2]] = Array.from(r, v=>Math.round(v*10)/10);
}
fs.writeFileSync(out, JSON.stringify({grid, months:res}));
console.log(grid, Object.keys(res).length);
