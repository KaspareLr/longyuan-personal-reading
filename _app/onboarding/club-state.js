/* Shared local-only account state across the independent demo. */
(()=>{
 const base=new URL('.',document.currentScript.src);window.clubRootURL=base.href;
 const avatarPool=["assets/default-avatars/author-1.png", "assets/default-avatars/author-2.png", "assets/default-avatars/author-3.png", "assets/default-avatars/author-4.png", "assets/default-avatars/call_7PweNBn5vkxrwUsG2nA01cD2.png", "assets/default-avatars/call_9G8tmFXUSq488NnKy6qQDQUg.png", "assets/default-avatars/call_BoUMGW0VsMdNAEWB3HBp6EiM.png", "assets/default-avatars/call_EeDwyLTBmtofOnY7o0uy68Ra.png", "assets/default-avatars/call_L26vyrRbEgCUZLAPBfYfhjj4.png", "assets/default-avatars/call_OgiavCgYXJGgkDCcW3039MFv.png", "assets/default-avatars/call_T4m9NoHP7lo2kGRubhxu5kva.png", "assets/default-avatars/call_bsA98T6GedRq1dMVTYDm77kF.png", "assets/default-avatars/call_d2LVFBYix0Gn6rv3XKLygKSd.png", "assets/default-avatars/call_eNbU08SV8Df2izJJKLtj5X70.png", "assets/default-avatars/call_oiWPtL1xhiIsZCa7S1dGNPfT.png", "assets/default-avatars/call_p7SJ7jUHe2q6KPGDR7190KVu.png", "assets/default-avatars/call_ztGyJ7Q15W6aqqQVmWAgoCGb.png"];
 const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('club-demo:'+key))??fallback}catch{return fallback}};
 const write=(key,value)=>{try{localStorage.setItem('club-demo:'+key,JSON.stringify(value))}catch{}};
 const defaultAvatar=()=>{const saved=read('default-avatar',null);if(avatarPool.includes(saved))return saved;const selected=avatarPool[Math.floor(Math.random()*avatarPool.length)];write('default-avatar',selected);return selected};
 const needsDefault=avatar=>!avatar||avatar.startsWith('assets/account-avatars/');
 const state=window.clubSession={get profile(){return read('profile',null)},get membership(){return read('membership',null)},read,write,
  update(profile){profile={...profile,avatar:needsDefault(profile.avatar)?defaultAvatar():profile.avatar};write('default-avatar',profile.avatar);write('profile',profile);try{localStorage.setItem('club-demo:nickname',profile.nickname)}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  logout(){write('profile',null);try{localStorage.removeItem('club-demo:nickname')}catch{};refresh();window.dispatchEvent(new Event('club-session-change'))},
  member(plan){write('membership',{...plan,expires:'2027-10-15',started:'2026-10-15'});window.dispatchEvent(new Event('club-session-change'))},
  login(){dialog.showModal();dialog.querySelector('input').focus()}
 };
 const dialog=document.createElement('dialog');dialog.className='club-account-dialog';dialog.setAttribute('aria-label','登录读书会');dialog.innerHTML=`<form method="dialog"><button class="club-dialog-close" aria-label="关闭登录">×</button></form><span class="club-overline">YOUR READING SPACE</span><h2>欢迎回来。</h2><p>用一个昵称，开启你的阅读空间。</p><form id="club-demo-login"><label>阅读昵称<input name="nickname" maxlength="20" value="林间读者" autocomplete="nickname" required></label><label>登录身份<select name="role"><option value="reader">读者</option><option value="leader">领读人 · 体验创建读书会</option></select></label><label>邮箱（选填）<input name="email" type="email" autocomplete="email" placeholder="reader@example.com"></label><button class="button dark" type="submit">登录并开始阅读</button></form>`;document.body.append(dialog);
 dialog.querySelector('#club-demo-login').addEventListener('submit',e=>{e.preventDefault();const f=e.target;state.update({nickname:f.nickname.value.trim(),email:f.email.value,bio:'读书，读人，也读世界。',city:'上海',interests:['文学','生活'],role:f.role.value});dialog.close();if(f.role.value==='leader'){const configured=read('club-configuration',null);clubPageMotion.navigate(new URL(configured?'index.html':'index.html?setup=1',base))}});
 const themes={共读:'reading',领读人:'people',活动:'events',会员:'membership'};
 function refresh(){
  let profile=state.profile;if(profile&&needsDefault(profile.avatar)){profile={...profile,avatar:defaultAvatar()};write('default-avatar',profile.avatar);write('profile',profile)}
  document.querySelectorAll('.nav-shell nav a,.nav-shell nav button,.club-demo-topbar .nav a').forEach(el=>{
   const page=themes[el.textContent.trim()];if(!page)return;
   if(el.tagName==='BUTTON'){const a=document.createElement('a');a.href=new URL('portal.html#/'+page,base);a.textContent=el.textContent;el.replaceWith(a)}else el.href=new URL('portal.html#/'+page,base);
  });
  document.querySelectorAll('.login,.nav-login').forEach(el=>{el.replaceChildren();if(profile){const img=document.createElement('img');img.className='club-account-avatar';img.src=new URL(profile.avatar,base);img.alt='';img.width=28;img.height=28;const name=document.createElement('span');name.className='club-account-name';name.textContent=profile.nickname;el.append(img,name)}else el.textContent='登录';el.classList.toggle('is-signed-in',!!profile);el.setAttribute('aria-label',profile?'我的阅读空间':'登录');if(el.tagName==='A')el.href=new URL('portal.html#/me',base)});
 }
 document.addEventListener('click',e=>{
  const login=e.target.closest('.login,.nav-login,[data-club-login]');if(login){e.preventDefault();e.stopImmediatePropagation();if(state.profile&&!login.hasAttribute('data-club-login'))clubPageMotion.navigate(new URL('portal.html#/me',base));else state.login();return}
  const member=e.target.closest('[data-open="member"],.member');if(member){e.preventDefault();e.stopImmediatePropagation();clubPageMotion.navigate(new URL('portal.html#/membership',base));return}
 },true);
 refresh();window.addEventListener('storage',refresh);window.addEventListener('hashchange',refresh);
})();
