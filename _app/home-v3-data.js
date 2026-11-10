/* Shared demo resource metadata keeps home cards and detail destinations consistent. */
(()=>{
 const prefix=document.currentScript.src.replace(/home-v3-data\.js.*$/,'');
 const asset=n=>new URL('assets/home-v3/'+n,prefix).href;
 const summary='漂亮的布置需要怎样维持？顺手的空间，又为谁减少了麻烦？从住宅设计与时间利用数据出发，重新理解一个家的使用与维护。我们容易先看见材料、色彩和家具，却容易忽略维持这些安排所需的工作。拉开椅子、取放餐具、清理台面，都是一个家被使用的部分。';
 const reason='它把注意力放在日常空间的具体安排上。我们想由此继续问：一种便利，究竟为谁减少了麻烦？';
 const books=[{id:'home-v3-house',title:'住宅设计解剖书',author:'［日］增田奏 著 · 赵可 译',publisher:'',category:'建筑与生活',summary,reason,cover:asset('83ddc.png'),url:'portal.html#/book/home-v3-house'},{id:'home-v3-law',title:'法律援助法律法规释解',author:'',publisher:'',category:'法律',summary:'法律援助相关法律法规释解。',reason:'从具体规则出发，理解法律援助。',cover:asset('067cf.png'),url:'portal.html#/book/home-v3-law'}];
 for(const collection of [window.clubCatalogData?.books,window.clubPortalData?.books])if(collection)for(const b of books)if(!collection.some(x=>x.id===b.id))collection.push(b);
 if(window.clubSharedContent&&!window.clubHomeV3ArticleIndex){
  const items=clubSharedContent.articles;window.clubHomeV3ArticleIndex=items.length;
  items.push({title:'百年披萨店如何征服四大洲',author:'龙源读书会',cover:asset('500be.png'),summary:'在那不勒斯老城迷宫般的街巷中，切萨雷塞拉莱街1号藏着全球食客争相排队的传奇——达米切莱，一家始于1870年的百年披萨店，以玛格丽特和马里纳拉两款经典披萨征服世界。'},{title:'你买的是一张餐桌，还是一处能吃饭的地方？',author:'王富贵 · 安邸AD',cover:asset('eded0.png'),summary},{title:'好住的家，应该少让人费一点劲。',author:'龙源读书会',cover:asset('500be.png'),summary});
 }
})();
