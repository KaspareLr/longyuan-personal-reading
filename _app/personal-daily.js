/* Stable daily editions, with a previous-day edition for the local demo. */
window.personalDailyEditions=function(stories,state){
 const format=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}),date=format.format(new Date()),yesterday=format.format(new Date(Date.parse(date+'T00:00:00+08:00')-86400000)),key='longyuan-personal-daily-editions-v1';
 let editions=[];try{editions=JSON.parse(localStorage.getItem(key))||[]}catch{}
 const signature=JSON.stringify([state.profile?.categories,state.profile?.topics,state.profile?.topicsOther,state.domains,state.ops]);
 let changed=false;const current=editions.find(x=>x.date===date);
 if(!current||current.signature!==signature){editions=editions.filter(x=>x.date!==date);editions.push({date,signature,time:state.ops.deliveryTime||'07:30',stories});changed=true}
 if(stories.length&&!editions.some(x=>x.date===yesterday)){
  // Reuse resources with working covers, players and detail routes; vary the selection and order.
  const split=Math.ceil(stories.length/2),previous=[...stories.slice(split),...stories.slice(0,split)].slice(0,4);
  editions.push({date:yesterday,signature,time:state.ops.deliveryTime||'07:30',stories:previous,demo:true});changed=true;
 }
 editions.sort((a,b)=>b.date.localeCompare(a.date));editions=editions.slice(0,30);
 if(changed)localStorage.setItem(key,JSON.stringify(editions));
 return editions;
};
