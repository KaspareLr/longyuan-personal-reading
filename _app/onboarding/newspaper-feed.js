/* A quiet, text-first editorial feed using the onboarding design language. */
(()=>{
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function makePodcastPlayer(data){
 const player=el('section',null,'paper-podcast-player');player.setAttribute('aria-label','播客播放器');
 
 const audio=el('audio');audio.preload='metadata';audio.src=data.src;audio.hidden=true;
 const controls=el('div',null,'paper-player-controls'),toggle=el('button',null,'paper-audio-toggle'),icon=el('i',null,'font_family icon-Play');icon.setAttribute('aria-hidden','true');toggle.type='button';toggle.setAttribute('aria-label','播放 '+data.title);toggle.setAttribute('aria-pressed','false');toggle.append(icon);
 const timeline=el('div',null,'paper-audio-timeline'),range=el('input',null,'paper-audio-range');range.type='range';range.min=0;range.max=100;range.step=.1;range.value=0;range.disabled=true;range.setAttribute('aria-label','播放进度');
 const times=el('div',null,'paper-audio-times'),elapsed=el('span','00:00'),duration=el('span',data.duration);times.append(elapsed,duration);timeline.append(range,times);controls.append(toggle,timeline);player.append(controls,audio);
 const status=el('p',null,'paper-audio-status');status.setAttribute('role','status');player.append(status);
 const clock=value=>{const n=Math.max(0,Math.floor(value||0));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
 function sync(){const playing=!audio.paused&&!audio.ended;icon.className='font_family '+(playing?'icon-Pause':'icon-Play');toggle.setAttribute('aria-label',(playing?'暂停 ':'播放 ')+data.title);toggle.setAttribute('aria-pressed',String(playing));elapsed.textContent=clock(audio.currentTime);if(Number.isFinite(audio.duration)&&audio.duration>0){duration.textContent=clock(audio.duration);range.max=audio.duration;range.disabled=false;range.value=audio.currentTime;range.setAttribute('aria-valuetext',clock(audio.currentTime)+' / '+clock(audio.duration));range.style.setProperty('--played',audio.currentTime/audio.duration*100+'%')}}
 toggle.onclick=async()=>{if(!audio.paused){audio.pause();return}try{status.textContent='';if(audio.ended)audio.currentTime=0;await audio.play()}catch{status.textContent='暂时无法播放，请重试。'}};
 audio.addEventListener('play',()=>{document.querySelectorAll('.reading-paper audio').forEach(other=>{if(other!==audio)other.pause()});sync()});['pause','ended','timeupdate','loadedmetadata','durationchange'].forEach(event=>audio.addEventListener(event,sync));range.oninput=()=>{audio.currentTime=Number(range.value);sync()};audio.addEventListener('error',()=>{status.textContent='音频暂时无法加载，请稍后重试。';sync()});return player;
}
function sourceFields(story){const r=story.resource;if(!r)return [story.author||'读书会编辑部',''];if(r.kind==='book')return [r.title,r.author||''];if(r.kind==='magazine')return [r.title,r.issue||''];if(r.kind==='magazine-article')return [r.publication||'', [r.issue,r.title,r.author].filter(Boolean).join(' · ')];return [r.title,[story.audio?.date||r.date,story.audio?.title,story.audio?.duration||r.duration].filter(Boolean).join(' · ')]}
function sourceBlock(story){const [name,note]=sourceFields(story),source=el('div',null,'paper-source');source.append(el('strong',name));if(note)source.append(el('span',note));return source}
function paragraphColumns(paragraphs,columns=2){const body=el('div',null,'paper-preview');body.dataset.columns=columns;const split=columns===2?Math.ceil(paragraphs.length/2):paragraphs.length;[paragraphs.slice(0,split),paragraphs.slice(split)].filter(a=>a.length).forEach(group=>{const col=el('div',null,'paper-text-column');group.forEach(p=>col.append(el('p',p)));body.append(col)});return body}
window.renderNewspaperFeed=function(stories,{count,formats,clubName,editPreferences,brief}){
 document.body.classList.add('newspaper-mode');const host=document.querySelector('#work-area');host.replaceChildren();const paper=el('section',null,'reading-paper');paper.setAttribute('aria-label','财经阅读信息流');
 const mast=el('header',null,'paper-masthead');mast.append(el('p',count+' 份内容 · '+formats.join(' / '),'paper-edition'),el('h1','今天，值得读的'+count+'件事'),el('p','从《第一财经》与财经读物出发，结合你的阅读方向，为你编辑。','paper-description'));paper.append(mast);
 const ordered=stories.map((story,index)=>({story,index})),podcastIndex=ordered.findIndex((x,i)=>i>0&&x.story.audio);if(podcastIndex>1)ordered.splice(1,0,ordered.splice(podcastIndex,1)[0]);
 const featured=el('section',null,'paper-featured-group'),list=el('section',null,'paper-latest-group'),entries=read('longyuan-edition-articles',{});
 ordered.forEach(({story,index},position)=>{
  const id='finance-'+encodeURIComponent(story.title)+'-'+index,url='portal.html#/article/'+id+'?from=initialize',preview=story.preview||[story.summary],body=[...preview,...(story.body||[]).filter(p=>!preview.includes(p))];
  const entry={id,title:story.title,author:story.author||'读书会编辑部',summary:body[0],body:body.slice(1).join('\n\n'),paragraphs:body,source:story.sourceNote,sourceUrl:story.url,format:story.format,cover:'',audio:story.audio||null,editorial:true};entries[id]=entry;
  const article=el('article',null,'paper-story '+(position===0?'paper-lead':position===1?'paper-dark':'paper-list'));article.id='paper-story-'+position;article.dataset.kind=story.kind;
  const content=el('div',null,'paper-article-content'),side=el('header',null,'paper-story-side'),number=el('span',String(position+1).padStart(2,'0'),'paper-number'),h=el('h2'),titleLink=el('a',story.title);titleLink.href=url;h.append(titleLink);const source=sourceBlock(story);
  if(position<2){const top=el('div',null,'paper-story-top');top.append(number,source);side.append(top,h)}else{const titleGroup=el('div',null,'paper-title-group');titleGroup.append(number,h);side.append(titleGroup);if(story.audio)side.append(makePodcastPlayer(story.audio));if(!story.banner)side.append(source)}
  const main=el('div',null,'paper-story-main');if(position===1&&story.audio)main.append(makePodcastPlayer(story.audio));main.append(paragraphColumns(brief?body.slice(0,1):body.slice(0,position===1?2:4),position===1?1:2));
  const actions=el('div',null,'paper-actions'),share=el('button',read('longyuan-home-pushed',[]).some(x=>x.id===id)?'已分享到读书会':'分享到读书会','paper-share');share.type='button';share.disabled=read('longyuan-home-pushed',[]).some(x=>x.id===id);share.onclick=event=>{event.stopPropagation();try{const all=read('longyuan-home-pushed',[]);if(!all.some(x=>x.id===id))all.push(entry);localStorage.setItem('longyuan-home-pushed',JSON.stringify(all));share.textContent='已分享到读书会';share.disabled=true}catch{share.textContent='保存失败，再试一次'}};
  const more=el('a',null,'paper-expand');more.href=url;more.setAttribute('aria-label','阅读全文：'+story.title);more.title='阅读全文';const arrow=el('i',null,'font_family icon-Arrow_Forward-2');arrow.setAttribute('aria-hidden','true');more.append(arrow);actions.append(share,more);main.append(actions);content.append(side,main);article.append(content);
  article.onclick=event=>{if(event.target.closest('a,button,input,audio,.paper-podcast-player')||window.getSelection()?.toString())return;location.href=url};
  if(position<2)featured.append(article);else if(story.banner){const row=el('div',null,'paper-image-row'),picture=el('figure',null,'paper-illustration'),image=el('img');image.src=story.banner;image.alt='零食门店与备货台的编辑配图';image.loading='lazy';picture.append(image);row.append(picture,article);list.append(row)}else list.append(article);
 });localStorage.setItem('longyuan-edition-articles',JSON.stringify(entries));paper.append(featured,list);
 const footer=el('footer',null,'paper-footer'),edit=el('button','调整内容偏好');edit.type='button';edit.onclick=editPreferences;footer.append(edit);paper.append(footer);host.append(paper);
};
})();
