// One reading-guide preference shared by all resource details in this tab.
const clubGuideContext=new URLSearchParams(location.search).get('nav')==='club';
const readingGuidePreferenceKey=clubGuideContext?'club-demo-reading-guide-collapsed':'longyuan-reading-guide-collapsed';
let readingGuideCollapsed=clubGuideContext;
try{const saved=sessionStorage.getItem(readingGuidePreferenceKey);if(saved!==null)readingGuideCollapsed=saved==='true';}catch{}
window.readingGuideIsCollapsed=()=>readingGuideCollapsed;
window.renderResourceChat = function(kind="期刊"){const arrow='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';return `<aside class="pe-chat" aria-label="阅读对话"><div class="pe-guide-heading"><img class="pe-guide-avatar" src="../assets/reading-guide-avatar-v3.png" width="44" height="44" alt=""><div><h2>阅读向导</h2><p>找好文章，也帮你读得更舒服</p></div><button type="button" class="pe-chat-toggle pe-icon-button" data-pe-chat-toggle aria-label="收起对话" title="收起对话" aria-expanded="true"><i class="iconfont icon-Slider" aria-hidden="true"></i><span class="pe-tooltip">收起对话</span></button></div><div class="pe-chat-messages" aria-live="polite"><div class="pe-guide-welcome"><h3>此刻，想读点什么？</h3><p>说说你的想法，或从这里开始。</p>${[['帮我挑一篇','说说此刻的心情或兴趣，我按你的状态选'],['给自己十分钟','选一篇轻松、可读全文的短文'],['问一个主题','先告诉我想聊什么，答案带原文出处']].map(([title,desc])=>`<button class="pe-guide-prompt" data-pe-prompt="${title}"><span><strong>${title}</strong><small>${desc}</small></span>${arrow}</button>`).join('')}</div></div><div class="pe-chat-form-wrap"><form class="pe-chat-form"><textarea rows="2" aria-label="向本刊提问" placeholder="关于${kind==='期刊'?'这本刊':kind}，你想了解什么？&#10;例如：这期有哪些关于消费的文章？" required></textarea><div class="pe-chat-tools"><label class="pe-chat-attach" tabindex="0" role="button" title="添加内容" aria-label="添加内容"><i class="iconfont icon-Link" aria-hidden="true"></i><input type="file" hidden></label><button type="submit" aria-label="发送提问" title="发送提问">${arrow}</button></div></form></div></aside><button type="button" class="pe-chat-reopen pe-icon-button" data-pe-chat-toggle aria-label="展开阅读向导" title="展开阅读向导" aria-expanded="true"><img src="../assets/reading-guide-avatar-v3.png" width="44" height="44" alt=""><span class="pe-tooltip">展开阅读向导</span></button>`;};
/* Ordinary issues: the same editorial composition is mounted on route and shelf. */
window.renderOrdinaryPeriodical = function(m, issue) {
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const known=m.title==='第一财经'&&/2026.*0?9\s*期/.test(issue.label);
 const d=known?window.periodicalReference:m.title==='南风窗'&&/2026.*0?9\s*期/.test(issue.label)?window.nanfcIssueReference:m.title==='十月少年文学'&&/2026.*0?9\s*期/.test(issue.label)?window.octoberIssueReference:null;
 const single=d?.singlePrice||'18.00',singleOriginal=d?.singleOriginal||'48.00',annual=d?.annualPrice||'188.00',annualOriginal=d?.annualOriginal||'576.00';
 const button=(t,k,primary=false)=>`<button class="rd-button ${primary?'rd-primary':''}" data-rd-action="${k}">${t}</button>`;
 const iconButton=(label,key,icon)=>`<button class="rd-button pe-icon-button" data-rd-action="${key}" data-rd-icon="${icon}" aria-label="${label}" title="${label}"><i class="iconfont icon-${icon}" aria-hidden="true"></i><span class="pe-tooltip" role="tooltip">${label}</span></button>`;
 const external=(t,u,cls='')=>`<a class="${cls}" href="${e(u)}" target="_blank" rel="noopener noreferrer">${t}</a>`;
 const arrow='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';
 const groups=d?d.groups:[];
 const archiveIssues=m.issues.filter(a=>a.label!==issue.label).slice(0,5);
 const archivePlacement=[{depth:-38,lift:3,tilt:-2,offset:-1,lean:-1,rise:10},{depth:-19,lift:1,tilt:1,offset:2,lean:1,rise:13},{depth:2,lift:5,tilt:-1,offset:0,lean:0,rise:9},{depth:21,lift:2,tilt:2,offset:1,lean:1,rise:12},{depth:38,lift:4,tilt:-2,offset:-1,lean:-1,rise:10}];
 const archiveBox=`<span class="pe-archive-scene" aria-hidden="true"><span class="pe-archive-crate"><span class="pe-crate-back"></span>${archiveIssues.map((a,i)=>`<span class="pe-crate-magazine" style="--book-depth:${archivePlacement[i].depth}px;--book-lift:${archivePlacement[i].lift}px;--book-tilt:${archivePlacement[i].tilt}deg;--book-offset:${archivePlacement[i].offset}px;--book-lean:${archivePlacement[i].lean}deg;--book-rise:${archivePlacement[i].rise}px"><img src="${e(a.src)}" alt="" loading="lazy" draggable="false"></span>`).join('')}<span class="pe-crate-side"><span class="pe-crate-handle"></span></span><span class="pe-crate-front"><span>ARCHIVE</span></span></span></span>`;
 const planName='purchase-plan-'+(window.periodicalRenderSerial=(window.periodicalRenderSerial||0)+1);
 const issueCover=d?.cover||(d?.related.find(a=>a.title===m.title&&a.issue===issue.label)?.cover)||issue.src||m.issues.find(a=>a.label===issue.label)?.src||m.src;
 const issueNumber=issue.label.match(/第?\s*(\d+)\s*期/)?.[1]||'—';
 let markup=`<div class="rd-page rd-periodical pe-figma-detail">
 <div class="pe-layout"><aside class="pe-identity"><div class="pe-column-edition"><span>${e(m.title==='第一财经'?'商业财经':m.category)}</span></div><div class="pe-identity-top"><h1>${e(m.title)}</h1><div class="pe-metadata"><span>${e(d?.frequency||(d?'月刊':'期刊'))}</span><details class="pe-issue-picker"><summary>${e(issue.label)}<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></summary><div>${m.issues.map((a,i)=>`<a href="#/magazine/${encodeURIComponent(m.title)}?issue=${i}">${e(a.label)}</a>`).join('')}</div></details><div class="pe-social">${iconButton('收藏','save','mark')}${iconButton('分享','share','Share')}</div></div></div>

 <div class="pe-purchase"><div class="pe-plans" role="radiogroup" aria-label="选择购买方式"><div class="pe-plan-heading"><strong>选择购买方式</strong></div>${[['single','单期购买','仅购买当前1期','￥'+single,'¥'+singleOriginal],['annual','全年订购','全年订阅更优惠','￥'+annual,'¥'+annualOriginal]].map(([value,title,desc,price,original])=>`<label class="pe-plan"><div class="pe-plan-row"><input type="radio" name="${planName}" value="${value}" ${value==='single'?'checked':''}><i class="pe-plan-selector iconfont icon-${value==='single'?'Check':'UnSelect'}" aria-hidden="true"></i><span class="pe-plan-copy"><strong>${title}</strong><small>${desc}</small></span><span class="pe-plan-price"><strong>${d?price:'待配置'}</strong><small>原价：<del>${d?original:'待配置'}</del></small></span></div>${value==='annual'?`<span class="pe-plan-benefits"><span class="pe-benefits-content"><span><i class="iconfont icon-SuccessII" aria-hidden="true"></i><span>该本杂志即日起至未来1年内所有更新电子版杂志的使用权限</span></span><span><i class="iconfont icon-SuccessII" aria-hidden="true"></i><span>赠送该杂志的部分往期的杂志的使用权限，有效期1年</span></span></span></span>`:''}</label>`).join('')}</div></div>

</aside>
 <main class="pe-reading"><div class="pe-column-edition pe-column-edition-right"><span>${e(issue.label)}</span><span>ISSUE ${issueNumber.padStart(2,'0')}</span></div><div class="pe-intro"><div class="pe-intro-copy"><span class="pe-kicker">ABOUT THE JOURNAL</span><p>${e(d?d.intro:'从这一期开始，阅读文字背后的世界。本期目录与出版资料待接入。')}</p></div><span class="pe-intro-rule" aria-hidden="true"></span></div><section id="pe-directory" class="pe-directory"><header class="pe-section-heading"><div class="pe-directory-identity"><img class="pe-directory-cover" src="${e(issueCover)}" width="49" height="66" alt="${e(m.title+' '+issue.label)}封面"><div class="pe-directory-title"><span class="pe-kicker">CONTENTS</span><h2>这一期，读什么</h2></div></div><span>${d?groups.reduce((n,g)=>n+g.articles.length,0)+' 篇 / '+groups.length+' 个栏目':'目录待接入'}</span></header>
 ${d?`<nav class="pe-categories" aria-label="目录栏目">${groups.map((g,i)=>`<button data-rd-jump="pe-group-${i}">${e(g.title)}<sup>${g.articles.length}</sup></button>`).join('')}</nav>${groups.map((g,i)=>`<section class="pe-group" id="pe-group-${i}"><h3><span>0${i+1}</span>${e(g.title)}</h3>${g.articles.map((a,j)=>`<article class="pe-article"><span class="pe-article-number">${String(j+1).padStart(2,'0')}</span><div>${a.cover?external(`<img class="pe-article-cover" loading="lazy" src="${e(a.cover)}" alt="${e(a.title)}配图">`,a.url):''}${external(`<h4>${e(a.title)}</h4>`,a.url)}<p>${e(a.excerpt)}</p>${external('阅读全文 '+arrow,a.url,'pe-read-link')}</div></article>`).join('')}</section>`).join('')}`:'<p class="pe-empty">这本刊物的目录尚未接入。可通过过往期刊查看其他期次。</p>'}
 </section></main>${window.renderResourceChat()}</div>
 <section class="pe-bottom-section" id="pe-related"><header class="pe-section-heading"><div><span class="pe-kicker">KEEP EXPLORING</span><h2>相关杂志</h2></div><span>${d?d.related.length+' 本刊物':'继续发现'}</span></header><div class="pe-cover-grid pe-related-grid">${d?d.related.map(a=>external(`<span class="pe-related-summary ${a.title==='银行家'?'pe-related-summary-flush':''}"><img loading="lazy" src="${e(a.cover)}" alt="${e(a.title)}"><span class="pe-related-info"><strong>${e(a.title)}</strong><span>${e(a.issue)}</span></span></span><small>${e(a.price)}</small>`,clubGuideContext?'#/magazine/'+encodeURIComponent(a.title)+'?claimed=0':a.url)).join(''):flowShelfData.filter(x=>x!==m).slice(0,6).map(a=>`<a href="#/magazine/${encodeURIComponent(a.title)}"><img loading="lazy" src="${e(a.src)}" alt="${e(a.title)}"><strong>${e(a.title)}</strong></a>`).join('')}</div></section>
 <div class="pe-purchase-dock pe-figma-action-dock"><div class="pe-dock-resource-actions"><button class="pe-dock-resource-button" data-rd-action="archive"><i class="iconfont icon-History" aria-hidden="true"></i>过往期刊</button>${d?external('<i class="iconfont icon-Image" aria-hidden="true"></i>原貌版',d.trial,'pe-dock-resource-button'):`<button class="pe-dock-resource-button" data-rd-action="facsimile"><i class="iconfont icon-Image" aria-hidden="true"></i>原貌版</button>`}</div><button class="rd-button rd-primary" data-pe-buy data-plan="single" data-single-price="${d?'￥'+single:'价格待配置'}" data-annual-price="${d?'￥'+annual:'价格待配置'}" data-rd-action="purchase"><span class="pe-buy-label"><span>单期购买：</span><strong>${d?'￥'+single:'价格待配置'}</strong></span></button></div>
 <footer class="pe-source">${d?external('内容与价格来源：龙源期刊网 · '+e(m.title)+' '+e(issue.label),d.source):'资源详情演示'}<span>阅读、登录与支付在原站完成</span></footer></div>`;
 if(clubGuideContext){
  markup=markup.replace(/<div class="pe-purchase">[\s\S]*?(?=<\/aside>)/,'')
   .replace(/<button class="rd-button rd-primary" data-pe-buy[\s\S]*?<\/button>/,'')
   .replace(/<footer class="pe-source">[\s\S]*?<\/footer>/,'')
   .replace(/(<span class="pe-related-info">[\s\S]*?<\/span><\/span>)<small>[\s\S]*?<\/small>/g,'$1');
  const identityActions=`<div class="pe-identity-resource-actions" aria-label="期刊阅读方式">${d?.trial?external('原貌版试读',d.trial,'pe-identity-original'):'<button type="button" class="pe-identity-original" data-rd-action="facsimile">原貌版试读</button>'}<button type="button" class="pe-identity-archive" data-rd-action="archive">过往期刊</button></div>`;
  const guideCard='<div class="pe-identity-guide-slot"><div class="pe-identity-guide-card"><img src="assets/figma-identity/guide.png" width="40" height="40" alt="苏皖"><div><div class="pe-identity-guide-name"><strong>苏皖</strong><span>领读人</span></div><small>本刊编辑</small></div></div></div>';
  markup=markup.replace('<aside class="pe-identity">','<aside class="pe-identity pe-identity-refined">')
   .replace('</aside>',identityActions+guideCard+'</aside>')
   .replace(/<div class="pe-purchase-dock pe-figma-action-dock">[\s\S]*?<\/div><\/div>/,'')
   .replace('<i class="iconfont icon-mark" aria-hidden="true"></i>','<img class="pe-refined-icon" src="assets/figma-identity/mark.svg" width="24" height="24" alt=""><i class="iconfont icon-mark" aria-hidden="true"></i>')
   .replace('<i class="iconfont icon-Share" aria-hidden="true"></i>','<img class="pe-refined-icon" src="assets/figma-identity/share.svg" width="24" height="24" alt=""><i class="iconfont icon-Share" aria-hidden="true"></i>')
   .replace('<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></summary>','<span class="pe-refined-issue-arrow"><img src="assets/figma-identity/issue-arrow.svg" width="5" height="10" alt=""></span></summary>');
 }
 return d&&!d.related.length?markup.replace(/<section class="pe-bottom-section"[\s\S]*?<\/section>/,''):markup;
};

