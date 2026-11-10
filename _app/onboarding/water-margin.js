import * as THREE from './vendor/three.module.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const transcripts=[
  '林冲为什么一忍再忍？读风雪山神庙，先别急着等那一枪。林冲最初想守住的，是一个寻常人的日子。他是禁军教头，有家，也有对体面生活的依恋。刺配之后，他仍然希望安稳度日。直到草料场的大火，以及山神庙外听见的密谋，让他知道退让已经不能保命。人物的变化不是忽然发生的。读这段故事，可以标出三次选择：他何时忍让，何时犹疑，又在什么时候终于反抗。梁山不是他的出发点，而是退路消失之后的去处。再读一次，你看到的也许不只是一个好汉，而是一个人在绝境中改变自己的过程。',
  '勇敢和逞强，有时只隔着一步。武松景阳冈打虎，是水浒传最著名的情节之一。但如果我们只记得拳头，就会错过故事的层次。酒后的武松不信劝阻，也不愿折回。等真正遇到猛虎，逃避危险的本能和奋力求生的勇气，都在同一个人身上出现。打虎让他成名，却不能概括他的一生。阅读时，试着分开三个时刻：上冈前的自负，遭遇老虎时的反应，和事后被众人称赞的英雄形象。我们不是要取消英雄，而是要看见英雄也有人的弱点与挣扎。你会怎样描述这个更完整的武松？',
  '一个义字，有多重？在梁山，它既是相互扶助，也是不同愿望之间的张力。宋江盼望招安，李逵却常常对朝廷直言不满。鲁智深路见不平的帮助，与宋江维系群体的方式，也并不完全相同。一百零八个人聚在一起，不代表他们想要同一种未来。因此，读聚义的热闹时，也要听见分歧。试着为人物画一张关系图：谁救过谁，谁信任谁，谁又反对谁的决定？然后回到具体情节寻找依据。水浒传让人反复重读，正因为忠与义从来不是两个轻易就能写清的字。'
];
const episodes=[['林冲为什么一忍再忍？','从“安稳度日”到“雪夜上梁山”，看见一个人的心理转折。'],['勇敢和逞强，只隔着一步？','越过打虎的传奇，重新看见一个人的自负、恐惧与勇气。'],['一个「义」字，究竟有多重？','同登梁山的兄弟，未必走向同一种未来。']];
const cards=[
  ['林冲的反抗，是一时冲动吗？','留意他此前一再忍让的选择。山神庙外的密谋，让他意识到退让已不能换来活路；反抗有一个逐步累积的过程。','回到第十回 · 风雪山神庙'],
  ['武松打虎，只有“勇敢”这一种读法吗？','把上冈前的逞强、遇虎时的求生、成名后的评价分开看。人物可以同时拥有勇气与弱点。','回到第二十三回 · 景阳冈打虎'],
  ['鲁智深的“义”，体现在哪里？','从拳打镇关西到野猪林救林冲，他的帮助常指向具体的受难者。比较他的行动，而不只看“粗豪”的外表。','线索 · 镇关西 / 野猪林'],
  ['宋江和李逵，想要同一种未来吗？','同在梁山并不等于观点一致。宋江期望招安，李逵的反应往往更直接；分歧让“兄弟”关系更复杂。','线索 · 聚义与招安'],
  ['一百零八将，为什么不只是一个数字？','三十六天罡、七十二地煞构成群像框架。名字和座次背后，是不同阶层的遭际，也是群体内部的秩序。','回到第七十一回 · 英雄排座次'],
  ['“忠”与“义”，能一直站在同一边吗？','以招安为转折，观察群体理想、个人意愿和朝廷秩序如何发生冲突。用具体情节支持你的判断，不必急着给出标准答案。','线索 · 百回本后半部']
];
const people=[
  {name:'宋江',tag:'THE LEADER · 及时雨',description:'善于结交、组织与维系人心。他让分散的好汉聚成一个群体，也把梁山带向招安的道路。',relations:['与李逵：追随，也有分歧','与吴用：决策与谋划'],question:'当个人理想成为群体的方向，谁的声音容易被忽略？',target:'liangshan',x:400,y:90},
  {name:'林冲',tag:'THE EXILE · 豹子头',description:'从禁军教头到风雪中的亡命者。他不是一开始就想上梁山；恰恰是对寻常生活的留恋，让他的转变更有重量。',relations:['与鲁智深：野猪林相救','与高俅：权势与迫害'],question:'一再退让的人，究竟在守护什么？',target:'snow',x:582,y:195},
  {name:'鲁智深',tag:'THE PROTECTOR · 花和尚',description:'拳打镇关西，野猪林救林冲。粗豪只是外表，他能看见弱者的困境，并愿意为此付出代价。',relations:['与林冲：相救与相知','与武松：同行与照应'],question:'一个人的慈悲，会以怎样不温柔的方式出现？',target:'cards',x:582,y:405},
  {name:'武松',tag:'THE WANDERER · 行者',description:'景阳冈的一场搏斗，让他的名字成为勇武的象征。但荣誉、创痛与选择，才一起构成这个完整的人。',relations:['与宋江：相识与结义','与鲁智深：二龙山聚义'],question:'我们是在读一个英雄，还是在读一个被称为英雄的人？',target:'tiger',x:400,y:510},
  {name:'李逵',tag:'THE REBEL · 黑旋风',description:'直率、激烈，也时常鲁莽。他对宋江的追随和对招安的抗拒，让“忠于一个人”与“认同一种道路”显出距离。',relations:['与宋江：追随与冲突','与梁山：归属与秩序'],question:'忠于一个人，是否就要赞同他的每一个决定？',target:'question',x:218,y:405},
  {name:'吴用',tag:'THE STRATEGIST · 智多星',description:'从智取生辰纲到梁山运筹，谋划把个人的力量组织起来。计谋不仅推动情节，也提出了目的与手段的追问。',relations:['与晁盖：生辰纲之谋','与宋江：梁山的谋主'],question:'为达成共同的目标，可以走多远？',target:'liangshan',x:218,y:195}
];
const chapters=['张天师祈禳瘟疫　洪太尉误走妖魔','王教头私走延安府　九纹龙大闹史家村','史大郎夜走华阴县　鲁提辖拳打镇关西','赵员外重修文殊院　鲁智深大闹五台山','小霸王醉入销金帐　花和尚大闹桃花村','九纹龙剪径赤松林　鲁智深火烧瓦罐寺'];
$('#wm-chapters').innerHTML=chapters.map((title,i)=>`<a class="wm-chapter-link" href="portal.html#/article/${i}?context=book&resource=rb-ob-01"><span>${String(i+1).padStart(2,'0')}</span><strong>${title.replace('　','<br>')}</strong><i aria-hidden="true">↗</i></a>`).join('');
let toastTimer;
function toast(text){$('.toast').textContent=text;$('.toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('visible'),2600)}
function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem('wm:'+key))??fallback}catch{return fallback}}
function saveLocal(key,value){try{localStorage.setItem('wm:'+key,JSON.stringify(value))}catch{}}

