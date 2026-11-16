(()=>{
 const base=new URL('.',document.currentScript.src),path=location.pathname,name=path.slice(base.pathname.length)||'index.html',primary=['index.html','feed.html','club.html','me.html'].includes(name);
 const items=[['index.html','新首页','icon-Home'],['feed.html','信息流','icon-All'],['club.html','读书会','icon-Read'],['me.html','我的','icon-user_s']];
 const links=items.map(([url,label])=>`<a href="${new URL(url,base).href}" ${name===url?'aria-current="page"':''}>${label}</a>`).join('');
 const nav=document.querySelector('.site-header .nav-shell>nav,.club-demo-topbar .nav-island>nav,.club-demo-topbar nav');if(nav)nav.innerHTML=links;
 document.querySelectorAll('a.brand').forEach(a=>a.href=new URL('index.html',base).href);
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('discovery-navigation.css',base);document.head.append(style);
 if(primary){document.body.classList.add('discovery-shell');const tabs=document.createElement('nav');tabs.className='discovery-tabs';tabs.setAttribute('aria-label','主导航');tabs.innerHTML='<div class="club-mobile-nav-shell">'+items.map(([url,label,icon])=>`<a class="club-mobile-nav-item ${name===url?'is-active':''}" href="${new URL(url,base).href}" ${name===url?'aria-current="page"':''}><span class="club-mobile-nav-icon" aria-hidden="true"><i class="iconfont font_family ${icon}"></i></span><span>${label}</span></a>`).join('')+'</div>';document.body.append(tabs)}
 document.querySelector('#preview .dialog-close')?.addEventListener('click',()=>document.querySelector('#preview').close());
})();

/* The card's native detail link also activates from its non-control surface. */
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const target=event.target;if(!(target instanceof Element)||target.closest('a,button,input,select,textarea,label,audio,video,[role=button],[role=slider],[contenteditable=true]'))return;
 if(window.getSelection()?.toString().trim())return;
 const card=target.closest('.v3-podcast');if(!card)return;
 const detail=card.querySelector('.v3-podcast-copy a[href],.v3-podcast-square[href]');if(detail){event.preventDefault();detail.click()}
});

/* Return from discovery resources to the selected lecturer, preserving existing reader drill-down. */
(()=>{const backBase=new URL('.',document.currentScript.src),params=new URLSearchParams(location.search);if(params.get('from')!=='discover')return;document.addEventListener('click',event=>{if(!event.target.closest('.portal-back,.club-page-back'))return;const chapter=/^#\/article\//.test(location.hash)&&!location.hash.includes('shared-');if(chapter)return;event.preventDefault();event.stopImmediatePropagation();const url=new URL('index.html',backBase);url.searchParams.set('leader',params.get('leader')||'');if(window.clubPageMotion)clubPageMotion.navigate(url);else location.assign(url)},true)})();
