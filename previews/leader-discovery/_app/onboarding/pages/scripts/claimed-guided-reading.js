/* Editorial demo plans: reference structure, not attributed published courses. */
window.octoberGuidedBooks=[{"title": "稻草人", "cover": "assets/guided-books/book-1.jpg", "sourceCover": "https://citymedia.oss-cn-wulanchabu.aliyuncs.com/aibook-files/CC262DC5-5CAF-9FE3-8769-B29DD1E94324/assets/img/cover.jpg", "bookGuid": "CC262DC5-5CAF-9FE3-8769-B29DD1E94324"}, {"title": "寄小读者", "cover": "assets/guided-books/book-2.jpg", "sourceCover": "https://citymedia.oss-cn-wulanchabu.aliyuncs.com/aibook-files/13BCAF96-5AF7-792B-D43D-D87D7D467FE8/assets/img/cover.jpg", "bookGuid": "13BCAF96-5AF7-792B-D43D-D87D7D467FE8"}, {"title": "中国神话故事集", "cover": "assets/guided-books/book-3.jpg", "sourceCover": "https://citymedia.oss-cn-wulanchabu.aliyuncs.com/aibook-files/683fa7ab-03fb-5d72-b603-bf0e9c1440fd/assets/img/cover.jpg", "bookGuid": "683fa7ab-03fb-5d72-b603-bf0e9c1440fd"}, {"title": "日诵经典", "cover": "assets/guided-books/book-4.jpg", "sourceCover": "https://citymedia.oss-cn-wulanchabu.aliyuncs.com/aibook-files/48fa60f9-3b00-5fe3-bfc3-3bde20cf654e/assets/img/cover.jpg", "bookGuid": "48fa60f9-3b00-5fe3-bfc3-3bde20cf654e"}, {"title": "没头脑和不高兴", "cover": "assets/guided-books/book-5.jpg", "sourceCover": "https://citymedia.oss-cn-wulanchabu.aliyuncs.com/aibook-files/62b7f614-bdb0-5350-8e56-f51c475ad969/assets/img/cover.jpg", "bookGuid": "62b7f614-bdb0-5350-8e56-f51c475ad969"}];
window.octoberGuidedResources=[
 {...octoberGuidedBooks[0],type:'book',author:'叶圣陶'},
 {type:'journal',title:'南风窗',issue:octoberClubData.issues[0].label,cover:octoberClubData.issues[0].src},
 {type:'article',title:'星星只在夜里亮吗？',author:'',cover:null},
 {...octoberGuidedBooks[3],type:'book',publisher:''},
 {type:'article',title:'来自赛汗塔拉的牧羊犬',author:'格日勒其木格·黑鹤',cover:null}
];
window.octoberReadingTypeLabel=type=>({journal:'期刊',book:'图书',article:'文章'}[type]||'图书');
window.octoberGuidedPlans=octoberClubData.lecturers.profiles.flatMap((p,index)=>{
 const themes=[['成长与选择','人物与故事','读一篇成长故事，记录人物面对的选择。','如果你是故事中的主人公，会做出怎样的选择？'],['走进编辑的阅读现场','文字与观察','选读一篇本刊文章，标出标题、开头和结尾。','哪一个细节让你愿意继续读下去？'],['把日常写成一首诗','诗歌与想象','读一首童诗，摘录最有画面感的两句。','试着把今天看到的一件小事写成三行诗。']][index];
 return [0,1,2,3,4].map((slot)=>{const past=slot>0,resource=octoberGuidedResources[slot];return {id:p.id+(slot===0?'-current':slot===1?'-past':'-past-'+slot),personId:p.id,contentType:resource.type,bookTitle:resource.title,issue:resource.issue||'',author:resource.author||'',publisher:resource.publisher||'',cover:resource.type==='article'?null:resource.cover,title:slot===0?themes[0]:['','重读，把细节读出来','让想象走进日常','故事里的另一种选择','用文字留下一个发现'][slot],subtitle:themes[1],start:past?'2026-09-07':'2026-10-12',end:past?'2026-10-04':'2026-11-08',past,description:'围绕《'+resource.title+'》，用四周时间完成选读、观察、讨论与表达。',message:'带着一个问题读进去，再带着自己的发现走出来。',todayTask:{range:themes[2],question:themes[3]},weeks:[{title:'从阅读开始',range:'第一周 · 选读与初读',tasks:['选择一篇感兴趣的作品，完成第一次阅读。','写下一个你希望在共读中讨论的问题。']},{title:'看见文字里的细节',range:'第二周 · 精读与摘录',tasks:['摘录三个打动你的细节，注明作品名称。','用自己的话说明：这些细节为什么重要？']},{title:'交换不同的读法',range:'第三周 · 讨论与比较',tasks:['围绕今日共读问题写下你的看法。','比较两种不同理解，回到原文寻找依据。']},{title:'把阅读变成表达',range:'第四周 · 写作与回顾',tasks:['完成一篇短读后感，记录阅读带来的变化。','回顾最初的问题，看看你的答案是否改变。']}]}});
});
// Sample reader notes are displayed alongside personal notes, without writing to localStorage.
window.octoberReadingDemoNotes={
 '稻草人':[
  {author:'林小满',text:'读完《稻草人》，最让我难过的是它看见了别人的困境，却没办法伸出手。以前我觉得善良就是替别人难过，现在更想问自己：在生活里，我能做的一件小事是什么？'},
  {author:'陈一禾',text:'这次重读，我注意到稻草人一直在认真看、认真听。它没有说话，故事却让我听见了许多声音。我想试着多留意身边的人，别急着用一句“没关系”带过他们的心情。'},
  {author:'周沐',text:'和大家讨论以后，我发现同一个故事可以有不同的读法。有人看见无力，有人看见关心。我更愿意把稻草人的注视理解成一个提醒：看见别人，是理解别人迈出的第一步。'}
 ],
 '寄小读者':[
  {author:'林小满',text:'《寄小读者》让我重新注意到日常里很小的美。读完后，我也想给远方的朋友写一封信，把今天窗外的云和路上的发现认真告诉她。'},
  {author:'陈一禾',text:'我喜欢书信里亲切的语气，像有人坐在身边慢慢聊天。原来表达感受不一定要用很华丽的词，把真实看到的、想到的写清楚，就已经很动人。'},
  {author:'周沐',text:'这次阅读让我想起离家时的心情。距离会让熟悉的事物变得珍贵，也让我更愿意说出感谢。准备把读书时想起的那个人，写进自己的下一封信里。'}
 ],
 '中国神话故事集':[
  {author:'林小满',text:'读这些神话时，我最感兴趣的是古人怎样解释眼前的世界。那些大胆的想象，让天空、山川和日月都有了故事，也让我想画一张属于自己的神话地图。'},
  {author:'陈一禾',text:'故事里的困难常常很大，人物却愿意一步一步尝试。我读到的不只是神奇的力量，还有面对困难时不轻易放弃的勇气。'},
  {author:'周沐',text:'共读时听到大家对同一个人物的不同看法很有意思。我想再回到故事里找细节，看看哪些选择让我敬佩，哪些选择还值得继续讨论。'}
 ],
 '日诵经典':[
  {author:'林小满',text:'同一段文字，默读和读出声的感觉很不一样。慢慢诵读时，我才注意到句子的节奏，原来停顿也能帮助我理解意思。'},
  {author:'陈一禾',text:'我给自己定了每天读一小段的计划。比起一次记住很多内容，反复读熟一句、想明白一句，更让我觉得踏实。'},
  {author:'周沐',text:'今天试着把喜欢的句子和生活中的一件小事联系起来。经典忽然变得近了，读书也不只是记忆文字，而是在日常里慢慢体会。'}
 ],
 '没头脑和不高兴':[
  {author:'林小满',text:'一开始只觉得两个主人公很好笑，后来才发现自己也有“没头脑”和“不高兴”的时候。做事前多想一步，心情不好时把话说清楚，都是我想练习的小改变。'},
  {author:'陈一禾',text:'故事把小毛病放大以后，后果就变得特别明显。我喜欢这样的幽默：笑过之后，还能回头想想自己的习惯。'},
  {author:'周沐',text:'读完和朋友聊了聊，我们各自找到一个最像自己的地方。比起直接说教，这个故事更容易让我愿意承认问题，也愿意试着改一改。'}
 ]
};
window.octoberReadingNotes=plan=>[
 ...(octoberReadingState(plan.id).notes||[]),
 ...[...(octoberReadingDemoNotes[plan.bookTitle]||[
 {author:'林小满',text:'读完《'+plan.bookTitle+'》，我把最有感触的一段摘录下来。再读一次时，发现原来被我忽略的细节，正好回应了共读时提出的问题。'},
 {author:'陈一禾',text:'这次阅读让我试着从不同角度理解文字。把自己的想法和大家分享以后，我发现一个问题可以有好几种答案，也更愿意回到原文寻找依据。'},
 {author:'周沐',text:'我喜欢这次共读中交换想法的过程。别人留意的细节和我不一样，这让我重新读了一遍，也为下一次阅读留下了新的问题。'}
 ]),{author:'许知遥',text:'共读《'+plan.bookTitle+'》时，我把最有感触的一段读给了家人听。听到他们不同的理解后，我又回到原文读了一遍。原来分享不仅是说出自己的想法，也能发现独自阅读时忽略的细节。'}].map((note,index)=>({...note,date:plan.past?'2026-10-0'+(4-index):'2026-10-'+(14-index),demo:true}))
];
window.octoberReadingState=id=>{try{return JSON.parse(localStorage.getItem('oc-reading:'+id)||'{}')}catch{return {}}};
window.renderOctoberReadingCards=function(personId){
 const plans=octoberGuidedPlans.filter(x=>x.personId===personId),e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<div class="oc-reading-list-grid">${plans.map(x=>{
 const state=octoberReadingState(x.id),progress=x.past?100:Math.min(100,Math.round((state.checks||[]).length/28*100));
 const subtitle=x.contentType==='journal'?x.issue:x.contentType==='article'?(x.author||'作者待补充'):([x.author,x.publisher].filter(Boolean).join(' · ')||'出版信息待补充');
 return `<a class="oc-reading-list-card ${x.contentType==='article'?'is-article':''}" href="${octoberCommunityRoute('reading',x.id)}">
 ${x.contentType!=='article'&&x.cover?`<span class="oc-reading-list-book"><span class="oc-reading-list-paper" aria-hidden="true"></span><img class="oc-reading-list-cover" src="${e(x.cover)}" alt="《${e(x.bookTitle)}》封面" loading="lazy" width="210" height="285"></span>`:''}
 <div class="oc-reading-list-content"><div class="oc-reading-list-heading"><span class="oc-reading-list-status ${x.past?'is-complete':''}">${x.past?'已完结':'进行中'}</span><div><h4>${e(x.bookTitle)}</h4><p>${e(subtitle)}</p></div></div>
 <blockquote class="oc-reading-list-message"><strong>领读语</strong><p>${e(x.todayTask.question)}</p></blockquote>
 <div class="oc-reading-list-summary"><div class="oc-reading-list-summary-copy"><div><strong>阅读进度</strong><small>${e(x.start)} 至 ${e(x.end)}</small></div><div class="oc-reading-participants"><span class="oc-reading-avatars"><img src="assets/figma-reading/participant-1.png" alt="" width="20" height="20"><img src="assets/figma-reading/participant-2.png" alt="" width="20" height="20"></span><span>12 人参与</span></div></div><div class="oc-reading-list-ring" role="progressbar" aria-label="阅读进度" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><svg viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="39" class="oc-list-ring-track"/><circle cx="44" cy="44" r="39" class="oc-list-ring-value" opacity="${progress===0?0:1}" pathLength="100" stroke-dasharray="${progress} 100"/></svg><strong>${progress}%</strong></div></div></div></a>`;
 }).join('')}</div>`;
};
window.renderReadingBookVolume=function(plan){const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));return plan.contentType!=='article'&&plan.cover?`<div class="oc-book-stage ${plan.contentType==='journal'?'oc-book-magazine':''}" data-book-tilt style="--book-edge:${e(window.readingCoverEdgeColor?.(plan.cover)||'#e6e3dc')}"><div class="oc-book-object"><div class="oc-book-back" aria-hidden="true"></div><div class="oc-book-spine" aria-hidden="true"></div><div class="oc-book-pages" aria-hidden="true"></div><div class="oc-book-bottom" aria-hidden="true"></div><div class="oc-book-top" aria-hidden="true"></div>${plan.contentType==='book'?`<div class="oc-book-board-inner oc-book-board-front" aria-hidden="true"></div><div class="oc-book-board-inner oc-book-board-back" aria-hidden="true"></div>${['front','back'].map(side=>['top','bottom','right'].map(edge=>`<div class="oc-book-board-edge oc-book-board-${side} oc-book-board-${edge}" aria-hidden="true"></div>`).join('')).join('')}`:''}<div class="oc-book-front"><img class="oc-guided-cover" src="${e(plan.cover)}" alt="《${e(plan.bookTitle)}》封面"><span class="oc-book-light" aria-hidden="true"></span></div></div></div>`:'';};
window.renderOctoberGuidedDetail=function(id){
 const plan=octoberGuidedPlans.find(x=>x.id===id);if(!plan)return '<p>未找到这个领读计划。</p>';
 const p=octoberClubData.lecturers.profiles.find(x=>x.id===plan.personId),state=octoberReadingState(id),e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const now=new Date(),today=now.toLocaleDateString('sv-SE'),checked=(state.checks||[]).includes(today),year=now.getFullYear(),month=now.getMonth(),days=new Date(year,month+1,0).getDate(),offset=(new Date(year,month,1).getDay()+6)%7;
 const countdown=ocReadingCountdown(now);
 const progress=plan.past?100:Math.min(100,Math.round((state.checks||[]).length/28*100));
 const calendar=Array.from({length:days},(_,i)=>{const date=`${year}-${String(month+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;return `<span class="oc-calendar-day ${date===today?'is-today':''} ${(state.checks||[]).includes(date)?'is-checked':''}" aria-label="${date}${(state.checks||[]).includes(date)?' 已打卡':''}">${i+1}</span>`}).join('');
 return `<div class="oc-reading-detail oc-guided-figma ${plan.contentType==='article'?'oc-guided-article':''}" data-reading-id="${e(id)}" data-content-type="${e(plan.contentType)}">
 <div class="oc-guided-overview">
 <header class="oc-guided-sidebar">
 ${renderReadingBookVolume(plan)}
 <div class="oc-guided-title"><h1>${e(plan.bookTitle)}</h1><p>${e(plan.contentType==='journal'?plan.issue:plan.contentType==='article'?(plan.author||'作者待补充'):([plan.author,plan.publisher].filter(Boolean).join(' · ')||'出版信息待补充'))}</p></div>
 <div class="oc-guided-join"><div class="oc-guided-progress"><strong>总进度${progress}%</strong><div class="oc-reading-progress" role="progressbar" aria-label="阅读进度" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><span style="width:${progress}%"></span></div><div class="oc-reading-participants"><span class="oc-reading-avatars"><img src="assets/figma-reading/participant-1.png" alt=""><img src="assets/figma-reading/participant-2.png" alt=""></span><span>12 人参与</span></div></div><button class="oc-button oc-dark" ${state.joined?'data-reading-start':'data-reading-join'}>${state.joined?'立即阅读':'加入读书会'}</button></div>
 <a class="oc-guided-guide" href="${octoberCommunityRoute('lecturer',p.id)}"><img src="${e(p.avatar)}" alt=""><strong>${e(p.name)}</strong><span>领读人</span></a>
 </header>
 <div class="oc-guided-information">
 <section class="oc-section oc-guided-week-section"><header class="oc-heading"><span>WEEKLY PLAN</span><h2>共读周计划</h2></header><div class="oc-reading-weeks">${plan.weeks.map((w,i)=>`<article><span class="oc-eyebrow">WEEK ${String(i+1).padStart(2,'0')}</span><div><h3>${e(w.title)}</h3><p>${e(w.range)}</p><ul>${w.tasks.map(t=>`<li>${e(t)}</li>`).join('')}</ul></div></article>`).join('')}</div></section>
 <section class="oc-section oc-guided-calendar-section"><header class="oc-heading"><span>READING TRACKER</span><h2>阅读日历</h2></header><article class="oc-guided-task"><div class="oc-guided-task-heading"><h3>今日阅读任务</h3><p class="oc-guided-task-month">${year}年${String(month+1).padStart(2,'0')}月</p></div><div class="oc-guided-calendar-row"><div class="oc-calendar-grid" aria-label="${year}年${month+1}月阅读日历">${['一','二','三','四','五','六','日'].map(x=>`<span class="oc-calendar-weekday">${x}</span>`).join('')}${'<span></span>'.repeat(offset)}${calendar}</div><div class="oc-guided-check" data-reading-clock style="--countdown-progress:${countdown.progress}deg" ><svg class="oc-guided-clock-ring" viewBox="0 0 190 190" aria-hidden="true"><circle class="oc-clock-track" cx="95" cy="95" r="91"/><circle class="oc-clock-value" data-reading-ring cx="95" cy="95" r="91" pathLength="100" stroke-dasharray="${countdown.progress/3.6} 100"/></svg><span class="oc-guided-clock-progress" role="progressbar" aria-label="今日打卡剩余时间" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${countdown.percent}"></span><div><strong data-reading-countdown>${countdown.label}</strong><small>剩余时间</small></div><button class="oc-button oc-dark" data-reading-check ${!state.joined||checked?'disabled':''}>${checked?'已打卡':'今日打卡'}</button></div></div><div class="oc-guided-question"><p>${e(plan.todayTask.range)}</p><blockquote><strong>共读问题</strong><p>${e(plan.todayTask.question)}</p></blockquote></div><p class="oc-reading-feedback" role="status">${checked?'已记录今天的阅读。':''}</p></article></section>
 </div></div>
 <section class="oc-section oc-guided-notes-section"><header class="oc-heading oc-guided-notes-heading"><div><span>READER NOTES</span><h2>读后感分享</h2></div><button class="oc-button" type="button" data-reading-comment>我要评论</button></header><div class="oc-reading-notes">${octoberReadingNotes(plan).map(n=>`<article><img class="oc-guided-quote" src="assets/figma-guided-detail/quote.svg" alt="" width="42" height="32"><p>${e(n.text)}</p><footer><strong>${e(n.author||'我')}</strong><small>${e(n.date)}</small></footer></article>`).join('')}</div><form class="oc-reading-note-form"><label for="oc-reading-note">写下我的读后感</label><div class="oc-guided-compose"><textarea id="oc-reading-note" name="note" rows="3" maxlength="2000" required placeholder="读到哪一段最有感触？记录作品名称和你的想法……"></textarea><button class="oc-button oc-dark" type="submit">发送</button></div><p role="status" class="oc-reading-feedback"></p></form></section></div>`;
};
function ocReadingCountdown(now=new Date()){
 const start=new Date(now),end=new Date(now);start.setHours(0,0,0,0);end.setHours(24,0,0,0);
 const remaining=Math.max(0,end-now),seconds=Math.floor(remaining/1000),fraction=remaining/(end-start);
 return {label:[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(x=>String(x).padStart(2,'0')).join(':'),progress:fraction*360,percent:Math.round(fraction*100)};
}
function ocUpdateReadingCountdown(){
 const countdown=ocReadingCountdown();document.querySelectorAll('[data-reading-clock]').forEach(el=>{
 el.style.setProperty('--countdown-progress',countdown.progress+'deg');el.querySelector('[data-reading-ring]').setAttribute('stroke-dasharray',(countdown.progress/3.6)+' 100');el.querySelector('.oc-guided-clock-progress').setAttribute('aria-valuenow',countdown.percent);el.querySelector('[data-reading-countdown]').textContent=countdown.label;
 const root=el.closest('[data-reading-id]'),state=octoberReadingState(root.dataset.readingId),today=new Date().toLocaleDateString('sv-SE');
 const button=el.querySelector('[data-reading-check]'),checked=(state.checks||[]).includes(today);button.disabled=!state.joined||checked;button.textContent=checked?'已打卡':'今日打卡';
 });
}
setInterval(ocUpdateReadingCountdown,1000);
function ocSaveReading(id,state){try{localStorage.setItem('oc-reading:'+id,JSON.stringify(state));return true}catch{return false}}
function ocRefreshReading(root){root.outerHTML=renderOctoberGuidedDetail(root.dataset.readingId)}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-reading-join],[data-reading-check],[data-reading-start]');if(!button)return;
 const root=button.closest('[data-reading-id]'),state=octoberReadingState(root.dataset.readingId);
 if(button.hasAttribute('data-reading-start')){if(!state.joined)return;root.querySelector('.oc-guided-calendar-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});return;}
 if(button.hasAttribute('data-reading-join'))state.joined=true;
 else{if(!state.joined||button.disabled)return;state.checks=[...new Set([...(state.checks||[]),new Date().toLocaleDateString('sv-SE')])];}
 if(ocSaveReading(root.dataset.readingId,state))ocRefreshReading(root);else root.querySelector('.oc-reading-feedback').textContent='浏览器无法保存，请检查存储设置。';
});
document.addEventListener('submit',event=>{const form=event.target.closest('.oc-reading-note-form');if(!form)return;event.preventDefault();const text=form.elements.note.value.trim();if(!text)return;const root=form.closest('[data-reading-id]'),state=octoberReadingState(root.dataset.readingId);state.notes=[{text,date:new Date().toLocaleDateString('sv-SE')},...(state.notes||[])];if(ocSaveReading(root.dataset.readingId,state)){ocRefreshReading(root);document.querySelector('.oc-reading-note-form [role=status]').textContent='读后感已保存在当前浏览器。'}else form.querySelector('[role=status]').textContent='保存失败，请检查浏览器存储设置。'});

