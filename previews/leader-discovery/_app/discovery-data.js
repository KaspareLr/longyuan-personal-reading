/* People-first discovery. Reuse existing profiles, demo people and portrait assets. */
(()=>{
 const summaries=[
  {role:'作家 · 文学与成长',intro:'从人物的命运与日常细节里，看见成长的另一种可能。',tags:['文学与成长']},
  {role:'文学编辑 · 阅读推广',intro:'带着编辑的目光看文字，留意叙事、语言与不经意的细节。',tags:['文学与成长','编辑与写作']},
  {role:'诗人 · 童诗与想象',intro:'把心里的话念出声来，在童诗里留住一点自由的想象。',tags:['童诗与想象','文学与成长']}
 ];
 window.discoveryLeaders=clubPeopleProfiles.map((p,i)=>({...p,...summaries[i],profileHref:'pages/index.html?nav=club#/magazine/'+encodeURIComponent('南风窗')+'?claimed=1&page=lecturer&id='+encodeURIComponent(p.id)})).concat([
  {id:'lin-zhixia',name:'林知夏',role:'文学编辑 · 日常观察',portrait:'assets/home-template/guide-1.webp',intro:'相信文字能让人重新看见日常，也想听听你的生活里发生了什么。',bio:'相信文字能让人重新看见日常，和你一起读文学、聊生活。',tags:['文学与成长','编辑与写作']},
  {id:'chen-yu',name:'陈屿',role:'旅行写作者 · 城市观察',portrait:'assets/home-template/guide-2.webp',intro:'喜欢走进城市与山野，在行走和交谈中理解不同的生活。',bio:'以行走丈量世界，用阅读理解人与城市、人与自然的关系。',tags:['城市与日常','编辑与写作']},
  {id:'su-wan',name:'苏皖',role:'编辑 · 细节观察',portrait:'assets/guide-su.png',intro:'留意容易被忽略的细节，一起把一个问题想得更具体。',bio:'从编辑的日常出发，分享观察、提问与理解文字的方法。',tags:['编辑与写作','城市与日常']},
  {id:'zhou-qin',name:'周芹',role:'小学语文教师 · 成长陪伴',portrait:'assets/guide-zhou.png',intro:'关心孩子怎样理解文字，也关心大人怎样学会倾听。',bio:'从课堂与日常交流中，寻找和孩子一起理解文字、表达想法的方式。',tags:['文学与成长','童诗与想象']}
 ]);
})();
