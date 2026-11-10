(()=>{
 // File previews link to the sibling project; HTTP previews use its existing local server.
 const projectEntry=new URL('pages/index.html',location.href).href;
 const clubProjectEntry=projectEntry+'?nav=club';
 const projectHome=kind=>clubProjectEntry+'#/'+kind;
 document.querySelectorAll('[data-project-home]').forEach(link=>link.href=projectHome(link.dataset.projectHome));
 const asset=name=>'assets/'+name;
 const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<span class="arrow"><img src="assets/card-arrow.svg" alt=""></span>';
 document.querySelector('.guides').innerHTML=clubGuideProfiles.map(p=>`<a class="guide" href="${escape(clubProjectEntry+'#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&page=lecturer&id='+encodeURIComponent(p.id))}"><img src="${escape(p.avatar)}" width="40" height="40" alt="${escape(p.name)}"><span><strong>${escape(p.name)} <b>领读人</b></strong><small>${escape(p.role)}</small></span></a>`).join('');
 const daily=clubSharedContent.daily,articles=clubSharedContent.articles,books=clubCatalogData.books,magazines=clubCatalogData.magazines;
 const podcasts=['十一红：传承家乡戏勇敢挑战自我','勇敢的种子：探讨鼓励的力量与教育智慧','青石街有龙出没'];
 document.querySelector('#books-grid').innerHTML=books.map((b,i)=>`<button class="book-card" data-book="${i}"><div class="book-art"><span class="book-cover"><img src="${escape(b.cover)}" alt="《${escape(b.title)}》封面" loading="lazy"></span></div><h3>${escape(b.title)}</h3><p>${escape(b.author)} · ${escape(b.publisher)}</p><footer><span>${escape(b.category)}</span>${arrow}</footer></button>`).join('');
 document.querySelector('#magazines-grid').innerHTML=magazines.map((m,i)=>`<button class="magazine" data-magazine="${i}"><span class="hinged-cover"><span class="cover-pages" aria-hidden="true"></span><img src="${escape(m.cover)}" alt="《${escape(m.title)}》封面" loading="lazy"></span><h3>${escape(m.title)}</h3><p>${escape(m.issue)}</p></button>`).join('');
 document.querySelector('#daily-track').innerHTML=daily.map(a=>`<a class="daily-card" href="${escape(a.url)}" target="_blank" rel="noopener"><img src="${escape(a.cover)}" alt="" loading="lazy"><div><h3>${escape(a.title)}</h3><p>${escape(a.author)}</p></div></a>`).join('');
 document.querySelector('#article-list').innerHTML=articles.map(a=>`<a class="article-item" href="${escape(a.url)}" target="_blank" rel="noopener"><span class="article-image-frame"><img src="${escape(a.cover)}" alt="${escape(a.title)}" loading="lazy"></span><div class="article-copy"><span>${escape(a.author)}</span><div><h3>${escape(a.title)}</h3><p>${escape(a.summary)}</p></div></div><span class="arrow"><img src="assets/arrow.svg" alt=""></span></a>`).join('');
 const dailyWall=document.querySelector('.daily-window');requestAnimationFrame(()=>dailyWall.scrollLeft=Math.max(0,(dailyWall.scrollWidth-dailyWall.clientWidth)/2));
 const dialog=document.querySelector('#preview'),content=document.querySelector('#dialog-content');let focusBefore=null;
 function open(title,html){focusBefore=document.activeElement;content.innerHTML=`<h2>${title}</h2>${html}`;dialog.showModal();}
 function close(){dialog.close();focusBefore?.focus({preventScroll:true});}
 document.querySelector('.dialog-close').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.addEventListener('cancel',()=>requestAnimationFrame(()=>focusBefore?.focus({preventScroll:true})));
 let toastTimer;function toast(message){const node=document.querySelector('.toast');node.textContent=message;node.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('visible'),2600);}
 const storage={get(key){try{return localStorage.getItem('club-demo:'+key);}catch{return null;}},set(key,value){try{localStorage.setItem('club-demo:'+key,value);}catch{}}};
 function renderReading(){clubPageMotion.navigate(clubProjectEntry+'#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&page=reading&id='+encodeURIComponent('magazine-第一财经'));}
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  const nav=event.target.closest('.nav-shell nav a');if(nav){document.querySelectorAll('.nav-shell nav a').forEach(a=>a.removeAttribute('aria-current'));nav.setAttribute('aria-current','page');}
  if(!button)return;
  const kind=button.dataset.open;
  if(kind==='reading')renderReading();
  if(kind==='member')open('成为龙源读书会会员','<p>与领读人一起读书，参与共读讨论，收藏喜欢的图书、杂志和文章。</p><p>会员功能为演示预览，此页面不产生付费或订阅。</p><button class="button dark" data-member-preview>体验会员状态</button>');
  if(kind==='login')open('欢迎来到龙源读书会','<p>设置一个昵称，体验你的阅读空间。</p><form class="dialog-form" id="login-form"><label>阅读昵称<input name="nickname" maxlength="20" required autocomplete="nickname" placeholder="怎么称呼你？"></label><button class="button dark" type="submit">进入读书会</button></form>');
  if(kind==='activities'||kind==='activity')open('曹文轩 · 油麻地的成长课','<img class="preview-cover" src="assets/activity.png" alt="领读活动海报"><p>2025年10月12日 · 济南市图书馆（中心馆）负一层大报告厅</p><p>活动已完结，报名已结束。你可以收藏活动，留待回顾。</p><button class="button dark" data-save="activity">收藏活动</button>');
  if(button.hasAttribute('data-book')){const b=books[Number(button.dataset.book)];open(escape(b.title),`<img class="preview-cover" src="${escape(b.cover)}" alt="《${escape(b.title)}》封面"><p>${escape(b.author)} · ${escape(b.publisher)} · ${escape(b.category)}</p><p>${escape(b.summary)}</p><div><a class="button dark" href="${escape(b.url)}" target="_blank" rel="noopener">前往阅读</a> <button class="button" data-save="book-${escape(b.id)}">加入我的书架</button></div>`);}
  if(button.hasAttribute('data-magazine')){const m=magazines[Number(button.dataset.magazine)];clubPageMotion.navigate(clubProjectEntry+'#/magazine/'+encodeURIComponent(m.title)+'?claimed=0');return;}
  if(button.dataset.podcast)open(podcasts[Number(button.dataset.podcast)],'<p>音频 · 示例资源</p><p>属于《南风窗》读书会。正式内容将关联本刊期次、领读人和单刊会员权限。</p><p>媒体介绍、关联原文与播放内容将在资源接入后展示。</p>');
  if(button.hasAttribute('data-join-confirm')){storage.set('joined','true');button.textContent='已加入 · 共读计划已开启';document.querySelector('.join').textContent='查看领读';toast('已加入本期共读');}
  if(button.dataset.save){storage.set('saved-'+button.dataset.save,'true');button.textContent='已收藏';toast('已保存到当前浏览器');}
  if(button.dataset.follow){storage.set('follow-'+button.dataset.follow,'true');button.textContent='已关注';}
  if(button.hasAttribute('data-member-preview')){storage.set('member','true');button.textContent='会员体验已开启';document.querySelector('.member').lastChild.textContent='会员中心';toast('已切换为会员体验状态');}
  if(button.dataset.jump&&['books','magazines'].includes(button.dataset.jump)){clubPageMotion.navigate(projectHome(button.dataset.jump));return;}
  if(button.dataset.jump){close();document.getElementById(button.dataset.jump).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
 });
 document.addEventListener('submit',event=>{if(event.target.id!=='login-form')return;event.preventDefault();const nickname=event.target.elements.nickname.value.trim();if(!nickname)return;storage.set('nickname',nickname);document.querySelector('.login').textContent=nickname;close();toast('欢迎，'+nickname);});
 if(storage.get('nickname'))document.querySelector('.login').textContent=storage.get('nickname');if(storage.get('joined'))document.querySelector('.join').textContent='查看领读';
 const initialPanel=new URLSearchParams(location.search).get('panel');if(['member','login'].includes(initialPanel))document.querySelector('[data-open="'+initialPanel+'"]')?.click();
 // Featured progress is started by feature-cover-scroll.js once the card is centered.
})();
