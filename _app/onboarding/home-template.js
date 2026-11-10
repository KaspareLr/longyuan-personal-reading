/* Fictional homepage data, rendered through the ordinary homepage's exact DOM templates. */
(() => {
  const home=document.querySelector('body>main#home');
  if(!home)return;
  const source=home.cloneNode(true),asset=(kind,i)=>`assets/home-template/${kind}-${i+1}.webp`;
  const books=[
    ['雾中的来信','林予安','拾光文艺出版社','文学小说','一封从湖畔小镇寄出的旧信，让一个关于离别与重逢的故事缓缓展开。沿着雾气与记忆的边界，重新寻找与人相遇的勇气。'],
    ['智能边界','周启明','未来新知出版社','科技人文','人工智能如何重塑人类世界？从算法、创造到日常生活，在技术的浪潮中重新思考人的位置。'],
    ['城墙与长风','顾南川','山河文化出版社','历史文化','走过古城街巷，听砖石与长风讲述时间。以城市为线索，读懂建筑背后的生活、人情与历史。'],
    ['与自己和解','沈知夏','春日生活出版社','心理成长','在忙碌的世界里给自己留一点空间。以温柔而具体的日常练习，学习接纳不完美，重建内心的秩序。']
  ].map(([title,author,publisher,category,summary],i)=>({title,author,publisher,category,summary,cover:asset('book',i)}));
  const magazines=[
    ['界面之城','2026年10期','未来城市，正在发生','从街巷到天际线，观察城市更新中的空间、技术与普通人的生活。'],
    ['远行志','2026年10期','在山与海之间，遇见更大的自己','沿着山脊与海岸出发，把行走、地理和旅途中的相遇写进生活。'],
    ['艺境','2026年10期','在艺术中，重新看见日常','走进展览与创作者的工作室，发现艺术如何悄悄改变我们的观看方式。'],
    ['新知前沿','2026年10期','当人类与 AI 一起发现世界','用清晰而有趣的方式理解科技变化，把对未来的好奇带回今天。'],
    ['风格档案','2026年08期','时装与日常的新叙事','从衣着、设计到个人表达，寻找属于自己的审美与生活态度。'],
    ['慢生活','2026年10期','好好吃饭，慢下来生活','从一餐饭、一杯茶和一处绿意开始，找回生活里具体而微小的满足。']
  ].map(([title,issue,subtitle,summary],i)=>({title,issue,subtitle,summary,cover:asset('magazine',i),author:'拾光编辑部'}));
  const podcasts=[
    ['城市落日：把今天的故事慢慢说完','42分钟','日落时分的城市、窗边的灯与耳机里的声音。聊聊那些忙碌过后，才有时间认真感受的生活片刻。'],
    ['星夜故事：给失眠的人一封晚安信','28分钟','一本书、一盏灯和一片星空，在轻柔的故事里安放情绪，陪你结束漫长的一天。'],
    ['山野电波：沿着地图，走进旷野','56分钟','带上背包与麦克风，听山风、脚步和远方的回声，分享一次关于自然与自由的旅程。']
  ].map(([title,duration,summary],i)=>({title,duration,summary,author:['林知夏','陈屿','陈屿'][i],cover:asset('podcast',i)}));
  const daily=[
    ['当 AI 成为窗边的同伴','科技与生活','屏幕另一端的智能，让我们更有效率，也让我们重新思考：什么样的陪伴，仍然只能来自人。'],
    ['翻开一本书，世界就亮了','阅读与想象','文字像一扇门，把日常与想象相连。愿你每一次翻页，都能遇见一个此前未曾看见的世界。'],
    ['城市的温柔，藏在步行之间','城市观察','放慢脚步，街角的咖啡香、树荫与陌生人的微笑，都能成为一天里值得记住的部分。'],
    ['把自然，重新种进城市','绿色生活','河岸的绿意与远处的风车，提醒我们：城市的未来，也可以从身边的一条步道开始。'],
    ['好想法，从一起讨论开始','创意与协作','纸上零散的线条，在一次倾听和一次提问中相连。合作让一个人的灵感，生长成一群人的可能。'],
    ['给自己一个不赶时间的早晨','日常随笔','读几页书，等一束光，陪小狗看一会儿远山。有时不安排什么，就是最好的安排。']
  ].map(([title,category,summary],i)=>({title,author:'拾光编辑部 · '+category,category,summary,cover:asset('daily',i)}));
  const articles=[
    ['车窗外的远方','林知夏','当列车穿过黄昏，窗外掠过的不只是风景。那些尚未抵达的地方，也在悄悄改变我们看待生活的方式。'],
    ['雨后的奔跑','陈屿','踩过积水，笑声比脚步更快。长大后才明白，快乐有时只是愿意暂时忘记目的地，痛快地跑一场。'],
    ['深夜之前的创作','沈书禾','台灯亮起，世界慢慢安静。写下一行字、划掉一个念头，在反复修改中，找到只属于自己的表达。'],
    ['收获时刻','许望川','清晨的海面被第一束光照亮。一张网的重量，是人与自然之间漫长而朴素的对话。'],
    ['山巅的选择','周启明','走上山顶，不是为了证明什么，而是给自己一次重新看清方向的机会。远处的山，还在等我们。']
  ].map(([title,author,summary],i)=>({title,author,summary,cover:asset('article',i)}));
  const guides=[{title:'林知夏',role:'文学编辑 · 日常阅读陪伴者',summary:'相信文字能让人重新看见日常，和你一起读文学、聊生活。',cover:asset('guide',0)},{title:'陈屿',role:'旅行写作者 · 城市与自然观察者',summary:'以行走丈量世界，用阅读理解人与城市、人与自然的关系。',cover:asset('guide',1)}];
  const activity={title:'在真实的相遇中，看见更大的世界',author:'拾光读书会',summary:'带上一本最近读过的书，和热爱阅读的朋友们坐在一起。从一段文字聊起，分享阅读中的发现，也听听不同生活里的答案。现场包含主题分享、对谈交流与自由共读。',date:'10月18日 14:00—16:30',location:'城市文化中心 · 阅享空间',host:'拾光读书会 · 嘉宾：林知夏、陈屿',cover:'assets/home-template/activity.webp'};
  const data={books,magazines,podcasts,daily,articles,guides,activities:[activity]};
  function tag(el,kind,index=0){el.removeAttribute('data-open');el.removeAttribute('data-book');el.removeAttribute('data-magazine');el.removeAttribute('data-podcast');el.removeAttribute('data-guide');el.setAttribute('data-template-resource',kind);el.setAttribute('data-template-index',index);el.setAttribute('aria-disabled','true');el.tabIndex=-1;if(el.tagName==='A'){el.removeAttribute('href');el.removeAttribute('target');el.removeAttribute('data-club-linked')}}
  function image(el,item){el.src=item.cover;el.alt=item.title;el.removeAttribute('srcset')}
  function feature(node,config){const type=config.featured||'magazine',item=type==='book'?books[0]:type==='article'?articles[0]:magazines[0];node.dataset.templateArticle=String(type==='article');node.querySelector('h2').textContent=item.title;node.querySelector('.issue').textContent=type==='magazine'?item.issue:type==='book'?item.author+' · '+item.publisher:item.author;node.querySelector('.badge').textContent='共读进行中';node.querySelector('blockquote p').textContent=type==='magazine'?'一座城市的未来，会怎样改变每个人的日常？':type==='book'?'如果一封信能穿过时间，你最想把它寄给谁？':'我们出发时，究竟在寻找怎样的远方？';image(node.querySelector('.feature-cover img'),item);node.querySelector('.feature-cover').setAttribute('aria-label','查看'+item.title+'领读');node.querySelectorAll('.feature-more button,.feature-cover').forEach(el=>tag(el,'featured'));node.querySelector('.progress-ring').setAttribute('aria-valuenow','68');node.querySelector('#progress-label').textContent='68%';node.querySelector('.progress-description p').textContent='2026-10-12 至 2026-11-08';node.querySelectorAll('.participants img').forEach((el,i)=>image(el,guides[i]));node.querySelector('.participants>span:last-child').textContent='128 人参与';const join=node.querySelector('.join');tag(join,'join');delete join.dataset.joined;join.textContent='加入';}
  function render(config={}){
    const page=source.cloneNode(true),intro=page.querySelector('.intro');intro.querySelector('h1').innerHTML='恭喜您！<br>完成龙源读书会的创建！';intro.querySelector('.eyebrow').textContent='LONGYUAN READING CLUB';intro.querySelector('.intro-copy').textContent='接下来和配置向导一起完成首页的资源配置，让我们的读书会丰富起来吧！注：当前首页为演示内容';intro.querySelectorAll('.guide').forEach((el,i)=>{const g=guides[i];image(el.querySelector('img'),g);el.querySelector('strong').innerHTML=g.title+' <b>领读人</b>';el.querySelector('small').textContent=g.role;tag(el,'guides',i)});
    feature(page.querySelector('#featured'),config);
    page.querySelectorAll('.book-card').forEach((el,i)=>{const b=books[i];tag(el,'books',i);image(el.querySelector('.book-cover img'),b);el.querySelector('h3').textContent=b.title;el.querySelector(':scope>p').textContent=b.author+' · '+b.publisher;el.querySelector('footer>span:first-child').textContent=b.category});
    page.querySelectorAll('.magazine').forEach((el,i)=>{const m=magazines[i+1];tag(el,'magazines',i+1);image(el.querySelector('img'),m);el.querySelector('h3').textContent=m.title;el.querySelector('p').textContent=m.issue});
    page.querySelectorAll('.podcast').forEach((el,i)=>{const p=podcasts[i];image(el.querySelector('img'),p);el.querySelector('h3').textContent=p.title;el.querySelector('.podcast-copy p').textContent='10月16日 · '+p.author;const b=el.querySelector('.play');tag(b,'podcasts',i);b.lastChild.textContent=p.duration});
    page.querySelectorAll('.daily-card').forEach((el,i)=>{const a=daily[i];tag(el,'daily',i);image(el.querySelector('img'),a);el.querySelector('h3').textContent=a.title;el.querySelector('p').textContent=a.author});
    page.querySelectorAll('.article-item').forEach((el,i)=>{const a=articles[i];tag(el,'articles',i);image(el.querySelector('img'),a);el.querySelector('h3').textContent=a.title;el.querySelector('.article-copy>span').textContent=a.author;el.querySelector('.article-copy p').textContent=a.summary});
    const event=page.querySelector('.activity');image(event.querySelector('.activity-image'),activity);event.querySelector('h3').textContent=activity.title;event.querySelector('.badge').textContent='即将开始';event.querySelector('.activity-copy>div>p').textContent=activity.summary;event.querySelectorAll('.activity-meta p').forEach((el,i)=>el.lastChild.textContent=[activity.date,activity.location,'主办：'+activity.host][i]);event.querySelector('.activity-bottom>span').innerHTML='<strong>36</strong> 人报名';tag(event.querySelector('.activity-bottom button'),'activities');tag(page.querySelector('#activities .text-button'),'activities');
    ['books','magazines'].forEach(kind=>{const link=page.querySelector('#'+kind+' .more');tag(link,'list-'+kind)});
    for(const id of ['featured','books','magazines','podcasts','daily','articles','activities']){const section=page.querySelector('#'+id);section.classList.add('setup-section');}
    page.querySelectorAll('a,button').forEach(el=>{el.setAttribute('aria-disabled','true');el.tabIndex=-1});
    return page.innerHTML;
  }
  function initialize(){const wall=home.querySelector('.daily-window');if(wall)requestAnimationFrame(()=>wall.scrollLeft=Math.max(0,(wall.scrollWidth-wall.clientWidth)/2));}
  // Keep pointer hover intact while blocking every homepage content action.
  document.addEventListener('click',event=>{
    if(!document.body.classList.contains('club-setup-page'))return;
    if(event.target.closest('main#home a,main#home button')){event.preventDefault();event.stopImmediatePropagation()}
  },true);
  window.clubHomepageTemplate={render,initialize,feature,data};
})();
