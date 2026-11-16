/* Lecturer entry policy and the banner-free directory share the live roster. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const unique=items=>[...new Map((Array.isArray(items)?items:[]).filter(p=>p&&typeof p.id==='string'&&p.id.trim()).map(p=>[p.id,p])).values()];
 const roster=()=>unique(window.clubPeopleProfiles);
 let routeFor;
 const card=p=>`<a class="people-guide-card" href="${esc(routeFor('lecturer',p.id))}" aria-label="进入${esc(p.name)}的领读人主页"><div class="people-guide-portrait"><img src="${esc(p.portrait)}" alt="${esc(p.name)}" loading="lazy"></div><div class="people-guide-card-copy"><div><span class="people-guide-badge">READING GUIDE · 领读人</span><h3>${esc(p.name)}</h3><p class="people-guide-role">${esc(p.role)}</p></div><blockquote><strong>领读寄语</strong><p>${esc(p.name==='曹文轩'?'如果你是故事中的主人公，会做出怎样的选择？':p.slogan)}</p></blockquote></div></a>`;
 window.clubPeoplePage={
  resolveEntry(route,items=roster()){const profiles=unique(items);return profiles.length===1?route('lecturer',profiles[0].id):null;},
  render(route){
   routeFor=route;const profiles=roster();
   const heading='<header class="reading-home-heading people-directory-heading"><span>READING GUIDES · 领读人</span><div><h1>与领读人相遇<br>把好书读深</h1><p>跟随不同的阅读视角，发现值得共读的好书与文章，让每一次阅读都有新的收获。</p></div></header>';
   if(!profiles.length)return `<div class="people-directory">${heading}<section class="portal-empty"><h2>领读人即将到来</h2><p>新的领读人与阅读分享正在准备中。</p></section></div>`;
   return `<div class="people-directory">${heading}<div class="people-guide-sections"><section class="people-guide-featured" aria-label="推荐领读人"><div class="people-guide-recommendations">${profiles.slice(0,2).map(card).join('')}</div><a class="people-next-chapter" href="portal.html#/me"><span>YOUR NEXT CHAPTER</span><h2>每个读者，<br>都有自己的光。</h2><p>记录读书时的发现，写下让你停留的一句话。你的阅读，也值得被看见。</p></a></section><section class="people-all-guides" aria-labelledby="people-all-title"><header><span>ALL</span><h2 id="people-all-title">全部领读人</h2></header><div class="people-all-grid">${profiles.map(card).join('')}</div></section></div></div>`;
  },
  mount(){document.body.classList.add('people-directory-page');},
  unmount(){document.body.classList.remove('people-directory-page','people-home-page');}
 };
})();
