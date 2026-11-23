import { fromUrl } from 'geotiff'; import fs from 'fs';
const out=process.argv[2]; const B='https://data.chc.ucsb.edu/products/CHIRPS/v2.0/global_monthly/cogs/';
const LAT0=19.112, LON0=-98.258, R=0.55; const res={}; let grid=null;
const jobs=[];for(let y=2010;y<=2020;y++)for(const m of ['05','06','07','08','09','10'])jobs.push([y,m]);
async function one([y,m]){const tif=await fromUrl(`${B}chirps-v2.0.${y}.${m}.cog`);const img=await tif.getImage();
 const [ox,oy]=img.getOrigin();const [rx,ry]=img.getResolution();
 const x0=Math.floor((LON0-R-ox)/rx),x1=Math.ceil((LON0+R-ox)/rx),y0=Math.floor((LAT0+R-oy)/ry),y1=Math.ceil((LAT0-R-oy)/ry);
 const [r]=await img.readRasters({window:[x0,y0,x1,y1]});
 grid??={w:x1-x0,h:y1-y0,lon0:ox+x0*rx,lat0:oy+y0*ry,dx:rx,dy:ry};res[`${y}-${m}`]=Array.from(r,v=>Math.round(v*10)/10);}
for(const j of jobs){for(let t=0;t<4;t++){try{await one(j);break}catch(e){console.log("retry",j,t);await new Promise(r=>setTimeout(r,1500))}}}
fs.writeFileSync(out,JSON.stringify({grid,months:res}));console.log(grid,Object.keys(res).length,res['2018-07'].slice(0,8));
