// A pinned editorial interlude: automatic spring in/out, scroll intent advances it.
(()=>{
 const mounted=new WeakSet();
 function initialize(){document.querySelectorAll('.oc-feature').forEach(feature=>{
  if(mounted.has(feature))return;mounted.add(feature);
  const root=feature.closest('.oc-publication'),stage=document.createElement('div');stage.className='oc-feature-stage';feature.before(stage);stage.append(feature);
  const background=feature.style.backgroundImage;
  const cards=feature.querySelector('.oc-topic-articles'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let progress=0,velocity=0,target=0,frame=0,last=0,active=false,spent=false,intent=0,settledAt=0,lastScroll=scrollY,origin=null,touchY=null;
  const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
  function render(){
   const p=clamp(progress,0,1),endW=document.documentElement.clientWidth,endH=innerHeight;
   const current=stage.getBoundingClientRect();
   const x=current.left*(1-p),y=current.top*(1-p),w=origin.width+(endW-origin.width)*p,h=origin.height+(endH-origin.height)*p;
   // Reserve the moving surface's full footprint, including while it scrolls upward.
   stage.style.height=(h+Math.max(0,-current.top*p))+'px';
   Object.assign(feature.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px',borderRadius:(40*(1-p))+'px'});
   feature.style.setProperty('--oc-topic-progress',p);
   cards.style.maxHeight=(cards.scrollHeight*clamp((p-.35)/.65,0,1))+'px';
   cards.style.opacity=String(clamp((p-.65)/.35,0,1));cards.style.transform=`translateY(${(1-p)*16}px)`;
  }
  function animate(to){target=to;if(frame)return;last=performance.now();function tick(now){if(!feature.isConnected){cleanup();return;}
   const dt=Math.min((now-last)/1000,.032);last=now;const omega=19;
   velocity+=(-omega*omega*(progress-target)-2*omega*velocity)*dt;progress+=velocity*dt;render();
   if(Math.abs(progress-target)<.001&&Math.abs(velocity)<.01){progress=target;velocity=0;frame=0;render();if(target===0)restore();else settledAt=performance.now();return;}
   frame=requestAnimationFrame(tick);
  }frame=requestAnimationFrame(tick);}
  function open(){if(active||spent||reduced.matches)return;origin=stage.getBoundingClientRect();active=true;intent=0;root.classList.add('has-topic-focus');feature.classList.add('oc-topic-fixed');cards.inert=false;render();animate(1);}
  function restore(){active=false;spent=true;feature.classList.remove('oc-topic-fixed');root.classList.remove('has-topic-focus');feature.removeAttribute('style');
   // Preserve the original inline background image; only motion geometry is transient.
   feature.style.backgroundImage=background;stage.style.removeProperty('height');cards.style.opacity='';cards.style.transform='';cards.style.maxHeight='';cards.inert=!reduced.matches;}
  function onScroll(){
   const y=scrollY,previous=lastScroll,down=y>previous;lastScroll=y;if(active)return;
   const rect=stage.getBoundingClientRect();
   if(spent&&rect.top>innerHeight*.72)spent=false;
   const header=document.querySelector('body > .topbar'),dock=root.querySelector('.oc-dock');
   const top=Math.max(0,header?.getBoundingClientRect().bottom||0)+10;
   const bottom=Math.min(innerHeight,dock?.getBoundingClientRect().top||innerHeight)-10;
   // Expand only after both edges are visible, clear of fixed navigation.
   const fullyVisible=rect.top>=top-1&&rect.bottom<=bottom+1;
   if(down&&!spent&&fullyVisible)open();
   else if(down&&!spent&&rect.height<=bottom-top&&rect.bottom<=bottom&&rect.bottom+(y-previous)>bottom&&rect.top<top&&rect.bottom>top){
    // A coarse wheel step may jump over the visibility interval; align before opening.
    window.scrollTo({top:y+rect.top-top,behavior:'instant'});
    requestAnimationFrame(()=>{if(!feature.isConnected||active||spent)return;const r=stage.getBoundingClientRect();if(r.top>=top-1&&r.bottom<=bottom+1)open();});
   }
  }
  function consume(delta){
   if(!active)return false;
   // The native page scroll takes over as soon as the surface starts returning.
   if(target===0)return false;
   if(frame){if(delta<0){intent+=delta;if(intent< -120){animate(0);return false;}}return true;}
   if(performance.now()-settledAt<160)return true;
   intent+=delta;
   if(intent>Math.max(480,innerHeight*.75)||intent< -120){animate(0);return false;}
   return true;
  }
  function wheel(event){if(event.ctrlKey||event.target.closest('.topbar,.pe-chat'))return;if(consume(event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1)))event.preventDefault();}
  function touchStart(event){touchY=event.touches[0]?.clientY;}
  function touchMove(event){const y=event.touches[0]?.clientY;if(y===undefined||touchY===null)return;if(consume(touchY-y))event.preventDefault();touchY=y;}
  function key(event){if(event.target.closest('input,textarea,[contenteditable=true]'))return;const delta={ArrowDown:60,PageDown:innerHeight*.6,' ':innerHeight*.6,ArrowUp:-60,PageUp:-innerHeight*.6,Escape:-1000}[event.key];if(delta!==undefined&&consume(delta))event.preventDefault();}
  function resize(){if(active){origin=stage.getBoundingClientRect();render();}}
  function preference(){if(reduced.matches&&active){cancelAnimationFrame(frame);frame=0;restore();}cards.inert=!reduced.matches&&!active;}
  function cleanup(){cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);reduced.removeEventListener('change',preference);removed.disconnect();}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('touchstart',touchStart,{passive:true});window.addEventListener('touchmove',touchMove,{passive:false});window.addEventListener('keydown',key);window.addEventListener('resize',resize);reduced.addEventListener('change',preference);
  const removed=new MutationObserver(()=>{if(!feature.isConnected)cleanup();});removed.observe(document.body,{childList:true,subtree:true});cards.inert=!reduced.matches;
 });}
 new MutationObserver(initialize).observe(document.body,{childList:true,subtree:true});initialize();
})();
