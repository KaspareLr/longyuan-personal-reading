/* Keep content below the actual mobile header, including wrapped/zoomed labels. */
(()=>{
 const header=document.querySelector('.site-header,body>.club-demo-topbar');
 if(!header)return;
 const nav=header.querySelector('.nav-shell,.nav-island');
 const mobile=matchMedia('(max-width:1000px)');let frame=0;
 function measure(){
  frame=0;
  if(!mobile.matches){document.body.style.removeProperty('--mobile-header-offset');return;}
  const offset=Math.ceil((nav||header).getBoundingClientRect().bottom+16)+'px';
  if(document.body.style.getPropertyValue('--mobile-header-offset')!==offset)document.body.style.setProperty('--mobile-header-offset',offset);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 const observer=new ResizeObserver(schedule);observer.observe(header);if(nav)observer.observe(nav);
 addEventListener('resize',schedule,{passive:true});mobile.addEventListener('change',schedule);
 document.fonts?.ready.then(schedule);measure();
})();
