/* Shared onboarding recording gesture, followed by a presentation-only AI reply. */
(()=>{'use strict';
 const backdrop=document.createElement('div');backdrop.className='feed-voice-backdrop';backdrop.hidden=true;backdrop.setAttribute('aria-hidden','true');document.body.append(backdrop);
 const host=document.createElement('aside');host.className='feed-voice';host.setAttribute('aria-label','语音调整信息流');
 host.innerHTML='<section class="feed-voice-conversation" aria-labelledby="feed-voice-heading" hidden><header><strong id="feed-voice-heading">这次想读什么</strong><button type="button" aria-label="收起语音对话">×</button></header><div class="feed-voice-messages" role="log" aria-live="polite"></div></section>';
 document.body.append(host);const panel=host.querySelector('section'),messages=host.querySelector('.feed-voice-messages');let timers=[];
 const profile={},control=readingVoiceControl.mount(host,profile,()=>{}, {holdLabel:'描述想法，调整推荐',question:'想调整哪些阅读内容？',onStart(){dismiss();clear()},onSend:respond});
 const hold=control.wrap.querySelector('.voice-record');hold.setAttribute('aria-label','描述想法，调整推荐，按住说话');control.state('idle');
 function clear(){timers.forEach(clearTimeout);timers=[];document.querySelector('#personal-feed')?.classList.remove('feed-voice-refreshing')}
 function later(fn,ms){timers.push(setTimeout(fn,ms))}
 function message(who,text,cls=''){const item=document.createElement('div');item.className='feed-voice-message is-'+who+' '+cls;const label=document.createElement('span'),body=document.createElement('p');label.textContent=who==='user'?'你':'领读';body.textContent=text;item.append(label,body);messages.append(item);messages.scrollTop=messages.scrollHeight;return item}
 function respond(){clear();hold.disabled=true;profile.voiceReply=null;control.state('idle');messages.replaceChildren();panel.hidden=false;backdrop.hidden=false;panel.dataset.stage='recognized';
  message('user','今天想看看 AI 怎么影响日常消费，内容短一点，多一些文章。');
  later(()=>{panel.dataset.stage='reply';message('assistant','好，我会多选一些 AI 与日常消费相关的文章，把推荐正文整理得更精炼。')},650);
  later(()=>{panel.dataset.stage='adjusting';message('assistant','正在调整信息流…','is-adjusting');document.querySelector('#personal-feed')?.classList.add('feed-voice-refreshing')},1450);
  later(()=>{document.querySelector('#personal-feed')?.classList.remove('feed-voice-refreshing');messages.querySelector('.is-adjusting')?.remove();panel.dataset.stage='done';message('assistant','调整完毕，接下来多读一点你关心的。','is-complete');hold.disabled=false;later(dismiss,2000)},3200);
 }
 function dismiss(){panel.hidden=true;backdrop.hidden=true}
 backdrop.onclick=()=>{dismiss();hold.focus()};
 host.querySelector('header button').onclick=()=>{dismiss();hold.focus()};host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!control.held){dismiss();hold.focus()}});
 addEventListener('pagehide',()=>{clear();control.destroy()},{once:true});
})();
