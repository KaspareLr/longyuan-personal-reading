/* A single faithful content model; only explicitly imported issue articles opt in. */
(()=>{
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const key=url=>String(url||'').match(/\/(dycy202609[0-9]{2})\.html(?:[?#]|$)/)?.[1];
 const data=new Map((window.clubEditorialArticleData||[]).map(a=>[a.id,a]));let cleanup=null;
 function find(url){return data.get(key(url))||null;}
 function renderPlanned(a,plan){
  const byId=new Map(a.blocks.map(b=>[b.id,b])),starts=new Map(plan.groups.map(g=>[g.sourceIds[0],g]));
  function one(b){
   const treatment=plan.treatments[b.id]||{},role=treatment.role||'',attrs=`id="${escape(b.id)}" data-er-block`;
   if(b.type==='paragraph'){
    let text=escape(b.text);for(const value of treatment.emphasis||[])text=text.split(escape(value)).join(`<strong class="er-inline-emphasis">${escape(value)}</strong>`);
    const tag=role==='quote'||role==='closing-quote'?'blockquote':'p';
    return `<${tag} ${attrs} class="er-text er-${escape(role||'body')}">${text}</${tag}>`;
   }
   if(b.type==='heading')return `<h${b.level===4?3:2} ${attrs} class="er-heading er-heading-${b.level}${role?' er-'+escape(role):''}">${escape(b.text)}</h${b.level===4?3:2}>`;
   if(b.type==='figure'){
    const image=`<img src="${escape(b.src)}" width="${b.width}" height="${b.height}" alt="${escape(b.alt)}" loading="lazy" decoding="async">`;
    const caption=b.caption?`<figcaption>${escape(b.caption)}</figcaption>`:'';
    if(role==='rebuild-table'){
     const table=treatment.table;return `<figure ${attrs} class="er-data-table"><div class="er-table-scroll" role="region" aria-label="票房对照表" tabindex="0"><table><thead><tr>${table.headers.map(h=>`<th scope="col">${escape(h)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${escape(cell)}</th>`:`<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${caption}<details class="er-original-chart"><summary>查看原始图表</summary>${image}</details></figure>`;
    }
    return `<figure ${attrs} class="er-figure er-${escape(role||'image')}">${image}${caption}</figure>`;
   }
   return '';
  }
  const parts=[];let regular=[];
  function flush(){if(regular.length){parts.push('<div class="er-column-group">'+regular.join('')+'</div>');regular=[];}}
  for(let i=0;i<a.blocks.length;i++){
   const b=a.blocks[i],group=starts.get(b.id),t=plan.treatments[b.id];
   if(group){flush();const blocks=group.sourceIds.map(id=>byId.get(id));if(group.role==='exhibit')parts.push('<section class="er-exhibit">'+blocks.map(one).join('')+'</section>');else parts.push(`<section class="er-editorial-pair er-${escape(group.role)}">${one(blocks[0])}<div class="er-pair-copy">${blocks.slice(1).map(one).join('')}</div></section>`);i+=blocks.length-1;continue;}
   if((b.type==='paragraph'&&(!t||t.role==='inline-emphasis'))||b.type==='heading'){regular.push(one(b));continue;}
   flush();parts.push(one(b));
  }
  flush();return parts.join('');
 }
 function render(a){
  const plan=window.clubEditorialPlans?.[a.id];
  const parts=[];let paragraphs=[];
  function flush(){if(paragraphs.length){parts.push('<div class="er-column-group">'+paragraphs.join('')+'</div>');paragraphs=[];}}
  for(const b of a.blocks){
   if(b.type==='paragraph'){paragraphs.push(`<p id="${escape(b.id)}" data-er-block>${escape(b.text)}</p>`);continue;}
   flush();
   if(b.type==='heading')parts.push(`<h${b.level===4?3:2} id="${escape(b.id)}" data-er-block class="er-heading er-heading-${b.level}">${escape(b.text)}</h${b.level===4?3:2}>`);
   if(b.type==='figure')parts.push(`<figure id="${escape(b.id)}" data-er-block><img src="${escape(b.src)}" width="${b.width}" height="${b.height}" alt="${escape(b.alt)}" loading="lazy" decoding="async">${b.caption?`<figcaption>${escape(b.caption)}</figcaption>`:''}</figure>`);
  }
  flush();
  return `<div class="er-article-region"><div class="portal-prose er-prose${plan?' er-magazine':''}">${plan?renderPlanned(a,plan):parts.join('')}<div class="er-end" aria-hidden="true"><span>END</span></div></div></div>`;
 }
 function mount(){
  cleanup?.();cleanup=null;const reader=document.querySelector('.portal-reader.is-editorial');if(!reader)return;
  const region=reader.querySelector('.er-article-region'),prose=reader.querySelector('.er-prose'),mobile=matchMedia('(max-width:760px)');let preferred='single',frame=0;
  try{preferred=localStorage.getItem('club-demo:editorial-layout')==='double'?'double':'single';}catch{}
  function capture(){const edge=(document.querySelector('.site-header')?.getBoundingClientRect().bottom||0)+16;const block=[...prose.querySelectorAll('[data-er-block]')].find(b=>b.getBoundingClientRect().bottom>edge);return block?{block,y:block.getBoundingClientRect().top}:null;}
  function apply(anchor){const font=parseFloat(getComputedStyle(prose).fontSize),fits=!mobile.matches&&Math.min(region.getBoundingClientRect().width,1040)>=font*44+40;reader.dataset.editorialLayout=preferred==='double'&&fits?'double':'single';
   const toggle=reader.querySelector('[data-er-toggle]');if(toggle){const active=reader.dataset.editorialLayout==='double';toggle.setAttribute('aria-pressed',String(active));toggle.disabled=!fits;toggle.title=!fits?'当前可用宽度不足，请使用单栏':active?'切换为单栏':'切换为双栏';toggle.setAttribute('aria-label',toggle.title);}
   if(anchor?.block.isConnected)requestAnimationFrame(()=>{const delta=anchor.block.getBoundingClientRect().top-anchor.y;if(Math.abs(delta)>1)scrollBy({top:delta,behavior:'instant'});});
  }
  function click(event){const b=event.target.closest('[data-er-toggle]');if(b&&!b.disabled){const anchor=capture();preferred=reader.dataset.editorialLayout==='double'?'single':'double';try{localStorage.setItem('club-demo:editorial-layout',preferred);}catch{}apply(anchor);}
   if(event.target.closest('[data-reader-font-cycle],[data-reader-adjust],[data-reader-size]')){const anchor=capture();requestAnimationFrame(()=>apply(anchor));}}
  reader.addEventListener('click',click);const observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>apply());});observer.observe(region);observer.observe(prose);apply();
  document.fonts?.ready.then(()=>{if(reader.isConnected)apply();});
  cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();reader.removeEventListener('click',click);};
 }
 window.clubEditorialReflow={find,render,mount,readingMinutes:a=>Math.max(1,Math.ceil(a.blocks.reduce((n,b)=>n+(b.text||b.caption||'').length,0)/400))};
})();
