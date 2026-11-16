/* Shared three-column footer, following the public reading-club footer structure. */
(()=>{
 const base=new URL('.',document.currentScript.src),url=path=>new URL(path,base).href;
 const links=[['首页','index.html'],['共读','portal.html#/reading'],['领读人','portal.html#/people'],['杂志','pages/index.html?nav=club#/magazines'],['读书','pages/index.html?nav=club#/books'],['活动','portal.html#/events'],['会员','portal.html#/membership']];
 const footer=document.createElement('footer');footer.className='club-site-footer';footer.setAttribute('aria-label','站点页脚');
 footer.innerHTML=`<div class="club-footer-columns"><div class="club-footer-brand"><a href="${url('index.html')}" aria-label="龙源读书会首页"><img src="${url('assets/logo.png')}" width="125" height="32" alt="龙源读书会"></a><p>与领读人共读好书，发现值得读的杂志、文章和声音，让阅读成为日常。</p></div><nav aria-label="页脚内容导航"><h2>内容</h2><ul>${links.map(([label,path])=>`<li><a href="${url(path)}">${label}</a></li>`).join('')}</ul></nav><div class="club-footer-about"><h2>说明</h2><p>让阅读，成为一种相遇。<br>在文字里发现新的视角，也连接每一个热爱阅读的人。</p><div class="club-footer-service"><a href="${url('portal.html#/me')}">我的阅读空间</a><a href="${url('portal.html#/membership')}">会员权益</a></div></div></div><div class="club-footer-bottom">龙源读书会 · LONGYUAN READING CLUB</div>`;
 const old=document.querySelector('body > .portal-footer,body > .site-footer');if(old)old.replaceWith(footer);else document.querySelector('body > main')?.insertAdjacentElement('afterend',footer);
})();
