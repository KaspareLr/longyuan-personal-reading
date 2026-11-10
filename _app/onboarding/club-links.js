/* Resolve reading-club resource links within this demo, including dynamic pages. */
(()=>{
 const base=new URL('.',document.currentScript.src),portal=path=>new URL('portal.html#/'+path,base).href;
 const e=s=>encodeURIComponent(s);
 const guide=(page,id)=>new URL('pages/index.html?nav=club#/magazine/'+e('南风窗')+'?claimed=1&page='+page+'&id='+e(id),base).href;
 function normalize(){
  document.querySelectorAll('a[href]').forEach(a=>{
   if(a.dataset.clubLinked||a.hasAttribute('data-template-resource'))return;const raw=a.getAttribute('href');
   const bid=raw.match(/#\/book\/([^?&#]+)/)?.[1];
   if(bid&&(raw.includes('icitychina')||raw.startsWith('#/book/'))){a.href=portal('book/'+bid);a.removeAttribute('target');a.dataset.clubLinked='1';return}
   if(a.closest('.daily-card')){const i=Array.from(document.querySelectorAll('.daily-card')).indexOf(a);a.href=portal('article/daily-'+i);a.removeAttribute('target');a.dataset.clubLinked='1';return}
   if(a.closest('.article-item')){const i=Array.from(document.querySelectorAll('.article-item')).indexOf(a);a.href=portal('article/shared-'+i);a.removeAttribute('target');a.dataset.clubLinked='1';return}
   if(a.closest('.pe-reading,.rd-article-group')&&/qikan\.com\.cn\/(article|articleinfo)/.test(raw)){
    const article=a.closest('.pe-article'),title=article?.querySelector('h4')?.textContent||a.textContent||a.querySelector('img')?.alt||'本期文章';
    const links=Array.from(document.querySelectorAll('.pe-article h4'));const i=Math.max(0,links.findIndex(h=>h.textContent===title));
    const publication=document.querySelector('.view.active .pe-identity h1')?.textContent||'第一财经';
    a.href=portal('article/'+i+'?context=magazine&resource='+e(publication)+'&title='+e(title));a.removeAttribute('target');a.dataset.clubLinked='1';return
   }
   if(a.closest('.oc-daily-track')&&/qikan\.cn|qikan\.com/.test(raw)){a.href=portal('article/daily-'+Array.from(document.querySelectorAll('.oc-daily-track a')).indexOf(a));a.removeAttribute('target');a.dataset.clubLinked='1'}
  });
 }
 document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-book]');if(b){ev.preventDefault();ev.stopImmediatePropagation();const item=window.clubCatalogData?.books[Number(b.dataset.book)];if(item)clubPageMotion.navigate(portal('book/'+e(item.id)));return}
  const activity=ev.target.closest('[data-open="activity"],[data-open="activities"]');if(activity){ev.preventDefault();ev.stopImmediatePropagation();clubPageMotion.navigate(portal(activity.dataset.open==='activity'?'event/oil':'events'))}
 },true);
 const watcher=new MutationObserver(()=>normalize());watcher.observe(document.body,{childList:true,subtree:true});normalize();
})();
