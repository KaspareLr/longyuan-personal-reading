/* Primary pages use bottom navigation without a top greeting strip. */
(()=>{
 const base=new URL('.',document.currentScript.src);if(location.pathname!==base.pathname+'me.html')return;
 const header=document.createElement('header');header.className='mobile-reading-header mobile-me-header';header.setAttribute('aria-label','个人页导航');header.innerHTML=`<a class="mobile-header-circle me-back" href="${new URL('index.html',base).href}" aria-label="返回"><span class="mobile-header-inner"><i class="iconfont icon-Arrow_Forward-2" aria-hidden="true"></i></span></a><p class="mobile-me-title">我的</p><span class="me-header-spacer" aria-hidden="true"></span>`;document.querySelector('body>main')?.before(header);header.querySelector('.me-back').onclick=event=>{try{const previous=new URL(document.referrer);if(previous.origin===location.origin&&previous.pathname!==location.pathname){event.preventDefault();history.back()}}catch{}};
})();
