(()=>{const base=new URL('.',document.currentScript.src),path=location.pathname,isMe=path.endsWith('/me.html'),isHome=path===base.pathname||path===base.pathname+'index.html';const items=[['index.html','首页',isHome],['club.html','读书会',!isHome&&!isMe],['me.html','我的',isMe]];const nav=document.querySelector('.site-header .nav-shell>nav,.club-demo-topbar .nav-island>nav,.club-demo-topbar nav');if(nav)nav.innerHTML=items.map(([url,label,active])=>`<a href="${new URL(url,base).href}" ${active?'aria-current="page"':''}>${label}</a>`).join('');document.querySelectorAll('a.brand').forEach(a=>a.href=new URL('index.html',base).href);document.querySelector('#preview .dialog-close')?.addEventListener('click',()=>document.querySelector('#preview').close());})();

/* The card's native detail link also activates from its non-control surface. */
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const target=event.target;if(!(target instanceof Element)||target.closest('a,button,input,select,textarea,label,audio,video,[role=button],[role=slider],[contenteditable=true]'))return;
 if(window.getSelection()?.toString().trim())return;
 const card=target.closest('.v3-podcast');if(!card)return;
 const detail=card.querySelector('.v3-podcast-copy a[href],.v3-podcast-square[href]');if(detail){event.preventDefault();detail.click()}
});
