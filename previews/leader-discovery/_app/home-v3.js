/* Figma 489:2631. One recommendation slot; ?recommendation=book|magazine|article previews its variants. */
(()=>{
 const main=document.querySelector('main#home');if(!main)return;const pageQuery=new URLSearchParams(location.search);if(pageQuery.has('setup')||pageQuery.get('club')==='mine')return;
 document.body.classList.add('home-v3');
 const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const asset=n=>'assets/home-v3/'+n;
 const articleUrl=i=>'portal.html#/article/shared-'+i;
 const bookUrl='portal.html#/book/home-v3-house';
 const magazineUrl='pages/index.html?nav=club#/magazine/'+encodeURIComponent('安邸AD')+'?claimed=0';
 const title='好住的家，\n应该少让人费一点劲。';
 const recommendationFields=clubBookRecommendationFields.forBook({id:'home-v3-house'});
 const description=recommendationFields.body;
 const guide=recommendationFields.guide;
 const why=recommendationFields.why;
 const article={title:'百年披萨店如何征服四大洲',body:'在那不勒斯老城迷宫般的街巷中，切萨雷塞拉莱街1号是个神奇的地方，这里藏着全球食客争相排队的传奇——达米切莱，一家始于1870年的百年披萨店，以玛格丽特和马里纳拉两款经典披萨征服世界，曾被《纽约时报》誉为“披萨的圣殿”。\n18世纪的那不勒斯，是欧洲最贫瘠的角落之一。1760年大饥荒席卷整个王国，面包成为奢侈品。贫民们将剩余面团揉成薄饼，撒上番茄、奶酪、橄榄油。'};
 const sharedIndex=window.clubHomeV3ArticleIndex;

 const variant=['book','magazine','article'].includes(new URLSearchParams(location.search).get('recommendation'))?new URLSearchParams(location.search).get('recommendation'):'book';
 const full=[];
 function field(text,key,tag='p'){full.push({key,text});return `<${tag} class="v3-field" data-v3-field="${key}">${e(text)}</${tag}>`;}
 function cover(type,src,href,extra=''){return `<a class="v3-cover-link ${type==='magazine'?'magazine':'v3-book'} ${extra}" href="${e(href)}" data-club-linked="1"><span class="${type==='magazine'?'hinged-cover':'book-cover'}">${type==='magazine'?'<span class="cover-pages" aria-hidden="true"></span>':''}<img src="${asset(src)}" alt="${type==='magazine'?'安邸AD':'住宅设计解剖书'}封面"></span></a>`;}
 const type=variant==='magazine'?'magazine':'book',url=type==='book'?bookUrl:magazineUrl;
 const resource=`<div class="v3-resource"><div class="v3-resource-copy"><div class="v3-resource-top"><div>${field(type==='book'?'住宅设计解剖书':'AD安邸','resourceTitle','h3')}${field(type==='book'?'［日］增田奏 著 · 赵可 译':'2024年11期','resourceMeta')}</div><blockquote><strong>导读</strong>${field(guide,'guide')}</blockquote></div><div class="v3-reason"><h3>为什么选它？</h3>${field(why,'why')}</div></div>${cover(type,type==='book'?'83ddc.png':'6f4d8.png',url)}</div>`;
 const recommendation=document.createElement('section');recommendation.id='recommendation';recommendation.className='v3-recommendation v3-recommendation-'+variant;recommendation.dataset.recommendation=variant;recommendation.setAttribute('aria-label','编辑推荐');
 recommendation.innerHTML=variant==='article'?`<div class="v3-recommendation-copy">${field(article.title,'recommendationTitle','h2')}${field(article.body,'articleBody')}<blockquote class="v3-article-reason"><strong>为什么选它？</strong>${field(guide,'articleWhy')}</blockquote><a class="button dark" data-club-linked="1" href="${articleUrl(sharedIndex)}">立即阅读</a></div><a class="v3-recommendation-image" href="${articleUrl(sharedIndex)}" data-club-linked="1"><img src="${asset('500be.png')}" alt="文章配图"></a>`:`<div class="v3-recommendation-copy">${field(title,'recommendationTitle','h2')}${field(description,'recommendationBody')}<a class="button dark" data-club-linked="1" href="${e(url)}">立即阅读</a></div>${resource}`;
 main.querySelector('.intro').after(recommendation);main.querySelector('#activities h2').textContent='热门活动';
 const daily=main.querySelector('#daily');recommendation.after(daily);
 const featured=main.querySelector('#featured'),featureSection=document.createElement('section');featureSection.className='section v3-coreading';featureSection.innerHTML='<header class="section-title"><span>SELECTED</span><h2>共读活动</h2></header>';daily.after(featureSection);featureSection.append(featured);
 main.querySelector('#featured .feature-cover').dataset.coverFrameKind='magazine';main.querySelector('#featured .feature-cover img').src=asset('6c73b.png');main.querySelector('#featured .issue').textContent='2026年12期';
 // Keep the main destination distinct from the current plan's join action.
 const more=featured.querySelector('.feature-more'),oldMore=more.querySelector('button');
 const all=document.createElement('a');all.className=oldMore.className;all.textContent='查看全部';all.href='portal.html#/reading';all.dataset.clubLinked='1';oldMore.replaceWith(all);
 const morePosition=document.createComment('co-reading primary action'),join=featured.querySelector('.join'),joinPosition=document.createComment('co-reading join action');
 more.before(morePosition);join.before(joinPosition);
 const actions=document.createElement('div');actions.className='v3-coreading-actions';actions.hidden=true;featured.append(actions);
 const compactFeature=matchMedia('(max-width:760px)');
 function arrangeFeature(){if(compactFeature.matches){actions.hidden=false;actions.append(more);joinPosition.after(join);}else{morePosition.after(more);joinPosition.after(join);actions.hidden=true;}}
 compactFeature.addEventListener('change',arrangeFeature);arrangeFeature();
 const dailyData=[{type:'article',cover:'eded0.png',title:'你买的是一张餐桌，\n还是一处能吃饭的地方？',meta:'2026.10.31',href:articleUrl(sharedIndex+1)},{type:'article',cover:'eded0.png',title:'你买的是一张餐桌，\n还是一处能吃饭的地方？',meta:'王富贵·安邸AD·2025年03期',href:articleUrl(sharedIndex+1)},{type:'book',cover:'803f5.png',title:'住宅设计解剖书',meta:'［日］增田奏 著 · 赵可 译',href:bookUrl},{type:'magazine',cover:'6f4d8.png',title:'安邸AD',meta:'2025年03期',href:magazineUrl},{type:'podcast',cover:'64eb4.png',title:'十一红：传承家乡戏勇敢挑战自我',meta:'试听演示音频'}];

 const existingDaily=clubSharedContent.daily[0];dailyData[1]={type:'article',cover:existingDaily.cover,title:existingDaily.title,meta:existingDaily.author,href:'portal.html#/article/daily-0'};
 const sixth=clubCatalogData.books[0];dailyData.push({type:'book',cover:sixth.cover,title:sixth.title,meta:sixth.author,href:'portal.html#/book/'+encodeURIComponent(sixth.id)});
 main.querySelector('#daily-track').innerHTML=dailyData.map(a=>`<${a.type==='podcast'?'button type="button" data-v3-podcast':'a href="'+e(a.href)+'" data-club-linked="1"'} class="daily-card v3-daily" data-kind="${a.type}"><img src="${a.cover.startsWith('assets/')?e(a.cover):asset(a.cover)}" alt="">${a.type==='podcast'?`<span class="v3-podcast-square"><img src="${asset('102ce.png')}" alt="播客封面"><span class="v3-play"><i class="iconfont club-local-icon icon-Play" aria-hidden="true"></i></span></span>`:''}<div>${field(a.title,'dailyTitle','h3')}${field(a.meta,'dailyMeta')}</div></${a.type==='podcast'?'button':'a'}>`).join('');
 // Figma PROGRESSIVE background blur: 0 at caption top, strongest at bottom.
 main.querySelectorAll('.v3-daily>div').forEach(caption=>{
  const blur=document.createElement('span');blur.className='v3-daily-progressive-blur';blur.setAttribute('aria-hidden','true');
  for(let i=1;i<=8;i++){const layer=document.createElement('span');const center=i*12.5,start=Math.max(0,center-12.5),end=Math.min(100,center+12.5);layer.style.setProperty('--daily-blur',i*6.25+'px');layer.style.setProperty('--daily-mask',i===8?'linear-gradient(to bottom,transparent 87.5%,#000 100%)':`linear-gradient(to bottom,transparent ${start}%,#000 ${center}%,transparent ${end}%)`);blur.append(layer);}
  caption.prepend(blur);
 });
 const tracks=()=>`<div class="v3-audio" aria-label="试听演示音频播放器"><button type="button" data-v3-podcast aria-label="播放试听音频" aria-pressed="false"><i class="iconfont club-local-icon icon-Play" aria-hidden="true"></i><i class="iconfont icon-Pause v3-pause-icon" aria-hidden="true"></i></button><span data-audio-current>00:00</span><input type="range" min="0" max="100" value="0" step="0.1" disabled aria-label="播放进度"><span data-audio-duration>--:--</span><select data-v3-speed aria-label="播放速度">${[0.75,1,1.25,1.5,2].map(rate=>`<option value="${rate}" ${rate===1?'selected':''}>x${rate===1?'1.0':rate}</option>`).join('')}</select></div>`;
 main.querySelector('#podcasts .podcast-grid').innerHTML=[0,1].map(()=>`<article class="v3-podcast"><img class="v3-podcast-background" src="${asset('64eb4.png')}" alt=""><a class="v3-podcast-square" href="podcast.html" aria-label="查看十一红播客详情"><img src="${asset('102ce.png')}" alt=""></a><div class="v3-podcast-copy"><a href="podcast.html">${field('十一红：传承家乡戏勇敢挑战自我','podcastTitle','h3')}</a>${field('9月15日 · 试听演示音频','podcastMeta')}</div>${tracks(22)}</article>`).join('');
 const entries=[{type:'magazine',title:'安邸AD',meta:'2025年03期',src:'6f4d8.png',href:magazineUrl,summary:description},{type:'podcast',title:'十一红：传承家乡戏勇敢挑战自我',meta:'9月15日',src:'102ce.png',href:'podcast.html'},{type:'book',title:'住宅设计解剖书',meta:'［日］增田奏 著 · 赵可 译',src:'83ddc.png',href:bookUrl,summary:description},{type:'article',title:'好住的家，应该少让人费一点劲。',meta:'2026.10.31',src:'500be.png',href:articleUrl(sharedIndex+2),summary:description}];
 main.querySelector('#article-list').innerHTML=entries.map((a,i)=>`<article class="v3-mixed-item" data-kind="${a.type}"><a class="v3-mixed-cover ${a.type==='magazine'?'magazine':a.type==='book'?'v3-book':''}" href="${e(a.href)}" data-club-linked="1"><span class="${a.type==='magazine'?'hinged-cover':a.type==='book'?'book-cover':'article-image-frame'}">${a.type==='magazine'?'<span class="cover-pages" aria-hidden="true"></span>':''}<img src="${asset(a.src)}" alt="${e(a.title)}"></span></a><div class="v3-mixed-content"><div class="v3-mixed-meta"><strong>${String(i+1).padStart(2,'0')}</strong>${field(a.meta,'mixedMeta')}</div><div class="v3-mixed-summary"><a href="${e(a.href)}" data-club-linked="1">${field(a.title,'mixedTitle','h3')}</a>${a.type==='podcast'?tracks():field(a.summary,a.type==='article'?'mixedArticleBody':'mixedBody')}<a class="v3-arrow" href="${e(a.href)}" data-club-linked="1" aria-label="查看${e(a.title)}"><span><i class="iconfont club-local-icon icon-Arrow_Forward-2" aria-hidden="true"></i></span></a></div></div></article>`).join('');
 // Mobile 522:7451 gives the podcast player its own full-width row.
 const mixedPodcast=main.querySelector('.v3-mixed-item[data-kind=podcast]'),mixedAudio=mixedPodcast.querySelector('.v3-audio'),mixedAudioPosition=document.createComment('desktop mixed player'),mixedMobile=matchMedia('(max-width:760px)');mixedAudio.before(mixedAudioPosition);
 function arrangeMixedAudio(){const focused=document.activeElement;if(mixedMobile.matches)mixedPodcast.append(mixedAudio);else mixedAudioPosition.after(mixedAudio);if(mixedAudio.contains(focused))focused.focus({preventScroll:true});}
 mixedMobile.addEventListener('change',arrangeMixedAudio);arrangeMixedAudio();
 // Reuse the real catalogue that backs library/detail pages; metadata stays paired with covers.
 main.querySelector('#books-grid').innerHTML=clubCatalogData.books.slice(0,4).map(b=>`<a class="book-card" href="portal.html#/book/${e(b.id)}"><div class="book-art"><span class="book-cover"><img src="${e(b.cover)}" alt="《${e(b.title)}》封面" loading="lazy"></span></div><h3>${e(b.title)}</h3><footer><span>${e(b.author)}</span><span class="v3-book-arrow"><i class="iconfont club-local-icon icon-Arrow_Forward-2" aria-hidden="true"></i></span></footer></a>`).join('');
 main.querySelector('#magazines-grid').innerHTML=clubCatalogData.magazines.slice(0,5).map(m=>`<a class="magazine" href="pages/index.html?nav=club#/magazine/${encodeURIComponent(m.title)}?claimed=0"><span class="hinged-cover"><span class="cover-pages" aria-hidden="true"></span><img src="${e(m.cover)}" alt="《${e(m.title)}》封面" loading="lazy"></span><h3>${e(m.title)}</h3></a>`).join('');
 // Every preview keeps its full source; line clamps govern layout, detail views expose full text.
 const rules={recommendationTitle:[32,2],recommendationBody:[140,4],articleBody:[260,6],resourceTitle:[24,2],resourceMeta:[40,1],guide:[44,2],why:[64,3],articleWhy:[60,2],dailyTitle:[40,2],dailyMeta:[40,1],podcastTitle:[48,2],podcastMeta:[32,2],mixedTitle:[48,2],mixedMeta:[40,2],mixedBody:[120,2],mixedArticleBody:[240,4]};
 main.querySelectorAll('[data-v3-field]').forEach(n=>{const [max,lines]=rules[n.dataset.v3Field];n.dataset.maxCharacters=max;n.style.setProperty('--v3-lines',lines);n.title=n.textContent;const characters=Array.from(n.textContent);if(characters.length>max)n.textContent=characters.slice(0,max-1).join('')+'…';});
 const preview=document.querySelector('#preview'),content=document.querySelector('#dialog-content');
 const expand=document.createElement('button');expand.type='button';expand.className='v3-expand-recommendation';expand.textContent='查看完整推荐';expand.setAttribute('aria-haspopup','dialog');expand.hidden=true;recommendation.append(expand);
 // On phones the action row follows the resource information; desktop keeps its original positions.
 const readAction=recommendation.querySelector('.v3-recommendation-copy>.button');readAction.classList.add('v3-recommendation-read');
 const readPosition=document.createComment('recommendation action');readAction.before(readPosition);
 const footer=document.createElement('div');footer.className='v3-recommendation-footer';footer.hidden=true;recommendation.append(footer);
 const compactRecommendation=matchMedia('(max-width:760px)');
 function arrangeRecommendation(){const focused=document.activeElement;if(compactRecommendation.matches){footer.hidden=false;footer.append(readAction,expand);}else{readPosition.after(readAction);recommendation.insertBefore(expand,footer);footer.hidden=true;}if(focused===readAction||focused===expand)focused.focus({preventScroll:true});}
 compactRecommendation.addEventListener('change',arrangeRecommendation);arrangeRecommendation();

 function checkOverflow(){expand.hidden=![...recommendation.querySelectorAll('[data-v3-field]')].some(n=>n.scrollHeight>n.clientHeight+1||Array.from(n.title).length>Number(n.dataset.maxCharacters));}
 new ResizeObserver(checkOverflow).observe(recommendation);document.fonts.ready.then(checkOverflow);
 let returnFocus;
 function showPreview(html,trigger){returnFocus=trigger;content.innerHTML=html;preview.showModal();}
 preview.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;});
 expand.addEventListener('click',()=>{const body=[...recommendation.querySelectorAll('[data-v3-field]')].map(n=>'<p><strong>'+({recommendationTitle:'标题',recommendationBody:'推荐正文',articleBody:'文章详情',resourceTitle:'资源名称',resourceMeta:'资源信息',guide:'导读',why:'为什么选它',articleWhy:'为什么选它'}[n.dataset.v3Field]||'')+'</strong><br>'+e(n.title).replace(/\n/g,'<br>')+'</p>').join('');showPreview('<h2>完整推荐</h2>'+body,expand);});

 // One shared local demo audio keeps every entry in sync and prevents overlap.
 const audio=new Audio('assets/water-margin/podcast-1.mp3');audio.preload='metadata';
 const players=[...main.querySelectorAll('.v3-audio')],playButtons=[...main.querySelectorAll('[data-v3-podcast]')];
 const audioStatus=document.createElement('p');audioStatus.className='v3-audio-status';audioStatus.setAttribute('role','status');audioStatus.hidden=true;main.querySelector('#podcasts').append(audioStatus);
 const formatTime=value=>{const seconds=Math.max(0,Math.floor(Number.isFinite(value)?value:0));return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');};
 function syncAudio(){
  const duration=Number.isFinite(audio.duration)?audio.duration:0,playing=!audio.paused&&!audio.ended,percent=duration?audio.currentTime/duration*100:0;
  playButtons.forEach(button=>{button.classList.toggle('is-playing',playing);button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'暂停试听音频':'播放试听音频');});
  players.forEach(player=>{player.querySelector('[data-audio-current]').textContent=formatTime(audio.currentTime);player.querySelector('[data-audio-duration]').textContent=duration?formatTime(duration):'--:--';const range=player.querySelector('input');range.disabled=!duration;range.value=percent;range.setAttribute('aria-valuetext',formatTime(audio.currentTime)+' / '+formatTime(duration));range.style.setProperty('--audio-progress',percent+'%');player.querySelector('[data-v3-speed]').value=String(audio.playbackRate);});
 }
 for(const name of ['loadedmetadata','durationchange','timeupdate','play','pause','ended','ratechange','seeked'])audio.addEventListener(name,syncAudio);
 audio.addEventListener('error',()=>{audioStatus.hidden=false;audioStatus.textContent='试听音频加载失败，请刷新页面后重试。';syncAudio();});
 main.addEventListener('click',async event=>{const play=event.target.closest('[data-v3-podcast]');if(!play)return;if(!audio.paused){audio.pause();return;}if(audio.ended||(Number.isFinite(audio.duration)&&audio.duration-audio.currentTime<0.2))audio.currentTime=0;try{await audio.play();audioStatus.hidden=true;}catch(error){audioStatus.hidden=false;audioStatus.textContent='暂时无法播放，请再次点击播放重试。';}});
 players.forEach(player=>{player.querySelector('input').addEventListener('input',event=>{if(Number.isFinite(audio.duration)){audio.currentTime=Number(event.target.value)/100*audio.duration;syncAudio();}});player.querySelector('[data-v3-speed]').addEventListener('change',event=>{audio.playbackRate=Number(event.target.value);syncAudio();});});
 addEventListener('pagehide',()=>audio.pause());syncAudio();

 const wall=main.querySelector('.daily-window'),dailyMobile=matchMedia('(max-width:760px)');function syncDailyGutter(){const edge=main.querySelector('#daily').getBoundingClientRect().left;wall.style.setProperty('--daily-content-gutter',Math.max(0,edge)+'px');}function positionDaily(){syncDailyGutter();wall.scrollLeft=0;}requestAnimationFrame(positionDaily);new ResizeObserver(syncDailyGutter).observe(main);dailyMobile.addEventListener('change',()=>requestAnimationFrame(positionDaily));
})();
