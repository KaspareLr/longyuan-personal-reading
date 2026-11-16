/* URL-scoped preview data: the normal demo stays untouched. */
(()=>{
 const singleLecturer=new URLSearchParams(location.search).get('lecturers')==='1';
 function url(value){const target=new URL(value,location.href);if(singleLecturer&&target.origin===location.origin&&/\.html$/.test(target.pathname))target.searchParams.set('lecturers','1');return target.href;}
 window.clubPreviewScenario={singleLecturer,url};
 if(!singleLecturer)return;
 function syncLink(link){if(link.hasAttribute('download'))return;const raw=link.getAttribute('href');if(!raw||raw.startsWith('#'))return;const next=url(raw);if(next!==link.href)link.href=next;}
 function scan(root){if(root.matches?.('a[href]'))syncLink(root);root.querySelectorAll?.('a[href]').forEach(syncLink);}
 new MutationObserver(records=>{for(const record of records){if(record.type==='attributes')syncLink(record.target);else record.addedNodes.forEach(n=>{if(n.nodeType===1)scan(n)})}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['href']});
 document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(link)syncLink(link);},true);
 document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
})();
