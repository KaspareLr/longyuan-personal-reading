/* Same guide component as periodical details; existing reader behavior is retained. */
(() => {
 const mount=document.getElementById('article-guide-mount');
 if(mount)mount.innerHTML=window.renderResourceChat("这篇文章");
})();