// A local, explicit directory lookup; no generated claims about article bodies.
document.addEventListener('submit',event=>{
 const form=event.target.closest('.pe-chat-form');if(!form)return;event.preventDefault();
 const input=form.querySelector('textarea'),question=input.value.trim();if(!question)return;
 const messages=form.closest('.pe-chat').querySelector('.pe-chat-messages');
 const user=document.createElement('p');user.className='pe-user-message';user.textContent=question;messages.append(user);
 const root=form.closest('.rd-periodical');
 const rows=[...root.querySelectorAll('.pe-article')];
 if(!rows.length){const reply=document.createElement('p');reply.textContent='当前是阅读向导的交互演示，尚未接入大模型。可以继续阅读正文或使用页面中的原站入口。';messages.append(reply);input.value='';messages.scrollTop=messages.scrollHeight;return;}
 const terms=question.match(/[\u4e00-\u9fff]{2,}|[a-z0-9]+/gi)||[];
 const keys=[...new Set(terms.flatMap(t=>t.length>2?[...Array(t.length-1)].map((_,i)=>t.slice(i,i+2)):[t]))];
 const matches=rows.map(row=>({row,score:keys.reduce((n,k)=>n+(row.textContent.includes(k)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3);
 const reply=document.createElement('p');reply.textContent=matches.length?'根据本期目录与摘要，找到这些相关内容。点击可在原站阅读：':'当前目录中没有找到明确匹配。可以试试具体关键词，例如“睡眠”“消费”或“公司”。';messages.append(reply);
 matches.forEach(({row})=>{const original=row.querySelector('h4').closest('a');const a=document.createElement('a');a.href=original.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=original.textContent;messages.append(a)});
 input.value='';messages.scrollTop=messages.scrollHeight;
});

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-pe-chat-toggle]');if(!button)return;
 event.preventDefault();event.stopPropagation();
 const root=button.closest('.rd-periodical');if(!root)return;
 const collapsed=!root.classList.contains('pe-chat-collapsed');
 readingGuideCollapsed=collapsed;
 try{sessionStorage.setItem(readingGuidePreferenceKey,String(collapsed));}catch{}
 root.classList.toggle('pe-chat-collapsed',collapsed);
 document.querySelectorAll('.rd-periodical').forEach(other=>{if(other!==root)applyGuidePreference(other);});
 const chat=root.querySelector('.pe-chat'),reopen=root.querySelector('.pe-chat-reopen');
 chat.inert=collapsed;
 animateGuide(chat,collapsed);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){reopen.getAnimations().forEach(a=>a.cancel());if(collapsed)reopen.animate([{opacity:0,transform:'scale(.88)'},{opacity:1,transform:'scale(1)'}],{duration:220,easing:'ease-out'});}
 root.querySelectorAll('[data-pe-chat-toggle]').forEach(b=>b.setAttribute('aria-expanded',String(!collapsed)));
 (collapsed?reopen:chat.querySelector('.pe-chat-toggle'))?.focus({preventScroll:true});
},true);

