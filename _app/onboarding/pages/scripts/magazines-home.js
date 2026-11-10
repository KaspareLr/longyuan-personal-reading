/* Figma 190:4047. Magazine volumes share guided reading's renderer and pointer behavior. */
(()=>{
 const root=document.querySelector('#view-magazines'),data=window.magazinesHomeData;if(!root||!data)return;
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<img src="assets/figma-magazines/card-arrow.svg" alt="">';
 const volume=m=>renderReadingBookVolume({contentType:'journal',bookTitle:m.title,cover:m.cover});
 [...root.children].forEach(n=>n.classList.add('magazines-legacy'));
 const page=document.createElement('div');page.className='magazines-home';root.append(page);
 const picks=[data.magazines[0],...data.magazines.filter(m=>['瞭望东方周刊','南都周刊','财经','读者'].includes(m.title))].slice(0,5);
 // Keep exactly five distinct recommendations even when upstream category selections change.
 for(const m of data.magazines)if(picks.length<5&&!picks.includes(m))picks.push(m);
 page.innerHTML=`<section class="magazines-home-hero" aria-label="编辑推荐期刊"><div class="magazines-home-feature"><div class="magazines-home-info"></div><div class="magazines-home-cover"></div><div class="magazines-home-thumbnails" aria-label="选择推荐期刊">${picks.map((m,i)=>`<button type="button" data-magazine-pick="${i}" aria-pressed="${i===0}" aria-label="推荐期刊：${e(m.title)}"><img src="${e(m.cover)}" alt=""></button>`).join('')}</div></div></section><div class="magazines-home-body"><section class="magazines-stories" aria-label="封面故事"><header class="magazines-section-title"><span>COVER STORIES</span><h2>封面故事</h2></header><div class="magazines-stories-grid">${data.stories.map((s,i)=>`<article class="magazines-story ${i===0?'is-featured':''}"><img src="${e(s.cover)}" alt="" loading="lazy"><button class="magazines-story-toggle" type="button" data-story-select="${i}" aria-expanded="${i===0}" aria-controls="magazine-story-description-${i}" aria-label="${e(s.title)}"></button><div class="magazines-story-caption"><div><h3>${e(s.title)}</h3><p id="magazine-story-description-${i}" ${i===0?'':'hidden'}>${e(s.excerpt)}</p></div><a class="magazines-story-read" href="${e(s.url)}" aria-label="阅读：${e(s.title)}" ${i===0?'':'hidden'}><img src="assets/figma-magazines/story-arrow.svg" alt=""></a></div></article>`).join('')}</div></section><section class="magazines-all" aria-label="全部杂志"><header class="magazines-all-heading"><div class="magazines-section-title"><span>ALL MAGAZINES</span><h2>全部杂志</h2></div><div class="magazines-category-filters" aria-label="期刊分类">${['全部',...data.categories].map((c,i)=>`<button type="button" data-magazine-category="${e(c)}" aria-pressed="${i===0}">${e(c)}</button>`).join('')}</div></header><div class="magazines-all-grid"></div></section></div>`;
 const categoryRail=page.querySelector('.magazines-category-filters');
 function updateCategoryFades(){const max=categoryRail.scrollWidth-categoryRail.clientWidth;categoryRail.style.setProperty('--category-fade-left',categoryRail.scrollLeft>1?'28px':'0px');categoryRail.style.setProperty('--category-fade-right',categoryRail.scrollLeft<max-1?'28px':'0px');}
 categoryRail.addEventListener('scroll',updateCategoryFades,{passive:true});
 new ResizeObserver(updateCategoryFades).observe(categoryRail);updateCategoryFades();
 let selected=0,sequence=0,progressFrame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function animateProgress(delay=0){
  cancelAnimationFrame(progressFrame);
  const ring=page.querySelector('.magazines-home-ring'),arc=ring.querySelector('.magazines-progress-arc'),label=ring.querySelector('span');
  const target=Number(ring.dataset.progress),circumference=2*Math.PI*39;
  const paint=value=>{arc.style.strokeDashoffset=String(circumference*(1-value/100));label.textContent=Math.round(value)+'%';};
  if(reduced.matches){paint(target);return;}
  paint(0);let start=null;
  function tick(now){if(!ring.isConnected||!root.classList.contains('active'))return;if(start===null)start=now;const t=Math.max(0,Math.min(1,(now-start-delay)/1100));paint(target*(1-Math.pow(1-t,3)));if(t<1)progressFrame=requestAnimationFrame(tick);}
  progressFrame=requestAnimationFrame(tick);
 }
 function show(index,animate=false){
  selected=index;const m=picks[index];const info=page.querySelector('.magazines-home-info'),cover=page.querySelector('.magazines-home-cover');
  info.innerHTML=`<div class="magazines-home-identity"><div class="magazines-home-kicker"><img src="assets/figma-magazines/laurel-left.svg" alt=""><span>编辑推荐</span><img src="assets/figma-magazines/laurel-right.svg" alt=""></div><h1>${e(m.title)}</h1><div class="magazines-home-issue">${m.frequency?`<strong>${e(m.frequency)}</strong>`:''}<a href="${e(m.href)}">${e(m.issue)}<span><img src="assets/figma-magazines/chevron.svg" alt=""></span></a></div></div><div class="magazines-home-reading"><div class="magazines-home-guide"><img src="assets/figma-magazines/guide.png" width="40" height="40" alt="苏皖"><div><strong>苏皖 <small>领读人</small></strong><p>本刊编辑</p></div></div><div class="magazines-home-progress"><div class="magazines-home-progress-copy"><strong>阅读进度</strong><p>2026-09-07 至 2026-10-04</p><div class="magazines-home-participants"><span><img src="assets/figma-magazines/guide.png" width="20" height="20" alt=""><img src="assets/figma-magazines/participant.png" width="20" height="20" alt=""></span><span>12 人参与</span><small class="magazines-home-reading-status">已完结</small></div></div><div class="magazines-home-ring" role="progressbar" aria-label="阅读进度" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" data-progress="100"><svg viewBox="0 0 88 88" aria-hidden="true"><circle class="magazines-progress-track" cx="44" cy="44" r="39"/><circle class="magazines-progress-arc" cx="44" cy="44" r="39" stroke-dasharray="245.04422698" stroke-dashoffset="0"/></svg><span>100%</span></div><a class="magazines-home-join" href="${e(octoberCommunityRoute('reading','magazine-'+m.title))}">加入</a></div></div><a class="magazines-home-read" href="${e(m.href)}">立即阅读</a>`;
  cover.innerHTML=`<a class="magazines-home-cover-link" href="${e(m.href)}" aria-label="查看《${e(m.title)}》期刊详情">${volume(m)}</a>`;cover.querySelector('[data-book-tilt]').dataset.bookBaseY='-20';page.querySelectorAll('[data-magazine-pick]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  if(animate)animateProgress(150);
  if(animate&&!reduced.matches){cover.animate([{opacity:0,transform:'translateX(40px) rotate(2deg)'},{opacity:1,transform:'translateX(0) rotate(0)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});[...info.children].forEach((n,i)=>n.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:i*60,fill:'backwards',easing:'ease-out'}));}
 }
 async function select(index){if(index===selected)return;const token=++sequence;const cover=page.querySelector('.magazines-home-cover');if(!reduced.matches)await cover.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-30px)'}],{duration:200,easing:'ease-in',fill:'forwards'}).finished.catch(()=>{});if(token!==sequence)return;cover.getAnimations().forEach(a=>a.cancel());show(index,true);}
 function filter(category='全部'){
 page.querySelector('.magazines-all-grid').innerHTML=data.magazines.filter(m=>category==='全部'||m.category===category).map(m=>`<a class="magazines-all-card" href="${e(m.href)}"><div class="magazines-card-cover books-library-cover-area"><span class="books-library-volume"><span class="books-library-paper" aria-hidden="true"></span><img class="books-library-cover" src="${e(m.cover)}" alt="《${e(m.title)}》封面" loading="lazy"></span></div><div class="magazines-card-info"><h3>${e(m.title)}</h3><p>${e(m.issue)}</p></div></a>`).join('');
 page.querySelectorAll('[data-magazine-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.magazineCategory===category)));
 }
 function expandStory(index){
  const stories=[...page.querySelectorAll('.magazines-story')];
  page.querySelector('.magazines-stories-grid').style.gridTemplateColumns=stories.map((_,i)=>i===index?'3fr':'1fr').join(' ');
  stories.forEach((story,i)=>{const open=i===index;story.classList.toggle('is-featured',open);story.querySelector('.magazines-story-toggle').setAttribute('aria-expanded',String(open));story.querySelector('p').hidden=!open;story.querySelector('.magazines-story-read').hidden=!open;});
 }
 page.addEventListener('click',event=>{const story=event.target.closest('[data-story-select]');if(story)expandStory(Number(story.dataset.storySelect));const pick=event.target.closest('[data-magazine-pick]'),category=event.target.closest('[data-magazine-category]');if(pick)select(Number(pick.dataset.magazinePick));if(category)filter(category.dataset.magazineCategory);});
 let wasActive=false;function entrance(){const active=root.classList.contains('active');if(active&&!wasActive)animateProgress(450);if(!active)cancelAnimationFrame(progressFrame);if(active&&!wasActive&&!reduced.matches){page.querySelector('.magazines-home-cover').animate([{opacity:0,transform:'translateY(32px) scale(.94)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1100,delay:100,fill:'backwards',easing:'cubic-bezier(.2,.8,.2,1)'});[...page.querySelector('.magazines-home-info').children,...page.querySelectorAll('.magazines-home-thumbnails button')].forEach((n,i)=>n.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,delay:250+i*90,fill:'backwards',easing:'cubic-bezier(.2,.8,.2,1)'}));}wasActive=active;}
 reduced.addEventListener('change',()=>animateProgress());
 show(0);filter();new MutationObserver(entrance).observe(root,{attributes:true,attributeFilter:['class']});entrance();
})();
