(()=>{'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const people=discoveryLeaders,grid=document.querySelector('#discovery-people-grid'),filters=document.querySelector('#discovery-interests'),empty=document.querySelector('#discovery-empty'),dialog=document.querySelector('#preview');let term='',interest='全部',opener=null;
 readingCopy.heading(document.querySelector('#discover-title'),['遇见一个人，',['打开','一种新视角。']]);
 document.querySelector('#discovery-avatar-wall').innerHTML=people.map(p=>`<button type="button" data-person="${esc(p.id)}" aria-label="认识${esc(p.name)}" aria-haspopup="dialog" aria-controls="preview" title="${esc(p.name)}"><img src="${esc(p.portrait)}" width="80" height="80" alt=""></button>`).join('');
 const interests=['全部',...new Set(people.flatMap(p=>p.tags))];
 filters.innerHTML=interests.map(t=>`<button type="button" data-interest="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('');
 function render(){
  const results=people.filter(p=>(interest==='全部'||p.tags.includes(interest))&&(!term||[p.name,p.role,p.intro,...p.tags].join(' ').toLocaleLowerCase().includes(term)));
  filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.interest===interest)));
  grid.innerHTML=results.map(p=>`<button type="button" class="discovery-person-card" data-person="${esc(p.id)}" aria-label="认识${esc(p.name)}" aria-haspopup="dialog" aria-controls="preview"><img class="discovery-person-avatar" src="${esc(p.portrait)}" width="112" height="112" alt="" loading="lazy"><span class="discovery-person-name">${esc(p.name)}</span><span class="discovery-person-role">${esc(p.role)}</span><span class="discovery-person-intro">${esc(p.intro)}</span><span class="discovery-person-action">认识一下 <i class="font_family icon-Arrow_Forward-2" aria-hidden="true"></i></span></button>`).join('');
  empty.hidden=results.length>0;grid.hidden=!results.length;
  document.querySelector('#discovery-count').textContent=term?`找到 ${results.length} 位同行的人`:`${results.length} 位同行的人`;
  document.querySelector('#discovery-result-status').textContent=`${interest}，找到${results.length}位同行的人`;
 }
 function showPerson(id,trigger){const p=people.find(p=>p.id===id);if(!p)return;opener=trigger;document.querySelector('#dialog-content').innerHTML=`<div class="discovery-person-detail"><img src="${esc(p.portrait)}" width="112" height="112" alt="${esc(p.name)}"><span class="eyebrow">NICE TO MEET YOU</span><h2 id="person-dialog-name">${esc(p.name)}</h2><p class="discovery-person-detail-role">${esc(p.role)}</p><p class="discovery-person-detail-intro">${esc(p.intro)}</p><p class="discovery-person-bio">${esc(p.bio||p.intro)}</p><div class="discovery-person-tags">${p.tags.map(t=>'<span>'+esc(t)+'</span>').join('')}</div>${p.profileHref?`<a class="button dark" href="${esc(p.profileHref)}">领读人主页 <span aria-hidden="true">↗</span></a>`:''}</div>`;dialog.showModal();dialog.querySelector('.dialog-close').focus()}
 document.querySelector('.discovery-main').addEventListener('click',e=>{const person=e.target.closest('[data-person]');if(person){showPerson(person.dataset.person,person);return}const filter=e.target.closest('[data-interest]');if(filter){interest=filter.dataset.interest;render();return}if(e.target.closest('[data-reset]')){interest='全部';term='';render()}});
 dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true})});
 render();
})();