// Real, local audio files; user initiated playback only.
const audio=$('#wm-audio'),play=$('#wm-play'),seek=$('#wm-seek');let currentEpisode=0;
const time=s=>Number.isFinite(s)?`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`:'00:00';
function updateAudio(){const active=!audio.paused;play.setAttribute('aria-pressed',String(active));play.setAttribute('aria-label',active?'暂停知识播客':'播放知识播客');play.firstElementChild.textContent=active?'Ⅱ':'▶';$('#podcast').classList.toggle('is-playing',active)}
play.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();$('#wm-audio-status').textContent=''}catch{$('#wm-audio-status').textContent='暂时无法播放，可以展开导读文字继续阅读。'}}else audio.pause()});
['play','pause','ended'].forEach(event=>audio.addEventListener(event,updateAudio));
const updateDuration=()=>$('#wm-duration').textContent=time(audio.duration);
audio.addEventListener('loadedmetadata',updateDuration);audio.addEventListener('durationchange',updateDuration);updateDuration();
audio.addEventListener('timeupdate',()=>{seek.value=Number.isFinite(audio.duration)?audio.currentTime/audio.duration*100:0;$('#wm-current').textContent=time(audio.currentTime);updateDuration()});
seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(seek.value)*audio.duration/100});
$('#wm-speed').addEventListener('click',()=>{audio.playbackRate=audio.playbackRate===1?1.25:audio.playbackRate===1.25?1.5:1;$('#wm-speed').textContent=audio.playbackRate+'×'});
$('#wm-transcript').textContent=transcripts[0];
$('#wm-transcript-toggle').addEventListener('click',()=>{const expanded=$('#wm-transcript-toggle').getAttribute('aria-expanded')==='true';$('#wm-transcript').hidden=expanded;$('#wm-transcript-toggle').setAttribute('aria-expanded',String(!expanded));$('#wm-transcript-toggle').textContent=expanded?'查看导读文字 ＋':'收起导读文字 −'});
$$('[data-episode]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.episode);if(i===currentEpisode)return;audio.pause();currentEpisode=i;audio.src=`assets/water-margin/podcast-${i+1}.mp3`;audio.load();$('#wm-episode-title').textContent=episodes[i][0];$('#wm-episode-summary').textContent=episodes[i][1];$('#wm-transcript').textContent=transcripts[i];$('#wm-current').textContent='00:00';$('#wm-duration').textContent='00:00';seek.value=0;$('#wm-audio-status').textContent='';$$('[data-episode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))}));

// Anki-style retrieval: flip, grade, persist and export an actual importable CSV.
let cardIndex=0;const mastered=new Set(readLocal('mastered',[]));
function renderCard(){const card=cards[cardIndex];$('#wm-flashcard').setAttribute('aria-pressed','false');$('#wm-flashcard').setAttribute('aria-label','翻开学习卡片答案');$('.wm-card-front').setAttribute('aria-hidden','false');$('.wm-card-back').setAttribute('aria-hidden','true');$('#wm-card-question').textContent=card[0];$('#wm-card-answer').textContent=card[1];$('#wm-card-source').textContent=card[2];const count=`${String(cardIndex+1).padStart(2,'0')} / 06`;$('.wm-card-front b').textContent=count;$('#wm-card-counter').textContent=count;$('#wm-review-status').textContent=`已掌握 ${mastered.size} / 6 张`}
$('#wm-flashcard').addEventListener('click',()=>{const active=$('#wm-flashcard').getAttribute('aria-pressed')!=='true';$('#wm-flashcard').setAttribute('aria-pressed',String(active));$('#wm-flashcard').setAttribute('aria-label',active?'返回学习卡片问题':'翻开学习卡片答案');$('.wm-card-front').setAttribute('aria-hidden',String(active));$('.wm-card-back').setAttribute('aria-hidden',String(!active))});
$('#wm-card-prev').addEventListener('click',()=>{cardIndex=(cardIndex+5)%6;renderCard()});$('#wm-card-next').addEventListener('click',()=>{cardIndex=(cardIndex+1)%6;renderCard()});
$('#wm-card-review').addEventListener('click',()=>{if($('#wm-flashcard').getAttribute('aria-pressed')!=='true'){toast('先翻开卡片，看看另一面的阅读提示');$('#wm-flashcard').click();return}mastered.add(cardIndex);saveLocal('mastered',[...mastered]);cardIndex=(cardIndex+1)%6;renderCard();toast(mastered.size===6?'六个问题已记下，带着它们回到原文吧':'已记下，下一张')});
$('#wm-export').addEventListener('click',()=>{const csv='\uFEFF'+cards.map(c=>[c[0],c[1]+' · '+c[2],'水浒传 江湖六问'].map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='水浒传-江湖六问-Anki.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出 6 张卡片，可导入 Anki（正面、背面、标签）')});renderCard();

function selectPerson(i){const p=people[i];$('#wm-person-tag').textContent=p.tag;$('#wm-person-name').textContent=p.name;$('#wm-person-description').textContent=p.description;$('#wm-person-relations').innerHTML=p.relations.map(r=>{const [name,text]=r.split('：');return `<span><strong>${name}</strong>${text}</span>`}).join('');$('#wm-person-question').textContent=p.question;$('#wm-person-link').href='#'+p.target;$('#wm-person-link').textContent=p.target==='cards'?'带着问题，翻一张卡片 ↗':'回到他的故事 ↗';$('.wm-map-active-line').setAttribute('d',`M400 300L${p.x} ${p.y}`);$$('[data-person]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.person)===i)))}
$$('[data-person]').forEach(b=>b.addEventListener('click',()=>selectPerson(Number(b.dataset.person))));selectPerson(0);
const choiceText=['你选择守住心中的义。可以比较鲁智深与宋江：他们口中的“义”，是否指向同一件事？','你想寻找另一条路。试着为一个人物标出转折：他是否真的还有别的选择？','把判断留到读完之后，也是一种认真。重读招安前后的分歧，看看你的想法会不会改变。'];
function choose(i){$$('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.choice)===i)));$('#wm-vote-result').textContent=choiceText[i];saveLocal('choice',i)}
$$('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.choice))));const savedChoice=readLocal('choice',null);if(Number.isInteger(savedChoice)&&savedChoice>=0&&savedChoice<3)choose(savedChoice);
function updateShelf(){const saved=window.clubSession?.read('savedBooks',[]).includes('rb-ob-01');$('#wm-save').setAttribute('aria-pressed',String(!!saved));$('#wm-save').textContent=saved?'✓ 已加入书架':'＋ 加入书架'}
$('#wm-save').addEventListener('click',()=>{const ids=clubSession.read('savedBooks',[]),saved=ids.includes('rb-ob-01');clubSession.write('savedBooks',saved?ids.filter(id=>id!=='rb-ob-01'):[...ids,'rb-ob-01']);updateShelf();toast(saved?'已移出书架':'已加入书架，可在“我的”查看')});updateShelf();

// Scrolling remains native. Sticky scenes advance from the scroll position in both directions.
const scenes=$$('.wm-chapter'),sections=['prologue','snow','tiger','liangshan','question'].map(id=>$('#'+id));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:.1});
$$('.wm-reveal').forEach(e=>revealObserver.observe(e));document.body.classList.add('motion-ready');
let scrollQueued=false,heroProgress=0;
function scrollFrame(){scrollQueued=false;const vh=innerHeight,sy=scrollY;heroProgress=clamp(sy/Math.max(vh,1));$('.wm-progress>span').style.width=`${sy/Math.max(1,document.documentElement.scrollHeight-vh)*100}%`;let active=0;
 sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=vh*.55)active=i});$$('.wm-rail a').forEach((a,i)=>i===active?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
 scenes.forEach(section=>{const r=section.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;const p=clamp(-r.top/Math.max(1,section.offsetHeight-vh));const index=Math.min(2,Math.floor(p*3));section.querySelectorAll('.wm-beat').forEach((el,i)=>{const isActive=i===index;el.classList.toggle('is-active',isActive);if(!motion.matches)el.setAttribute('aria-hidden',String(!isActive));else el.removeAttribute('aria-hidden')});section.querySelector('.wm-beat-meter i').style.width=`${p*100}%`;section.querySelector('.wm-scene-count').textContent=`${String(index+1).padStart(2,'0')} — 03`;if(!motion.matches)section.querySelector('.wm-scene-art').style.transform=`scale(${1.08+p*.08}) translateY(${(p-.5)*-3}%)`});
 if(!motion.matches){$('.wm-hero-landscape').style.transform=`scale(${1.06+heroProgress*.05}) translateY(${heroProgress*5}%)`;$('.wm-hero-copy').style.opacity=String(1-clamp(heroProgress*1.6));$('.wm-hero-copy').style.transform=`translateY(${-heroProgress*70}px)`}
}
function onScroll(){if(!scrollQueued){requestAnimationFrame(scrollFrame);scrollQueued=true}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);scrollFrame();
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});history.replaceState(null,'',a.getAttribute('href'))}));

