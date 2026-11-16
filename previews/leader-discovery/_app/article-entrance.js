/* One-shot editorial entrances; content stays visible if animation APIs fail. */
(()=>{
 const root=document.querySelector('#portal-main');if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let reader=null,observer=null,frame=0;const played=new WeakSet(),active=new Set();
 function stop(){observer?.disconnect();observer=null;active.forEach(a=>a.cancel());active.clear();}
 function play(el){
  if(played.has(el))return;played.add(el);
  if(reduced.matches||!el.animate||el.getBoundingClientRect().bottom<=0)return;
  const image=el.tagName==='IMG',heading=el.matches('h1,h2,h3'),duration=image?480:heading?380:260;
  // Multi-column paragraphs must not be transformed: they can span fragments.
  const frames=image?[{opacity:.45,transform:'translateY(16px) scale(.985)'},{opacity:1,transform:'none'}]:heading?[{opacity:.35,transform:'translateY(10px)'},{opacity:1,transform:'none'}]:[{opacity:.65},{opacity:1}];
  const animation=el.animate(frames,{duration,easing:'cubic-bezier(.22,1,.36,1)'});active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
 }
 function sync(){
  const next=root.querySelector('.portal-reader');if(next===reader)return;stop();reader=next;if(!reader)return;
  const targets=[...reader.querySelectorAll('.portal-article-head h1,.portal-article-meta,.portal-prose h2,.portal-prose h3,.portal-prose p,.portal-prose blockquote,.portal-prose figure img')];
  if(reduced.matches||!window.IntersectionObserver){targets.forEach(el=>played.add(el));return;}
  observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){observer.unobserve(e.target);play(e.target);}},{rootMargin:'0px 0px -24px 0px',threshold:0});
  targets.forEach(el=>observer.observe(el));
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)stop();});
 new MutationObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);}).observe(root,{childList:true,subtree:true});sync();
})();
