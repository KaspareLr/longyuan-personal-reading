// No build dependency: decode our non-interlaced RGB/RGBA PNG covers for a file:// fallback.
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const {derive}=require('../podcast-cover-colors.js');
function sample(file){const data=fs.readFileSync(file);let width,height,channels,parts=[];
 for(let offset=8;offset<data.length;){const length=data.readUInt32BE(offset),kind=data.toString('ascii',offset+4,offset+8),body=data.subarray(offset+8,offset+8+length);if(kind==='IHDR'){width=body.readUInt32BE(0);height=body.readUInt32BE(4);if(body[8]!==8||body[12]!==0||![2,6].includes(body[9]))throw Error('Unsupported PNG '+file);channels=body[9]===6?4:3;}if(kind==='IDAT')parts.push(body);offset+=length+12;}
 const raw=zlib.inflateSync(Buffer.concat(parts)),stride=width*channels,decoded=Buffer.alloc(height*stride);let input=0;
 const paeth=(a,b,c)=>{const p=a+b-c,da=Math.abs(p-a),db=Math.abs(p-b),dc=Math.abs(p-c);return da<=db&&da<=dc?a:db<=dc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[input++];for(let x=0;x<stride;x++){const index=y*stride+x,a=x>=channels?decoded[index-channels]:0,b=y?decoded[index-stride]:0,c=y&&x>=channels?decoded[index-stride-channels]:0;const predictor=filter===0?0:filter===1?a:filter===2?b:filter===3?Math.floor((a+b)/2):filter===4?paeth(a,b,c):NaN;if(!Number.isFinite(predictor))throw Error('PNG filter');decoded[index]=(raw[input++]+predictor)&255;}}
 const samples=new Uint8ClampedArray(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const src=(Math.min(height-1,Math.floor((y+.5)*height/64))*width+Math.min(width-1,Math.floor((x+.5)*width/64)))*channels,dst=(y*64+x)*4;samples[dst]=decoded[src];samples[dst+1]=decoded[src+1];samples[dst+2]=decoded[src+2];samples[dst+3]=channels===4?decoded[src+3]:255;}return samples;
}
const root=path.resolve(__dirname,'../..'),palette={};for(let i=1;i<=3;i++){const name=`assets/claimed-october/podcast-${i}.png`;palette[name]=derive(sample(path.join(root,name)));}
fs.writeFileSync(path.join(root,'scripts/podcast-cover-palette.js'),'window.podcastCoverPalette='+JSON.stringify(palette,null,2)+';\n');console.log(palette);
