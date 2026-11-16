/* Figma 207:5731, adapted to the portal's existing routes and local lecturer data. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const profiles=window.clubPeopleProfiles;let active=0,routeFor,restore=[],animations=[],counterFrame=0,revealFrame=0,generation=0,pointerCleanup=()=>{};
 const card=(p)=>`<a class="people-guide-card" href="${esc(routeFor('lecturer',p.id))}" aria-label="进入${esc(p.name)}的领读人主页"><div class="people-guide-portrait"><img src="${esc(p.portrait)}" alt="${esc(p.name)}" loading="lazy"></div><div class="people-guide-card-copy"><div><span class="people-guide-badge">READING GUIDE · 领读人</span><h3>${esc(p.name)}</h3><p class="people-guide-role">${esc(p.role)}</p></div><blockquote><strong>领读寄语</strong><p>${esc(p.name==='曹文轩'?'如果你是故事中的主人公，会做出怎样的选择？':p.slogan)}</p></blockquote></div></a>`;
 function details(p){return `<div class="people-hero-left"><dl class="people-guide-stats"><div><dt>领读</dt><dd data-count="${p.readings}" aria-label="${p.readings}">${p.readings}</dd></div><div><dt>关注</dt><dd data-count="${p.followers}" aria-label="${p.followers}">${p.followers}</dd></div><div><dt>观点</dt><dd data-count="${p.views}" aria-label="${p.views}">${p.views}</dd></div></dl><div class="people-guide-identity"><h1>${esc(p.name)}</h1><p>${esc(p.role)}</p><a class="people-home-link" href="${esc(routeFor('lecturer',p.id))}">进入主页</a></div></div><div class="people-hero-right"><section><h2>READING MESSAGE · 领读寄语</h2><p class="people-guide-message">${esc(p.slogan)}</p></section><section><h2>ABOUT · 领读人介绍</h2><p class="people-guide-bio">${esc(p.bio)}</p></section><section><h2>专属栏目</h2><p class="people-guide-column">${esc(p.columnTitle)}</p></section></div>`}
 function stopMotion(){generation++;animations.forEach(a=>a.cancel());animations=[];cancelAnimationFrame(counterFrame);cancelAnimationFrame(revealFrame)}
 function entrance(root,initial=false){
  stopMotion();const token=generation;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const animate=(el,frames,options)=>{if(el){const a=el.animate(frames,{fill:'both',easing:'cubic-bezier(.16,1,.3,1)',...options});a.pause();animations.push(a)}};
  const duration=initial?1800:850;
  root.querySelectorAll('.people-hero-photo,.people-hero-original').forEach(img=>animate(img,[{opacity:0,transform:'scale(1.055)'},{opacity:1,transform:'scale(1)'}],{duration}));
  const groups=[...root.querySelectorAll('.people-guide-stats>div'),...root.querySelectorAll('.people-guide-identity>*'),...root.querySelectorAll('.people-hero-right section')];
  groups.forEach((el,i)=>animate(el,[{opacity:0,transform:'translateY(22px)',filter:'blur(4px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:initial?1100:650,delay:initial?180+i*105:i*45}));
  // Show the actual value immediately; roll only a short distance, without counting from zero.
  root.querySelectorAll('[data-count]').forEach((el,row)=>{
   el.textContent=el.dataset.count;
   animate(el,[{transform:'translateY(10px)',opacity:.45},{transform:'translateY(0)',opacity:1}],{duration:600,delay:(initial?950:450)+row*100});
  });
  Promise.all([...root.querySelectorAll('.people-hero-media img')].map(img=>img.decode().catch(()=>{}))).then(()=>{if(token!==generation||!root.isConnected)return;animations.forEach(a=>a.play())});
 }
 function select(i){active=(i+profiles.length)%profiles.length;const p=profiles[active],root=document.querySelector('.people-guide-hero');if(!root)return;root.querySelector('.people-hero-content').innerHTML=details(p);root.querySelectorAll('.people-hero-photo,.people-hero-original').forEach(photo=>{photo.src=photo.classList.contains('people-hero-original')?p.heroOriginal:p.hero;if(photo.classList.contains('people-hero-photo'))photo.alt=p.name+'领读人'});root.querySelectorAll('[data-people-slide]').forEach((b,index)=>b.setAttribute('aria-pressed',String(index===active)));entrance(root);}
 function mountBannerPointer(root){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return ()=>{};
  const media=root.querySelector('.people-hero-media'),photo=root.querySelector('.people-hero-photo'),original=root.querySelector('.people-hero-original');
  const canvas=document.createElement('canvas'),mask=document.createElement('canvas');canvas.className='people-hero-trail';canvas.setAttribute('aria-hidden','true');media.appendChild(canvas);
  const ctx=canvas.getContext('2d'),ink=mask.getContext('2d');if(!ctx||!ink){canvas.remove();return ()=>{}}root.classList.add('has-pointer-trail');
  let frame=0,inside=false,x=0,y=0,tx=0,ty=0,px=0,py=0,last=0,lastMove=0,w=0,h=0,source='',zoom=1,dx=0,dy=0;
  const density=.65;
  function wake(){if(!frame)frame=requestAnimationFrame(draw)}
  function move(e){if(e.pointerType==='touch')return;const rect=media.getBoundingClientRect();tx=e.clientX-rect.left;ty=e.clientY-rect.top;if(!inside){x=px=tx;y=py=ty;inside=true}lastMove=performance.now();root.classList.add('is-revealing');wake()}
  function leave(){inside=false;root.classList.remove('is-revealing');lastMove=performance.now();wake()}
  function draw(now){frame=0;if(!root.isConnected)return;const rect=media.getBoundingClientRect(),dt=Math.min(50,last?now-last:16.7);last=now;
   if(w!==rect.width||h!==rect.height||source!==original.src){w=rect.width;h=rect.height;source=original.src;canvas.width=mask.width=Math.ceil(w*density);canvas.height=mask.height=Math.ceil(h*density);ink.setTransform(density,0,0,density,0,0);ctx.setTransform(density,0,0,density,0,0)}
   const follow=1-Math.exp(-dt/95);x+=(tx-x)*follow;y+=(ty-y)*follow;zoom+=((inside?1.025:1)-zoom)*(1-Math.exp(-dt/260));dx+=((inside?(x/w-.5)*-18:0)-dx)*follow;dy+=((inside?(y/h-.5)*-12:0)-dy)*follow;
   photo.style.scale=String(zoom);photo.style.translate=`${dx}px ${dy}px`;
   ink.globalCompositeOperation='destination-out';ink.fillStyle=`rgba(0,0,0,${1-Math.exp(-dt/380)})`;ink.fillRect(0,0,w,h);ink.globalCompositeOperation='source-over';
   if(inside){const distance=Math.hypot(x-px,y-py),steps=Math.max(1,Math.ceil(distance/10));for(let i=1;i<=steps;i++){const q=i/steps,cx=px+(x-px)*q,cy=py+(y-py)*q,r=55+Math.min(20,distance*.25);const glow=ink.createRadialGradient(cx,cy,6,cx,cy,r);glow.addColorStop(0,'rgba(255,255,255,.7)');glow.addColorStop(.5,'rgba(255,255,255,.45)');glow.addColorStop(1,'rgba(255,255,255,0)');ink.fillStyle=glow;ink.fillRect(cx-r,cy-r,r*2,r*2)}}px=x;py=y;
   ctx.clearRect(0,0,w,h);if(original.complete&&original.naturalWidth){const fit=Math.max(w/original.naturalWidth,h/original.naturalHeight),scale=fit*zoom,iw=original.naturalWidth*scale,ih=original.naturalHeight*scale;ctx.globalCompositeOperation='source-over';ctx.drawImage(original,(w-iw)/2+dx,(h-ih)/2+dy,iw,ih);ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0,w,h);ctx.globalCompositeOperation='source-over'}
   if(now-lastMove<2400||Math.abs(zoom-(inside?1.025:1))>.0001||Math.hypot(tx-x,ty-y)>.2)frame=requestAnimationFrame(draw);else if(!inside){ctx.clearRect(0,0,w,h);ink.clearRect(0,0,w,h);photo.style.removeProperty('scale');photo.style.removeProperty('translate');last=0}
  }
  root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);
  return ()=>{cancelAnimationFrame(frame);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);canvas.remove();photo.style.removeProperty('scale');photo.style.removeProperty('translate')};
 }
 window.clubPeoplePage={
  render(route){routeFor=route;active=0;return `<section class="people-guide-hero" aria-label="推荐领读人" aria-roledescription="轮播"><div class="people-hero-media"><img class="people-hero-photo" src="${esc(profiles[0].hero)}" alt="曹文轩领读人" fetchpriority="high"><div class="people-hero-reveal" aria-hidden="true"><img class="people-hero-original" src="${esc(profiles[0].heroOriginal)}" alt=""></div></div><div class="people-hero-content">${details(profiles[0])}</div><div class="people-hero-pagination" role="group" aria-label="切换推荐领读人">${profiles.map((p,i)=>`<button type="button" data-people-slide="${i}" aria-label="查看${esc(p.name)}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div></section><div class="people-guide-sections"><section class="people-guide-featured" aria-label="推荐领读人"><div class="people-guide-recommendations">${profiles.slice(0,2).map(card).join('')}</div><a class="people-next-chapter" href="portal.html#/me"><span>YOUR NEXT CHAPTER</span><h2>每个读者，<br>都有自己的光。</h2><p>记录读书时的发现，写下让你停留的一句话。你的阅读，也值得被看见。</p></a></section><section class="people-all-guides" aria-labelledby="people-all-title"><header><span>ALL</span><h2 id="people-all-title">全部领读人</h2></header><div class="people-all-grid">${profiles.map(card).join('')}</div></section></div>`},
  mount(){document.body.classList.add('people-home-page');const root=document.querySelector('.people-guide-hero');entrance(root,true);pointerCleanup=mountBannerPointer(root);root.querySelectorAll('[data-people-slide]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.peopleSlide))));root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));root.querySelector(`[data-people-slide="${active}"]`).focus()}});let downX;root.addEventListener('touchstart',e=>{downX=e.touches[0]?.clientX},{passive:true});root.addEventListener('touchend',e=>{if(downX===undefined)return;const delta=e.changedTouches[0].clientX-downX;if(Math.abs(delta)>65)select(active+(delta<0?1:-1));downX=undefined},{passive:true});[['.site-header .brand img','assets/people/logo.png']].forEach(([selector,src])=>{const img=document.querySelector(selector);if(img){restore.push([img,img.getAttribute('src')]);img.src=src}})},
  unmount(){pointerCleanup();stopMotion();document.body.classList.remove('people-home-page');restore.forEach(([img,src])=>img.setAttribute('src',src));restore=[]}
 };
})();
