const editorialBooks = [
  {
    "id": 10,
    "title": "前线部署工程师",
    "author": "范冰",
    "publisher": "西安交通大学出版社",
    "chapters": 8,
    "category": "教育学",
    "summary": "围绕 AI 客户交付，介绍问题发现、项目部署、续约与规模化复制的方法。",
    "url": "https://ebooks.com.cn/books/10",
    "cover": "assets/longyuan-home/ebook-10.png",
    "access": "登录后可读",
    "retrieved": "2026-09-24"
  },
  {
    "id": 8,
    "title": "科学的历程",
    "author": "未知作者",
    "publisher": "北师大出版社",
    "chapters": 3,
    "category": "",
    "summary": "以科学思想的跨文明传播为线索，串联古典科学、欧洲学术复兴与西学东渐。",
    "url": "https://ebooks.com.cn/books/8",
    "cover": "assets/longyuan-home/ebook-8.png",
    "access": "登录后可读",
    "retrieved": "2026-09-24"
  },
  {
    "id": 7,
    "title": "材料力学",
    "author": "未知作者",
    "publisher": "西安交通大学出版社",
    "chapters": 13,
    "category": "教育学",
    "summary": "介绍材料力学基础、杆件变形、应力应变，以及强度和刚度计算。",
    "url": "https://ebooks.com.cn/books/7",
    "cover": "assets/longyuan-home/ebook-7.png",
    "access": "登录后可读",
    "retrieved": "2026-09-24"
  }
];
(() => {
 const one=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 const icon=name=>`<i class="iconfont icon-${name}" aria-hidden="true"></i>`;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const picks={
  5:{title:'每日一读：把阅读放回日常',kind:'一篇文章 / 轻阅读',copy:'从一个小问题开始，给今天留下一点新的想法。',url:'#/reader/2'},
  15:{title:'数字时代，我们如何保持深度阅读？',kind:'一个主题 / 多种视角',copy:'沿着问题、案例与原文，慢慢展开一条阅读线索。',url:'#/topic/reading'},
  30:{title:'科学的历程',kind:'一本书 / 深入探索',copy:'放慢一点，沿着科学思想的演进读下去。',url:'#/book/8'}
 };
 function chooseTime(value){const p=picks[value];all('[data-reading-time]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.readingTime===String(value))));one('#reading-pick').innerHTML=`<a class="reading-pick" href="${p.url}"><span class="eyeline">${p.kind}</span><h4>${p.title}</h4><p>${p.copy}</p><span class="story-link">开始这段阅读 ${icon('Arrow_Forward-2')}</span></a>`}
 function showReturn(){let value;try{value=JSON.parse(localStorage.getItem('longyuan-last-reading'))}catch{}const valid=value&&typeof value.title==='string'&&/^#\/(reader|book|topic)\//.test(value.url);one('#reading-return').innerHTML=valid?`<a href="${escape(value.url)}"><span>继续阅读 · ${escape(value.title)}</span>${icon('Arrow_Forward-2')}</a>`:'每次翻开，都可以是一个新的开始。'}
 chooseTime(5);showReturn();
 document.addEventListener('click',event=>{
  const target=event.target.closest('[data-reading-time],[data-scroll-to]');if(!target)return;
  if(target.dataset.readingTime)chooseTime(target.dataset.readingTime);
  if(target.dataset.scrollTo){event.preventDefault();document.getElementById(target.dataset.scrollTo).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}
 });
 // Place the catalogue alongside its ranking rail, preserving all existing cards and route links.
 const catalog=one('#view-magazines'),sections=[...catalog.querySelectorAll(':scope > .content')];
 const layout=document.createElement('div');layout.className='catalog-layout';
 const main=document.createElement('div');main.className='catalog-main';
 const feature=document.createElement('a');feature.className='catalog-feature';feature.href='#/magazine/读者';
 feature.innerHTML=`<div><span class="eyeline">编辑主推 / 人文阅读</span><h2>读一些文字，<br>也读懂一些生活。</h2><p>从《读者》出发，在故事与随笔之间，发现日常生活里的细微光亮。</p><span class="story-link">走进这本刊 ${icon('Arrow_Forward-2')}</span></div><img src="assets/longyuan-home/duzh202220-z.jpg" alt="读者封面">`;
 main.append(feature,...sections.slice(1));layout.append(main,sections[0]);catalog.append(layout);
 let category='all';
 function filterCatalog(){const q=one('#magazine-keyword').value.trim().toLowerCase();let total=0;all('[data-mag-filter]').forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&card.textContent.toLowerCase().includes(q);card.hidden=!visible;card.style.display='';if(visible)total++});one('#catalog-count').textContent=`${total} 本可探索的期刊`;one('#catalog-empty').hidden=total>0;all('[data-filter-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filterCategory===category)))}
 one('#magazine-keyword').addEventListener('input',filterCatalog);document.addEventListener('click',event=>{const b=event.target.closest('[data-filter-category]');if(b){category=b.dataset.filterCategory;filterCatalog()}});filterCatalog();
 const topics={city:['城市更新：重新想象我们的生活','城市、公共空间与日常生活'], 'ai-class':['当 AI 走进课堂','教育、技术与学习方式'],aging:['银发时代的美好日常','社会趋势、消费与生活方式'],reading:['数字时代的深度阅读','阅读方式、信息与思考'],'city-culture':['城市文化与公共空间','社区、街道与文化生活'],'family-reading':['家庭阅读习惯养成','亲子陪伴、教育与成长']};
 const realChapters={10:['FDE 的崛起','解决正确的问题','赢得客户','激活部署','守住续约','扩大收入','规模化复制','完整案例集'],8:['希腊古典时代的科学','西学东渐与近代中国科学技术的落后','中世纪后期欧洲学术的复兴'],7:['绪论','轴向拉伸、压缩与剪切','扭转','弯曲内力','弯曲应力','弯曲变形','应力、应变分析及强度理论','组合变形','压杆稳定','动载荷','交变应力','能量法','超静定结构']};
 function routeDetails(){
  let route;try{route=decodeURIComponent(location.hash.replace(/^#\/?/,''))}catch{return}
  const [path]=route.split('?'),[type,id]=path.split('/');const query=new URLSearchParams((location.hash.split('?')[1]||''));let title='';
  if(type==='membership'){one('#view-membership .member-hero h1').textContent='《'+id+'》阅读相伴会员'}
  if(type==='topic'){
   const item=topics[id]||[query.get('title')||'我的阅读专题','围绕你的问题整理阅读路径'];title=item[0];one('#view-topic .topic-detail-hero h1').textContent=item[0];one('#view-topic .topic-detail-hero p').textContent=item[1]+'。从背景、案例和不同视角展开探索。以下为阅读路径演示，正式内容需依据实际检索资料生成。';
   const copies=['先厘清关键概念、时间范围和背景，建立理解“'+item[0]+'”的基础。','从具体报道与人物故事中，观察这个主题如何出现在真实生活里。','把不同立场与观察放在一起阅读，形成自己的判断。'];
   all('#view-topic .topic-section').forEach((section,index)=>{section.querySelector('p').textContent=copies[index];section.querySelector('b').textContent=['背景与概念：','案例与实践：','观点与讨论：'][index]+item[0];section.querySelector('small').textContent='示例阅读入口 · 内容待实际检索匹配'});
   one('#topic-ask-link').href='#/search?q='+encodeURIComponent(item[0]);
  }
  if(type==='topic-generate')one('#topic-ready-link').href='#/topic/custom?title='+encodeURIComponent(query.get('q')||'我的阅读专题');
  if(type==='reader')title=one('#reader-title').textContent;
  if(['reader','book','topic'].includes(type)&&title){try{localStorage.setItem('longyuan-last-reading',JSON.stringify({title,url:location.hash}))}catch{}}
  if(type==='home'||!type)showReturn();
 }
 window.addEventListener('hashchange',routeDetails);routeDetails();
})();
