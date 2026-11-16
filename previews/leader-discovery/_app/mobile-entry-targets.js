/* Expand single-destination entries on phones while retaining native links/controls. */
(()=>{
 const mobile=matchMedia('(max-width:760px)');
 const entries=['.v3-recommendation','.v3-mixed-item','.article-item','.portal-event-feature','.event-card','.book-card','.mag-card','.magazine','.rank-row','.small-book-row','.book-feature','.reading-home-feature','.oc-reading-list-card','.people-guide-card','.rd-article','.rd-chapter','.rd-feature-card','.oc-article','.oc-topic-article','.reader-toc-article','.wm-chapter-link','[data-mobile-entry]'].join(',');
 const controls='a,button,input,select,textarea,label,summary,audio,video,[role=button],[role=slider],[contenteditable=true],[data-no-entry-click]';
 function destination(card){
  const links=[...card.querySelectorAll('a[href]')].filter(a=>!a.hidden&&!a.closest('[hidden],[inert]')&&a.getClientRects().length);
  const targets=new Map();
  for(const a of links){
   if(a.hasAttribute('download')||a.target&&a.target!=='_self')return null;
   const raw=a.getAttribute('href');if(!raw||raw==='#'||/^javascript:/i.test(raw))return null;
   let url;try{url=new URL(a.href,location.href);}catch{return null;}
   if(!/^https?:$/.test(url.protocol))return null;
   targets.set(url.href,a);
  }
  return targets.size===1?[...targets.values()][0]:null;
 }
 document.addEventListener('click',event=>{
  if(!mobile.matches||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const target=event.target;if(!(target instanceof Element)||target.closest(controls))return;
  if(window.getSelection()?.toString().trim())return;
  // Never enlarge a detail-page reading region, dialog, form, or another control.
  if(target.closest('dialog,form,.portal-prose,.pe-chat'))return;
  let card=target.closest(entries);
  while(card){
   if(card.matches('a,button')||card.closest('a,button'))return;
   const link=destination(card);
   if(link){event.preventDefault();link.click();return;}
   card=card.parentElement?.closest(entries);
  }
 });
})();
