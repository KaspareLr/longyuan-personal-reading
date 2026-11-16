/* One directory modal for desktop and phone, shared by magazine and book readers. */
(()=>{
 const root=document.querySelector('#portal-main');if(!root)return;let current;
 function sync(){
  const reader=root.querySelector('.portal-reader');
  if(current&&current.reader!==reader){current.dialog.remove();current=null;document.body.classList.remove('reader-directory-open');}
  if(!reader||current)return;
  const toc=reader.querySelector('.portal-toc'),tools=reader.querySelector('.portal-reader-tools');if(!toc||!tools)return;
  const trigger=document.createElement('button');trigger.type='button';trigger.className='reader-directory-trigger';trigger.innerHTML='<i class="iconfont club-local-icon icon-list" aria-hidden="true"></i>';trigger.title='查看目录';trigger.setAttribute('aria-label','查看目录');trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','reader-directory');tools.prepend(trigger);
  const dialog=document.createElement('dialog');dialog.id='reader-directory';dialog.className='reader-directory-dialog';dialog.setAttribute('aria-labelledby','reader-directory-title');dialog.innerHTML='<div class="reader-directory-heading"><h2 id="reader-directory-title">目录</h2><button type="button" aria-label="关闭目录" autofocus><i class="iconfont club-local-icon icon-Close" aria-hidden="true"></i></button></div><div class="reader-directory-body"></div>';
  current={reader,toc,trigger,dialog};reader.classList.add('reader-has-directory');dialog.querySelector('.reader-directory-body').append(toc);document.body.append(dialog);
  trigger.addEventListener('click',()=>{dialog.classList.toggle('night',reader.classList.contains('night'));dialog.showModal();trigger.setAttribute('aria-expanded','true');document.body.classList.add('reader-directory-open');toc.querySelector('[aria-current]')?.scrollIntoView({block:'center'});});
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target.closest('a'))dialog.close();});
  dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');document.body.classList.remove('reader-directory-open');if(trigger.isConnected){const panel=trigger.closest('.reader-tools-panel');(panel?.inert?tools.querySelector('.reader-tools-toggle'):trigger)?.focus({preventScroll:true});}});
 }
 new MutationObserver(sync).observe(root,{childList:true,subtree:true});sync();
})();