// Delegated interaction also supports detail sections refreshed after joining/check-in.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let active=null,bounds=null,frame=0,latest=null;
 function reset(){cancelAnimationFrame(frame);frame=0;if(active){active.style.removeProperty('--book-rx');active.style.removeProperty('--book-ry');active.style.removeProperty('--book-light-x');}active=null;bounds=null;}
 document.addEventListener('pointermove',event=>{
 const stage=event.target.closest('[data-book-tilt]');if(!stage||reduced.matches||!fine.matches||event.pointerType==='touch'){if(active)reset();return;}
 if(active!==stage){reset();active=stage;bounds=stage.getBoundingClientRect();}
 latest={x:Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1)),y:Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1))};
 if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!active)return;active.style.setProperty('--book-rx',(20-latest.y*8)+'deg');active.style.setProperty('--book-ry',(Number(active.dataset.bookBaseY??20)+latest.x*12)+'deg');active.style.setProperty('--book-light-x',(50+latest.x*18)+'%');});
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(active&&(!event.relatedTarget||!active.contains(event.relatedTarget)))reset();},{passive:true});
 window.addEventListener('blur',reset);window.addEventListener('scroll',reset,{passive:true});reduced.addEventListener('change',reset);
})();

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-reading-comment]');if(!button)return;
 const input=button.closest('[data-reading-id]').querySelector('.oc-reading-note-form textarea');
 input.focus({preventScroll:true});input.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
});
// Replay the reading progress on pointer entry or keyboard focus.
(()=>{
 const frames=new WeakMap(),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function paint(card,value){const ring=card.querySelector('.oc-reading-list-ring'),stroke=ring.querySelector('.oc-list-ring-value');stroke.setAttribute('stroke-dasharray',value+' 100');stroke.setAttribute('opacity',value>0?'1':'0');ring.querySelector('strong').textContent=Math.round(value)+'%';}
 function stop(card){const frame=frames.get(card);if(frame)cancelAnimationFrame(frame);frames.delete(card);paint(card,Number(card.querySelector('.oc-reading-list-ring').getAttribute('aria-valuenow')));}
 function play(card){stop(card);if(reduced.matches)return;const target=Number(card.querySelector('.oc-reading-list-ring').getAttribute('aria-valuenow')),start=performance.now();paint(card,0);function tick(now){if(!card.isConnected){frames.delete(card);return;}const t=Math.min(1,(now-start)/750);paint(card,target*(1-Math.pow(1-t,3)));if(t<1)frames.set(card,requestAnimationFrame(tick));else frames.delete(card);}frames.set(card,requestAnimationFrame(tick));}
 document.addEventListener('pointerover',event=>{const card=event.target.closest('.oc-reading-list-card');if(card&&event.pointerType!=='touch'&&(!event.relatedTarget||!card.contains(event.relatedTarget)))play(card);});
 document.addEventListener('pointerout',event=>{const card=event.target.closest('.oc-reading-list-card');if(card&&(!event.relatedTarget||!card.contains(event.relatedTarget)))stop(card);});
 document.addEventListener('focusin',event=>{const card=event.target.closest('.oc-reading-list-card');if(card)play(card);});
 document.addEventListener('focusout',event=>{const card=event.target.closest('.oc-reading-list-card');if(card)stop(card);});
 reduced.addEventListener('change',()=>document.querySelectorAll('.oc-reading-list-card').forEach(stop));
})();
