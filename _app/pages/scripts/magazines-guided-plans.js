/* Magazine homepage entries reuse the guided-reading demo with matching issue metadata. */
(()=>{
 const base=octoberGuidedPlans.find(plan=>plan.contentType==='journal');if(!base)return;
 magazinesHomeData.magazines.forEach(m=>{
  const id='magazine-'+m.title;if(octoberGuidedPlans.some(plan=>plan.id===id))return;
  octoberGuidedPlans.push({...base,id,bookTitle:m.title,issue:m.issue,cover:m.cover,returnUrl:'#/magazines',title:'一起读《'+m.title+'》',description:'围绕《'+m.title+'》'+m.issue+'开展选读、讨论与分享。',todayTask:{range:'选读本期《'+m.title+'》的一篇文章，记录一个值得讨论的观点。',question:'文章中哪个观点或细节让你印象最深？结合原文分享你的理解。'}});
 });
})();
