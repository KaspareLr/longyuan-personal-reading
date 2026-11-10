/* Shared header scrim, with real progressive blur rather than a color gradient. */
(()=>{
 const header=document.querySelector('.site-header,body>.club-demo-topbar,body>.topbar');if(!header)return;
 function mount(){
  if(header.querySelector(':scope>.navigation-progressive-blur'))return;
  const scrim=document.createElement('div');scrim.className='navigation-progressive-blur';scrim.setAttribute('aria-hidden','true');
  [0.25,0.5,1,2,3,5,8,12].forEach((radius,i)=>{const layer=document.createElement('span'),end=100-i*6;layer.style.setProperty('--nav-blur',radius+'px');layer.style.setProperty('--nav-blur-mask',`linear-gradient(to bottom,#000 0%,#000 ${end-20}%,transparent ${end}%)`);scrim.append(layer)});
  header.prepend(scrim);
 }
 mount();new MutationObserver(mount).observe(header,{childList:true});
})();
