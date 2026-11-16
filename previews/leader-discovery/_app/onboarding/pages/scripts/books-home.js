(()=>{
 const recommendations=libraryBooks;
 const root=document.querySelector('#view-books');if(!root)return;
 const hero=document.createElement('section');hero.className='books-home-hero';hero.setAttribute('aria-label','编辑推荐图书');root.prepend(hero);
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let selected=0,requested=0,switching=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function render(index){selected=index;const book=recommendations[index];
 const reason=book.reason;
 const markup=`<div class="books-home-feature"><div class="books-home-left"><div class="books-home-thumbnails" aria-label="选择推荐图书"><div class="books-home-thumbnail-track">${recommendations.map((b,i)=>`<button type="button" data-book-recommend="${i}" aria-label="推荐图书：${e(b.title)}" aria-pressed="${i===index}"><img src="${e(b.cover)}" width="44" height="60" alt=""></button>`).join('')}</div></div><div class="books-home-copy"><div class="books-home-identity"><div class="books-home-kicker"><img src="assets/figma-books/recommend-left.svg" width="9.734" height="16" alt=""><span>编辑推荐</span><img src="assets/figma-books/recommend-right.svg" width="9.734" height="16" alt=""></div><h1>${e(book.title)}</h1><strong>${e(book.author)}</strong></div><p>${e(book.summary)}</p></div></div>
 <a class="books-home-center" href="${e(book.url)}" aria-label="查看图书详情">${renderReadingBookVolume({contentType:'book',bookTitle:book.title,cover:book.cover})}</a>
 <div class="books-home-actions"><div class="books-home-description"><div class="books-home-club"><div class="books-home-guide"><img src="assets/figma-reading/participant-1.png" alt="" width="40" height="40"><div><div class="books-home-guide-name"><strong>苏皖</strong><span>领读人</span></div><small>本刊编辑</small></div></div><div class="books-home-join"><div class="books-home-progress"><strong>总进度40%</strong><div class="oc-reading-progress" role="progressbar" aria-label="共读进度" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"><span style="width:40%"></span></div><div class="oc-reading-participants"><span class="oc-reading-avatars"><img src="assets/figma-reading/participant-1.png" width="20" height="20" alt=""><img src="assets/figma-reading/participant-2.png" width="20" height="20" alt=""></span><span>12 人参与</span></div></div><a class="oc-button oc-dark" data-books-join href="${e(octoberCommunityRoute('reading','book-'+book.id))}">加入</a></div></div>
 <section class="books-home-reason"><h2>EDITOR’S NOTE 编辑推荐语</h2><p>${e(reason)}</p></section><section class="books-home-about"><h2>ABOUT THIS BOOK 简介</h2><p>${e(book.summary)}</p></section></div><a class="oc-button books-home-read" href="${e(book.url)}">立即阅读</a></div></div>`;
 if(hero.firstElementChild){const template=document.createElement('template');template.innerHTML=markup;['.books-home-copy','.books-home-center','.books-home-actions'].forEach(selector=>hero.querySelector(selector).replaceWith(template.content.querySelector(selector)));hero.querySelectorAll('[data-book-recommend]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.bookRecommend)===index)));}else hero.innerHTML=markup;
 }
 const header=document.querySelector('.topbar');if(header){const sync=()=>hero.style.setProperty('--books-nav-offset',header.offsetHeight+'px');new ResizeObserver(sync).observe(header);sync();}
 function targets(){return ['.books-home-center','.books-home-copy','.books-home-actions'].map(selector=>hero.querySelector(selector));}
 let entranceAnimations=[];
 async function entrance(direction=1,isSwitch=false){
  entranceAnimations.forEach(animation=>animation.cancel());entranceAnimations=[];if(reduced.matches)return;
  const ease='cubic-bezier(.25,.1,.25,1)';
  function reveal(node,delay,duration,from){if(!node)return;entranceAnimations.push(node.animate([{opacity:0,transform:from},{opacity:1,transform:'translate3d(0,0,0) scale(1)'}],{delay,duration,easing:ease,fill:'backwards'}));}
  if(isSwitch){targets().forEach((node,i)=>reveal(node,i*45,i===0?550:400,i===0?`translate3d(${direction*24}px,0,0) scale(.98)`:'translate3d(0,10px,0)'));await Promise.allSettled(entranceAnimations.map(animation=>animation.finished));return;}
  reveal(hero.querySelector('.books-home-center'),100,1100,`translate3d(${direction*18}px,32px,0) scale(.94)`);
  [...hero.querySelectorAll('.books-home-thumbnails button')].slice(0,3).forEach((node,i)=>reveal(node,180+i*100,700,'translate3d(0,12px,0)'));
  hero.querySelectorAll('.books-home-kicker,.books-home-identity h1,.books-home-identity>strong,.books-home-copy>p').forEach((node,i)=>reveal(node,380+i*110,800,'translate3d(0,18px,0)'));
  hero.querySelectorAll('.books-home-club,.books-home-reason,.books-home-about,.books-home-read').forEach((node,i)=>reveal(node,580+i*130,850,'translate3d(0,18px,0)'));
  await Promise.allSettled(entranceAnimations.map(animation=>animation.finished));
 }
 async function select(index){requested=index;hero.querySelectorAll('[data-book-recommend]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.bookRecommend)===index)));if(switching||selected===index)return;
 entranceAnimations.forEach(animation=>animation.cancel());entranceAnimations=[];
 switching=true;const direction=1,restoreFocus=hero.contains(document.activeElement);
 if(!reduced.matches){const animations=targets().map((node,i)=>node.animate([{opacity:1,transform:'translate(0,0)'},{opacity:0,transform:i===0?`translateX(${-direction*28}px) scale(.98)`:'translateY(-8px)'}],{duration:200,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'}));await Promise.allSettled(animations.map(a=>a.finished));}
 render(requested);if(restoreFocus)hero.querySelector(`[data-book-recommend="${selected}"]`)?.focus({preventScroll:true});await entrance(direction,true);switching=false;if(requested!==selected)select(requested);
 }
 let shifting=false;
 async function advanceThumbnails(button){
  const track=hero.querySelector('.books-home-thumbnail-track'),children=[...track.children];
  if(shifting||children.length<=3||children.indexOf(button)!==2)return;
  shifting=true;const first=children[0].getBoundingClientRect(),next=children[1].getBoundingClientRect();
  if(!reduced.matches){const animation=track.animate([{transform:'translate(0,0)'},{transform:`translate(${first.x-next.x}px,${first.y-next.y}px)`}],{duration:380,easing:'cubic-bezier(.22,.68,0,1)',fill:'forwards'});await animation.finished.catch(()=>{});track.append(children[0]);animation.cancel();}else track.append(children[0]);
  shifting=false;
 }
 hero.addEventListener('click',event=>{const button=event.target.closest('[data-book-recommend]');if(button){advanceThumbnails(button);select(Number(button.dataset.bookRecommend));return;}});
 window.addEventListener('hashchange',()=>{if(location.hash.split('?')[0]==='#/books')entrance();});
 render(0);if(location.hash.split('?')[0]==='#/books')requestAnimationFrame(()=>entrance());
})();
