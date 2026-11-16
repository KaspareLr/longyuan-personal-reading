/* Retain the reading-club navigation when entering the original project from its demo. */
(()=>{
 if(new URLSearchParams(location.search).get('nav')!=='club')return;
 const header=document.querySelector('body>.topbar');if(!header)return;
 document.body.classList.add('club-demo-context');
 const demo=new URL('../index.html',location.href).href;
 header.classList.add('club-demo-topbar');
 header.innerHTML=`<button class="club-page-back" aria-label="返回上一级" title="返回上一级" hidden><img src="../assets/navigation/back-arrow.svg" alt="" width="10.5" height="9.99983"></button><div class="nav-island"><a class="brand" href="${demo}#home" aria-label="龙源读书会首页"><img class="brand-logo" src="assets/club-navigation-logo.png" alt="龙源读书会"></a><div class="nav-links-group"><nav class="nav" aria-label="主导航"><a href="${demo}#home">首页</a><a href="${demo}#featured">共读</a><a href="${demo}#guides">领读人</a><a href="#/magazines" data-route="magazines">杂志</a><a href="#/books" data-route="books">读书</a><a href="${demo}#activities">活动</a><a href="${demo}?panel=member#home">会员</a></nav><a class="nav-login" href="${demo}?panel=login#home">登录</a></div></div>`;
 function sync(){const back=header.querySelector('.club-page-back');clubNavigation.setBack(back,!/^#\/(books|magazines)(?:[?]|$)/.test(location.hash));const parent=document.querySelector('.view.active .oc-dock-back');back.dataset.parent=parent?.getAttribute('href')||(/#\/book\//.test(location.hash)?'#/books':'#/magazines');const route=location.hash.split(/[/?]/)[1];header.querySelectorAll('[data-route]').forEach(a=>{const active=a.dataset.route===route;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
 header.querySelector('.club-page-back').addEventListener('click',()=>{clubPageMotion.back(header.querySelector('.club-page-back').dataset.parent);});
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-rd-action="purchase"],[data-rd-action="subscribe"],[data-rd-action="member"]')){event.preventDefault();event.stopImmediatePropagation();clubPageMotion.navigate(new URL('../portal.html#/membership',location.href).href);}
 },true);
 function syncAssistant(){
  const native=document.querySelector('.view.active .pe-chat');let shared=document.querySelector('.club-global-guide');
  if(native){shared?.remove();return;}
  if(shared||!window.renderResourceChat)return;
  shared=document.createElement('div');shared.className='club-global-guide rd-periodical pe-figma-detail';shared.innerHTML=renderResourceChat();document.body.append(shared);
 }
 window.addEventListener('hashchange',()=>{sync();syncAssistant();});sync();syncAssistant();
})();
