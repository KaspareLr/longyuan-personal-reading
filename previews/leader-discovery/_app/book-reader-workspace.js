/* Reading modes, independent private notes, and complete audio / map modules. */
(()=>{
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const modes=[['text','原文本'],['enhanced','增强文本'],['anki','Anki 卡片'],['audio','音频课'],['quiz','自测'],['map','知识地图']];
 const dockModes=modes.filter(([key])=>!['audio','anki'].includes(key));
 let dispose=()=>{};
 window.clubBookReader={unmount(){dispose();dispose=()=>{};},mount(a){
  this.unmount();if(a.context!=='book')return;
  const content=document.querySelector('.portal-reader-content'),reader=content?.closest('.portal-reader');if(!content)return;
  const b=a.book,science=b.id==='ebooks-8',chapter=clubBookContents.flatten(b)[a.index],chapterGroup=clubBookContents.groups(b)[chapter.groupIndex],chapterTitle=chapterGroup.original;
  const articleHead=content.querySelector('.portal-article-head');let originalHead='',scan=null,scanToken=0,rippleTransition=null;
  const noteCount=()=>clubSession.read('book-learning-notes',[]).filter(n=>n.bookId===b.id).length;
  const ac=new AbortController(),on=(el,event,fn)=>el.addEventListener(event,fn,{signal:ac.signal});
  let revealAnimation=null;
  let mode='text',cardIndex=0,flipped=false,quizIndex=0,answers=[],cardRatings={},cardOrder=[0,1,2],quizStarted=false,audioCourse=null,knowledgeMap=null;
  const views=new Map(),positions=new Map();
  const text=document.createElement('div');text.className='book-reader-text';
  [...content.children].filter(el=>!el.matches('.portal-reader-tools,.portal-article-head')).forEach(el=>text.append(el));
  text.querySelector('.portal-source-note')?.remove();
  const panel=document.createElement('section');panel.id='book-reader-panel';panel.className='book-reader-panel';panel.setAttribute('role','tabpanel');panel.tabIndex=0;panel.append(text);content.append(panel);views.set('text',text);
  reader.classList.add('has-book-reader');
  if(science){
   content.querySelector('.portal-article-meta').innerHTML=`<span>${escape(b.publisher)}</span><span>${escape(b.title)} · ${escape(chapter.number)}</span>`;
   text.querySelector('.portal-prose').innerHTML=`<p class="lead">本节围绕「${escape(a.title)}」，可以先找出一个关键问题，再回到历史背景中理解它。</p><h2>带着问题进入这一节</h2><p>科学史中的一个概念，往往回应着当时具体的疑问。阅读时，把“提出了什么解释”和“为什么需要这种解释”分别记下来。</p><h2>比较方法，也比较证据</h2><p>试着区分观察、推理和制度环境各自发挥的作用。遇到不同观点时，先找出它们共同讨论的问题，再比较支持各自结论的依据。</p><blockquote>把概念放回它所回应的问题，再用自己的语言解释一次。</blockquote><h2>留下自己的理解</h2><p>读完后，用一句话概括本节的核心问题，补充一个支持它的例子。下方的学习工具可以帮助你整理、回忆和检验这份理解。</p>`;
  }
  articleHead.querySelector('.club-overline').textContent=chapter.number;
  originalHead=articleHead.innerHTML;
  const dock=document.createElement('nav');dock.className='book-reader-dock';dock.setAttribute('aria-label','图书阅读功能');
  dock.innerHTML=`<div class="book-reader-tabs" role="tablist" aria-label="学习方式">${dockModes.map(([key,label])=>`<button type="button" role="tab" id="book-mode-${key}" aria-controls="book-reader-panel" aria-selected="${key==='text'}" tabindex="${key==='text'?0:-1}" data-reader-mode="${key}" aria-label="${label}" title="${label}"><img src="assets/${key==='text'?'book-reader':'book-capabilities'}/${key}.png" width="40" height="40" alt=""><span>${({text:"原文",enhanced:"增强",quiz:"自测",map:"地图"})[key]||label}</span></button>`).join('')}</div><div class="book-reader-dock-actions"><button type="button" class="book-reader-notes-toggle" aria-label="我的笔记" title="我的笔记" data-open-reader-notes aria-haspopup="dialog" aria-expanded="false"><i class="iconfont club-local-icon icon-EditPen" aria-hidden="true"></i><span class="book-reader-note-label">笔记</span> <span data-reader-note-count>${noteCount()}</span></button><a class="book-reader-map-toggle" aria-label="知识图谱" title="知识图谱" href="https://ebooks.com.cn/reader/8/map?chapterId=806"><img src="assets/book-capabilities/map.png" width="28" height="28" alt=""><span>知识图谱</span></a></div>`;
  document.body.append(dock);document.body.classList.add('book-reader-open');
  const notes=clubReaderNotes.create({book:b,article:a,signal:ac.signal,onCount:count=>{dock.querySelector('[data-reader-note-count]').textContent=count;}});
  const header=(en,title,sub='')=>`<header class="book-learning-heading"><span class="club-overline">${en}</span><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</header>`;
  const focusPoints=science?[
   ['问题','这一节试图回应什么问题？','先记录问题本身，再区分作者介绍的不同解释。'],
   ['方法','解释依靠什么方法？','比较观察、逻辑推理和数学表达各自的作用。'],
   ['语境','知识为何在这里发展？','将思想、交流方式和社会环境联系起来理解。']
  ]:[['细节','哪个细节值得停下来？','找出本节中一个具体的动作、说法或描写。'],['选择','怎样理解人物或作者的选择？','把判断与本节中的具体依据放在一起。'],['联系','这一节与全书有什么联系？','比较前后章节，用自己的语言说明变化。']];
  const chapterCards=science?[
   [['自然哲学','泰勒斯的自然解释有什么特点？','他尝试用自然界本身的因素解释世界，把水视作万物的本原。'],['数学传统','毕达哥拉斯学派关注什么？','关注数、比例与秩序，用数量关系理解现象。'],['知识组织','柏拉图学园与亚里士多德的研究带来什么启发？','教学、讨论、观察与分类，让知识能够被组织、质疑和传承。']],
   [['知识交流','西学东渐涉及哪些知识交流？','天文学、数学、地理与测绘等知识经翻译、合作和教学进入中国。'],['历史背景','为什么不能用单一原因解释近代科技差距？','需要同时考察教育、制度、生产活动和跨文化交流等条件。'],['阅读方法','比较中西知识体系时，应先说明什么？','先说明比较的时期、领域和评价依据，避免把不同传统简单排成一条直线。']],
   [['知识传播','中世纪后期欧洲知识复兴有哪些传播途径？','翻译活动、跨地区交流和大学教学使古典及阿拉伯学术成果得到传播和研究。'],['大学','大学如何支持知识延续？','课程、讲授与辩论提供相对持续的学习共同体，帮助知识被讨论和传承。'],['方法','经院哲学与实验探索可以怎样比较？','分别考察逻辑论证、文本解释和经验观察承担的作用，再分析彼此的联系。']]
  ][chapter.groupIndex]:null;
  const cards=(chapterCards||focusPoints.map(([tag,q,answer])=>[tag,`围绕「${chapterTitle}」：${q}`,answer])).map(([tag,q,answer])=>({tag,q,answer}));
  const questions=[
   {q:science?'阅读科学史时，怎样理解一种学说？':'怎样形成对本节有依据的理解？',options:['先记住一个结论','结合问题、方法与背景一起分析','只按自己的印象判断'],correct:1,why:science?'知识与它所回应的问题、采用的方法及所处的时代相联系。':'把判断放回本节的具体文字中，理解才有可以核对的依据。'},
   {q:'遇到两个不同的解释，下一步适合做什么？',options:['比较它们讨论的问题和依据','只选更容易记住的那个','跳过差异'],correct:0,why:'先比较问题和依据，才能说明分歧具体发生在哪里。'},
   {q:'怎样检查自己是否理解了这一节？',options:['看过就算理解','只重复标题','用自己的话解释，并举出具体例子'],correct:2,why:'独立解释并举例，可以帮助发现理解中的空缺。'}
  ];
  function renderCard(view){const id=cardOrder[cardIndex],c=cards[id];view.innerHTML=header('RECALL & REMEMBER','翻一张，记住一点',`${escape(chapterTitle)} · ${cardIndex+1} / ${cards.length}`)+`<div class="book-card-progress"><span>会了 ${Object.values(cardRatings).filter(x=>x==='known').length}</span><span>不会 ${Object.values(cardRatings).filter(x=>x==='again').length}</span><progress aria-label="卡片复习进度" max="${cards.length}" value="${Object.keys(cardRatings).length}"></progress></div><button type="button" class="book-learning-card ${flipped?'is-flipped':''}" data-learning-flip aria-label="${flipped?'返回问题':'翻看答案'}"><small>${flipped?'阅读提示':escape(c.tag)}</small><strong>${escape(flipped?c.answer:c.q)}</strong><span>${flipped?'点击返回问题':'点击翻看答案'}</span></button>${flipped?`<div class="book-card-ratings"><button type="button" data-card-rating="again">不会</button><button type="button" data-card-rating="known">会了</button></div>`:''}<div class="book-learning-card-actions"><button type="button" data-learning-prev ${cardIndex===0?'disabled':''}>上一张</button><button type="button" data-card-shuffle>洗牌</button><button type="button" data-card-reset>重新开始</button><button type="button" data-learning-next ${cardIndex===cards.length-1?'disabled':''}>下一张</button></div><p class="book-learning-caption" role="status">${Object.keys(cardRatings).length===cards.length?'这一组已复习完，可以重新开始，或切回原文本继续阅读。':'翻看答案后，选择“会了”或“不会”。'}</p>`;}
  function renderQuiz(view){
   if(!quizStarted){view.innerHTML=`<section class="book-quiz-start">${header('CHAPTER REVIEW','检验这一节的理解',escape(a.title))}<div class="book-quiz-start-facts"><span><strong>${questions.length}</strong> 道题</span><span>单项选择</span><span>答后查看解析</span></div><p>不急着选出答案。回想文字中的依据，再做一次自己的判断。</p><button type="button" class="button dark" data-learning-quiz-start>开始测验 <i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></button></section>`;return;}
   if(quizIndex===questions.length){const score=answers.filter((v,i)=>v===questions[i].correct).length;view.innerHTML=header('CHAPTER REVIEW','完成这次自测',`答对 ${score} / ${questions.length} 题`)+`<div class="book-quiz-result"><strong>${Math.round(score/questions.length*100)}<small>分</small></strong><p>带着刚才的问题，回到文字里再读一次。</p><button type="button" class="button dark" data-learning-restart>重新自测</button></div>`;return;}
   const q=questions[quizIndex],answer=answers[quizIndex];view.innerHTML=header('CHAPTER REVIEW','看看自己理解了多少',`${quizIndex+1} / ${questions.length}`)+`<h3>${escape(q.q)}</h3><div class="book-quiz-options">${q.options.map((t,i)=>`<button type="button" data-learning-answer="${i}" ${answer!==undefined?'disabled':''} class="${answer!==undefined&&i===q.correct?'is-correct':answer===i?'is-wrong':''}"><b>${String.fromCharCode(65+i)}</b>${escape(t)}${answer!==undefined&&i===q.correct?'<span>正确答案</span>':''}</button>`).join('')}</div><p class="book-quiz-feedback" role="status">${answer===undefined?'选择一个答案，再查看解析。':(answer===q.correct?'回答正确。':'再想一想。')+escape(q.why)}</p>${answer!==undefined?`<button type="button" class="button dark" data-learning-quiz-next>${quizIndex===questions.length-1?'查看结果':'下一题'}</button>`:''}`;
  }

  function createView(key){
   const view=document.createElement('div');view.className='book-learning-view';view.dataset.mode=key;view.hidden=true;panel.append(view);views.set(key,view);
   if(key==='enhanced')view.innerHTML=header('READ & UNDERSTAND','从文字里，多读懂一点',escape(a.title))+`<p class="book-learning-intro">${escape(b.summary)}</p>${focusPoints.map(([tag,q,answer],i)=>`<section class="book-enhanced-block"><span>0${i+1} / ${tag}</span><h3>${escape(q)}</h3><p>${escape(answer)}</p><details><summary>展开阅读提示</summary><p>以「${escape(a.title)}」为起点，记录一句解释，再补充支持这份解释的例子。</p></details></section>`).join('')}`;
   if(key==='anki')renderCard(view);
   if(key==='quiz')renderQuiz(view);
   if(key==='map'){knowledgeMap=clubKnowledgeMap.create({signal:ac.signal,bookTitle:b.title});view.append(knowledgeMap.element);}
   if(key==='audio'){audioCourse=clubAudioCourse.create({signal:ac.signal,lesson:window.clubAudioLessons?.[b.id]?.[chapter.groupIndex]||(science&&chapter.groupIndex===0?clubAudioLesson:null),chapterTitle});view.append(audioCourse.element);}
   return view;
  }
  function cancelScan(){scanToken++;scan?.cancel();scan=null;rippleTransition?.skipTransition();rippleTransition=null;document.querySelector('.reader-enhance-ripple')?.remove();document.documentElement.classList.remove('reader-ripple-active');dock.querySelector('[data-reader-mode="enhanced"]').removeAttribute('aria-busy');}
  function select(key,initial=false,origin=null){
   cancelScan();
   if(!initial&&mode==='text'&&key==='enhanced'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const rect=dock.querySelector('[data-reader-mode="enhanced"]').getBoundingClientRect(),x=origin?.x??rect.left+rect.width/2,y=origin?.y??rect.top+rect.height/2;
    const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)),token=scanToken;
    const html=document.documentElement;html.style.setProperty('--reader-ripple-x',x+'px');html.style.setProperty('--reader-ripple-y',y+'px');html.style.setProperty('--reader-ripple-radius',radius+'px');
    dock.querySelector('[data-reader-mode="enhanced"]').setAttribute('aria-busy','true');
    if(document.startViewTransition){
     html.classList.add('reader-ripple-active');
     const transition=document.startViewTransition(()=>{if(token===scanToken)commitSelect(key,false,true);});rippleTransition=transition;
     transition.finished.catch(()=>{}).finally(()=>{if(token===scanToken)cancelScan();});
    }else{
     const overlay=document.createElement('div');overlay.className='reader-enhance-ripple';overlay.setAttribute('aria-hidden','true');overlay.style.left=x+'px';overlay.style.top=y+'px';document.body.append(overlay);
     scan=overlay.animate([{transform:'translate(-50%,-50%) scale(0)',opacity:.9},{transform:`translate(-50%,-50%) scale(${radius/50})`,opacity:0}],{duration:1000,easing:'cubic-bezier(.2,.7,.2,1)'});
     commitSelect(key,false,true);scan.finished.then(()=>{if(token===scanToken)cancelScan();}).catch(()=>{});
    }
    return;
   }
   commitSelect(key,initial);
  }
  function commitSelect(key,initial=false,ripple=false){
   if(!modes.some(m=>m[0]===key))key='text';
   if(!initial&&mode===key)return;
   revealAnimation?.cancel();
   if(!initial)positions.set(mode,scrollY);if(mode==='audio'&&key!=='audio')audioCourse?.pause();
   mode=key;const view=views.get(key)||createView(key);
   views.forEach((el,k)=>{el.hidden=k!==key;});reader.dataset.readerMode=key;
   dock.querySelectorAll('[role=tab]').forEach(tab=>{const active=tab.dataset.readerMode===key;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
   if(dockModes.some(m=>m[0]===key)){panel.setAttribute('aria-labelledby',`book-mode-${key}`);panel.removeAttribute('aria-label');}else{panel.removeAttribute('aria-labelledby');panel.setAttribute('aria-label',chapterTitle+' · '+(key==='audio'?'音频课':'Anki 卡片'));dock.querySelector('[role=tab]').tabIndex=0;}
   articleHead.innerHTML=key==='map'?`<h1>${escape(b.title)}</h1>`:['audio','anki'].includes(key)?`<span class="club-overline">${String(chapter.groupIndex+1).padStart(2,'0')}</span><h1>${escape(chapterTitle)}</h1><div class="portal-article-meta"><span>${escape(b.title)}</span><span>${key==='audio'?'音频课':'Anki 卡片'}</span></div>`:originalHead;
   reader.querySelectorAll('.reader-chapter-tool').forEach(link=>{const active=link.dataset.chapterMode===key&&Number(link.dataset.chapterIndex)===chapter.groupIndex;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
   reader.querySelectorAll('.reader-toc-article').forEach((link,i)=>{if(!['audio','anki','map'].includes(key)&&i===a.index)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
   reader.querySelectorAll('.reader-toc-article,.portal-reader-next a').forEach(link=>{const url=new URL(link.href);const [path,query]=url.hash.split('?');const p=new URLSearchParams(query);p.set('mode',['audio','anki'].includes(key)?'text':key);link.hash=path+'?'+p;});
   if(!initial){const [path,query]=location.hash.split('?'),p=new URLSearchParams(query);p.set('mode',key);history.replaceState(history.state,'',path+'?'+p);window.scrollTo({top:positions.get(key)??0,behavior:'instant'});}
   if(!initial&&!ripple&&!matchMedia('(prefers-reduced-motion: reduce)').matches)revealAnimation=view.animate([{opacity:0},{opacity:1}],{duration:280,easing:'cubic-bezier(.2,.8,.2,1)'});
   if(matchMedia('(max-width:760px)').matches){const tab=dock.querySelector('[role=tab][aria-selected=true]'),tabs=dock.querySelector('.book-reader-tabs');if(tab){const left=tab.offsetLeft-tabs.offsetLeft;if(left<tabs.scrollLeft)tabs.scrollLeft=left;else if(left+tab.offsetWidth>tabs.scrollLeft+tabs.clientWidth)tabs.scrollLeft=left+tab.offsetWidth-tabs.clientWidth;}}
  }
  on(dock,'click',event=>{const note=event.target.closest('[data-open-reader-notes]');if(note){notes.open(note);return;}const button=event.target.closest('[data-reader-mode]');if(button)select(button.dataset.readerMode,false,event.detail?{x:event.clientX,y:event.clientY}:null);});
  on(dock,'keydown',event=>{const tab=event.target.closest('[role=tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=[...dock.querySelectorAll('[role=tab]')],i=tabs.indexOf(tab);const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(i+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[next].dataset.readerMode);tabs[next].focus({preventScroll:true});});
  on(panel,'click',event=>{
   const el=event.target.closest('button');if(!el)return;
   if(el.hasAttribute('data-learning-quiz-start')){quizStarted=true;renderQuiz(views.get('quiz'));}
   if(el.hasAttribute('data-card-rating')){cardRatings[cardOrder[cardIndex]]=el.dataset.cardRating;if(cardIndex<cards.length-1)cardIndex++;flipped=false;renderCard(views.get('anki'));views.get('anki').querySelector('[data-learning-flip]').focus({preventScroll:true});}
   if(el.hasAttribute('data-card-reset')||el.hasAttribute('data-card-shuffle')){cardIndex=0;flipped=false;cardRatings={};if(el.hasAttribute('data-card-shuffle')){for(let i=cardOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[cardOrder[i],cardOrder[j]]=[cardOrder[j],cardOrder[i]];}}else cardOrder=[0,1,2];renderCard(views.get('anki'));views.get('anki').querySelector('[data-learning-flip]').focus({preventScroll:true});}
   if(el.hasAttribute('data-learning-flip')){flipped=!flipped;renderCard(views.get('anki'));views.get('anki').querySelector('[data-learning-flip]').focus({preventScroll:true});}
   if(el.hasAttribute('data-learning-prev')||el.hasAttribute('data-learning-next')){cardIndex+=el.hasAttribute('data-learning-next')?1:-1;flipped=false;renderCard(views.get('anki'));const next=views.get('anki').querySelector(el.hasAttribute('data-learning-next')?'[data-learning-next]':'[data-learning-prev]');(next.disabled?views.get('anki').querySelector('[data-learning-flip]'):next).focus({preventScroll:true});}
   if(el.hasAttribute('data-learning-answer')){answers[quizIndex]=Number(el.dataset.learningAnswer);renderQuiz(views.get('quiz'));views.get('quiz').querySelector('[data-learning-quiz-next]').focus({preventScroll:true});}
   if(el.hasAttribute('data-learning-quiz-next')){quizIndex++;renderQuiz(views.get('quiz'));const focusTarget=views.get('quiz').querySelector('[data-learning-restart],h3');focusTarget.tabIndex=-1;focusTarget.focus({preventScroll:true});}
   if(el.hasAttribute('data-learning-restart')){quizIndex=0;answers=[];renderQuiz(views.get('quiz'));}
  });
  if(new URLSearchParams(location.hash.split('?')[1]).get('mode')==='graph'){location.replace('https://ebooks.com.cn/reader/8/map?chapterId=806');return;}
  const initialMode=new URLSearchParams(location.hash.split('?')[1]).get('mode')||'text';select(initialMode,true);
  if(initialMode==='notes')requestAnimationFrame(()=>notes.open(dock.querySelector('[data-open-reader-notes]')));
  dispose=()=>{revealAnimation?.cancel();cancelScan();audioCourse?.dispose();knowledgeMap?.dispose();notes.dispose();ac.abort();dock.remove();document.body.classList.remove('book-reader-open');};
 }};
})();
