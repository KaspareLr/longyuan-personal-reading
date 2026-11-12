/* Original feed only. Figma 586:7380; preserve shared data and existing detail routes. */
(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const titlePhrases={
  '今年双十一，有些订单不需要等快递':['今年双十一，','有些订单','不需要等快递'],
  '我们为什么愿意为一种“可能”买单？':['我们为什么','愿意为一种','“可能”买单？'],
  '买下它，和随时能用它，是两回事':['买下它，','和随时能用它，','是两回事'],
  '订了那么多工具，工作真的变轻了吗？':['订了那么多工具，','工作真的','变轻了吗？'],
  '额度囤下来了，事情开始做了吗？':['额度囤下来了，','事情','开始做了吗？'],
  '订阅会到期，哪些能力能留下来？':['订阅会到期，','哪些能力','能留下来？']
 };
 function semanticTitle(heading){
  if(!heading)return;const text=heading.title||heading.textContent;let phrases=titlePhrases[text];
  if(!phrases){phrases=[];const words=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('zh-CN',{granularity:'word'}).segment(text)].map(x=>x.segment):[...text];for(const word of words){if(phrases.length&&/^[，。！？、；：”’）了的吗呢]+$/.test(word))phrases[phrases.length-1]+=word;else phrases.push(word)}}
  heading.classList.add('feed-semantic-title');heading.replaceChildren(...phrases.map(text=>{const span=document.createElement('span');span.className='feed-title-phrase';span.textContent=text;return span}));
 }
 window.decorateFigmaFeed=function(batch,edition){
  const nodes=[...batch.children].filter(n=>n.matches('.v3-recommendation,.personal-podcast-entry')&&!n.classList.contains('feed-last-extra'));
  const stories=edition.stories,issue=window.readingIssue;
  nodes.forEach((node,i)=>{
   const title=node.querySelector('h2,h3')?.textContent,story=stories.find(s=>s.title===title||s.title===node.getAttribute('aria-label'))||(node.classList.contains('feed-editor-feature')?stories.find(s=>s.resource?.kind==='book'):null);
   if(story)node.dataset.feedContentId=story.id;
   const original=issue?.items.find(s=>story?.id===issue.id+'-'+s.id),angle=original?issue.leadLabels[Number(original.id)-1]:(story?.section||'从阅读中发现'),type=story?.format==='期刊'?'杂志':story?.format||'图书';
   const meta=document.createElement('div');meta.className='feed-story-meta';meta.innerHTML=`<strong>${String(i+1).padStart(2,'0')}</strong><span>${esc(angle)}</span><span class="feed-story-type">${esc(type)}</span>`;
   const card=node.matches('.personal-podcast-entry')?node.querySelector('article'):node;card.prepend(meta);
   if(!node.classList.contains('feed-editor-feature')&&node.matches('.v3-recommendation-book,.v3-recommendation-magazine')){const resource=node.querySelector('.v3-resource'),cover=resource.querySelector('.v3-cover-link'),identity=resource.querySelector('.v3-resource-top>div'),guide=resource.querySelector('blockquote'),reason=resource.querySelector('.v3-reason'),row=document.createElement('div'),copy=document.createElement('div');row.className='editor-resource-top';copy.className='editor-resource-copy';identity.classList.add('editor-resource-identity');copy.append(identity,guide);row.append(cover,copy);resource.replaceChildren(row,reason)}
   if(story?.audio){const intro=document.createElement('p');intro.className='feed-podcast-intro';intro.textContent=story.summary;card.querySelector('.feed-podcast-heading').after(intro);const why=document.createElement('blockquote');why.className='feed-podcast-reason';why.innerHTML='<strong>为什么选它？</strong><p>'+esc(story.recommendationReason)+'</p>';card.querySelector('.v3-audio').before(why)}
   // Display clipping preserves full fields in the existing full-text dialog and details.
   node.querySelectorAll('[data-v3-field]').forEach(f=>{if(f.title)f.textContent=f.title});
   semanticTitle(node.querySelector('[data-v3-field=recommendationTitle],.v3-podcast-copy h3'));
  });
  if(!edition.themeId||edition.themeId!==issue?.id)return;
  const transitions={
   '03-01':{label:'从使用关系，回到购物车',title:'这些没有快递的订单，买到的是什么？',description:'先分清拥有与使用，再回到双十一的新商品。看看会员、额度与一次实际调用，分别意味着什么。'},
   '01-02':issue.transitions[0],
   '02-04':{label:'从购买理由，走向使用经验',title:'开通之后，工作真的变轻了吗？',description:'理解为什么愿意买单之后，听听真实的使用经历。工具怎样进入工作，又在哪些地方需要重新整理？'},
   '04-05':issue.transitions[3],'05-06':issue.transitions[4]
  };
  nodes.forEach((node,i)=>{const next=nodes[i+1];if(!next)return;const a=node.dataset.feedContentId?.split('-').pop(),b=next.dataset.feedContentId?.split('-').pop(),story=stories.find(s=>s.id===next.dataset.feedContentId),t=transitions[a+'-'+b]||{label:'继续阅读',title:story?.title||'',description:story?.summary||''};const bridge=document.createElement('aside');bridge.className='feed-editorial-transition';bridge.setAttribute('aria-label','阅读串联');bridge.innerHTML=`<span>${esc(t.label)}</span><h2>${esc(t.title)}</h2><p>${esc(t.description)}</p>`;node.after(bridge)});
  const ending=document.createElement('footer');ending.className='feed-editorial-ending';ending.innerHTML=`<span>结语</span><h2>${issue.closingPhrases.map(esc).join('<br>')}</h2>${issue.closing.map(p=>'<p>'+esc(p)+'</p>').join('')}`;const end=document.createElement('div');end.className='feed-editorial-end';end.innerHTML='<span>END</span>';batch.append(ending,end);
 };
})();
