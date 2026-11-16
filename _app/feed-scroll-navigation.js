/* Reveal mobile navigation only when returning upward through the feed. */
(()=>{'use strict';const nav=document.querySelector('.discovery-tabs');if(!nav)return;
 const mobile=matchMedia('(max-width:760px)');let last=Math.max(0,scrollY),distance=0,direction=0,frame=0;
 function visible(value){document.body.classList.toggle('feed-nav-visible',value);nav.inert=mobile.matches&&!value;if(mobile.matches&&!value)nav.setAttribute('aria-hidden','true');else nav.removeAttribute('aria-hidden')}
 function reset(){last=Math.max(0,scrollY);distance=0;direction=0;visible(false)}
 function update(){frame=0;const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight)),delta=y-last;last=y;if(!mobile.matches||Math.abs(delta)<1)return;
  if(document.body.classList.contains('voice-is-recording')||document.querySelector('.feed-voice-backdrop:not([hidden])')){distance=0;return}
  const next=delta>0?1:-1;if(next!==direction){direction=next;distance=0}distance+=Math.abs(delta);if(distance>=12){visible(direction<0);distance=0}
 }
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});mobile.addEventListener('change',reset);addEventListener('pageshow',reset);reset();
})();
