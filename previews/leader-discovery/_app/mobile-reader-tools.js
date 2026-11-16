/* Desktop folds settings only; mobile folds the complete toolbar. */
(()=>{
 const root=document.querySelector('#portal-main');if(!root)return;
 const media=matchMedia('(max-width:760px)'),mounted=new WeakMap();let serial=0;
 function state(tools,open,focus=false){
  const refs=mounted.get(tools);if(!refs)return;
  tools.classList.toggle('reader-tools-open',open);
  const label=(open?'收起':'展开')+(media.matches?'阅读工具':'阅读设置');
  refs.toggle.setAttribute('aria-expanded',String(open));refs.toggle.setAttribute('aria-label',label);refs.toggle.title=label;refs.toggle.querySelector('i').className='iconfont club-local-icon '+(open?'icon-Close':'icon-a--2');
  refs.panel.inert=!open;refs.panel.setAttribute('aria-hidden',String(!open));
  if(focus)refs.toggle.focus({preventScroll:true});
 }
 function sync(){
  root.querySelectorAll('.portal-reader-tools').forEach(tools=>{
   if(!mounted.has(tools)){
    const panel=document.createElement('div');panel.className='reader-tools-panel';panel.id='reader-tools-panel-'+(++serial);
    const toggle=document.createElement('button');toggle.type='button';toggle.className='reader-tools-toggle';toggle.setAttribute('aria-controls',panel.id);toggle.innerHTML='<i class="iconfont club-local-icon icon-a--2" aria-hidden="true"></i>';
    const settings=document.createElement('div');settings.className='reader-tools-settings';settings.append(panel,toggle);
    mounted.set(tools,{panel,toggle,settings});tools.append(settings);
    toggle.addEventListener('click',()=>state(tools,!tools.classList.contains('reader-tools-open')));
    tools.classList.add('reader-tools-collapsible');state(tools,false);
   }
   const {panel,toggle,settings}=mounted.get(tools);
   tools.dataset.toolsMode=media.matches?'mobile':'desktop';
   if(media.matches){
    [...tools.children].filter(el=>el!==settings).forEach(el=>panel.append(el));
    const order=el=>el.matches('.reader-directory-trigger')?0:el.matches('.reader-tool-group')?1:el.matches('.reader-tool-section')?2:3;
    const sorted=[...panel.children].sort((a,b)=>order(a)-order(b));
    sorted.forEach((el,i)=>{if(panel.children[i]!==el)panel.insertBefore(el,panel.children[i]||null)});
   }else{
    [...panel.children].filter(el=>!el.matches('.reader-tool-section')).forEach(el=>tools.insertBefore(el,settings));
    [...tools.children].filter(el=>el.matches('.reader-tool-section')).forEach(el=>panel.append(el));
   }
  });
 }
 document.addEventListener('pointerdown',event=>{root.querySelectorAll('.reader-tools-open').forEach(tools=>{if(!tools.contains(event.target))state(tools,false)});});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')root.querySelectorAll('.reader-tools-open').forEach(tools=>{state(tools,false,true);event.preventDefault()})});
 media.addEventListener('change',()=>{sync();root.querySelectorAll('.reader-tools-collapsible').forEach(tools=>{const focus=mounted.get(tools).panel.contains(document.activeElement);state(tools,false,focus)});});
 new MutationObserver(sync).observe(root,{childList:true,subtree:true});sync();
})();