// A real Three.js book, including separate boards, inset page block and sampled edge colors.
// The illustration remains visible as a complete fallback when WebGL is unavailable.
let renderer,bookGroup,scene,camera,stars,frame=0,observer;let mx=0,my=0,rx=0,ry=0,visible=true;
try{
 const stage=$('#wm-stage');renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;stage.append(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,.1,60);camera.position.set(0,0,9);
 scene.add(new THREE.AmbientLight(0xe8e3cd,2.3));const key=new THREE.DirectionalLight(0xffe2ae,3);key.position.set(-3,5,8);scene.add(key);const rim=new THREE.DirectionalLight(0xadc8c5,1.6);rim.position.set(5,1,-3);scene.add(rim);
 bookGroup=new THREE.Group();scene.add(bookGroup);
 const texture=await new THREE.TextureLoader().loadAsync('pages/assets/source-books/rb-ob-01.webp');texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const edge=new THREE.MeshStandardMaterial({color:0xcfc5b3,roughness:.9});const darkerEdge=new THREE.MeshStandardMaterial({color:0xaba18f,roughness:.88});const cover=new THREE.MeshStandardMaterial({map:texture,roughness:.76});
 const imageAspect=texture.image.width/texture.image.height, height=3.25,width=height*imageAspect,depth=.28;
 const lines=document.createElement('canvas');lines.width=128;lines.height=512;const ctx=lines.getContext('2d');ctx.fillStyle='#e5dfcc';ctx.fillRect(0,0,128,512);for(let x=0;x<128;x+=3){ctx.fillStyle=x%6===0?'#bdb9a6':'#f2eddd';ctx.fillRect(x,0,1,512)}const pageTexture=new THREE.CanvasTexture(lines);pageTexture.colorSpace=THREE.SRGBColorSpace;const pageMat=new THREE.MeshStandardMaterial({map:pageTexture,roughness:1});
 const pages=new THREE.Mesh(new THREE.BoxGeometry(width-.065,height-.09,depth-.065),[pageMat,pageMat,edge,edge,edge,edge]);bookGroup.add(pages);
 const front=new THREE.Mesh(new THREE.BoxGeometry(width,height,.026),[edge,edge,edge,edge,cover,edge]);front.position.z=depth/2;bookGroup.add(front);
 const back=new THREE.Mesh(new THREE.BoxGeometry(width,height,.026),edge);back.position.z=-depth/2;bookGroup.add(back);
 const spine=new THREE.Mesh(new THREE.BoxGeometry(.045,height,depth+.025),darkerEdge);spine.position.x=-width/2+.012;bookGroup.add(spine);
 // 108 points, the novel's stars, hover in true 3D around the volume.
 const positions=new Float32Array(108*3);let seed=108;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<108;i++){positions[i*3]=(rand()-.5)*14;positions[i*3+1]=(rand()-.5)*8;positions[i*3+2]=(rand()-.5)*6-1}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));stars=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xc9b491,size:.018,transparent:true,opacity:.45,depthWrite:false}));scene.add(stars);
 function resize(){const mobile=innerWidth<=760,w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const frustum=2*Math.tan(THREE.MathUtils.degToRad(16))*9,worldWidth=frustum*w/h;bookGroup.position.set(worldWidth*(mobile?.19:.238),mobile?-1.5:.02,0);bookGroup.scale.setScalar(mobile?.43:Math.min(1.12,h/760));bookGroup.userData.baseY=bookGroup.position.y;bookGroup.userData.baseScale=bookGroup.scale.x}
 resize();addEventListener('resize',resize);document.body.classList.add('has-webgl');
 addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});addEventListener('pointerleave',()=>{mx=my=0});
 function animate(t){frame=0;if(!visible||document.hidden)return;rx+=(mx*.2-rx)*.055;ry+=(my*.12-ry)*.055;const p=motion.matches?0:heroProgress;
 bookGroup.rotation.set(.12+ry+p*.3,-.3+rx-p*.4,.06-p*.15);bookGroup.position.y=bookGroup.userData.baseY-p*.65+(motion.matches?0:Math.sin(t*.00055)*.035);bookGroup.scale.setScalar(bookGroup.userData.baseScale*(1+p*.16));stars.rotation.y=motion.matches?0:t*.000015;stars.rotation.z=-p*.06;renderer.render(scene,camera);if(!motion.matches)frame=requestAnimationFrame(animate)
 }
 function resume(){if(visible&&!document.hidden&&!frame)frame=requestAnimationFrame(animate)}
 observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)resume();else{cancelAnimationFrame(frame);frame=0}},{threshold:0});observer.observe($('#prologue'));document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else resume()});motion.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;resume();scrollFrame()});resume();
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('has-webgl');cancelAnimationFrame(frame)});
 addEventListener('pageshow',event=>{if(event.persisted)resume()});
 addEventListener('pagehide',event=>{cancelAnimationFrame(frame);frame=0;audio.pause();if(event.persisted)return;observer.disconnect();renderer.dispose();scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material)(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>m.dispose())});texture.dispose();pageTexture.dispose()});
}catch(error){document.body.classList.remove('has-webgl');renderer?.dispose();$('#wm-stage').replaceChildren();console.info('Water Margin: using illustrated book fallback.');}
