/* Cover-derived podcast material: dominant chromatic region + white-text contrast. */
((global)=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function hsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;if(!d)return [0,0,l];const s=d/(1-Math.abs(2*l-1));let h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return [(h*60+360)%360,s,l];}
 function rgb(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;const a=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return a.map(v=>Math.round((v+m)*255));}
 function contrast(color){const a=color.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return 1.05/(.2126*a[0]+.7152*a[1]+.0722*a[2]+.05);}
 function derive(pixels){
  const buckets=Array.from({length:24},()=>({weight:0,cos:0,sin:0,s:0,light:[]}));let opaque=0,chromatic=0;
  for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]<220)continue;opaque++;const [h,s,l]=hsl(pixels[i],pixels[i+1],pixels[i+2]);
   // Ignore paper, lettering and near-black; reduce bright skin-like highlights.
   if(s<.07||l<.16||l>.78)continue;chromatic++;
   const skin=h>15&&h<55&&l>.48&&s<.65;
   const index=i/4,x=(index%64+.5)/64,y=(Math.floor(index/64)+.5)/64;
   const centre=1+1.5*Math.exp(-((x-.5)**2+(y-.5)**2)/.12);
   const weight=(.65+.7*s)*(.8+.4*(1-l))*(skin?.5:1)*centre;
   const b=buckets[Math.floor(h/15)];b.weight+=weight;b.cos+=Math.cos(h*Math.PI/180)*weight;b.sin+=Math.sin(h*Math.PI/180)*weight;b.s+=s*weight;b.light.push(l);
  }
  const total=buckets.reduce((a,b)=>a+b.weight,0);
  const mean=Math.atan2(buckets.reduce((a,b)=>a+b.sin,0),buckets.reduce((a,b)=>a+b.cos,0));
  // A sizeable contrasting hue often belongs to the subject rather than paper/wood.
  const score=b=>b.weight<total*.035?0:b.weight*(1+2*(1-Math.cos(Math.atan2(b.sin,b.cos)-mean)));
  const best=buckets.reduce((a,b)=>score(b)>score(a)?b:a);
  let hue=0,saturation=0,lightness=.28;
  if(best.weight&&chromatic/Math.max(opaque,1)>.05){hue=(Math.atan2(best.sin,best.cos)*180/Math.PI+360)%360;saturation=clamp(best.s/best.weight*.78,.2,.52);best.light.sort((a,b)=>a-b);lightness=clamp(best.light[Math.floor(best.light.length*.35)]*.78,.34,.43);}
  let color=rgb(hue,saturation,lightness);
  while(contrast(color)<5&&lightness>.16){lightness-=.008;color=rgb(hue,saturation,lightness);}
  return {hex:'#'+color.map(v=>v.toString(16).padStart(2,'0')).join(''),contrast:Number(contrast(color).toFixed(2)),hue:Math.round(hue),chromatic:saturation>0};
 }
 if(typeof module!=='undefined'&&module.exports){module.exports={derive,contrast};return;}
 global.podcastCoverColor={derive};
 const cache=new Map(),seen=new WeakSet();
 function mount(){document.querySelectorAll('.oc-podcast').forEach(card=>{
  if(seen.has(card))return;seen.add(card);const image=card.querySelector('img');if(!image)return;
  function update(){if(/^#[0-9a-f]{6}$/i.test(card.dataset.podcastBg||'')){card.style.setProperty('--podcast-bg',card.dataset.podcastBg);return;}const key=image.getAttribute('src'),preset=global.podcastCoverPalette?.[key];
   if(preset){card.style.setProperty('--podcast-bg',preset.hex);card.dataset.coverContrast=preset.contrast;}
   if(!image.complete||!image.naturalWidth)return;
   let result=cache.get(image.currentSrc||image.src);
   if(!result){try{const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const context=canvas.getContext('2d',{willReadFrequently:true});context.imageSmoothingEnabled=false;context.drawImage(image,0,0,64,64);result=derive(context.getImageData(0,0,64,64).data);cache.set(image.currentSrc||image.src,result);}catch{return;}}
   card.style.setProperty('--podcast-bg',result.hex);card.dataset.coverContrast=result.contrast;
  }
  image.addEventListener('load',update);update();
  new MutationObserver(update).observe(image,{attributes:true,attributeFilter:['src','srcset']});
 });}
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
})(typeof window!=='undefined'?window:globalThis);
