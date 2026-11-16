/* Split the back control out of the navigation island without moving page content. */
(()=>{
 const running=new WeakMap();
 window.clubNavigation={setBack(back,visible){
  if(!back||back.hidden===!visible)return;
  const header=back.parentElement,island=header.querySelector('.nav-shell,.nav-island'),before=island.getBoundingClientRect();
  for(const el of [back,island]){running.get(el)?.cancel();running.delete(el)}
  back.hidden=!visible;
  if(!visible||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const after=island.getBoundingClientRect(),button=back.getBoundingClientRect(),offset=before.left+14-button.left;
  const ease='cubic-bezier(.22,1,.36,1)';
  const body=island.animate([{transform:`translateX(${before.left-after.left}px)`},{transform:'translateX(0)'}],{duration:680,easing:ease});running.set(island,body);
  const split=back.animate([
   {opacity:0,transform:`translateX(${offset}px) scale(.32,.78)`,borderRadius:'20px',offset:0},
   {opacity:.8,transform:`translateX(${offset*.3}px) scale(1.14,.88)`,borderRadius:'40px',offset:.38},
   {opacity:1,transform:'translateX(0) scale(1)',borderRadius:'100px',offset:1}
  ],{duration:680,easing:ease});running.set(back,split);
  const arrow=back.querySelector('img');if(arrow)arrow.animate([{opacity:0,translate:'5px 0'},{opacity:1,translate:'0 0'}],{duration:330,delay:170,easing:ease,fill:'backwards'});
 }};
})();
