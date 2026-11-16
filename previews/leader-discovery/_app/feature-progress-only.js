/* V3: keep the cover fixed; animate only the reading progress when it enters view. */
(()=>{
 if(!document.body.classList.contains('home-v3'))return;
 const ring=document.querySelector('#featured .progress-ring');if(!ring)return;
 const arc=ring.querySelector('.value'),label=ring.querySelector('strong');
 const target=Math.max(0,Math.min(100,Number(ring.getAttribute('aria-valuenow'))||0));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let frame=0,played=false;
 function paint(value){arc.style.strokeDashoffset=String(100-value);label.textContent=Math.round(value)+'%';ring.setAttribute('aria-valuenow',String(Math.round(value)));}
 function finish(){cancelAnimationFrame(frame);played=true;paint(target);}
 function start(){if(played)return;played=true;if(reduced.matches){finish();return;}let began;
  const tick=now=>{began??=now;const t=Math.min(1,(now-began)/1600);paint(target*(1-Math.pow(1-t,3)));if(t<1)frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);
 }
 paint(reduced.matches?target:0);
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){start();observer.disconnect();}},{threshold:.6});observer.observe(ring);
 reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
 addEventListener('pageshow',event=>{if(event.persisted)finish();});addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();});
})();
