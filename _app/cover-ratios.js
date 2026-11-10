/* Resource semantics, not image filenames or intrinsic dimensions, select cover ratios. */
(()=>{
 const base=new URL('.',document.currentScript.src),pages=new URL('pages/',base),registry=new Map();
 function register(items,kind,relative){for(const item of items||[]){const src=item.cover||item.src;if(src)try{registry.set(new URL(src,relative).pathname,kind);}catch{}for(const issue of item.issues||[])if(issue.src)try{registry.set(new URL(issue.src,relative).pathname,kind);}catch{}}}
 register(window.clubCatalogData?.books,'book',base);register(window.clubPortalData?.books,'book',base);
 register(window.clubCatalogData?.magazines,'magazine',base);register(window.magazinesHomeData?.magazines,'magazine',pages);
 for(const reference of [window.periodicalReference,window.nanfcIssueReference,window.octoberIssueReference])if(reference){register([reference],'magazine',pages);register(reference.related,'magazine',pages);}
 if(typeof editorialBooks!=='undefined')register(editorialBooks,'book',pages);
 if(typeof libraryBooks!=='undefined')register(libraryBooks,'book',pages);
 if(typeof flowShelfData!=='undefined')register(flowShelfData,'magazine',pages);
 if(typeof archivedShelfData!=='undefined')register(archivedShelfData,'magazine',pages);
 const excluded='.v3-podcast,.v3-podcast-square,.podcast,.podcast-art,.oc-podcast,.v3-mixed-item[data-kind="podcast"],.v3-daily[data-kind="podcast"],.pe-article,.rd-article-group,.portal-reader:not(.is-standalone) .portal-prose';
 const articleSelector='.v3-daily[data-kind="article"]>img,.v3-mixed-item[data-kind="article"] .article-image-frame>img,.v3-recommendation-image>img,.portal-reader.is-standalone .portal-prose>img,.home-v3 .article-item .article-image-frame>img';
 let frame=0;
 function apply(){frame=0;
  for(const img of document.querySelectorAll('img')){
   if(img.closest(excluded)||/\.svg(?:[?#]|$)/i.test(img.getAttribute('src')||''))continue;
   let kind;
   if(['book','magazine','article'].includes(img.dataset.coverType))kind=img.dataset.coverType;
   else if(img.matches(articleSelector))kind='article';
   else if(img.closest('.oc-book-stage'))kind=img.closest('.oc-book-magazine')?'magazine':'book';
   else if(img.matches('.book-sidebar-mobile-cover,.book-contents-cover,.v3-daily[data-kind=book]>img')||img.closest('.books-library-card,.book-art,.wm-book-fallback,.wm-small-book,.v3-cover-link.v3-book,.v3-mixed-cover.v3-book'))kind='book';
   else if(img.closest('.magazines-all-card,.magazines-card-cover,.magazines-home-thumbnails,.magazines-home-cover,.reading-home-cover,.oc-issues,.oc-member-issues,.shelf-cover,.v3-cover-link.magazine,.v3-mixed-cover.magazine,.pe-cover-grid,.pe-crate-book')||img.matches('.pe-mobile-resource-cover,.pe-directory-cover,.pe-header-cover img,.v3-daily[data-kind=magazine]>img'))kind='magazine';
   else if(img.closest('[data-cover-frame-kind]'))kind=img.closest('[data-cover-frame-kind]').dataset.coverFrameKind;
   else {try{kind=registry.get(new URL(img.getAttribute('src'),location.href).pathname);}catch{}}
   if(!kind)continue;
   if(img.dataset.resourceCover!==kind)img.dataset.resourceCover=kind;
   const heightAxis=img.matches('.portal-book-cover')||!!img.closest('.books-home-thumbnails,.magazines-home-thumbnails,.feature-cover,.reading-home-cover,.portal-spotlight,.shelf-cover');
   const axis=heightAxis?'height':'width';if(img.dataset.resourceCoverAxis!==axis)img.dataset.resourceCoverAxis=axis;
   const wrapper=img.closest('.book-cover,.hinged-cover,.oc-reading-list-book,.books-library-volume,.shelf-cover');
   if(wrapper&&wrapper.dataset.coverFrameKind!==kind)wrapper.dataset.coverFrameKind=kind;
   const readingResource=img.closest('.reader-resource');if(readingResource&&readingResource.dataset.coverKind!==kind)readingResource.dataset.coverKind=kind;
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(apply);}
 new MutationObserver(records=>{if(records.some(record=>record.type==='attributes'||[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1&&(node.matches('img')||node.querySelector('img')))))schedule();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','data-cover-type']});apply();
})();
