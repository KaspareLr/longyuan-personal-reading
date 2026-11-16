(() => {
 const dialog=document.createElement('dialog');dialog.className='ly-book-open-dialog';dialog.setAttribute('aria-label','打开杂志');document.body.append(dialog);
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let activeMagazine=null;
 let frame=0,flight=null,source=null,run=0,motion=null,closing=false,progress=0,targetProgress=0,zoomFrame=0,upIntent=0;
 window.openShelfMagazine=async index=>{
  if(closing||source?.classList.contains('is-opening'))return;
  if(dialog.open){await closeBook();window.openShelfMagazine(index);return;}
  dialog.classList.remove('is-detail','is-expanded','has-site-nav','is-zooming-detail');
  const token=++run;
  source=document.querySelector(`.shelf-cover[data-index="${index}"]`);
  const origin=source?.getBoundingClientRect();
  let m=flowShelfData[index];if(!m)return;if(m.title==='第一财经')m={...m,issues:window.periodicalReference.archive.map(a=>({src:a.cover,label:a.issue}))};activeMagazine=m;
  const route=encodeURIComponent(m.title);
  dialog.classList.remove('is-open');
  dialog.innerHTML='<button class="ly-book-close" aria-label="合上杂志"><i class="iconfont icon-Close" aria-hidden="true"></i></button><div class="ly-open-volume ly-unified-detail"></div>';
  window.longyuanResourceDetails.mountSpread(dialog,m,0);
  const navigation=document.querySelector('body > .topbar').cloneNode(true);
  navigation.classList.add('ly-reader-nav');navigation.setAttribute('aria-label','龙源期刊网导航');navigation.inert=true;
  navigation.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  dialog.append(navigation);
  const surface=document.createElement('div');surface.className='ly-detail-surface';
  const closeRow=document.createElement('div');closeRow.className='ly-close-row';closeRow.append(dialog.querySelector('.ly-book-close'));
  dialog.querySelector('.ly-open-volume').prepend(closeRow);
  surface.append(dialog.querySelector('.ly-open-volume'));dialog.append(surface);
  dialog.classList.add('is-detail','is-turning','is-extracting');
  dialog.dataset.phase='extracting';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const h=Math.min(innerHeight*.80,760,(innerWidth-40)*19/28),w=h*14/19;
  dialog.style.setProperty('--spread-width',w*2+'px');dialog.style.setProperty('--spread-height',h+'px');
  const closedX=innerWidth/2-w/2,closedY=innerHeight/2-h/2;
  dialog.style.setProperty('--expand-progress',0);
  dialog.style.setProperty('--nav-space',0);
  lastGesture=0;collapsedAt=performance.now();closeArmed=false;closeStarted=0;
  progress=targetProgress=0;upIntent=0;motion={w,h,reduced,initial:source?.style.transform,target:null};
  const composer=document.querySelector('.hero-search');
  document.body.classList.add('is-reading-publication');
  if(!reduced&&composer){
    void composer.offsetWidth;
    await Promise.allSettled(composer.getAnimations().map(animation=>animation.finished));
    if(token!==run){document.body.classList.remove('is-reading-publication');return}
  }
  if(source&&!reduced){
    source.classList.add('is-opening');
    const stage=source.parentElement,rect=stage.getBoundingClientRect();
    const scale=h/source.offsetHeight;
    const y=closedY-rect.top-source.offsetTop-(source.offsetHeight-h)/2;
    const x=innerWidth/2-(rect.left+source.offsetLeft);
    const initial=source.style.transform;
    const target=`translateX(calc(-50% + ${x}px)) translateY(${y}px) rotateY(0deg) rotateX(0deg) scale(${scale})`;
    motion.target=target;
    flight=source.animate([{transform:initial},{transform:target}],{duration:800,easing:'cubic-bezier(.22,.65,.22,1)',fill:'forwards'});
    try{await flight.finished}catch{return}
    if(token!==run)return;
  }
  dialog.showModal();dialog.scrollTop=0;
  source?.classList.add('is-withdrawn');source?.classList.remove('is-opening');
  flight?.cancel();flight=null;
  const content=dialog.querySelector('.ly-open-volume');
  // This is an independent editorial cover image; it never becomes the animated leaf.
  // Resource content is shared with the routed issue page, including claim state.
  if(reduced){dialog.dataset.phase='ready';dialog.classList.remove('is-turning','is-extracting');return}
  const bounds=dialog.getBoundingClientRect();
  const dest={right:bounds.left+bounds.width/2,top:bounds.top,width:bounds.width/2,height:bounds.height};
  const leaf=document.createElement('div');leaf.className='ly-opening-leaf';leaf.setAttribute('aria-hidden','true');
  const front=document.createElement('img');front.src=m.src;front.alt='';front.className='ly-opening-front';
  const back=document.createElement('div');back.className='ly-opening-back ly-page-back';back.append(makePageMirror());
  leaf.append(front,back);leaf.style.width=w+'px';leaf.style.height=h+'px';dialog.append(leaf);
  const closed=`translate3d(${closedX}px,${closedY}px,0) perspective(1600px) rotateY(0deg)`;
  leaf.style.transform=closed;
  flight=null;dialog.dataset.phase='unfolding';dialog.classList.remove('is-extracting');dialog.classList.add('is-unfolding');
  const end=`translate3d(${dest.right}px,${dest.top}px,0) perspective(1600px) rotateY(-180deg) scale(${dest.width/w},${dest.height/h})`;
  leaf.style.transform=end;
  flight=leaf.animate([{transform:closed},{transform:end}],{duration:950,easing:'cubic-bezier(.22,.65,.22,1)'});
  const pageSurface=dialog.querySelector('.ly-detail-surface');
  const whitePage=document.createElement('div');whitePage.className='ly-opening-white';pageSurface.append(whitePage);
  const whiteBack=document.createElement('div');whiteBack.className='ly-opening-white';back.append(whiteBack);
  // The right page is already underneath the closed cover. Move its spine with the cover;
  // reveal it by physical occlusion, never by fading or delaying its appearance.
  const spineShift=closedX-dest.right;
  const reveal=pageSurface.animate([
    {transform:`translateX(${spineShift}px)`,clipPath:'inset(0 0 0 50%)'},
    {transform:'translateX(0px)',clipPath:'inset(0 0 0 50%)'}
  ],{duration:950,easing:'cubic-bezier(.22,.65,.22,1)'});
  try{await Promise.all([flight.finished,reveal.finished])}catch{return}
  if(token!==run||!dialog.open)return;
  // The rotated back face now occupies the exact final cover rectangle.
  dialog.dataset.phase='ready';dialog.classList.remove('is-turning','is-unfolding');flight=null;
  for(const white of [whitePage,whiteBack]){const fade=white.animate([{opacity:1},{opacity:0}],{duration:360,easing:'ease-out',fill:'forwards'});fade.finished.then(()=>white.remove()).catch(()=>white.remove());}
  motion.closed=closed;motion.end=end;motion.shift=spineShift;
  const attachBack=()=>{if(dialog.dataset.phase!=='ready')return;const r=dialog.getBoundingClientRect();leaf.style.width=r.width/2+'px';leaf.style.height=r.height+'px';leaf.style.transform=`translate3d(${r.left+r.width/2}px,${r.top}px,0) rotateY(-180deg)`};
  attachBack();const observer=new ResizeObserver(attachBack);observer.observe(dialog);dialog.addEventListener('close',()=>observer.disconnect(),{once:true});

 };
 function makePageMirror(){
  const mirror=document.createElement('div');mirror.className='ly-page-mirror';mirror.inert=true;
  mirror.innerHTML=dialog.querySelector('.ly-detail-surface').innerHTML;
  mirror.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  return mirror;
 }
 function setProgress(value){
  if(!motion)return;progress=Math.max(0,Math.min(1,value));
  dialog.style.setProperty('--spread-width',motion.w*2+(innerWidth-motion.w*2)*progress+'px');
  dialog.style.setProperty('--spread-height',motion.h+(innerHeight-motion.h)*progress+'px');
  dialog.style.setProperty('--expand-progress',progress);
  const visible=progress>=.985&&!closing;
  dialog.classList.toggle('is-zooming-detail',progress>0);
  if(!zoomFrame)dialog.classList.toggle('has-hidden-close-row',progress>0);
  const closeRow=dialog.querySelector('.ly-detail-surface .ly-close-row');
  if(closeRow)closeRow.inert=progress>0;
  if(!zoomFrame){dialog.classList.toggle('has-site-nav',visible);
  dialog.querySelector('.ly-reader-nav').inert=!visible;
  dialog.style.setProperty('--nav-space',visible?1:0);}
 }
 function zoomTo(value){
  targetProgress=Math.max(0,Math.min(1,value));
  if(motion?.reduced){setProgress(targetProgress);return}
  cancelAnimationFrame(zoomFrame);
  const viewport=dialog.querySelector('.ly-open-volume');
  const page=viewport.querySelector('.rd-page');
  dialog.style.setProperty('--zoom-content-width',viewport.clientWidth+'px');
  dialog.classList.add('is-resizing-detail');
  const from=progress,start=performance.now(),destination=targetProgress;
  function tick(now){const t=Math.min(1,(now-start)/460),ease=t*t*(3-2*t);setProgress(from+(destination-from)*ease);if(t<1)zoomFrame=requestAnimationFrame(tick);else{
   zoomFrame=0;dialog.classList.remove('is-resizing-detail');setProgress(destination);viewport.scrollTop=0;
   // Keep the surface visible when the zoom settles; avoid a second entrance flash.
   collapsedAt=performance.now();
  }}
  zoomFrame=requestAnimationFrame(tick);
 }
 async function closeBook(){
  if(closing||!dialog.open)return;
  if(dialog.dataset.phase!=='ready')return;
  closing=true;cancelAnimationFrame(zoomFrame);zoomFrame=0;dialog.classList.remove('is-resizing-detail');
  const viewport=dialog.querySelector('.ly-open-volume'),scrollFrom=viewport.scrollTop;
  if(!motion.reduced&&(progress>0||scrollFrom>0)){
   const from=progress;await new Promise(resolve=>{const start=performance.now();function tick(now){const t=Math.min(1,(now-start)/380);const ease=t*t*(3-2*t);setProgress(from*(1-ease));viewport.scrollTop=scrollFrom*(1-ease);if(t<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});
  }
  setProgress(0);viewport.scrollTop=0;targetProgress=0;
  const leaf=dialog.querySelector('.ly-opening-leaf'),surface=dialog.querySelector('.ly-detail-surface');
  if(!motion.reduced&&leaf){
   dialog.querySelector('.ly-open-volume').scrollTop=0;
   leaf.querySelector('.ly-page-back').replaceChildren(makePageMirror());
   dialog.dataset.phase='unfolding';dialog.classList.add('is-turning');
   leaf.style.width=motion.w+'px';leaf.style.height=motion.h+'px';leaf.style.transform=motion.closed;
   const options={duration:850,easing:'cubic-bezier(.22,.65,.22,1)',fill:'forwards'};
   const a=leaf.animate([{transform:motion.end},{transform:motion.closed}],options);
   const b=surface.animate([{transform:'translateX(0px)',clipPath:'inset(0 0 0 50%)'},{transform:`translateX(${motion.shift}px)`,clipPath:'inset(0 0 0 50%)'}],options);
   await Promise.allSettled([a.finished,b.finished]);
  }
  const original=source,returnMotion=motion;
  await new Promise(resolve=>{dialog.addEventListener('close',resolve,{once:true});dialog.close()});
  if(original&&!returnMotion.reduced&&returnMotion.target){
   original.classList.add('is-opening');
   const a=original.animate([{transform:returnMotion.target},{transform:returnMotion.initial}],{duration:700,easing:'cubic-bezier(.22,.65,.22,1)'});
   await a.finished.catch(()=>{});original.classList.remove('is-opening');
  }
  document.body.classList.remove('is-reading-publication');
  closing=false;
 }
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeBook()});
 dialog.addEventListener('click',async e=>{
  if(dialog.dataset.phase!=='ready'||closing)return;
  if(e.target.closest('.ly-book-close')){closeBook();return}
  if(e.target.closest('[data-home-login]')){document.querySelector('body > .topbar [data-home-login]').click();return}
  const issueButton=e.target.closest('[data-issue]');if(issueButton){
    const issue=activeMagazine?.issues[Number(issueButton.dataset.issue)];if(!issue)return;
    e.preventDefault();
    window.longyuanResourceDetails.mountSpread(dialog,activeMagazine,Number(issueButton.dataset.issue));
    dialog.querySelector('.ly-page-back')?.replaceChildren(makePageMirror());
    return;
  }
  const link=e.target.closest('a');if(link){const href=link.getAttribute('href');if(!href?.startsWith('#'))return;e.preventDefault();await closeBook();location.hash=href;return}
  if(e.target===dialog)closeBook();
 });
 dialog.addEventListener('close',()=>{if(!closing)document.body.classList.remove('is-reading-publication');run++;flight?.cancel();flight=null;dialog.getAnimations({subtree:true}).forEach(a=>a.cancel());dialog.querySelector('.ly-opening-leaf')?.remove();source?.classList.remove('is-withdrawn','is-opening');cancelAnimationFrame(frame);dialog.removeAttribute('data-phase');dialog.classList.remove('is-open','is-extracting','is-detail','is-expanded','is-turning','is-unfolding')});
 let touchStart=null,lastGesture=0,collapsedAt=0,closeArmed=false,closeStarted=0;
 function atTop(target){for(let el=target;el&&el!==dialog;el=el.parentElement){if(el.scrollTop>2)return false}return true}
 function effectiveChatTarget(target){return !!target.closest('.pe-chat')}
 function gesture(delta,target){
  if(dialog.dataset.phase!=='ready'||closing)return false;
  const now=performance.now(),quiet=now-lastGesture;lastGesture=now;
  if(effectiveChatTarget(target))return false;
  if(zoomFrame)return true;
  if(delta>0){upIntent=0;closeArmed=false;if(targetProgress<1){dialog.querySelector('.ly-open-volume').scrollTop=0;zoomTo(1);return true}return false}
  if(delta<0&&atTop(target)){
   if(targetProgress>0){
    upIntent=0;closeArmed=false;zoomTo(0);collapsedAt=now;
   }else if(progress<.01){
    // A separate deliberate gesture is required after shrink settles; momentum cannot close it.
    if(quiet>320&&now-collapsedAt>550){closeArmed=true;upIntent=0;closeStarted=now}
    if(closeArmed){upIntent+=Math.min(-delta,60);if(upIntent>=240&&now-closeStarted>=160){upIntent=0;closeArmed=false;closeBook()}}
   }
   return true;
  }
  upIntent=0;closeArmed=false;return false;
 }
 dialog.addEventListener('wheel',e=>{if(gesture(e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1),e.target))e.preventDefault()},{passive:false});
 dialog.addEventListener('touchstart',e=>{touchStart=e.touches[0]?.clientY},{passive:true});
 dialog.addEventListener('touchmove',e=>{const y=e.touches[0]?.clientY;if(touchStart!==null&&y!==undefined){if(gesture(touchStart-y,e.target))e.preventDefault();touchStart=y}},{passive:false});
 dialog.addEventListener('touchend',()=>{touchStart=null},{passive:true});
 window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();else{document.body.classList.remove('is-reading-publication');run++;flight?.cancel();flight=null;source?.classList.remove('is-opening','is-withdrawn')}});
})();
