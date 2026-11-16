/* Standalone copy of the existing demo's reading-guide component and behavior. */
(()=>{
 let readingGuideCollapsed=true;
 try{const saved=sessionStorage.getItem('club-demo-reading-guide-collapsed');if(saved!==null)readingGuideCollapsed=saved==='true';}catch{}
window.renderResourceChat = function(kind="期刊"){const arrow='<i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i>';return `<aside class="pe-chat" aria-label="阅读对话"><div class="pe-guide-heading"><img class="pe-guide-avatar" src="assets/reading-guide-avatar-v3.png" width="44" height="44" alt=""><div><h2>阅读向导</h2><p>调一调内容，把喜欢的推送到读书会</p></div><button type="button" class="pe-chat-toggle pe-icon-button" data-pe-chat-toggle aria-label="收起对话" title="收起对话" aria-expanded="true"><i class="iconfont icon-Slider" aria-hidden="true"></i><span class="pe-tooltip">收起对话</span></button></div><div class="pe-chat-messages" aria-live="polite"><div class="pe-guide-welcome"><h3>这份内容，合你的心意吗？</h3><p>告诉我想怎样调整。挑好后，每份内容都可以推送到读书会首页。</p>${[['调整每日数量','比如：每天只要 4 份'],['换一换内容形态','文章、播客、图书、期刊，按你的偏好来'],['让摘要短一点','先看重点，感兴趣的再读全文']].map(([title,desc])=>`<button class="pe-guide-prompt" data-pe-prompt="${title}"><span><strong>${title}</strong><small>${desc}</small></span>${arrow}</button>`).join('')}</div></div><div class="pe-chat-form-wrap"><form class="pe-chat-form"><textarea rows="2" aria-label="调整信息流内容" placeholder="想怎样调整这份内容？&#10;比如：每天只要 4 份文章，摘要短一点。" required></textarea><div class="pe-chat-tools"><label class="pe-chat-attach" tabindex="0" role="button" title="添加内容" aria-label="添加内容"><i class="iconfont icon-Link" aria-hidden="true"></i><input type="file" hidden></label><button type="submit" aria-label="发送提问" title="发送提问">${arrow}</button></div></form></div></aside><button type="button" class="pe-chat-reopen pe-icon-button" data-pe-chat-toggle aria-label="展开阅读向导" title="展开阅读向导" aria-expanded="true"><img src="assets/reading-guide-avatar-v3.png" width="44" height="44" alt=""><span class="pe-tooltip">展开阅读向导</span></button>`;};

 const mount=document.createElement('div');mount.className='demo-reading-widget rd-periodical pe-figma-detail';mount.innerHTML=renderResourceChat();document.body.append(mount);
// A local, explicit directory lookup; no generated claims about article bodies.
document.addEventListener('submit',event=>{
 const form=event.target.closest('.pe-chat-form');if(!form)return;event.preventDefault();
 const input=form.querySelector('textarea'),question=input.value.trim();if(!question)return;
 const messages=form.closest('.pe-chat').querySelector('.pe-chat-messages');
 if(document.body.dataset.setupView==='feed'){const user=document.createElement('p');user.className='pe-user-message';user.textContent=question;messages.append(user);input.value='';window.dispatchEvent(new CustomEvent('edition:request',{detail:{text:question,reply:answer=>{const reply=document.createElement('p');reply.textContent=answer;messages.append(reply);messages.scrollTop=messages.scrollHeight}}}));return;}
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
 try{sessionStorage.setItem('club-demo-reading-guide-collapsed',String(collapsed));}catch{}
 root.classList.toggle('pe-chat-collapsed',collapsed);document.body.classList.toggle('reading-guide-open',!collapsed);
 document.querySelectorAll('.rd-periodical').forEach(other=>{if(other!==root)applyGuidePreference(other);});
 const chat=root.querySelector('.pe-chat'),reopen=root.querySelector('.pe-chat-reopen');
 chat.inert=collapsed;
 animateGuide(chat,collapsed);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){reopen.getAnimations().forEach(a=>a.cancel());if(collapsed)reopen.animate([{opacity:0,transform:'scale(.88)'},{opacity:1,transform:'scale(1)'}],{duration:220,easing:'ease-out'});}
 root.querySelectorAll('[data-pe-chat-toggle]').forEach(b=>b.setAttribute('aria-expanded',String(!collapsed)));
 (collapsed?reopen:chat.querySelector('.pe-chat-toggle'))?.focus({preventScroll:true});
},true);

document.addEventListener('click',event=>{const b=event.target.closest('[data-pe-prompt]');if(!b)return;const input=b.closest('.pe-chat').querySelector('textarea');input.value=b.dataset.pePrompt==='调整每日数量'?'每天只要 4 份':b.dataset.pePrompt==='换一换内容形态'?'只保留文章和播客':'摘要短一点';input.focus();});

// Attachment remains local to the demo; show the chosen filename without uploading.
document.addEventListener("change",event=>{const input=event.target.closest(".pe-chat-attach input");if(!input)return;const label=input.closest("label");label.title=input.files[0]?.name||"添加内容";label.setAttribute("aria-label",label.title);});

document.addEventListener("keydown",event=>{const label=event.target.closest(".pe-chat-attach");if(label&&["Enter"," "].includes(event.key)){event.preventDefault();label.querySelector("input").click();}});

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
 root.classList.toggle('pe-chat-collapsed',readingGuideCollapsed);document.body.classList.toggle('reading-guide-open',!readingGuideCollapsed);
 chat.hidden=readingGuideCollapsed;chat.inert=readingGuideCollapsed;
 chat.style.display=readingGuideCollapsed?'none':'';chat.style.transform='';chat.style.opacity='';chat.style.willChange='';
 root.querySelectorAll('[data-pe-chat-toggle]').forEach(button=>button.setAttribute('aria-expanded',String(!readingGuideCollapsed)));
}
const initializedGuides=new WeakSet();
function initializeGuides(){document.querySelectorAll('.rd-periodical .pe-chat').forEach(chat=>{if(initializedGuides.has(chat))return;const root=chat.closest('.rd-periodical');initializedGuides.add(chat);applyGuidePreference(root);});}
// Runs before painting freshly mounted routed, article, and shelf details.
new MutationObserver(initializeGuides).observe(document.body,{childList:true,subtree:true});
initializeGuides();

})();
