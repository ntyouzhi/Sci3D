/* Local specimen viewer. Original white models supplied by the user. */
(() => {
'use strict';
let T=window.THREE;const $=id=>document.getElementById(id);
function notifyClassroom(){if(window.parent!==window)window.parent.postMessage({type:'insect-observation-ready'},location.origin)}
const insectData={
 bee:{name:'蜜蜂',sub:'原始动画 · 扇翅观察',latin:'Honeybee · 原绑定动画',dynamic:true,title:'扇翅时，身体和足怎样变化？',description:'保留蜜蜂模型原有骨骼动作和贴图。连续播放后可暂停、慢放，观察翅、触角和六足的姿态变化。网页采用轻量版本，不加载大型动画缓存和粒子毛发。',chips:['原始骨骼动画','贴图材质','暂停慢放'],question:'蜜蜂的翅和三对足连接在哪个部位？',clue:'翅和足连接在胸部。转动模型观察头、胸和腹的区别。此模型的动作不是实测飞行数据；轻量网页版不保留原粒子毛发。'},
 ladybug3d:{name:'七星瓢虫',sub:'原始贴图 · 三维观察',latin:'Coccinella · 原材质模型',embedded:true,title:'数一数背上的黑色斑点',description:'这是新提供的七星瓢虫模型，保留原始红黑贴图、触角、六足和鞘翅细节。可以旋转、放大，或切换到俯视观察背部斑点和中央接缝。',chips:['原始贴图','圆拱鞘翅','六足观察'],question:'两片鞘翅在哪里分开？',clue:'俯视观察背部中央的接缝。坚硬的鞘翅保护下方的膜质后翅。这份文件有绑定但没有自带动画，本次先展示原始静态姿态。'},
 firefly:{name:'萤火虫',sub:'连续起落 · 腹部发光',latin:'Firefly · 动作示意',dynamic:true,title:'从地面到空中，身体怎样移动？',description:'萤火虫先在地面弹跳一次，随后展开鞘翅、扇动后翅飞起，平稳悬停约8秒，再缓缓落地。飞行中不再弹跳。转到侧面观察升降与腹部发光区域；可暂停、慢放。',chips:['地面弹跳一次','平稳悬停','缓缓落地','腹部发光'],question:'萤火虫是整个身体都在发光吗？',clue:'观察腹部的发光区域，与头部、胸部和翅作比较。此处保留模型原有发光材质，不代表真实发光强度或闪光节律；弹跳、悬停和起落为教学示意，不作为实测运动数据。'},
 butterfly:{name:'蝴蝶',sub:'连续起落 · 柔曲扇翅',latin:'Butterfly · 动作示意',dynamic:true,title:'从地面到空中，动作怎样变化？',description:'蝴蝶会连续完成地面扇翅、起飞、空中悬停和缓缓落地，再开始下一轮。观察翼尖柔曲、身体升降以及足的收拢与展开。可暂停、慢放观察。',chips:['连续起落','空中悬停','柔曲扇翅'],question:'落到地面后，身体主要由什么支撑？',clue:'足帮助支撑身体和走动，翅帮助飞行。本页动作均为原绑定制作的教学示意，不作为真实物种步态、悬停能力和飞行速度的依据。'},
 ant:{name:'黑色蚂蚁',sub:'爬行动画 · 六足交替',latin:'Walking ant · 动态观察',dynamic:true,title:'六条足怎样交替支撑？',description:'观察黑色蚂蚁的六足爬行动作和触角摆动。先连续播放，再慢放或暂停，看看哪些足正在支撑身体，哪些足正在向前摆动。',chips:['六足爬行','可暂停慢放','触角摆动'],question:'爬行时，六条足会同时抬起吗？',clue:'慢放并暂停在不同姿态，比较接地的足与摆动的足。蚂蚁会交替支撑，而不是六条足同时离地；这份模型用于观察动作，不作为实测步态数据。'},
 fly:{name:'家蝇',sub:'一对翅 · 大复眼',latin:'Musca domestica',title:'它与蜻蜓的翅有什么不同？',description:'家蝇有一对用于飞行的翅，头部有较大的复眼，胸部有三对足。俯视数一数翅，再与蜻蜓的两对翅比较。',chips:['一对飞行翅','较大的复眼','三对足'],question:'家蝇与蜻蜓的飞行翅数量相同吗？',clue:'不同。家蝇有一对飞行翅，蜻蜓有两对。家蝇的后翅演化成用于平衡的平衡棒，本模型不宜用于辨认这类微小结构。',head:[0,.8,1.65],thorax:[0,1.1,.5],abdomen:[0,.7,-1.05]},
 cricket:{name:'蟋蟀',sub:'长触角 · 跳跃足',latin:'Emma field cricket',title:'哪一对足最强壮？',description:'蟋蟀有细长的触角。前足和中足较细，后足的腿节明显粗大。俯视和侧视交替观察，比较三对足的外形。',chips:['细长触角','粗大的后足','适于跳跃'],question:'蟋蟀的后足为什么比前足粗大？',clue:'粗大的后足肌肉发达，适合蹬地跳跃。它的前足和中足主要帮助行走与支撑。',head:[0,.18,1.92],thorax:[0,.20,1.10],abdomen:[0,.17,-.03]},
 dragonfly:{name:'蜻蜓',sub:'两对翅 · 细长腹部',latin:'Anotogaster sieboldii',title:'四片翅膀连接在哪里？',description:'蜻蜓有两对展开的翅、较大的复眼和细长的腹部。俯视观察前翅与后翅，再从侧面寻找翅和三对足的连接位置。',chips:['两对翅','细长腹部','较大的复眼'],question:'翅膀连接在细长的腹部上吗？',clue:'不是。两对翅和三对足都连接在胸部，细长的腹部延伸在胸部后方。',head:[0,.24,1.8],thorax:[0,.4,1.3],abdomen:[0,.08,-.65]},
 stag:{name:'锹甲',sub:'大颚 · 坚硬鞘翅',latin:'Miyama stag beetle',title:'前面的“大夹子”是什么？',description:'锹甲是一类甲虫。这只模型头部的大颚像一把夹子；背上的前翅形成坚硬的鞘翅，可以保护身体和折叠的后翅。',chips:['发达的大颚','坚硬的鞘翅','甲虫'],question:'看起来像“鹿角”的结构，是触角吗？',clue:'不是。那是头部发达的大颚；触角是头部另外一对较细的结构。放大正面可以对照观察。',head:[0,.42,1.03],thorax:[0,.31,.40],abdomen:[0,.23,-.73]},
};
// Keep classroom-facing copy short; production details live in the source notes.
Object.assign(insectData.ant,{name:'蚂蚁',sub:'六足爬行 · 触角摆动',description:'观察蚂蚁的六足爬行和触角摆动。慢放或暂停，看看哪些足正在支撑身体，哪些足正在向前摆动。',clue:'蚂蚁会交替支撑，而不是六条足同时离地。慢放并暂停在不同姿态，比较接地的足与摆动的足。'});
Object.assign(insectData.bee,{sub:'两对翅 · 六足观察',description:'连续播放后可暂停、慢放，观察蜜蜂的扇翅、触角摆动和六足姿态。',chips:['两对翅','触角摆动','六足观察'],clue:'翅和三对足都连接在胸部。转动模型，观察头、胸和腹的区别。'});
Object.assign(insectData.ladybug3d,{sub:'圆拱身体 · 坚硬鞘翅',description:'旋转、放大或切换到俯视，观察背部斑点、鞘翅中央的接缝、触角和六足。',chips:['圆拱鞘翅','背部斑点','三对足'],clue:'背部中央有两片鞘翅之间的接缝。坚硬的鞘翅保护着下方的膜质后翅。'});
insectData.butterfly.clue='足帮助支撑身体和走动，翅帮助飞行。观察落地前后足的展开与接地。';
insectData.firefly.clue='观察腹部的发光区域，与头部、胸部和翅作比较。';
const specimenOrder=['ant','bee','butterfly','firefly','ladybug3d','fly','cricket','dragonfly','stag'];
const icons={ant:'<ellipse cx="30" cy="41" rx="8" ry="11"/><ellipse cx="30" cy="26" rx="5" ry="7"/><circle cx="30" cy="13" r="7"/><path d="M25 9L19 3M35 9L41 3M26 22L14 15M34 22L46 15M25 27L11 27M35 27L49 27M26 31L15 42M34 31L45 42"/>',cricket:'<ellipse cx="30" cy="32" rx="8" ry="15"/><circle cx="30" cy="14" r="7"/><path d="M26 8Q16 0 10 10M34 8Q44 0 50 10M23 24L13 20L8 28M37 24L47 20L52 28M23 29L14 31L10 38M37 29L46 31L50 38M22 40L12 23L7 47M38 40L48 23L53 47M27 46L24 55M33 46L36 55"/>',wasp:'<ellipse cx="30" cy="40" rx="7" ry="12"/><ellipse cx="30" cy="24" rx="6" ry="7"/><circle cx="30" cy="11" r="6"/><path d="M25 27Q1 5 8 33Q17 40 25 27M35 27Q59 5 52 33Q43 40 35 27M24 22L13 17M36 22L47 17M24 28L12 35M36 28L48 35M24 33L15 44M36 33L45 44M24 38H36M24 44H36M26 7L21 2M34 7L39 2"/>',stag:'<ellipse cx="30" cy="37" rx="12" ry="15"/><rect x="20" y="16" width="20" height="11" rx="5"/><path d="M24 17Q10 4 21 2L25 10M36 17Q50 4 39 2L35 10M30 27V52M19 27L9 20M41 27L51 20M18 35L7 34M42 35L53 34M19 43L10 51M41 43L50 51"/>',bug:'<path d="M23 10H37L39 17L46 23L43 42L30 53L17 42L14 23L21 17ZM23 10L17 2M37 10L43 2M16 25L6 19M44 25L54 19M16 33L5 33M44 33L55 33M19 42L10 51M41 42L50 51M18 22H42M21 23L30 37L39 23"/>'};
specimenOrder.forEach((key,i)=>{const d=insectData[key],button=document.createElement('button');button.className='species';button.dataset.species=key;button.setAttribute('aria-pressed','false');button.innerHTML=`<span class="icon"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg></span><span><b>${d.name}</b><small>${d.sub}</small></span><span class="number">${d.dynamic?'▶':'0'+i}</span>`;button.addEventListener('click',()=>select(key));$(d.dynamic?'dynamic-list':'species-list').append(button)});
icons.fly='<ellipse cx="30" cy="39" rx="7" ry="12"/><ellipse cx="30" cy="24" rx="6" ry="7"/><circle cx="25" cy="12" r="5"/><circle cx="35" cy="12" r="5"/><path d="M25 23Q4 15 6 35Q13 47 25 28M35 23Q56 15 54 35Q47 47 35 28M24 22L17 16M36 22L43 16M24 28L12 34M36 28L48 34M24 32L16 46M36 32L44 46"/>';
icons.ladybug='<ellipse cx="30" cy="35" rx="17" ry="19"/><path d="M21 18Q21 7 30 7Q39 7 39 18M30 17V54M24 10L19 3M36 10L41 3M14 25L7 20M46 25L53 20M13 35H5M47 35H55M16 46L8 53M44 46L52 53"/><circle cx="22" cy="28" r="3"/><circle cx="38" cy="28" r="3"/><circle cx="21" cy="41" r="3"/><circle cx="39" cy="41" r="3"/>';
icons.ladybug3d=icons.ladybug;
icons.bee=icons.wasp;
icons.dragonfly='<ellipse cx="30" cy="14" rx="6" ry="4"/><ellipse cx="30" cy="23" rx="4" ry="5"/><path d="M30 28V55M26 22Q2 6 4 19Q9 26 26 25M34 22Q58 6 56 19Q51 26 34 25M26 26Q2 25 5 35Q13 40 27 29M34 26Q58 25 55 35Q47 40 33 29M26 21L22 16M34 21L38 16M26 26L20 30M34 26L40 30M27 28L22 36M33 28L38 36"/>';
// Refresh icon artwork after creating the specimen buttons.
document.querySelectorAll('.species').forEach(b=>{b.querySelector('svg').innerHTML=icons[b.dataset.species]});
let renderer,scene,camera,controls,mesh,key='fly',serial=0,rotation=0,annotation=false,colored=true,wire=false,lastTime=0;
let animationFrame=null,animationPaused=false,animationSpeed=1,animationClip='Continuous cycle';
const dynamicActive=()=>!!(insectData[key]?.dynamic||insectData[key]?.embedded);
function animationCommand(action,value){animationFrame?.contentWindow?.postMessage({type:'insect-animation-command',action,value},'*')}
function animationButtons(){const action=key==='ant'?'爬行':'连续动作';$('animation-play').textContent=(animationPaused?'继续':'暂停')+action;$('animation-play').setAttribute('aria-pressed',String(animationPaused));$('animation-speed').value=animationSpeed;$('animation-speed-text').textContent=animationSpeed+'×'}
window.addEventListener('message',event=>{
 if(!animationFrame||event.source!==animationFrame.contentWindow)return;
 if(event.data?.type==='insect-animation-ready'){$('loading').hidden=true;window.insectViewer.ready=true;window.insectViewer.key=key;$('animation-play').disabled=false;$('animation-speed').disabled=false;animationCommand('angle','free');if(key==='butterfly')animationCommand('clip','Continuous cycle');notifyClassroom()}
 if(event.data?.type==='insect-animation-error'){$('loading').innerHTML='<b>动画未能加载，请刷新重试</b>'}
 if(event.data?.type==='insect-animation-state'){animationPaused=event.data.paused;animationSpeed=event.data.speed;if(key==='butterfly'&&event.data.clip)animationClip=event.data.clip;animationButtons()}
});
$('animation-play').addEventListener('click',()=>{animationPaused=!animationPaused;animationCommand(animationPaused?'pause':'play');animationButtons()});
$('animation-speed').addEventListener('input',()=>{animationSpeed=Number($('animation-speed').value);animationCommand('speed',animationSpeed);animationButtons()});
const cache=new Map();
// Keep the same control-first sidebar order as the bird observation page.
const controlPanel=document.createElement('section');controlPanel.className='right-controls';
controlPanel.append($('controls-title'),document.querySelector('.switches'),$('animation-controls'));
const viewHeading=document.createElement('h3');viewHeading.textContent='观察角度';controlPanel.append(viewHeading,document.querySelector('.toolbar'));
document.querySelector('.field-notes').prepend(controlPanel);
async function initStatic(){
 await insectAssets.once('three',async()=>{
  if(!window.THREE){if(location.protocol==='file:'||!window.DecompressionStream)await insectAssets.script('vendor/three.js');else{const bytes=await insectAssets.unpack('vendor/three.js.gz'),url=URL.createObjectURL(new Blob([bytes],{type:'text/javascript'}));try{await insectAssets.script(url)}finally{URL.revokeObjectURL(url)}}}
  T=window.THREE;setupStatic();
 });
}
function setupStatic(){
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0xffffff,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 $('stage').prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','可拖动旋转的三维昆虫模型');
 scene=new T.Scene();camera=new T.PerspectiveCamera(36,1,.1,100);controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=3.4;controls.maxDistance=17;
 scene.add(new T.HemisphereLight(0xfafbf4,0x7d826a,2.3));const light=new T.DirectionalLight(0xfff7e7,3);light.position.set(3,7,5);scene.add(light);const fill=new T.DirectionalLight(0xe7f0ff,1.5);fill.position.set(-5,4,-2);scene.add(fill);
 const ground=new T.Mesh(new T.CircleGeometry(3.2,96),new T.MeshBasicMaterial({color:0xd6ddc6,transparent:true,opacity:.13,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.2;scene.add(ground);
 const ring=new T.Mesh(new T.RingGeometry(3.1,3.115,96),new T.MeshBasicMaterial({color:0xcbd4b8,transparent:true,opacity:.5,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-1.195;scene.add(ring);
 const grid=new T.GridHelper(6,12,0xccd4bc,0xe3e8da);grid.position.y=-1.21;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
 const resize=()=>{const r=$('stage').getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe($('stage'));resize();
 controls.addEventListener('start',()=>{rotation=0;syncButtons();document.querySelectorAll('[data-angle]').forEach(b=>b.classList.remove('selected'))});
 requestAnimationFrame(animate);
}catch(e){console.error(e);throw e}
}
function decode(base64,Type){if(base64 instanceof Type)return new Type(base64);const raw=atob(base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new Type(bytes.buffer)}
function load(id){
 if(window.INSECT_MODELS?.[id])return Promise.resolve(window.INSECT_MODELS[id]);if(cache.has(id))return cache.get(id);
 const pending=(async()=>{
  if(location.protocol==='file:'||!window.DecompressionStream){await insectAssets.script(`models/${id}.js`);return window.INSECT_MODELS[id]}
  const buffer=await insectAssets.unpack(`models/${id}.bin.gz`),length=new DataView(buffer).getUint32(0,true),start=4+length;
  const meta=JSON.parse(new TextDecoder().decode(buffer.slice(4,start)));
  if(buffer.byteLength!==start+meta.positionBytes+meta.indexBytes)throw Error('模型数据不完整');
  return {...meta,positions:new Float32Array(buffer.slice(start,start+meta.positionBytes)),indices:new Uint32Array(buffer.slice(start+meta.positionBytes))};
 })();cache.set(id,pending);pending.catch(()=>cache.delete(id));return pending;
}
function colorGeometry(g,id){
 const p=g.attributes.position,a=new Float32Array(p.count*3),regions=new Float32Array(p.count),d=insectData[id];
 const parent=Uint32Array.from({length:p.count},(_,i)=>i),stats=new Map();
 const find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i]}return i};
 if(id==='fly'||id==='ladybug'||id==='cricket'||id==='stag'||id==='dragonfly'){
  const indices=g.index.array;for(let i=0;i<indices.length;i+=3){parent[find(indices[i+1])]=find(indices[i]);parent[find(indices[i+2])]=find(indices[i])}
  for(let i=0;i<p.count;i++){const root=find(i);if(!stats.has(root))stats.set(root,{lo:[Infinity,Infinity,Infinity],hi:[-Infinity,-Infinity,-Infinity]});const s=stats.get(root);for(let axis=0;axis<3;axis++){const v=p.array[i*3+axis];s.lo[axis]=Math.min(s.lo[axis],v);s.hi[axis]=Math.max(s.hi[axis],v)}}
 }
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);let color;
  if(id==='fly'){const s=stats.get(find(i)),wing=s.lo[1]>.45&&s.hi[2]-s.lo[2]>2;const eye=z>1.35&&y>.15&&Math.abs(x)>.28;regions[i]=wing?1:s.hi[1]>1&&s.lo[2]>-.5?3:s.hi[1]>.9&&s.hi[2]<.1?4:0;color=new T.Color(wing?'#c6d4d0':eye?'#a6372d':Math.abs(x)>.7?'#54452e':'#59625d')}
  if(id==='cricket'){const s=stats.get(find(i));regions[i]=s.hi[1]>.30&&s.lo[1]>-.4&&s.hi[2]-s.lo[2]>1.5&&s.hi[0]-s.lo[0]>.5?1:0;color=new T.Color(z>1.36?'#463126':Math.abs(x)>.4?'#a67b48':'#765138');if(z>1.38&&Math.abs(x)>.26&&y>-.1)color.set('#25251e');if(z>1.5&&Math.abs(x)<.2)color.set('#a97844')}
  if(id==='stag'){
   const s=stats.get(find(i)),shell=s.hi[1]>.2&&s.lo[1]>-.4&&s.hi[2]-s.lo[2]>1.5&&s.hi[0]-s.lo[0]>.5;
   const jaw=s.hi[2]>2.1&&s.hi[0]-s.lo[0]>.4;
   const armor=s.lo[2]>0&&s.hi[1]>.3&&s.hi[0]-s.lo[0]>.8;
   regions[i]=shell?1:jaw?2:armor?3:0;
   color=new T.Color(shell?'#563623':jaw?'#4b2c21':armor?'#302b22':y<-.25?'#755039':'#413326');
  }
  if(id==='ladybug'){const s=stats.get(find(i)),shell=s.hi[1]>.95&&s.hi[2]-s.lo[2]>2.8;regions[i]=shell?1:0;color=new T.Color(shell?'#cc3824':z>1&&y>-.2&&Math.abs(x)>.58?'#eadbb8':'#282e26')}
  if(id==='dragonfly'){const s=stats.get(find(i)),wing=s.hi[0]-s.lo[0]>2&&s.lo[1]>.2&&s.hi[1]<.6;regions[i]=wing?1:0;color=new T.Color(wing?'#d5d8c9':Math.abs(x)<.27&&Math.sin(z*24)>.45?'#bba15c':'#47504a')}
  // A subtle grain suggests surface detail without claiming original textures.
  const grain=.94+.06*Math.sin(x*67+y*41+z*53);color.multiplyScalar(grain);color.toArray(a,i*3);
 }
 g.setAttribute('color',new T.BufferAttribute(a,3));
 g.setAttribute('paintRegion',new T.BufferAttribute(regions,1));
 const wingUV=new Float32Array(p.count*2);
 if(id==='fly'||id==='dragonfly'){
  for(let i=0;i<p.count;i++){if(regions[i]!==1)continue;const s=stats.get(find(i));wingUV[i*2]=Math.abs((p.getX(i)-s.lo[0])/(s.hi[0]-s.lo[0])-(s.hi[0]<0?1:0));wingUV[i*2+1]=(p.getZ(i)-s.lo[2])/(s.hi[2]-s.lo[2])}
  const body=[],wings=[],indices=g.index.array;for(let i=0;i<indices.length;i+=3){const target=regions[indices[i]]===1?wings:body;target.push(indices[i],indices[i+1],indices[i+2])}
  g.setIndex([...body,...wings]);g.clearGroups();g.addGroup(0,body.length,0);g.addGroup(body.length,wings.length,1);
 }
 g.setAttribute('wingUV',new T.BufferAttribute(wingUV,2));
}
const membranePattern=`
 if(vPaintRegion>.5&&vPaintRegion<1.5){
  vec2 uv=vWingUV;
  float mainSignal=sin(uv.y*15.0+uv.x*2.8+sin(uv.x*3.0)*.8);
  float crossSignal=sin(uv.x*35.0+uv.y*3.0);
  float mainVein=1.0-smoothstep(.025,.025+max(fwidth(mainSignal)*1.1,.09),abs(mainSignal));
  float crossVein=1.0-smoothstep(.02,.02+max(fwidth(crossSignal)*1.1,.10),abs(crossSignal));
  float vein=max(mainVein,crossVein*.58);
  vec3 tint=mix(vec3(.71,.78,.76),vec3(.82,.79,.72),uv.x*.35);
  vec3 membrane=mix(tint,vec3(.32,.39,.32),vein*.62);
  diffuseColor.rgb=pow(membrane,vec3(2.2));
  diffuseColor.a=mix(.62,.94,vein);
 }
`;
function detailPaint(material,id){
 const patterns={
  fly:`
   if(vPaintRegion>0.5&&vPaintRegion<1.5){
    ${membranePattern}
   }else if(vPaintRegion<.5&&q.z>1.35&&q.y>.15&&abs(q.x)>.28){
    float facet=.94+.06*sin(q.x*110.0)*sin(q.y*110.0);
    diffuseColor.rgb=pow(vec3(.63,.15,.11)*facet,vec3(2.2));
   }else if(vPaintRegion>2.5&&vPaintRegion<3.5){
    float stripe=1.0-smoothstep(.035,.060,min(abs(abs(q.x)-.18),abs(abs(q.x)-.45)));
    diffuseColor.rgb=pow(mix(vec3(.52,.55,.49),vec3(.19,.22,.20),stripe),vec3(2.2));
   }else if(vPaintRegion>3.5){
    float band=1.0-smoothstep(.10,.29,abs(sin(q.z*13.0)));
    diffuseColor.rgb=pow(mix(vec3(.48,.43,.29),vec3(.24,.27,.23),band*.75),vec3(2.2));
   }`,
  dragonfly:membranePattern,
  cricket:`
   if(vPaintRegion>.5){
    float vein=1.0-smoothstep(.025,.13,abs(sin(q.x*83.0+q.z*2.0)));
    float cross=1.0-smoothstep(.02,.10,abs(sin(q.z*38.0)));
    vec3 wing=mix(vec3(.57,.36,.16),vec3(.78,.59,.32),smoothstep(-.36,.33,q.y));
    diffuseColor.rgb=pow(mix(wing,vec3(.28,.19,.10),vein*.45+cross*.10),vec3(2.2));
   }else{
    diffuseColor.rgb*=.92+.08*sin(q.z*30.0+q.y*20.0);
   }`,
  stag:`
   float grain=.96+.04*sin(q.x*237.0+q.z*31.0)*sin(q.y*181.0-q.z*99.0);
   if(vPaintRegion>.5&&vPaintRegion<1.5){
    float edge=smoothstep(.20,.52,abs(q.x));
    float ridge=pow(.5+.5*sin(abs(q.x)*91.0+q.z*.7),12.0);
    float seam=1.0-smoothstep(.004,.018,abs(q.x));
    vec3 shell=mix(vec3(.27,.15,.075),vec3(.44,.29,.14),edge*.48);
    shell=mix(shell,vec3(.17,.105,.055),ridge*.20+seam*.65);
    diffuseColor.rgb=pow(shell*grain,vec3(2.2));
   }else if(vPaintRegion>1.5&&vPaintRegion<2.5){
    vec3 jaw=mix(vec3(.32,.17,.10),vec3(.11,.095,.07),smoothstep(1.1,2.4,q.z));
    diffuseColor.rgb=pow(jaw*grain,vec3(2.2));
   }else if(vPaintRegion>2.5){
    float warmEdge=smoothstep(.25,.52,abs(q.x));
    diffuseColor.rgb=pow(mix(vec3(.15,.14,.105),vec3(.31,.25,.15),warmEdge*.65)*grain,vec3(2.2));
   }else{
    float joint=.90+.10*sin(q.z*34.0+q.x*28.0);
    diffuseColor.rgb*=joint*grain;
   }`,
  ladybug:`
   if(vPaintRegion>.5){
    float dist=length(q.xz-vec2(0.0,.86))-.23;
    dist=min(dist,length(q.xz-vec2(.62,.34))-.28);
    dist=min(dist,length(q.xz-vec2(-.62,.34))-.28);
    dist=min(dist,length(q.xz-vec2(.99,-.46))-.28);
    dist=min(dist,length(q.xz-vec2(-.99,-.46))-.28);
    dist=min(dist,length(q.xz-vec2(.57,-1.27))-.26);
    dist=min(dist,length(q.xz-vec2(-.57,-1.27))-.26);
    float spot=1.0-smoothstep(-.008,.008,dist);
    float seam=1.0-smoothstep(.007,.020,abs(q.x));
    vec3 shell=mix(vec3(.80,.14,.07),vec3(.91,.24,.10),smoothstep(.0,1.08,q.y));
    diffuseColor.rgb=pow(mix(shell,vec3(.065,.075,.057),max(spot,seam*.60)),vec3(2.2));
   }`
 };
 if(!patterns[id])return;
 material.onBeforeCompile=shader=>{
  shader.vertexShader='attribute float paintRegion; attribute vec2 wingUV; varying vec2 vWingUV; varying float vPaintRegion; varying vec3 vPaintPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvPaintPosition=position; vPaintRegion=paintRegion; vWingUV=wingUV;');
  shader.fragmentShader='varying vec2 vWingUV; varying float vPaintRegion; varying vec3 vPaintPosition;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n#ifdef USE_COLOR\nvec3 q=vPaintPosition;\n'+patterns[id]+'\n#endif');
  if(id==='stag')shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n#ifdef USE_COLOR\nroughnessFactor=vPaintRegion>.5&&vPaintRegion<1.5?.30:vPaintRegion>1.5&&vPaintRegion<2.5?.37:.50;\n#endif');
 };
 material.customProgramCacheKey=()=>id+'-detailed-paint-v6';
 if(id==='ladybug'){material.roughness=.33;material.metalness=.07}
 if(id==='stag'){material.roughness=.43;material.metalness=.08}
}
function modelMaterials(){return mesh?(Array.isArray(mesh.material)?mesh.material:[mesh.material]):[]}
function updateMaterialMode(){modelMaterials().forEach(m=>{m.vertexColors=colored;m.color.set(colored?0xffffff:0xe3e1d4);m.wireframe=wire;m.transparent=!!m.userData.membrane&&colored&&!wire;m.depthWrite=!m.transparent;m.needsUpdate=true})}
async function select(id){
 const request=++serial;key=id;rotation=0;colored=true;wire=false;annotation=false;syncButtons();$('loading').hidden=false;$('loading').innerHTML='<span></span><b>正在准备'+insectData[id].name+'…</b>';
 window.insectViewer.ready=false;animationFrame?.remove();animationFrame=null;
 const isDynamic=dynamicActive();if(renderer)renderer.domElement.hidden=isDynamic;$('labels').hidden=true;document.querySelector('.switches').hidden=isDynamic;$('animation-controls').hidden=!isDynamic||!!insectData[id].embedded;$('controls-title').textContent=isDynamic&&!insectData[id].embedded?'播放控制':'观察控制';
 document.querySelector('.color-note').textContent='模型用于观察示意，大小与动作不代表实测数据。';
 document.querySelectorAll('.species').forEach(b=>{b.classList.toggle('active',b.dataset.species===id);b.setAttribute('aria-pressed',b.dataset.species===id?'true':'false')});
 const d=insectData[id];$('stage-name').textContent=d.name;$('latin').textContent=d.latin;$('note-title').textContent=d.title;$('description').textContent=d.description;$('chips').replaceChildren(...d.chips.map(s=>{const el=document.createElement('span');el.textContent=s;return el}));$('question').textContent=d.question;$('clue').textContent=d.clue;$('clue').hidden=true;$('reveal').setAttribute('aria-expanded','false');$('reveal').lastElementChild.textContent='＋';$('specimen-tag').textContent='SPECIMEN / 0'+(Object.keys(insectData).indexOf(id)+1);document.title=d.name+' · 昆虫观察台';
 if(mesh){scene.remove(mesh);mesh.geometry.dispose();modelMaterials().forEach(m=>m.dispose());mesh=null}
 if(isDynamic){
  document.querySelector('.color-note').textContent=id==='firefly'?'基于原绑定与动作增加悬停、扇翅和起落教学示意，保留原贴图与腹部发光材质；不代表实测运动、发光节律或真实体型比例。':id==='butterfly'?'原FBX没有自带动画。连续起落为本页制作的教学示意，不代表真实物种的运动数据；大小不代表真实比例。':'复用黑色蚂蚁离线动画。动态观察用于比较动作与姿态；模型大小不代表真实体型比例。';
  animationClip='Continuous cycle';
  document.querySelector('#animation-controls>p').textContent=id==='firefly'?'连续动作：地面弹跳一次 → 扇翅飞起 → 悬停约8秒 → 缓缓落地。飞行中不再弹跳，可暂停、慢放。':id==='butterfly'?'自动循环：地面扇翅 → 起飞 → 空中悬停 → 缓缓落地。可暂停、慢放观察。':'慢放看足的交替，暂停看支撑姿态。';
  annotation=false;animationPaused=false;animationSpeed=1;animationButtons();$('animation-play').disabled=true;$('animation-speed').disabled=true;$('material-tag').textContent=id==='firefly'?'萤火虫 · 悬停落地示意':id==='butterfly'?'蝴蝶 · 动作示意':'黑色蚂蚁 · 爬行动画';
  if(d.embedded){$('material-tag').textContent='七星瓢虫 · 原始贴图';document.querySelector('.color-note').textContent='保留用户提供模型的原始材质与姿态。源文件有绑定但无动画；本次为静态观察。模型大小不代表与其他昆虫的真实比例。'}
  if(id==='bee'){$('material-tag').textContent='蜜蜂 · 原始动画';document.querySelector('.color-note').textContent='保留原贴图与骨骼动画。轻量网页副本不包含粒子毛发和大型动画缓存；大小与动作不作为实测数据。';document.querySelector('#animation-controls>p').textContent='循环播放原始动画，可暂停、慢放观察翅、足和触角。'}
  document.querySelector('.color-note').textContent='模型用于观察示意，大小与动作不代表实测数据。';
  if(id==='bee')document.querySelector('#animation-controls>p').textContent='可暂停、慢放，观察翅、足和触角的变化。';
  animationFrame=document.createElement('iframe');animationFrame.className='animation-frame';animationFrame.title=d.name+'三维动作观察';animationFrame.src=`animations/${id}${location.protocol==='file:'||!window.DecompressionStream?'':'-web'}.html?v=27`;$('stage').prepend(animationFrame);window.insectViewer.triangles=null;
  const param=new URLSearchParams(location.search);param.set('insect',id);try{history.replaceState(null,'','?'+param)}catch(e){}
  document.querySelectorAll('[data-angle]').forEach(b=>b.classList.toggle('selected',b.dataset.angle==='free'));return;
 }
 try{
  const [,source]=await Promise.all([initStatic(),load(id)]);if(request!==serial){if(renderer)renderer.domElement.hidden=dynamicActive();return}renderer.domElement.hidden=false;
  const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(decode(source.positions,Float32Array),3));g.setIndex(new T.BufferAttribute(decode(source.indices,Uint32Array),1));if(d.flip)g.rotateZ(Math.PI);g.rotateX(-Math.PI/2);g.computeVertexNormals();colorGeometry(g,id);
  const bodyMaterial=new T.MeshStandardMaterial({vertexColors:colored,color:colored?0xffffff:0xe3e1d4,roughness:.52,metalness:.05,wireframe:wire,side:T.DoubleSide});detailPaint(bodyMaterial,id);
  let material=bodyMaterial;
  if(id==='fly'||id==='dragonfly'){
   const wingMaterial=new T.MeshPhysicalMaterial({vertexColors:colored,roughness:.32,metalness:.02,clearcoat:.35,clearcoatRoughness:.25,side:T.DoubleSide,forceSinglePass:true});wingMaterial.userData.membrane=true;detailPaint(wingMaterial,id);material=[bodyMaterial,wingMaterial];
  }
  mesh=new T.Mesh(g,material);scene.add(mesh);updateMaterialMode();
  const floor=source.bounds[0][2]-.12;
  scene.children.forEach(o=>{if(o.geometry?.type==='CircleGeometry')o.position.y=floor;if(o.geometry?.type==='RingGeometry')o.position.y=floor+.005;if(o.type==='GridHelper')o.position.y=floor-.01});
  const param=new URLSearchParams(location.search);param.set('insect',id);try{history.replaceState(null,'','?'+param)}catch(e){}
  labels();angle('free');$('loading').hidden=true;
  window.insectViewer.ready=true;window.insectViewer.key=id;window.insectViewer.triangles=source.triangles;notifyClassroom();
 }catch(e){if(request!==serial)return;$('loading').innerHTML='<b>模型未能加载</b><p>请检查网络或文件夹是否完整，再点一次昆虫重试。</p>';console.error(e)}
}
function angle(type){rotation=0;syncButtons();if(dynamicActive()){animationCommand('angle',type);document.querySelectorAll('[data-angle]').forEach(b=>b.classList.toggle('selected',b.dataset.angle===type));return}if(!controls)return;const damping=controls.enableDamping;controls.autoRotate=false;controls.enableDamping=false;controls.update();controls.target.set(0,.05,0);const views={free:[4.7,5.3,6.3],top:[0,10.8,.001],side:[10.8,1.1,0],front:[0,1.5,10.8]};camera.up.set(0,1,0);camera.position.fromArray(views[type]);controls.update();controls.enableDamping=damping;document.querySelectorAll('[data-angle]').forEach(b=>b.classList.toggle('selected',b.dataset.angle===type))}
function labels(){const d=insectData[key];$('labels').replaceChildren();[['head','头'],['thorax','胸'],['abdomen','腹']].forEach(([part,text])=>{const el=document.createElement('span');el.className='model-label';el.textContent=text;el.dataset.part=part;$('labels').append(el)});$('labels').hidden=!annotation}
function updateLabels(){if(!annotation||!mesh)return;const r=$('stage').getBoundingClientRect();$('labels').querySelectorAll('.model-label').forEach(el=>{const v=new T.Vector3(...insectData[key][el.dataset.part]).applyMatrix4(mesh.matrixWorld).project(camera);el.style.left=(v.x*.5+.5)*r.width+'px';el.style.top=(-v.y*.5+.5)*r.height+'px';el.hidden=v.z>1||v.z< -1})}
function syncButtons(){$('spin').setAttribute('aria-pressed',rotation?'true':'false');for(const [name,val] of [['color',colored],['annotation',annotation],['wire',wire]]){$(name).classList.toggle('active',val);$(name).setAttribute('aria-pressed',String(val))}$('material-tag').textContent=key==='bee'?'蜜蜂 · 原始动画':insectData[key]?.embedded?'七星瓢虫 · 原始贴图':dynamicActive()?(key==='firefly'?'萤火虫 · 悬停落地示意':key==='butterfly'?'蝴蝶 · 动作示意':'黑色蚂蚁 · 爬行动画'):colored?'示意着色':'原始白模'}
function animate(time){requestAnimationFrame(animate);const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;if(dynamicActive()||document.hidden)return;controls.autoRotate=!!rotation;controls.autoRotateSpeed=.75;controls.update(dt);renderer.render(scene,camera);updateLabels()}
document.querySelectorAll('[data-angle]').forEach(b=>b.addEventListener('click',()=>angle(b.dataset.angle)));
$('spin').addEventListener('click',()=>{rotation=rotation?0:1;if(dynamicActive())animationCommand('spin',!!rotation);syncButtons()});
$('zoom-in').addEventListener('click',()=>zoom(.82));$('zoom-out').addEventListener('click',()=>zoom(1.22));
function zoom(factor){if(dynamicActive()){animationCommand('zoom',factor);return}if(!controls)return;const offset=camera.position.clone().sub(controls.target);offset.setLength(T.MathUtils.clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update()}
$('color').addEventListener('click',()=>{colored=!colored;updateMaterialMode();syncButtons()});
$('wire').addEventListener('click',()=>{wire=!wire;updateMaterialMode();syncButtons()});
$('annotation').addEventListener('click',()=>{annotation=!annotation;$('labels').hidden=!annotation;syncButtons()});
$('reset').addEventListener('click',()=>{annotation=false;colored=true;wire=false;updateMaterialMode();$('labels').hidden=true;angle('free');if(dynamicActive()){animationPaused=false;animationSpeed=1;animationCommand('reset');animationButtons()}});
$('reveal').addEventListener('click',()=>{const open=$('clue').hidden;$('clue').hidden=!open;$('reveal').setAttribute('aria-expanded',String(open));$('reveal').lastElementChild.textContent=open?'−':'＋'});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){$('fullscreen').textContent='请用浏览器全屏'}});document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'退出全屏 ↙':'全屏观察 ↗'});
const signature=document.createElement('div');signature.className='signature';signature.textContent='有志青年vibe coding';document.querySelector('.field-notes').append(signature);
window.insectViewer={ready:false,getState:()=>({key,dynamic:dynamicActive(),animationPaused,animationSpeed,annotation,colored,wire,rotating:!!rotation,camera:camera?.position.toArray(),triangles:window.insectViewer.triangles}),capture:()=>{if(!renderer)return null;renderer.render(scene,camera);return renderer.domElement.toDataURL('image/png')}};
const requested=new URLSearchParams(location.search).get('insect');select(requested==='ladybug'?'ladybug3d':Object.hasOwn(insectData,requested)?requested:'ant');
})();
