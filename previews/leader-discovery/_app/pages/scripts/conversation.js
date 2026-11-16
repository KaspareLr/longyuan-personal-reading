/* Local, explicitly labeled conversation fixtures; no generated answer is presented as a live search. */
(() => {
 const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const icon=n=>`<i class="iconfont icon-${n}" aria-hidden="true"></i>`;
 const fixtures={
 reading:{title:'AI 与深度阅读',lead:'AI 可以缩短寻找线索的时间，但理解一篇文章，仍需要沿着作者的论证读下去。',points:['先找到值得读的内容：用问题缩小范围，比较不同文章的关注点。','再回到文章判断：摘要便于建立全貌，原文中的案例、条件和细节则帮助我们形成判断。'],titles:['数字时代，阅读方式正在如何改变？','从内容接受到互动阅读','AI 辅助学习中的原文回溯'],bodies:['当获取信息变得容易，阅读的挑战开始转向选择。我们需要分清哪些内容只是引起注意，哪些内容值得留出时间认真理解。','主动阅读意味着带着问题进入文章。阅读者不仅接受结论，也会比较证据、提出疑问，并将新的知识与已有经验联系起来。','摘要能够提供方向，但不能替代完整论证。回到原文，可以看到观点成立的条件、作者使用的案例，以及结论的适用范围。']},
 city:{title:'城市与日常生活',lead:'观察城市更新，可以先从普通人每天经过的街道、使用的公共空间和维系的社区关系入手。',points:['从空间看变化：步行体验、公共设施与可停留的场所，决定更新是否进入日常。','从人的感受看变化：居民、商户与访客的诉求可能不同，需要放在一起比较。'],titles:['城市更新中的公共空间与日常生活','一个街区的新生','谁在使用新的公共空间'],bodies:['一座城市的变化往往体现在细节里。街角可以停留的座椅、连接住区与公共交通的步道，都可能改变人们使用空间的方式。','街区的更新既涉及建筑，也涉及既有的生活网络。保留熟悉的服务和交往场所，是理解社区体验的一条线索。','同一处公共空间，对不同使用者可能意味着不同的便利与限制。观察谁能够进入、谁愿意停留，是讨论更新效果的起点。']},
 family:{title:'家庭阅读与成长',lead:'培养阅读习惯，可以从稳定的陪伴、孩子的自主选择和读后的自然交流开始。',points:['让选择发生：从孩子真正好奇的主题出发，逐渐拓展到不同题材。','把阅读放进日常：固定而轻松的共读时间，比急于检查记住多少更容易持续。'],titles:['让好奇心成为阅读的起点','家庭共读中的陪伴与交流','从一本书开始的自主探索'],bodies:['孩子对一个问题的好奇，可以成为进入书本的入口。允许他们选择题材、提出问题，有助于把阅读与自己的经验连接起来。','共读不必每次都有明确的学习任务。分享喜欢的片段、讨论人物的选择，都能让阅读成为家庭交流的一部分。','自主阅读需要逐渐积累。内容的难度、兴趣与可获得性应放在一起考虑，也需要给重复阅读和暂时放下留出空间。']}
 };
 const covers=['duzh202220-z.jpg','nafc202605-z.jpg','xwzk202606-z.jpg'];
 let topic='reading',lastQuestion='',turn=0,opener=null,currentArticle=0;
 const messages=$('#conversation-messages'),input=$('#search-page-input'),reader=$('#conversation-reader');
 function closeReader(focus=true){reader.hidden=true;if(focus&&opener?.isConnected)opener.focus()}
 function welcome(){messages.innerHTML=`<div class="welcome-chat">${icon('AI')}<h1>一个问题，开启一段阅读。</h1><p>告诉我你想了解什么。我们可以一起梳理观点，找到文章，再回到原文里继续探索。</p><button data-chat-prompt="AI如何改变我们的阅读方式？">AI 如何改变我们的阅读方式？</button><button data-chat-prompt="城市更新如何改变日常生活？">城市更新，怎样影响普通人的生活？</button><button data-chat-prompt="如何培养孩子的阅读习惯？">如何让孩子爱上阅读？</button></div>`}
 function refs(){return fixtures[topic].titles.map((t,i)=>`<button class="chat-source" data-chat-article="${i}" data-chat-topic="${topic}"><img src="assets/longyuan-home/${covers[i]}" alt="示意刊物封面"><span><b>${i+1}. ${esc(t)}</b><small>示例刊文 · 点击阅读</small></span></button>`).join('')}
 function send(q,mode='question'){
  q=q.trim();if(!q)return;
  if(!turn)messages.innerHTML='';
  const known=/AI|人工智能|阅读|城市|街|空间|孩子|家庭|教育|学习|总结|比较|观点|原文|解释/.test(q);
  if(mode==='question'){
   if(/城市|街|空间/.test(q))topic='city';else if(/孩子|家庭|教育|学习/.test(q))topic='family';else if(/AI|人工智能|深度阅读/.test(q))topic='reading';
  }
  const f=fixtures[topic],deep=$('#search-page-form [data-deep-search]').getAttribute('aria-checked')==='true';
  let body;
  if(mode==='summary')body=`<h3>这篇文章，主要在说什么？</h3><p>${esc(f.bodies[currentArticle])}</p><p>这是对当前示例片段的归纳。完整阅读时，还需要结合文章的论据与上下文。</p>`;
  else if(mode==='compare'||/不同观点|比较/.test(q))body=`<h3>把几个视角放在一起看</h3><p>第一篇关注问题的整体背景，第二篇从具体体验展开，第三篇提醒我们关注结论的条件。它们的观察角度不同，不意味着结论互相冲突。</p><p>围绕「${esc(f.title)}」，可以继续比较：各自讨论的对象是谁？使用了什么证据？哪些问题仍未被回答？</p>`;
  else if(!known)body=`<p>你想了解的是「${esc(q)}」。这个本地 Demo 暂时没有对应的回答资料，因此不会为它编造刊文出处。</p><p>可以先说明你更关心的对象、时间范围或观点，也可以体验下面三个预设话题的对话与文章阅读。</p>`;
  else body=`<p>${turn?'沿着这个问题，我们可以继续这样理解：':'我们可以从两个角度来看。'}${esc(f.lead)}</p><p>${esc(f.points[0])}${deep?`<button class="citation" aria-label="阅读引用 1" data-chat-article="0" data-chat-topic="${topic}">1</button>`:''}</p><p>${esc(f.points[1])}${deep?`<button class="citation" aria-label="阅读引用 2" data-chat-article="1" data-chat-topic="${topic}">2</button>`:''}</p>`;
  const node=document.createElement('section');node.className='chat-turn';node.innerHTML=`<div class="user-message">${esc(q)}</div><div class="assistant-message"><div class="assistant-label">${icon('AI')} 龙源 AI <span>· ${deep?'期刊深度搜索':'通用对话'} · 预设演示</span></div>${body}${deep&&known?`<div class="chat-sources">${refs()}</div>`:''}<div class="chat-followups">${known?'<button data-chat-prompt="有没有不同观点？">比较不同观点</button><button data-chat-prompt="怎样回到原文继续阅读？">回到原文继续读</button>':'<button data-chat-prompt="AI如何改变我们的阅读方式？">试试阅读与 AI</button>'}<a href="#/topic-generate?q=${encodeURIComponent(q)}">整理为专题 ${icon('Arrow_Forward-2')}</a></div></div>`;
  messages.append(node);turn++;lastQuestion=q;input.value='';node.scrollIntoView({block:'start',behavior:'instant'});
 }
 function open(q){closeReader(false);if(q){if(q!==lastQuestion)send(q)}else{turn=0;lastQuestion='';topic='reading';welcome()}input.value=''}
 window.longyuanConversation={open};
 $('#search-page-form').addEventListener('submit',e=>{e.preventDefault();send(input.value)});
 document.addEventListener('click',e=>{
  const prompt=e.target.closest('[data-chat-prompt]');if(prompt){send(prompt.dataset.chatPrompt);input.focus()}
  const source=e.target.closest('[data-chat-article]');if(source){opener=source;currentArticle=Number(source.dataset.chatArticle);const key=source.dataset.chatTopic;topic=key;const f=fixtures[key];reader.innerHTML=`<div class="drawer-top"><span>关联刊文 / 阅读面板</span><button aria-label="关闭阅读面板" data-reader-close>${icon('Close')}</button></div><div class="drawer-cover"><img src="assets/longyuan-home/${covers[currentArticle]}" alt="示意刊物封面"><div><b>期刊文章</b><small>交互示例 · 非真实期刊原文</small></div></div><h2>${esc(f.titles[currentArticle])}</h2><div class="drawer-prose"><p>${esc(f.bodies[currentArticle])}</p><p>读到这里，可以回到刚才的问题，想一想：这段内容补充了什么？还有哪些背景需要了解？</p></div><div class="lock-note">此处是用于体验阅读交互的示例片段，封面仅作视觉示意。正式文章需接入龙源授权资源。</div><div class="drawer-actions"><button class="btn" data-reader-ask="summary">总结本文</button><button class="btn btn-outline" data-reader-ask="compare">与其他文章比较</button></div>`;reader.hidden=false;reader.focus();reader.scrollTop=0}
  if(e.target.closest('[data-reader-close]'))closeReader();
  const ask=e.target.closest('[data-reader-ask]');if(ask){send(ask.dataset.readerAsk==='summary'?'帮我总结正在读的这篇文章':'把这篇文章与其他关联文章比较一下',ask.dataset.readerAsk);closeReader(false);input.focus()}
  if(e.target.closest('#new-conversation')){e.preventDefault();if(location.hash==='#/search')open();else location.hash='#/search'}
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!reader.hidden){closeReader();e.preventDefault()}});
 // The primary router calls open on hash changes; initialize after all scripts have loaded.
 if(location.hash.startsWith('#/search'))open(new URLSearchParams(location.hash.split('?')[1]||'').get('q'));else welcome();
})();
