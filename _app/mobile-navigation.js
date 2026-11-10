/* Product now uses its mobile top switcher. Retain V3 detail/back layout states. */
(()=>{
 const header=document.querySelector('.site-header,body>.club-demo-topbar');if(!header)return;
 const mobile=matchMedia('(max-width:760px)');document.body.classList.add('mobile-navigation-ready');
 document.querySelectorAll('.club-mobile-nav,.personal-tabs,.club-mobile-more').forEach(n=>n.remove());
 function sync(){const hasBack=[...header.querySelectorAll('.portal-back,.club-page-back,.wm-back')].some(n=>!n.hidden);document.body.classList.toggle('mobile-navigation-back',hasBack);document.body.style.setProperty('--mobile-nav-height','0px')}
 new MutationObserver(sync).observe(header,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});mobile.addEventListener('change',sync);addEventListener('hashchange',sync);addEventListener('pageshow',sync);sync();
})();
