const birds={crane:'丹顶鹤',mallard:'绿头鸭',eagle:'老鹰',kingfisher:'翠鸟'};
const introductions={
 crane:{title:'丹顶鹤',text:'丹顶鹤是一种大型涉禽，常活动于开阔的沼泽、湿地和浅水地带。它具有修长的颈、喙和腿，便于在浅水中行走并寻找鱼、虾、昆虫和植物等食物。成鸟头顶部裸露的红色皮肤，是最醒目的外形特征之一。'},
 mallard:{title:'绿头鸭',text:'绿头鸭是常见的游禽。雄鸟通常有富有金属光泽的绿色头部，雌鸟多呈褐色斑驳羽色，便于隐蔽。它的蹼足适合划水，宽而扁的喙有助于从水中筛取植物、种子和小型水生动物。'},
 eagle:{title:'老鹰',text:'本模型表现的是草原雕一类的大型猛禽。它拥有敏锐的视觉、弯曲而有力的喙和强壮的利爪，适合发现、捕捉并撕取食物。宽大的翅膀能够利用上升气流长时间滑翔，从高空巡视广阔区域。'},
 kingfisher:{title:'翠鸟',text:'观察翠鸟模型的长直喙、蓝绿色背羽和较短的腿。它会连续完成站立、起飞、振翅飞行、降落，再回到站立。试试慢放，从背面和上方比较翅膀上举、下压与收拢时的形状变化。'}
};
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
const requested=new URLSearchParams(location.search).get('bird'),bird=Object.hasOwn(birds,requested)?requested:'crane';
document.body.dataset.bird=bird;document.title='鸟类观察 · '+birds[bird];document.getElementById('view').setAttribute('aria-label',birds[bird]+'三维模型');
document.querySelector(`nav [data-bird="${bird}"]`).setAttribute('aria-current','page');
document.getElementById('birdIntro').innerHTML=`<h3>${introductions[bird].title}</h3><p>${introductions[bird].text}</p>`;
document.querySelector('#modelPlaceholder b').textContent=`正在准备${birds[bird]}模型…`;
try{await import('./'+bird+'.js');document.getElementById('speed').disabled=false;}catch(error){document.getElementById('status').textContent='加载失败，请刷新重试';console.error(error);}

const readyButton=document.getElementById('play');
const announceReady=()=>{if(!readyButton.disabled){document.getElementById('modelPlaceholder').hidden=true;parent.postMessage({type:'bird-observation-ready',bird},'*');return true;}return false;};
if(!announceReady()){const readyObserver=new MutationObserver(()=>{if(announceReady())readyObserver.disconnect();});readyObserver.observe(readyButton,{attributes:true,attributeFilter:['disabled']});}

if(new URLSearchParams(location.search).get('local')==='1'){document.querySelectorAll('nav a').forEach(a=>{a.href+='&local=1'});const heartbeat=()=>fetch('/__heartbeat',{cache:'no-store'}).catch(()=>{});heartbeat();setInterval(heartbeat,20000);}
