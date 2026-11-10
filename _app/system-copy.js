/* Shared system copy. Editorial content and user-entered values are never rewritten. */
(()=>{
 const catalog={
  common:{home:'首页',club:'读书会',me:'我的',book:'图书',magazine:'杂志',article:'文章',podcast:'播客',reading:'共读',shelf:'书架',preferences:'阅读偏好',next:'下一步',back:'上一步',return:'返回',close:'关闭',cancel:'取消',confirm:'确认',save:'保存',edit:'编辑',remove:'移除',search:'搜索',retry:'重试',expand:'展开全文',collapse:'收起',viewAll:'查看全部',read:'立即阅读',share:'分享到读书会',shared:'已分享到读书会',initialize:'重新初始化',about:'关于我们',logout:'退出登录',login:'登录',register:'注册'},
  auth:{loginTitle:['欢迎回来','继续阅读'],registerTitle:['你好','一起开始阅读'],loginDescription:'登录后，继续上次的阅读。',registerDescription:'先认识你，再准备每日阅读。',email:'邮箱',emailPlaceholder:'请输入邮箱',password:'密码',passwordPlaceholder:'请输入密码',confirmPassword:'确认密码',confirmPlaceholder:'请再次输入密码',showPassword:'显示',hidePassword:'隐藏',registerAction:'注册并继续',demo:'演示流程，任意填写即可继续。',pending:'正在进入',failed:'暂时无法进入，请重试。'},
  initialize:{steps:['认识你','阅读清单','每日安排','信息流'],
   avatar:{title:['选一个',['喜欢的','头像']],description:'从颜色到姿态，选一个适合你的头像。'},
   nickname:{title:['你好',['怎么','称呼你']],description:'留下姓名或昵称，方便大家认识你。'},
   accounts:{title:['从熟悉的',['阅读','开始']],description:'可以体验关联示例，也可以跳过，直接选择阅读偏好。'},
   accountsPending:{title:['阅读线索',['等你','确认']],description:'以下为演示资料，请选择愿意用于推荐的内容。'},
   accountsConfirmed:{title:['阅读线索',['已经','保留']],description:'可以查看已确认的资料，也可以继续关联账号。'},
   accountReview:{title:['看看这些',['阅读','线索']],description:'确认想使用的演示资料，不合适的可以移除。'},
   people:{title:['想和谁',['一起','阅读']],description:'选出想一起阅读的人，可以多选。'},
   voice:{title:['用声音',['聊聊你的','好奇']],description:'最近有没有一件事，让你特别想读点什么、弄明白一点什么？'},
   interests:{title:['哪些话题',['让你','好奇']],description:'选择感兴趣的话题，可以多选，也可以自行补充。'},
   name:{title:['给读书会',['起个','名字']],description:'写下名字和期待，接着看看阅读清单。'},
   library:{title:['为你整理了',['一份','阅读清单']],description:'保留想读的内容，不合适的可以替换，也可以搜索添加。'},
   schedule:{title:['安排好',['每日','阅读']],description:'设置每日数量、内容形式和推送时间。之后可以重新初始化。'},
   direction:{title:['这次共读',['从哪里','开始']],description:'选择一个想一起讨论的话题，也可以自行补充。'},
   recommendations:{title:['选一份',['一起读的','内容']],description:'选择想一起读的内容，没有合适的可以换一批。'},
   cycle:{title:['这次共读',['准备读','多久']],description:'设置共读周期和打卡方式。'},
   leader:{title:['邀请一位',['同行的','领读人']],description:'选择领读人，陪大家一起阅读和讨论。'},
   complete:{title:['准备好了',['开始','阅读吧']],description:'阅读偏好和每日安排已保存，可以开始查看信息流。'},
   nicknameLabel:'姓名或昵称',nicknamePlaceholder:'希望大家怎么称呼你？',clubNameLabel:'读书会名称',clubNamePlaceholder:'例如：商业慢读',clubNotesLabel:'阅读期待（选填）',clubNotesPlaceholder:'例如：少一点追热点，多一点分析依据。',saved:'进度已保存',saveFailed:'进度暂未保存，请重试。',resume:'上次的选择已保留，可以继续。',resumeAction:'继续初始化',restart:'重新开始',skip:'暂不关联，下一步',confirmAccounts:'确认资料，下一步',finish:'查看信息流',avatarAction:'就用这个头像',shuffle:'换一换'
  },
  feed:{todayTitle:['今天，','读懂一点新东西。'],todayDescription:'{name}每天 {time}，为你整理一份阅读。',archiveDescription:'回看{date}的阅读记录。',pastTitles:['回看那天的阅读','好内容，值得再读','重读一点，想深一点','看看那天的发现','回到关心的话题','再看一次，多懂一点','回看留下的好内容'],preparing:'阅读正在准备',remaining:'距离 {date}{time} 推送还有',emptyTitle:'这天还没有阅读',emptyDescription:'选择其他日期，或回到今天。',returnToday:'回到今天',audioFailed:'暂时无法播放，请重试。',shareFailed:'暂时无法分享，请重试。'},
  voice:{hold:'按住说话',release:'松手发送，上移取消',cancel:'松手取消',next:'下一步',preview:'试听演示语音',pause:'暂停演示语音',demo:'语音样式演示，不含真实录音'},
  club:{title:'龙源读书会',description:'从一本想读的书开始，发现值得读的杂志、文章与播客。'},
  profile:{categories:'你关注{topics}。',topics:'你想进一步了解的话题包括{topics}。',other:'你还补充了“{text}”。',people:'你希望和{people}一起阅读，交流各自的发现和想法。',clubName:'你给读书会起的名字是“{name}”。',clubNotes:'你留下的阅读期待是：“{text}”。',rhythm:'你选择的阅读安排是{details}。',formats:'内容形式包括{formats}。',clue:'这些选择会用于整理每日阅读。',title:'我对{name}的了解',updated:'更新于 {time}',intro:'我认识你，是从你留下的阅读选择开始的。',empty:'你还没有留下具体的阅读偏好。可以从一个话题、一次好奇开始，慢慢找到想读的内容。',expand:'展开全文',collapse:'收起',aboutTitle:'关于龙源阅读',aboutLead:'读懂一点新东西。',aboutBody:'从关心的话题出发，发现值得读的文章、图书、杂志与播客。把阅读中的想法留给自己，也分享给读书会。'},
  notes:{emptyTitle:'记下阅读中的想法',emptyDescription:'一段摘录、一个疑问，都可以成为第一篇笔记。',write:'写笔记',placeholder:'记下一段摘录，或此刻的想法',saved:'笔记已保存',failed:'笔记未能保存，请重试。',deleteTitle:'删除这篇笔记？',deleteDescription:'删除后无法恢复。',deleteAction:'删除笔记'},
  reader:{save:'收藏文章',unsave:'取消收藏文章',saved:'已收藏文章',removed:'已取消收藏',addShelf:'加入书架',inShelf:'已加入书架',removeShelf:'移出书架',removedShelf:'已移出书架',previous:'上一篇',next:'下一篇',first:'已是第一篇',last:'已是最后一篇',comment:'写下评论',commentPlaceholder:'写下阅读中的发现，或想继续讨论的问题。',publishComment:'发表评论',commentPublished:'评论已发布',contents:'目录',night:'夜间阅读',fontSize:'正文字号',singleColumn:'切换为单栏',doubleColumn:'切换为双栏'},
  podcast:{play:'播放播客',pause:'暂停播客',progress:'播放进度',speed:'播放速度',mute:'静音',unmute:'取消静音',transcript:'查看文字稿',notes:'阅读笔记',notesHint:'本期提供中文阅读笔记，暂无逐字文字稿。',failed:'暂时无法播放，请重试。'},
  states:{saved:'已保存',saveFailed:'暂时无法保存，请重试。',loadFailed:'暂时无法加载，请重试。',searchEmpty:'没有找到相关内容，试试其他关键词。',empty:'暂无内容',loginRequired:'登录后继续',logout:'已退出登录',followed:'已关注',unfollowed:'已取消关注',joined:'已加入读书会',left:'已退出读书会',eventRegistered:'报名成功，可在“我的”查看。',memberStarted:'会员体验已开启',eventSaved:'已收藏活动回顾',redeemed:'已兑换年度会员体验'}
 };
 const lookup=key=>key.split('.').reduce((v,k)=>v?.[k],catalog);
 const t=(key,values={})=>String(lookup(key)??key).replace(/\{(\w+)\}/g,(all,k)=>values[k]??all);
 function heading(element,lines,{mobileOnly=false}={}){element.classList.add('system-copy-title');element.classList.toggle('system-copy-mobile-lines',mobileOnly);element.replaceChildren();for(const line of lines){const row=document.createElement('span');row.className='system-title-line';for(const phrase of Array.isArray(line)?line:[line]){const span=document.createElement('span');span.className='system-title-phrase';span.textContent=phrase;row.append(span)}element.append(row)}}
 const aliases={
  '期刊':'common.magazine','继续':'common.next','继续下一步':'common.next','这样安排就好':'common.next','开始认识你':'common.next','看看为我推荐的清单':'common.next','给读书会起个名字':'common.next','留下清单，安排日常节奏':'common.next','用这些资料继续':'initialize.confirmAccounts','生成信息流，先看看':'initialize.finish','暂时无法播放，请再次点击播放重试。':'feed.audioFailed','保存失败，点击重试':'feed.shareFailed','已分享到本地读书会':'common.shared','保存失败':'states.saveFailed','文章已收藏':'reader.saved','已经是第一篇':'reader.first','已经是最后一篇':'reader.last','已经读到最后一篇':'reader.last','已退出演示账号':'states.logout','演示报名成功，可在“我的”查看':'states.eventRegistered','活动回顾已收藏':'states.eventSaved','年度会员体验已兑换':'states.redeemed','阅读昵称':'initialize.nicknameLabel','姓名昵称':'initialize.nicknameLabel','读书会的名字':'initialize.clubNameLabel','对这个读书会，还有什么期待？（选填）':'initialize.clubNotesLabel','每日内容数量':'settings.dailyCount','希望收到的内容形态':'settings.formats','每日送达时间':'settings.time','喜欢的内容自动发布':'settings.autoShare','下一篇文章':'reader.next','上一篇文章':'reader.previous','写下一个发现，或一个想继续讨论的问题……':'reader.commentPlaceholder','写下一个发现，或一个想继续讨论的问题…':'reader.commentPlaceholder','暂时无法播放音频，请稍后重试。':'podcast.failed','音频加载失败，可稍后重试。':'podcast.failed','收起全文':'common.collapse'
 };
 catalog.settings={dailyCount:'每日内容数量',formats:'内容形式',time:'推送时间',autoShare:'自动分享到读书会'};
 function normalize(value){return aliases[value]?t(aliases[value]):value}
 // Adapt inherited UI controls without touching editorial headings, metadata, reader prose or user values.
 const controlSelector='button,label,a.button,[role=button],[role=status],.toast,input,textarea';
 function control(element){if(element.matches('.chip')&&!element.closest('.operation-card,.shelf-tabs,[data-resource-type],.resource-type-options'))return;for(const attr of ['aria-label','title','placeholder'])if(element.hasAttribute(attr)){const value=element.getAttribute(attr),next=normalize(value);if(next!==value)element.setAttribute(attr,next)}if(element.matches('input,textarea'))return;const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(node.parentElement.closest('script,style,textarea,option,h1,h2,h3,.portal-prose,[data-v3-field],.recommendation-author,.shelf-item-body'))continue;const text=node.data.trim();if(element.matches('.chip')&&!element.closest('.operation-card,.shelf-tabs')&&text!=='期刊')continue;if(text==='期刊'&&!element.closest('.operation-card,.shelf-tabs,[data-resource-type],.resource-type-options'))continue;const next=normalize(text);if(next!==text)node.data=node.data.replace(text,next)}}
 function scan(root){if(root.nodeType!==1)return;if(root.matches(controlSelector))control(root);root.querySelectorAll(controlSelector).forEach(control)}
 function start(){scan(document.body);const observer=new MutationObserver(records=>{const roots=new Set();for(const r of records){const element=r.target.nodeType===1?r.target:r.target.parentElement,controlRoot=element?.closest(controlSelector);if(controlRoot)roots.add(controlRoot);for(const node of r.addedNodes||[])if(node.nodeType===1)roots.add(node)}roots.forEach(scan)});observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title']})}
 window.readingCopy={catalog,t,heading,normalize};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
