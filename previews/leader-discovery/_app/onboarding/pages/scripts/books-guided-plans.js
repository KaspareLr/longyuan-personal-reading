/* Reuse the existing guided-reading demo with the selected book's real metadata. */
(()=>{
 const base=octoberGuidedPlans.find(plan=>plan.contentType==='book'&&!plan.past);if(!base)return;
 libraryBooks.forEach(book=>{
  const id='book-'+book.id;if(octoberGuidedPlans.some(plan=>plan.id===id))return;
  octoberGuidedPlans.push({...base,id,bookTitle:book.title,author:book.author,publisher:book.publisher,cover:book.cover,contentType:'book',returnUrl:'#/books',title:'一起读《'+book.title+'》',description:book.summary,message:book.reason,todayTask:{range:'选读《'+book.title+'》的一段内容，摘录一个打动你的细节。',question:'这段文字让你产生了什么想法？结合原文说说你的理解。'}});
 });
})();
