/* Shared route motion for local documents, hash routes, and browser history. */
(()=>{
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const root=()=>document.querySelector('#portal-main,#app,body>main');
 const special=()=>!!document.querySelector('.book-opening-stage,.publication-entry-stage,.book-entry-veil');
 const mainAnimations=new Set();let departed=false;let sequence=0,exitAnimation=null,snapshot=null,routeFrame=0,lastURL=location.href;
 const boot=document.documentElement;boot.classList.add('club-motion-boot');
 function cancel(){mainAnimations.forEach(a=>a.cancel());mainAnimations.clear();exitAnimation?.cancel();exitAnimation=null;snapshot?.remove();snapshot=null;cancelAnimationFrame(routeFrame);const main=root();if(main){main.style.opacity='';main.removeAttribute('aria-busy');}}
 function animate(element,frames,options){const a=element.animate(frames,options);mainAnimations.add(a);a.finished.catch(()=>{}).finally(()=>mainAnimations.delete(a));return a;}
 function enter(){
  boot.classList.remove('club-motion-boot');const main=root();if(!main)return;main.style.opacity='';main.removeAttribute('aria-busy');
  if(reduced()||special())return;
  animate(main,[{opacity:0},{opacity:1}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});
  // Dedicated hero animations keep their own choreography and 3D transforms.
  if(main.querySelector('.people-guide-hero,.view.active .books-home-hero,.view.active .magazines-home-hero'))return;
  const candidates=[...main.querySelectorAll('h1,.intro-copy,.guide-row,.portal-heading>p,.reading-home-heading>div>p,.portal-event-feature,.portal-member-intro,.portal-plan-grid,.portal-account,.portal-article-meta,.portal-prose,.reading-home-feature,.oc-profile-introduction,.oc-profile-primary,.oc-reading-section,.pe-identity-top,.pe-metadata,.pe-section-heading,.pe-plan-heading')];
  const targets=candidates.filter((el,i)=>{const r=el.getBoundingClientRect();return r.width>0&&r.bottom>0&&r.top<innerHeight&&!candidates.slice(0,i).some(parent=>parent.contains(el));}).slice(0,7);
  targets.forEach((el,i)=>animate(el,[{opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:720,delay:80+i*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
 }
 function capture(){
  const main=root();if(!main||reduced()||special())return;
  const rect=main.getBoundingClientRect(),style=getComputedStyle(main),copy=main.cloneNode(true);
  copy.querySelectorAll('script,dialog,iframe,video,canvas,.pe-chat,.pe-chat-reopen,.portal-reader-tools,.oc-dock,.pe-purchase-dock').forEach(el=>el.remove());
  const oldSections=main.querySelectorAll('.view,.oc-main>section,.portal-section,.people-guide-sections'),newSections=copy.querySelectorAll('.view,.oc-main>section,.portal-section,.people-guide-sections');
  oldSections.forEach((el,i)=>{const r=el.getBoundingClientRect();if(!r.width||r.bottom<0||r.top>innerHeight)newSections[i]?.remove();});
  copy.querySelectorAll('.view').forEach(view=>{view.style.display=view.classList.contains('active')?'block':'none';view.classList.remove('view');});
  Object.assign(copy.style,{position:'absolute',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',maxWidth:'none',margin:'0',padding:style.padding,opacity:'1',pointerEvents:'none'});
  snapshot=document.createElement('div');snapshot.className='club-motion-snapshot';snapshot.setAttribute('aria-hidden','true');snapshot.inert=true;snapshot.append(copy);document.body.append(snapshot);
  const layer=snapshot,a=layer.animate([{opacity:1,translate:'0 0'},{opacity:0,translate:'0 -8px'}],{duration:240,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});a.finished.catch(()=>{}).then(()=>{layer.remove();if(snapshot===layer)snapshot=null;});
  main.style.opacity='0';main.setAttribute('aria-busy','true');
 }
 async function navigate(destination){
  const target=new URL(destination,location.href);if(target.href===location.href)return;
  if(target.origin!==location.origin||target.protocol!==location.protocol){location.assign(target.href);return;}
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument){location.hash=target.hash;return;}
  const token=++sequence;cancel();const main=root();
  if(main&&!reduced()&&!special()){
   exitAnimation=main.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in',fill:'forwards'});await exitAnimation.finished.catch(()=>{});
  }
  if(token===sequence)location.assign(target.href);
 }
 async function back(fallback){const token=++sequence;cancel();const main=root();if(main&&!reduced()){exitAnimation=main.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-in',fill:'forwards'});await exitAnimation.finished.catch(()=>{});}if(token!==sequence)return;departed=true;if(history.length>1)history.back();else navigate(fallback||new URL('index.html',document.currentScript?.src||location.href));}
 window.clubPageMotion={navigate,back,update(callback){++sequence;cancel();if(!reduced())capture();callback();routeFrame=requestAnimationFrame(()=>{routeFrame=requestAnimationFrame(enter);});}};
 window.addEventListener('hashchange',()=>{
  if(lastURL===location.href)return;lastURL=location.href;if(!document.querySelector('#app,#portal-main')&&!location.hash.startsWith('#/'))return;++sequence;cancel();
  if(special())return;if(departed){departed=false;const main=root();if(main)main.style.opacity='0';}else capture();
  routeFrame=requestAnimationFrame(()=>{routeFrame=requestAnimationFrame(enter);});
 },true);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target&&link.target!=='_self')return;
  if(link.matches('.login,.nav-login,[data-club-login]'))return;
  const target=new URL(link.href,location.href);if(target.origin!==location.origin||target.protocol!==location.protocol||target.href===location.href)return;
  const sameDocument=target.pathname===location.pathname&&target.search===location.search;
  if(sameDocument)return;
  // Same-document specialized magazine links are handled by publication-entry.js.
  event.preventDefault();event.stopImmediatePropagation();navigate(target.href);
 },true);
 document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(enter),{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted){departed=false;cancel();lastURL=location.href;enter();}});
 window.addEventListener('pagehide',()=>{++sequence;departed=false;cancel();boot.classList.remove('club-motion-boot');});
 // A failed optional page initializer must never leave the content hidden.
 setTimeout(()=>boot.classList.remove('club-motion-boot'),1800);
})();