document.addEventListener('click',event=>{const b=event.target.closest('[data-pe-prompt]');if(!b)return;const input=b.closest('.pe-chat').querySelector('textarea');input.value=b.dataset.pePrompt==='问一个主题'?'我想了解：':b.dataset.pePrompt==='给自己十分钟'?'请推荐一篇适合十分钟阅读的文章':'我的兴趣是：';input.focus();});

// Attachment remains local to the demo; show the chosen filename without uploading.
document.addEventListener("change",event=>{const input=event.target.closest(".pe-chat-attach input");if(!input)return;const label=input.closest("label");label.title=input.files[0]?.name||"添加内容";label.setAttribute("aria-label",label.title);});

document.addEventListener("keydown",event=>{const label=event.target.closest(".pe-chat-attach");if(label&&["Enter"," "].includes(event.key)){event.preventDefault();label.querySelector("input").click();}});

// Price, action and visual state update together; interrupted transitions restart cleanly.
document.addEventListener('change',event=>{
 if(!event.target.matches('.pe-plans input')||!event.target.checked)return;
 const root=event.target.closest('.rd-periodical');
 event.target.closest('.pe-plans').querySelectorAll('input').forEach(input=>input.parentElement.querySelector('.pe-plan-selector').className='pe-plan-selector iconfont icon-'+(input.checked?'Check':'UnSelect'));
 const button=root.querySelector('[data-pe-buy]');if(!button)return;
 const annual=event.target.value==='annual',title=annual?'全年订购':'单期购买';
 const price=annual?button.dataset.annualPrice:button.dataset.singlePrice;
 button.dataset.rdAction=annual?'subscribe':'purchase';button.dataset.plan=annual?'annual':'single';
 const label=button.querySelector('.pe-buy-label');label.querySelector('span').textContent=title+'：';label.querySelector('strong').textContent=price;
 button.setAttribute('aria-label',title+' '+price);
 const displayed=root.querySelector('[data-pe-current-price]');if(displayed)displayed.textContent=price;
 const original=root.querySelector('[data-pe-original-price]');if(original)original.textContent=price==='价格待配置'?'待配置':annual?'¥576.00':'¥48.00';
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&label.animate){
  label.getAnimations().forEach(animation=>animation.cancel());button.getAnimations().filter(animation=>animation.id==='pe-buy-switch').forEach(animation=>animation.cancel());
  label.animate([{opacity:0,transform:'translateY(12px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(-2px)',filter:'blur(0)',offset:.7},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:380,easing:'cubic-bezier(.2,.8,.2,1)'});
  button.animate([{transform:'scale(.96)'},{transform:'scale(1.025)',offset:.65},{transform:'scale(1)'}],{id:'pe-buy-switch',duration:400,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
});

// Retarget a critically damped spring from its current position and velocity.
const guideMotion=new WeakMap();
function animateGuide(chat,collapsed){
 let state=guideMotion.get(chat);
 if(!state){state={x:chat.hidden?1:0,v:0,target:0,frame:0,last:0};guideMotion.set(chat,state);}
 state.target=collapsed?1:0;chat.hidden=false;chat.style.display='flex';
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){cancelAnimationFrame(state.frame);state.frame=0;state.x=state.target;state.v=0;chat.hidden=collapsed;chat.style.display=collapsed?'none':'';chat.style.opacity='';chat.style.transform='';return;}
 if(state.frame)return;
 state.last=performance.now();chat.style.willChange='transform,opacity';
 function tick(now){const dt=Math.min((now-state.last)/1000,.032);state.last=now;
 const omega=22;state.v+=(-omega*omega*(state.x-state.target)-2*omega*state.v)*dt;state.x+=state.v*dt;
 chat.style.opacity=String(1-state.x);chat.style.transform=`translateX(${state.x*48}px) scale(${1-state.x*.025})`;
 if(Math.abs(state.x-state.target)<.001&&Math.abs(state.v)<.01){state.x=state.target;state.v=0;state.frame=0;chat.style.willChange='';chat.style.transform='';chat.style.opacity='';chat.style.display=state.target?'none':'';chat.hidden=!!state.target;return;}
 state.frame=requestAnimationFrame(tick);
 }state.frame=requestAnimationFrame(tick);
}

function applyGuidePreference(root){
 const chat=root.querySelector('.pe-chat');if(!chat)return;
 const motion=guideMotion.get(chat);if(motion){cancelAnimationFrame(motion.frame);guideMotion.delete(chat);}
 root.classList.toggle('pe-chat-collapsed',readingGuideCollapsed);
 chat.hidden=readingGuideCollapsed;chat.inert=readingGuideCollapsed;
 chat.style.display=readingGuideCollapsed?'none':'';chat.style.transform='';chat.style.opacity='';chat.style.willChange='';
 root.querySelectorAll('[data-pe-chat-toggle]').forEach(button=>button.setAttribute('aria-expanded',String(!readingGuideCollapsed)));
}
const initializedGuides=new WeakSet();
function initializeGuides(){document.querySelectorAll('.rd-periodical .pe-chat').forEach(chat=>{if(initializedGuides.has(chat))return;const root=chat.closest('.rd-periodical');initializedGuides.add(chat);applyGuidePreference(root);});}
// Runs before painting freshly mounted routed, article, and shelf details.
new MutationObserver(initializeGuides).observe(document.body,{childList:true,subtree:true});
initializeGuides();
