(async()=>{
 await clubSession.ready;if(!clubSession.profile){location.replace('auth.html');return}
 const status=document.querySelector('#settings-status');let state={};try{state=JSON.parse(localStorage.getItem('longyuan-personal-initialize-v1'))?.state||{}}catch{}
 const p=state.profile||{},name=p.name||clubSession.profile.nickname||'你';
 document.querySelector('#profile-name').textContent=name;
 document.querySelector('.profile-summary img').src=clubSession.profile.avatar||'onboarding/assets/default-avatars/call_T4m9NoHP7lo2kGRubhxu5kva.png';
 document.querySelector('#preferences-title').textContent=readingCopy.t('profile.title',{name});
 const clean=values=>[...new Set((values||[]).map(v=>String(v).trim()).filter(v=>v&&v!=='还没想好'))],join=values=>values.join('、'),paragraphs=[readingCopy.t('profile.intro')];
 const categories=clean(p.categories),topics=clean([...(p.topics||[]),...(state.domains||[])]),people=clean(p.people),ops=state.ops||{};
 if(p.organization||p.profession)paragraphs.push('你'+(p.organization?'在'+p.organization:'')+(p.profession?(p.organization?'，从事':'从事')+p.profession+'相关工作':'')+'。');
 if(categories.length||topics.length||p.topicsOther)paragraphs.push((categories.length?readingCopy.t('profile.categories',{topics:join(categories)}):'')+(topics.length?readingCopy.t('profile.topics',{topics:join(topics)}):'')+(p.topicsOther?readingCopy.t('profile.other',{text:p.topicsOther}):''));
 else paragraphs.push(readingCopy.t('profile.empty'));
 if(people.length||p.peopleOther)paragraphs.push(readingCopy.t('profile.people',{people:join([...people,...(p.peopleOther?[p.peopleOther]:[])])}));
 if(state.clubName)paragraphs.push(readingCopy.t('profile.clubName',{name:state.clubName})+(state.clubNotes?readingCopy.t('profile.clubNotes',{text:state.clubNotes}):''));
 else if(state.clubNotes)paragraphs.push(readingCopy.t('profile.clubNotes',{text:state.clubNotes}));
 if(ops.dailyCount||ops.formats?.length||ops.deliveryTime){const details=[];if(ops.deliveryTime)details.push('每天 '+ops.deliveryTime);if(ops.dailyCount)details.push(ops.dailyCount+' 份内容');paragraphs.push((details.length?readingCopy.t('profile.rhythm',{details:details.join('，')}):'')+(ops.formats?.length?readingCopy.t('profile.formats',{formats:join(clean(ops.formats)).replaceAll('期刊','杂志')}):'')+readingCopy.t('profile.clue'))}
 const body=document.querySelector('#reading-summary');paragraphs.forEach(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;body.append(paragraph)});
 const signature=JSON.stringify(paragraphs);let meta;try{meta=JSON.parse(localStorage.getItem('personal-reading-summary-meta'))}catch{}if(meta?.signature!==signature){meta={signature,updatedAt:Date.now()};localStorage.setItem('personal-reading-summary-meta',JSON.stringify(meta))}
 document.querySelector('#summary-updated').textContent='更新于 '+new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(meta.updatedAt));
 const more=document.querySelector('#summary-more');function toggle(){const expanded=body.classList.toggle('is-expanded');more.setAttribute('aria-expanded',String(expanded));more.textContent=readingCopy.t(expanded?'profile.collapse':'profile.expand')}more.onclick=toggle;
 // The preview itself is also an entry, while the named button provides the keyboard path.
 body.onclick=()=>{if(!body.classList.contains('is-expanded')&&!getSelection()?.toString())toggle()};
 document.querySelector('#reset-preferences').onclick=async()=>{try{await clubSession.savePreferences(null)}catch(error){status.textContent=error.message;return}sessionStorage.setItem('personal-previous-preferences',JSON.stringify(state));localStorage.removeItem('longyuan-personal-initialize-v1');localStorage.removeItem('longyuan-personal-ready');location.assign('onboarding/initialize.html')};
 document.querySelector('#account-logout').onclick=async e=>{const button=e.currentTarget;button.disabled=true;try{await clubSession.logout()}catch(error){status.textContent=error.message;button.disabled=false}};
 document.querySelector('#about-us').onclick=()=>{const dialog=document.querySelector('#preview'),content=document.querySelector('#dialog-content');content.replaceChildren();for(const [tag,text] of [['h2',readingCopy.t('profile.aboutTitle')],['p',readingCopy.t('profile.aboutLead')],['p',readingCopy.t('profile.aboutBody')]]){const element=document.createElement(tag);element.textContent=text;content.append(element)}dialog.showModal()};
})();
