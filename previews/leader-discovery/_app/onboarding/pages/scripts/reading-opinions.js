(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function show(root,index){
  const slides=[...root.querySelectorAll('.oc-opinion-slide')];if(!slides.length)return;
  index=(index+slides.length)%slides.length;const previous=Number(root.dataset.current||0);
  root.dataset.lastChange=Date.now();if(index===previous)return;
  const outgoing=slides[previous],incoming=slides[index];
  const direction=previous===slides.length-1&&index===0?1:previous===0&&index===slides.length-1?-1:index>previous?1:-1;
  const from=getComputedStyle(outgoing).transform;
  slides.forEach((slide,i)=>{slide.getAnimations().forEach(animation=>animation.cancel());slide.classList.toggle('is-active',i===index);slide.setAttribute('aria-hidden',String(i!==index));});
  root.dataset.current=index;
  if(!reduced.matches){
   const timing={duration:500,easing:'cubic-bezier(.22,.68,0,1)'};
   outgoing.animate([{transform:from==='none'?'translateX(0)':from,visibility:'visible'},{transform:`translateX(${-direction*100}%)`,visibility:'visible'}],timing);
   incoming.animate([{transform:`translateX(${direction*100}%)`},{transform:'translateX(0)'}],timing);
  }
  root.querySelectorAll('[data-oc-opinion-index]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 }
 document.addEventListener('click',event=>{const b=event.target.closest('[data-oc-opinion-index],[data-oc-opinion-pause]');if(!b)return;const root=b.closest('[data-oc-opinions]');if(b.hasAttribute('data-oc-opinion-index')){show(root,Number(b.dataset.ocOpinionIndex));return}const paused=root.dataset.paused!=='true';root.dataset.paused=String(paused);root.dataset.lastChange=Date.now();b.title=paused?'继续自动轮播':'暂停自动轮播';b.setAttribute('aria-label',b.title);b.querySelector('i').className='iconfont icon-'+(paused?'Play':'Pause')});
 setInterval(()=>{if(document.hidden||reduced.matches)return;document.querySelectorAll('[data-oc-opinions]').forEach(root=>{if(!root.dataset.lastChange){root.dataset.lastChange=Date.now();return}if(root.dataset.paused==='true'||root.matches(':hover')||root.contains(document.activeElement))return;const rect=root.getBoundingClientRect();if(rect.height===0||rect.bottom<=0||rect.top>=innerHeight){root.dataset.lastChange=Date.now();return}if(Date.now()-Number(root.dataset.lastChange)>=6500)show(root,Number(root.dataset.current||0)+1)})},500);
})();
