// Route-entry equivalent of the shelf extraction: source, centre, turn, white, detail.
(()=>{
 const base=new URL('.',document.currentScript.src),handoffKey='club-book-opening';
 let active=null,cleanup=null;
 window.addEventListener('pagehide',()=>{cleanup?.();cleanup=null;active?.remove();active=null;});
 let arriving=false;
 try{const pending=JSON.parse(sessionStorage.getItem(handoffKey)||'null');arriving=pending?.url===location.href&&Date.now()-pending.at<15000;if(arriving){sessionStorage.removeItem(handoffKey);document.documentElement.classList.add('book-entry-arriving');}}catch{}
 if(arriving)document.addEventListener('DOMContentLoaded',async()=>{
  const veil=document.createElement('div');veil.className='book-entry-veil';document.body.append(veil);document.documentElement.classList.remove('book-entry-arriving');
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  revealDetail();await veil.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-out'}).finished.catch(()=>{});veil.remove();
 },{once:true});
 async function openPublication(image,destination,source=null){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){location.assign(destination);return;}
  cleanup?.();active?.getAnimations({subtree:true}).forEach(a=>a.cancel());active?.remove();const stage=document.createElement('div');stage.className='book-opening-stage';active=stage;
  const volume=image.closest('[data-book-tilt]');
  source=source||volume||image;
  const previousVisibility=source.style.visibility;
  const rect=(volume||image).getBoundingClientRect(),originRotation=volume?getComputedStyle(volume.querySelector('.oc-book-object')).transform:'none',sheet=document.createElement('div');sheet.className='book-opening-sheet';
  const cover=document.createElement('div');cover.className='book-opening-cover';const front=image.cloneNode();front.removeAttribute('id');front.removeAttribute('class');front.removeAttribute('style');const back=document.createElement('div');back.className='book-opening-back';cover.append(front,back);sheet.append(cover);stage.append(sheet);document.body.append(stage);
  const height=Math.min(innerHeight*.72,680),width=height*14/19;
  Object.assign(sheet.style,{left:(innerWidth-width)/2+'px',top:(innerHeight-height)/2+'px',width:width+'px',height:height+'px'});
  const x=rect.left+rect.width/2-innerWidth/2,y=rect.top+rect.height/2-innerHeight/2;
  image.closest('dialog')?.close();
  cleanup=()=>{source.style.visibility=previousVisibility;document.body.classList.remove('is-reading-publication');};
  if(source){source.style.visibility='hidden';document.body.classList.add('is-reading-publication');}
  const wait=animation=>animation.finished.catch(()=>{});
  await wait(sheet.animate([{transform:`translate(${x}px,${y}px) scale(${rect.width/width},${rect.height/height}) ${originRotation==='none'?'':originRotation}`},{transform:'translate(0,0) scale(1)'}],{duration:620,easing:'cubic-bezier(.2,.8,.2,1)'}));if(active!==stage)return;
  const turn=cover.animate([{transform:'rotateY(0deg)'},{transform:'rotateY(-180deg)'}],{duration:650,easing:'cubic-bezier(.2,.65,.2,1)',fill:'forwards'});
  const centre=sheet.animate([{transform:'translateX(0px)'},{transform:`translateX(${width/2}px)`}],{duration:650,easing:'cubic-bezier(.2,.65,.2,1)',fill:'forwards'});
  await Promise.all([wait(turn),wait(centre)]);if(active!==stage)return;
  // Commit the full two-page rectangle before enlarging; the leaf no longer protrudes.
  cover.remove();centre.cancel();sheet.style.left=(innerWidth-width*2)/2+'px';sheet.style.width=width*2+'px';sheet.style.transformOrigin='50% 50%';
  await wait(sheet.animate([{transform:'scale(1)',opacity:1},{transform:`scale(${Math.max(innerWidth/(width*2),innerHeight/height)*1.05})`,opacity:1}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}));
  if(active!==stage)return;
  // Navigate only once the white paper covers the viewport completely.
  stage.style.background='#fff';
  const target=new URL(destination,location.href);
  if(target.pathname!==location.pathname||target.search!==location.search){
   try{sessionStorage.setItem(handoffKey,JSON.stringify({url:target.href,at:Date.now()}));}catch{}
   location.assign(target.href);return;
  }
  if(location.hash!==target.hash){await new Promise(resolve=>{window.addEventListener('hashchange',resolve,{once:true});location.hash=target.hash;});}
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(active!==stage)return;
  revealDetail();
  await wait(stage.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-out'}));stage.remove();if(active===stage)active=null;
  cleanup?.();cleanup=null;
 }
 function revealDetail(){
  const root=document.querySelector('.portal-book-detail, [data-page=book]');
  if(!root||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const groups=[['h1',0],['.book-sidebar-meta,.book-sidebar-category',55],['.book-contents-header,.book-contents-group:first-of-type,.book-sidebar-capabilities',110]];
  for(const [selector,delay] of groups){for(const element of root.querySelectorAll(selector)){
   const rect=element.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight||!rect.width)continue;
   element.getAnimations().filter(a=>a.id==='detail-field-enter').forEach(a=>a.cancel());
   element.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{id:'detail-field-enter',duration:340,delay,easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'});
  }}
 }
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const card=event.target.closest('[data-book]'),link=event.target.closest('a[href*="#/book/"]');
  let destination,image;
  if(card){const book=window.clubCatalogData?.books[Number(card.dataset.book)];if(!book)return;destination=new URL('portal.html#/book/'+encodeURIComponent(book.id),base).href;image=card.querySelector('img');}
  else if(link){destination=link.href;if(destination.includes('icitychina')||link.getAttribute('href').startsWith('#/book/'))destination=new URL('portal.html#/book/'+link.hash.split('#/book/')[1],base).href;image=link.querySelector('img')||link.closest('.books-home-feature')?.querySelector('.books-home-center img');}
  if(!destination||!image||new URL(destination).origin!==location.origin)return;
  event.preventDefault();event.stopImmediatePropagation();if(active)return;
  openPublication(image,destination,image.closest('[data-book-tilt],.book-cover')||image);
 },true);
})();
