/* Collapsed guide invitation, Figma 232:9453. Timings are milliseconds. */
(()=>{
 const FIRST_DELAY=8000,REPEAT_DELAY=60000,DISPLAY_TIME=5000;
 let timer=0,hideTimer=0,active=null;
 function hide(){clearTimeout(hideTimer);if(active){active.classList.remove('guide-nudge-visible','guide-nudge-settled');active=null;}}
 function schedule(delay=REPEAT_DELAY){clearTimeout(timer);if(!document.hidden)timer=setTimeout(show,delay);}
 function eligible(){return [...document.querySelectorAll('.pe-chat-collapsed .pe-chat-reopen')].find(button=>{const rect=button.getBoundingClientRect();return rect.width>0&&rect.height>0&&getComputedStyle(button).visibility!=='hidden'&&!button.closest('[inert]')});}
 function show(){
  const button=eligible(),editing=document.activeElement?.matches('input,textarea,[contenteditable=true]'),open=[...document.querySelectorAll('.pe-chat')].some(chat=>!chat.hidden&&getComputedStyle(chat).display!=='none'&&chat.getBoundingClientRect().width>0);
  if(document.hidden||!button||editing||open){schedule();return;}
  hide();active=button;button.classList.add('guide-nudge-visible');if(matchMedia('(prefers-reduced-motion: reduce)').matches)button.classList.add('guide-nudge-settled');hideTimer=setTimeout(()=>{hide();schedule();},DISPLAY_TIME);
 }
 function mount(){document.querySelectorAll('.pe-chat-reopen:not(.guide-nudge-ready)').forEach(button=>{
  button.classList.add('guide-nudge-ready');button.addEventListener('transitionend',event=>{if(event.propertyName==='width'&&active===button)button.classList.add('guide-nudge-settled');});
  const copy=document.createElement('span');copy.className='guide-nudge-copy';copy.setAttribute('aria-hidden','true');
  const title=document.createElement('span');title.textContent='阅读有疑问？问问我';const subtitle=document.createElement('span');subtitle.textContent='选书、解读，陪你一起读';copy.append(title,subtitle);button.append(copy);
 });if(active&&!active.closest('.pe-chat-collapsed'))hide();}
 document.addEventListener('click',event=>{if(event.target.closest('[data-pe-chat-toggle]')){hide();schedule();}},true);
 document.addEventListener('focusin',event=>{if(event.target.matches('input,textarea,[contenteditable=true]')){hide();schedule();}});
 document.addEventListener('visibilitychange',()=>{hide();clearTimeout(timer);if(!document.hidden)schedule(FIRST_DELAY);});
 window.addEventListener('hashchange',()=>{hide();schedule(FIRST_DELAY)});
 window.addEventListener('pagehide',()=>{hide();clearTimeout(timer)});
 window.addEventListener('pageshow',event=>{if(event.persisted)schedule(FIRST_DELAY)});
 new MutationObserver(mount).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 mount();schedule(FIRST_DELAY);
})();
