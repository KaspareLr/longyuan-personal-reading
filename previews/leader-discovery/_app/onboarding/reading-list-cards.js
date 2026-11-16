/* Same progress replay as the lecturer list; delegated events also support filtering. */
(()=>{
 const frames=new WeakMap(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const find=target=>target?.closest?.('.club-reading-list .oc-reading-list-card');
 function paint(card,value){const ring=card.querySelector('.oc-reading-list-ring'),stroke=ring.querySelector('.oc-list-ring-value');stroke.setAttribute('stroke-dasharray',value+' 100');stroke.setAttribute('opacity',value>0?'1':'0');ring.querySelector('strong').textContent=Math.round(value)+'%'}
 function stop(card){const frame=frames.get(card);if(frame)cancelAnimationFrame(frame);frames.delete(card);paint(card,Number(card.querySelector('.oc-reading-list-ring').getAttribute('aria-valuenow')))}
 function play(card){stop(card);if(reduced.matches)return;const target=Number(card.querySelector('.oc-reading-list-ring').getAttribute('aria-valuenow')),start=performance.now();paint(card,0);function tick(now){if(!card.isConnected){frames.delete(card);return}const t=Math.min(1,(now-start)/750);paint(card,target*(1-Math.pow(1-t,3)));if(t<1)frames.set(card,requestAnimationFrame(tick));else frames.delete(card)}frames.set(card,requestAnimationFrame(tick))}
 document.addEventListener('pointerover',event=>{const card=find(event.target);if(card&&event.pointerType!=='touch'&&(!event.relatedTarget||!card.contains(event.relatedTarget)))play(card)});
 document.addEventListener('pointerout',event=>{const card=find(event.target);if(card&&(!event.relatedTarget||!card.contains(event.relatedTarget)))stop(card)});
 document.addEventListener('focusin',event=>{const card=find(event.target);if(card&&(!event.relatedTarget||!card.contains(event.relatedTarget)))play(card)});
 document.addEventListener('focusout',event=>{const card=find(event.target);if(card&&(!event.relatedTarget||!card.contains(event.relatedTarget)))stop(card)});
 reduced.addEventListener('change',()=>document.querySelectorAll('.club-reading-list .oc-reading-list-card').forEach(stop));
})();
