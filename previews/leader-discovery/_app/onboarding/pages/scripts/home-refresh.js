(() => {
 const login=document.createElement('dialog');login.className='home-login-dialog';login.setAttribute('aria-label','登录龙源期刊网');
 login.innerHTML='<div class="home-login-head"><img src="assets/longyuan-home/longyuan-logo.png" alt="龙源期刊网"><button type="button" aria-label="关闭登录" data-login-close><i class="iconfont icon-Close" aria-hidden="true"></i></button></div><h2>让阅读，持续发生。</h2><p>登录后可同步收藏、阅读进度与已购权益。</p><p>当前为本地演示，账号登录服务尚未接入。</p><button type="button" class="btn" data-login-close>继续浏览</button>';
 document.body.append(login);
 document.querySelector('[data-home-login]').addEventListener('click',()=>login.showModal());
 login.addEventListener('click',e=>{if(e.target===login||e.target.closest('[data-login-close]'))login.close()});
 const picker=document.getElementById('home-content-files'),list=document.getElementById('home-attachments');let files=[];
 document.getElementById('home-add-content').addEventListener('click',()=>picker.click());
 function render(){list.replaceChildren();files.forEach((file,index)=>{const chip=document.createElement('div');chip.className='home-file-chip';const name=document.createElement('span');name.textContent=file.name;name.title=file.name;const remove=document.createElement('button');remove.type='button';remove.setAttribute('aria-label','移除 '+file.name);remove.innerHTML='<i class="iconfont icon-Close" aria-hidden="true"></i>';remove.addEventListener('click',()=>{files.splice(index,1);render()});chip.append(name,remove);list.append(chip)});if(files.length){const note=document.createElement('p');note.className='home-attachment-note';note.textContent='文件已在本地选择；演示暂未接入上传与解析。';list.append(note)}}
 picker.addEventListener('change',()=>{for(const file of picker.files){if(!files.some(x=>x.name===file.name&&x.size===file.size&&x.lastModified===file.lastModified))files.push(file)}picker.value='';render()});
})();
