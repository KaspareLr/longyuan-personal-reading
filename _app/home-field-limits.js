/* Homepage presentation limits; source records stay unchanged. */
(()=>{
 const rules=[{"label": "导航名称", "selector": ".nav-shell nav a", "max": 8, "lines": 1}, {"label": "登录昵称", "selector": ".club-account-name", "max": 12, "lines": 1}, {"label": "读书会名称", "selector": ".intro h1", "max": 24, "lines": 2}, {"label": "读书会简介", "selector": ".intro-copy", "max": 100, "lines": 3}, {"label": "栏目英文名", "selector": ".eyebrow,.section-title>span,.section-title>div>span", "max": 40, "lines": 1}, {"label": "栏目名称", "selector": ".section-title h2", "max": 16, "lines": 1}, {"label": "领读人姓名", "selector": ".guide-name-text", "max": 12, "lines": 1}, {"label": "领读人身份", "selector": ".guide small", "max": 24, "lines": 1}, {"label": "领读标题", "selector": ".feature-copy h2", "max": 32, "lines": 2}, {"label": "期次", "selector": ".feature-copy .issue", "max": 20, "lines": 1}, {"label": "领读语", "selector": ".feature-copy blockquote p", "max": 80, "lines": 3}, {"label": "领读状态", "selector": ".feature .badge", "max": 6, "lines": 1}, {"label": "参与人数", "selector": ".participants>span:last-child", "max": 16, "lines": 1}, {"label": "领读日期", "selector": ".progress-description p", "max": 32, "lines": 2}, {"label": "图书名称", "selector": ".book-card h3", "max": 40, "lines": 2}, {"label": "图书信息", "selector": ".book-card>p", "max": 40, "lines": 2}, {"label": "图书底部信息", "selector": ".book-card footer>span:first-child", "max": 32, "lines": 2}, {"label": "期刊名称", "selector": ".magazine h3", "max": 24, "lines": 2}, {"label": "期刊期次", "selector": ".magazine p", "max": 24, "lines": 1}, {"label": "播客标题", "selector": ".podcast h3", "max": 48, "lines": 2}, {"label": "播客日期", "selector": ".podcast-copy>div>p", "max": 20, "lines": 1}, {"label": "每日一读标题", "selector": ".daily-card h3", "max": 40, "lines": 2}, {"label": "每日一读来源", "selector": ".daily-card p", "max": 30, "lines": 1}, {"label": "文章标题", "selector": ".article-copy h3", "max": 48, "lines": 2}, {"label": "文章来源", "selector": ".article-copy>span", "max": 40, "lines": 1}, {"label": "文章摘要", "selector": ".article-copy p", "max": 120, "lines": 3}, {"label": "活动标题", "selector": ".activity h3", "max": 40, "lines": 2}, {"label": "活动简介", "selector": ".activity-copy>div>p", "max": 160, "lines": 4}, {"label": "页脚简介", "selector": ".club-footer-brand>p,.club-footer-about>p", "max": 100, "lines": 3}, {"label": "页脚导航", "selector": ".club-footer-columns nav a", "max": 12, "lines": 1}];
 const saved=new WeakMap();
 const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('zh',{granularity:'grapheme'}):null;
 const split=s=>segmenter?Array.from(segmenter.segment(s),x=>x.segment):Array.from(s);
 function refresh(){
  observer.disconnect();
  document.querySelectorAll('.guide strong').forEach(node=>{
   const text=Array.from(node.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());
   if(text){const span=document.createElement('span');span.className='guide-name-text';text.replaceWith(span);span.textContent=text.textContent.trim();}
  });
  for(const rule of rules)document.querySelectorAll(rule.selector).forEach(node=>{
   // Nested controls and icons retain their markup.
   if(node.children.length)return;
   const previous=saved.get(node), current=node.textContent;
   const full=previous&&current===previous.display?previous.full:current;
   const chars=split(full.trim());
   const display=chars.length>rule.max?chars.slice(0,rule.max-1).join('')+'…':full;
   if(node.textContent!==display)node.textContent=display;
   node.dataset.fieldLines=String(rule.lines);
   node.dataset.fieldMax=String(rule.max);
   node.title=full;
   if(chars.length>rule.max)node.setAttribute('aria-label',full);
   else if(previous?.truncated)node.removeAttribute('aria-label');
   saved.set(node,{full,display,truncated:chars.length>rule.max});
  });
  document.querySelectorAll('#login-form input[name=nickname]').forEach(n=>n.maxLength=12);
  document.querySelectorAll('.setup-chat-form textarea').forEach(n=>n.maxLength=500);
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 let queued=false;
 const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;refresh()})}});
 window.clubHomeFieldLimits=rules;
 refresh();
})();
