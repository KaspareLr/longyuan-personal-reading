/* Long detail introductions expand in place; source text is never shortened. */
(()=>{
 const root=document.querySelector('#portal-main,#app');if(!root)return;
 const mobile=matchMedia('(max-width:760px)'),records=new Map();let serial=0,frame=0;
 const targets=[['#portal-main[data-page=book] .book-detail-about>p','图书简介',6],['#portal-main[data-page=book] .book-detail-quote>p','编辑推荐',4],['#view-magazine .pe-resource-detail .pe-intro-copy>p','期刊简介',6]];
 function measure(){
  frame=0;
  for(const [paragraph,info] of records){
   if(!paragraph.isConnected){sizeObserver.unobserve(paragraph);records.delete(paragraph);continue;}
   const line=parseFloat(getComputedStyle(paragraph).lineHeight)||26;
   const needs=mobile.matches&&paragraph.scrollHeight>line*info.lines+1;
   info.button.hidden=!needs;
   paragraph.classList.toggle('resource-excerpt-collapsed',needs&&!info.expanded);
   const label=info.expanded?'收起':'展开全文';if(info.button.textContent!==label)info.button.textContent=label;
   info.button.setAttribute('aria-expanded',String(info.expanded));
   info.button.setAttribute('aria-label',(info.expanded?'收起':'展开全文')+'：'+info.label);
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
 const sizeObserver=new ResizeObserver(schedule);
 function enhance(){
  for(const [selector,label,lines] of targets)root.querySelectorAll(selector).forEach(paragraph=>{
   if(records.has(paragraph))return;
   if(!paragraph.id)paragraph.id='resource-intro-'+(++serial);
   const button=document.createElement('button');button.type='button';button.className='resource-excerpt-toggle';button.hidden=true;button.setAttribute('aria-controls',paragraph.id);paragraph.after(button);
   paragraph.style.setProperty('--resource-excerpt-lines',String(lines));
   const info={button,label,lines,expanded:false};records.set(paragraph,info);sizeObserver.observe(paragraph);
   button.addEventListener('click',()=>{
    const wasExpanded=info.expanded;info.expanded=!info.expanded;measure();
    if(wasExpanded)requestAnimationFrame(()=>{const header=document.querySelector('.site-header,.club-demo-topbar'),edge=(header?.getBoundingClientRect().bottom||0)+12;const top=button.getBoundingClientRect().top;if(top<edge)scrollBy({top:top-edge,behavior:'instant'});});
   });
  });schedule();
 }
 new MutationObserver(enhance).observe(root,{childList:true,subtree:true});
 mobile.addEventListener('change',schedule);document.fonts?.ready.then(schedule);enhance();
})();
