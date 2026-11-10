/* Isolated, local-only onboarding scenario. No remote resources are generated or saved. */
(() => {
  const home = document.querySelector('body > main#home');
  if (!home) return;
  const params = new URLSearchParams(location.search);
  const session = window.clubSession;
  const entry = new URL('index.html?setup=1', location.href).href;
  const setup = params.get('setup') === '1';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const steps = [
    { id: 'featured', label: '本期领读', english: 'READ TOGETHER', question: '从一场共读开始？', description: '选择一种领读资源，我会在首页为它留出主角的位置。', choices: [['期刊领读','magazine'],['图书领读','book'],['文章领读','article'],['暂不设置',false]] },
    { id: 'books', label: '精选图书', english: 'SELECTED BOOKS', question: '要关联图书资源吗？', description: '挑选想与大家分享的图书，搭建一个属于你的精选书架。' },
    { id: 'magazines', label: '精选杂志', english: 'SELECTED MAGAZINES', question: '也想和大家一起读杂志吗？', description: '关联期刊后，读者可以在首页发现你精选的杂志。' },
    { id: 'podcasts', label: '播客', english: 'PODCASTS', question: '让读书会也有声音？', description: '创建你的播客栏目，用声音分享阅读中的发现。' },
    { id: 'daily', label: '每日一读', english: 'DAILY READING', question: '每天，留一点时间给阅读？', description: '开启每日一读，为读者准备一篇适合短暂休息时阅读的内容。' },
    { id: 'articles', label: '精选文章', english: 'SELECTED ARTICLES', question: '把值得读的文章留下来？', description: '用精选文章，呈现你的阅读趣味与关注的话题。' },
    { id: 'activities', label: '精选活动', english: 'SELECTED EVENTS', question: '还想组织一些阅读活动吗？', description: '创建一场共读活动，让书页里的相遇走进生活。' }
  ];
  if (!setup) {
    document.addEventListener('DOMContentLoaded', () => {
      const host = document.querySelector('.club-footer-service');
      if (host) { const a = document.createElement('a'); a.href = entry; a.textContent = '配置我的读书会'; host.append(a); }
    });
    document.documentElement.classList.remove('club-setup-loading');
    return;
  }
  document.title='龙源读书会';
  document.body.classList.add('club-setup-page');
  let config = { ...session?.read('club-configuration-draft', {}) };
  let current = 0, editing = false, busy = false, started = false;
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const template=window.clubHomepageTemplate;
  home.innerHTML=template.render(config);
  template.initialize();
  document.documentElement.classList.remove('club-setup-loading');
  // Keep demo resources from inheriting real-resource routing or book-opening behavior.
  document.querySelector('.demo-reading-widget')?.setAttribute('inert','');
  const haze=document.createElement('div');haze.className='setup-haze';haze.setAttribute('aria-hidden','true');document.body.append(haze);
  const dock=document.createElement('aside');dock.className='setup-dock';dock.setAttribute('aria-label','创建读书会引导');
  dock.innerHTML='<div class="setup-dock-copy"><h2>恭喜您！<br>龙源读书会创建成功！</h2><p>当前内容为演示效果，您可以在读书会配置助手的协助下完成您的读书会内容创建，当然您也可以选择去后台完成内容的创建和配置</p></div><div class="setup-dock-actions"><button class="button" data-setup-backend>前往后台完成配置</button><button class="button dark" data-setup-start>开始吧！配置我的读书会</button></div>';
  document.body.append(dock);
  const assistant=document.createElement('aside');assistant.className='setup-assistant';assistant.id='club-setup-assistant';assistant.hidden=true;assistant.setAttribute('aria-label','读书会配置助手');
  assistant.innerHTML='<header class="setup-chat-header"><img src="assets/setup-assistant/avatar.png" alt=""><div><h2>读书会配置助手</h2><p>一起，把想法变成读书会</p></div><button type="button" data-setup-minimize aria-label="收起配置助手">−</button></header><div class="setup-chat-messages" role="log" aria-label="配置对话" aria-live="polite"></div><div class="setup-chat-form-wrap"><form class="setup-chat-form"><textarea rows="2" aria-label="告诉配置助手你的选择" placeholder="想怎样搭建你的读书会？&#10;例如：帮我关联图书和杂志"></textarea><div class="setup-chat-tools"><button type="submit" aria-label="发送配置选择"><span class="setup-design-icon"><img src="assets/setup-assistant/send-arrow.svg" alt=""></span></button></div></form></div>';
  document.body.append(assistant);
  const reopen=document.createElement('button');reopen.className='setup-reopen';reopen.hidden=false;reopen.setAttribute('aria-label','展开配置助手');reopen.setAttribute('aria-expanded','false');reopen.setAttribute('aria-controls','club-setup-assistant');reopen.innerHTML='<img src="assets/setup-assistant/avatar.png" alt="">';document.body.append(reopen);
  const messages=assistant.querySelector('.setup-chat-messages'), input=assistant.querySelector('textarea');
  const animate=(el,frames,options={})=>reduced.matches?Promise.resolve():el.animate(frames,{duration:500,easing:'cubic-bezier(.16,1,.3,1)',...options}).finished.catch(()=>{});
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,reduced.matches?Math.min(ms,80):ms));
  function message(html,user=false){const el=document.createElement('div');el.className=user?'setup-answer':'setup-message';el.innerHTML=user?`<span>${escape(html)}</span>`:html;messages.append(el);messages.scrollTop=el.scrollHeight>messages.clientHeight?el.getBoundingClientRect().top-messages.getBoundingClientRect().top+messages.scrollTop-20:messages.scrollHeight;animate(el,[{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:400});return el}
  function progress(){dock.className='setup-dock setup-working';dock.innerHTML=`<div><strong>正在搭建你的读书会</strong><p>${Object.keys(config).length} / ${steps.length} 项已确认</p></div><div class="setup-step-track"><i style="width:${Object.keys(config).length/steps.length*100}%"></i></div><button data-setup-show>继续配置</button>`}
  const arrow='<span class="setup-design-icon"><img src="assets/setup-assistant/option-arrow.svg" alt=""></span>';
  function option(label,description,attribute){return `<button type="button" ${attribute}><span class="setup-option-copy"><strong>${label}</strong><small>${description}</small></span>${arrow}</button>`}
  function ask(index){
    current=index;const s=steps[index],choices=s.choices||[['帮我配置',true],['暂不需要',false]];
    const details={magazine:'选择一期杂志，开启本期共读',book:'围绕一本好书，和大家一起读',article:'从一篇文章开始，分享阅读发现',books:'关联图书资源，搭建你的精选书架',magazines:'精选喜欢的期刊，让好内容被发现',podcasts:'创建播客，用声音分享阅读发现',daily:'每天精选一篇，让阅读成为日常',articles:'留下值得读的文章，呈现阅读趣味',activities:'组织一场活动，让阅读连接彼此'};
    message(`<span class="setup-label">${String(index+1).padStart(2,'0')} / 07 · ${s.label}</span><h3>${s.question}</h3><p>${s.description}</p><div class="setup-choices">${choices.map(([label,value])=>option(label,value===false?'先不展示这个栏目，之后随时添加':details[value]||details[s.id],`data-choice="${String(value)}"`)).join('')}</div>`);
    input.placeholder=s.id==='featured'?'想从哪种领读内容开始？\n例如：我想领读一本书':'告诉我你的选择\n例如：帮我配置，或暂不需要';
  }
  function summary(){current=steps.length;editing=false;message('<span class="setup-label">READY TO CREATE</span><h3>你的读书会，轮廓已清晰。</h3><p>确认一下这些选择。点击任意一项可以修改。</p><div class="setup-summary">'+steps.map((s,i)=>`<button type="button" data-setup-edit="${i}"><span>${s.label}</span><small>${config[s.id]?'保留':'不展示'} · 修改</small></button>`).join('')+'</div><div class="setup-choices">'+option('确认，生成我的首页','根据以上选择，完成你的读书会首页','data-setup-generate')+'</div>');input.placeholder='准备好了，就告诉我\n例如：确认生成我的首页';}
  async function apply(value,label){if(busy||current>=steps.length)return;busy=true;const s=steps[current];messages.querySelectorAll('[data-choice]:not(:disabled)').forEach(b=>{b.classList.toggle('is-selected',b.dataset.choice===String(value));b.disabled=true});message(label,true);config[s.id]=value;session?.write('club-configuration-draft',config);progress();const section=document.getElementById(s.id);section.hidden=false;const collapseTarget=section.closest('.feature-scroll-stage')||section;collapseTarget.hidden=false;section.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});input.disabled=true;
    await delay(700);
    if(!value){message(`好的，首页将不展示「${s.label}」。之后也可以重新添加。`);const h=collapseTarget.getBoundingClientRect().height;await animate(collapseTarget,[{opacity:1,scale:'1'},{opacity:0,scale:'.98'}],{duration:380});await animate(collapseTarget,[{height:h+'px',marginBottom:'0px',opacity:0},{height:'0px',marginBottom:-(parseFloat(getComputedStyle(home).rowGap)||80)+'px',opacity:0}],{duration:450});section.hidden=true;collapseTarget.hidden=true;section.classList.remove('is-confirmed');}
    else{if(s.id==='featured'){template.feature(section,config);window.clubFeatureCoverScroll?.refresh();}section.classList.add('is-confirmed');let status=section.querySelector('.setup-status');if(!status){status=document.createElement('span');status.className='setup-status';(section.querySelector('header')||section.querySelector('.feature-copy>div')).append(status)}status.textContent='已配置';await animate(section,[{opacity:.45,translate:'0 12px'},{opacity:1,translate:'0 0'}]);message(`已为你保留「${s.label}」，首页已同步更新。`)}
    await delay(250);busy=false;input.disabled=false;if(editing){summary()}else if(current+1<steps.length){ask(current+1)}else summary();
  }
  async function generate(){if(busy)return;busy=true;assistant.hidden=true;reopen.hidden=true;dock.hidden=true;document.body.classList.remove('setup-configuring');const overlay=document.createElement('div');overlay.className='setup-generate';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','正在生成读书会首页');overlay.innerHTML='<div class="setup-generation-card"><div class="setup-generation-orb" aria-hidden="true"></div><h2>配置完成，正在生成。</h2><p>让你的阅读趣味，在这里慢慢成形。</p><div class="setup-generation-number"><span>0</span><small>%</small></div><div class="setup-generation-bar" role="progressbar" aria-label="首页生成进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i style="width:0%"></i></div><p class="setup-generation-stage" role="status">整理你的模块选择…</p></div>';document.body.append(overlay);home.inert=true;document.querySelector('.site-header').inert=true;document.querySelector('.club-site-footer')?.setAttribute('inert','');overlay.querySelector('.setup-generation-card').tabIndex=-1;overlay.querySelector('.setup-generation-card').focus({preventScroll:true});const count=overlay.querySelector('.setup-generation-number span'),bar=overlay.querySelector('[role=progressbar]'),stage=overlay.querySelector('.setup-generation-stage');const duration=reduced.matches?1400:5400,start=performance.now();await new Promise(resolve=>{function tick(now){const p=Math.min(100,Math.floor((now-start)/duration*100));count.textContent=p;bar.setAttribute('aria-valuenow',p);bar.firstElementChild.style.width=p+'%';stage.textContent=p<25?'整理你的模块选择…':p<58?'关联资源与内容…':p<85?'编排专属首页…':p<100?'完成最后的细节…':'你的读书会，准备好了。';if(p<100)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});session?.write('club-configuration',{modules:config,completedAt:Date.now()});session?.write('club-configuration-draft',{});await delay(700);window.clubPageMotion.navigate(new URL('index.html',location.href))}
  function show(){assistant.hidden=false;reopen.hidden=true;reopen.setAttribute('aria-expanded','true');animate(assistant,[{opacity:0,translate:'28px 0',scale:'.97'},{opacity:1,translate:'0 0',scale:'1'}]);}
  function start(){if(started){show();return}started=true;document.body.classList.add('setup-configuring');show();progress();message('<h3>你好，领读人。</h3><p>接下来，我会陪你搭建首页。每确认一步，左侧页面都会同步变化。不需要的模块可以先收起来。</p>');steps.forEach(s=>{if(config[s.id]===false){const section=document.getElementById(s.id);section.hidden=true;(section.closest('.feature-scroll-stage')||section).hidden=true}});const next=steps.findIndex(s=>!(s.id in config));if(next<0)summary();else ask(next)}
  document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.hasAttribute('data-setup-start'))start();if(b.hasAttribute('data-setup-backend')){dock.querySelector('p').textContent='可以先与助手一起配置，逐步完善你的首页。'}if(b.hasAttribute('data-setup-show'))show();if(b.hasAttribute('data-setup-minimize')){assistant.hidden=true;reopen.hidden=false;reopen.setAttribute('aria-expanded','false');reopen.focus({preventScroll:true})}if(b===reopen)start();if(b.hasAttribute('data-choice')){const raw=b.dataset.choice;apply(raw==='true'?true:raw==='false'?false:raw,b.textContent)}if(b.hasAttribute('data-setup-edit')&&!busy){messages.querySelectorAll('[data-setup-generate],[data-setup-edit]').forEach(x=>x.disabled=true);editing=true;ask(Number(b.dataset.setupEdit));show()}if(b.hasAttribute('data-setup-generate'))generate()});
  assistant.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const text=input.value.trim();if(!text||busy)return;input.value='';if(current>=steps.length){if(/确认|生成|完成|可以|好的/.test(text))generate();else message('<p>可以点击上方的模块修改选择，或回复「确认生成」。</p>');return}if(/不|跳过|取消|不要|隐藏|去掉/.test(text)){apply(false,text);return}if(current===0){const value=/期刊|杂志/.test(text)?'magazine':/图书|书/.test(text)?'book':/文章/.test(text)?'article':null;if(value)apply(value,text);else message('<p>想从期刊、图书还是文章开始？也可以选择暂不设置。</p>')}else if(/好|要|配置|保留|创建|关联|开|是|可以|需要/.test(text))apply(true,text);else message('<p>你可以回复「帮我配置」或「暂不需要」，也可以直接点击上方选项。</p>')});
})();
