/* Three scroll beats: full cover, centered reading card, then a short reading pause. */
(()=>{
 const card=document.querySelector('#featured'),slot=card?.querySelector('.feature-cover .hinged-cover'),source=slot?.querySelector('img');
 if(!card||!slot||!source||card.hidden)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const stage=document.createElement('div');stage.className='feature-scroll-stage';card.before(stage);stage.append(card);
 const overlay=document.createElement('button');overlay.className='feature-scroll-cover';overlay.type='button';overlay.setAttribute('aria-label',card.querySelector('.feature-cover').getAttribute('aria-label')||'查看本期领读');overlay.innerHTML='<img alt="">';overlay.firstElementChild.src=source.currentSrc||source.src;card.append(overlay);if(card.querySelector('.feature-cover').getAttribute('aria-disabled')==='true')overlay.setAttribute('aria-disabled','true');
 const ring=card.querySelector('.progress-ring'),arc=ring.querySelector('.value'),label=card.querySelector('#progress-label'),targetProgress=Number(ring.getAttribute('aria-valuenow'))||0;
 const clamp=n=>Math.max(0,Math.min(1,n)),mix=(a,b,p)=>a+(b-a)*p;
 // Distances in CSS pixels. The pause uses native scrolling; wheel/touch input is never intercepted.
 const timing={startDelay:80,minShrink:300,maxShrink:420,minPause:320};
 let metrics,frame=0,lastWidth=0,ringFrame=0,ringState='waiting',coverPlayed=false;
 function paintRing(value){arc.style.strokeDashoffset=100-value;label.textContent=Math.round(value)+'%';ring.setAttribute('aria-valuenow',String(Math.round(value)))}
 function resetRing(){cancelAnimationFrame(ringFrame);ringFrame=0;ringState='waiting';paintRing(reduce.matches?targetProgress:0)}
 function startRing(){if(ringState!=='waiting')return;if(reduce.matches){paintRing(targetProgress);ringState='complete';return}ringState='playing';let start;
  function tick(now){if(start===undefined)start=now+180;const t=clamp((now-start)/1600);paintRing(targetProgress*(1-Math.pow(1-t,3)));if(t<1)ringFrame=requestAnimationFrame(tick);else{ringState='complete';ringFrame=0}}
  ringFrame=requestAnimationFrame(tick);
 }
 function measure(){overlay.firstElementChild.src=source.currentSrc||source.src;overlay.setAttribute('aria-label',card.querySelector('.feature-cover').getAttribute('aria-label')||'查看本期领读');card.classList.remove('feature-cover-unfolding');card.style.height='';card.style.transform='';const rect=card.getBoundingClientRect(),target=slot.getBoundingClientRect(),stageRect=stage.getBoundingClientRect();const centerTop=Math.max(104,(innerHeight-rect.height)/2);
  metrics={top:stageRect.top+scrollY,width:rect.width,height:rect.height,x:target.left-rect.left,y:target.top-rect.top,w:target.width,h:target.height,radius:parseFloat(getComputedStyle(card).borderTopLeftRadius)||0};
  metrics.fullHeight=Math.max(metrics.height,metrics.width/(source.naturalWidth/source.naturalHeight||14/19));metrics.start=Math.max(timing.startDelay,metrics.top-innerHeight*.78);metrics.pinStart=Math.max(0,metrics.top-centerTop);metrics.pinEnabled=card.dataset.templateArticle!=='true'&&innerWidth>1000&&metrics.height<innerHeight-150&&!reduce.matches;metrics.animateCover=card.dataset.templateArticle!=='true'&&!reduce.matches&&(metrics.pinEnabled||metrics.fullHeight<=metrics.height+1);
  const pauseDistance=Math.max(timing.minPause,innerHeight*.45),minShrink=Math.max(timing.minShrink,Math.min(timing.maxShrink,innerHeight*.42));
  // Reserve once, outside scroll updates. The original full-cover height becomes
  // the scroll runway, so shrinking never moves the following sections or scrollbar.
  metrics.stageHeight=metrics.pinEnabled?Math.max(metrics.fullHeight,metrics.height+metrics.start+minShrink+pauseDistance-metrics.pinStart):metrics.height;
  metrics.release=metrics.pinStart+metrics.stageHeight-metrics.height;metrics.end=metrics.pinEnabled?metrics.release-pauseDistance:metrics.start+minShrink;
  stage.style.height=metrics.stageHeight+'px';stage.style.setProperty('--feature-pin-top',centerTop+'px');stage.dataset.pinned=String(metrics.pinEnabled);update()
 }
 function update(){frame=0;if(!metrics)return;const scrollProgress=metrics.animateCover?clamp((scrollY-metrics.start)/(metrics.end-metrics.start)):1;if(metrics.animateCover&&scrollProgress>=1){coverPlayed=true;stage.dataset.coverPlayed='true'}const raw=coverPlayed?1:scrollProgress,p=raw*raw*(3-2*raw),height=mix(metrics.fullHeight,metrics.height,p);
  card.style.height=(metrics.animateCover?height:metrics.height)+'px';card.style.setProperty('--feature-cover-progress',p.toFixed(4));stage.dataset.phase=raw<1?'cover':metrics.pinEnabled&&scrollY<=metrics.release?'reading':'continue';
  const active=raw<1;card.classList.toggle('feature-cover-unfolding',active);overlay.hidden=!active;overlay.tabIndex=active&&overlay.getAttribute('aria-disabled')!=='true'?0:-1;card.querySelectorAll('.feature-copy,.feature-progress').forEach(el=>el.inert=active&&p<.84);
  if(active){Object.assign(overlay.style,{left:mix(0,metrics.x,p)+'px',top:mix(0,metrics.y,p)+'px',width:mix(metrics.width,metrics.w,p)+'px',height:mix(metrics.fullHeight,metrics.h,p)+'px',borderRadius:mix(metrics.radius,4,p)+'px'});card.style.setProperty('--feature-details-opacity',clamp((p-.25)/.65).toFixed(4));if(raw<.98&&ringState!=='waiting')resetRing()}
  else{const bounds=card.getBoundingClientRect(),panel=card.querySelector('.feature-progress').getBoundingClientRect();const visible=metrics.pinEnabled?bounds.top>=80&&bounds.bottom<=innerHeight-24:panel.top>=80&&panel.bottom<=innerHeight-24;if(visible||reduce.matches)startRing()}
 }

 window.clubFeatureCoverScroll={refresh:measure};
 function requestUpdate(){if(!frame)frame=requestAnimationFrame(update)}
 addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',measure);reduce.addEventListener('change',()=>{resetRing();measure()});new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-lastWidth)>.5){lastWidth=width;measure()}}).observe(stage);source.addEventListener('load',measure);document.fonts?.ready.then(measure);resetRing();measure();
 overlay.addEventListener('click',event=>{event.stopPropagation();card.querySelector('.feature-cover').click()});
 addEventListener('pageshow',event=>{if(event.persisted){if(ringState==='playing'){paintRing(targetProgress);ringState='complete'}measure()}});
 addEventListener('pagehide',()=>{cancelAnimationFrame(frame);cancelAnimationFrame(ringFrame)});
})();
