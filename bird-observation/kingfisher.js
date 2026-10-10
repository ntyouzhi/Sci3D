import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {createSmoothFeatherMaterial} from './kingfisher/feather-material.js';
import {smoothCrown} from './kingfisher/smooth-crown.js';
const $=id=>document.getElementById(id==='timeline'?'phase':id),canvas=document.createElement('canvas');$('view').prepend(canvas);const timeLabel=document.createElement('div');timeLabel.id='time';timeLabel.className='kingfisher-time';$('phase').after(timeLabel);const clipLabelElement=document.createElement('div');clipLabelElement.id='clipName';clipLabelElement.hidden=true;$('phase').after(clipLabelElement);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
let renderDirty=true;
renderer.setPixelRatio(2);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.01,1000);
scene.add(new THREE.HemisphereLight(0xffffff,0xd7dccc,2.4));
for(const [position,intensity] of [[[4,7,5],.65],[[-5,3,-4],.35]]){const light=new THREE.DirectionalLight(0xffffff,intensity);light.position.set(...position);scene.add(light)}
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.07;controls.autoRotateSpeed=.6;controls.enablePan=false;
controls.addEventListener('change',()=>renderDirty=true);
let model,mixer,action,clips=[],radius=1,playing=true,current=0;
let continuous=false,sequence=[],sequenceTime=0,sequenceDuration=0,phase=-1,perch;
const basePosition=new THREE.Vector3();
const labels={'fly1':'飞行 · 01','fly2':'飞行 · 02','fly3':'飞行 · 03','fly_endA':'收翼 · A','fly_endB':'收翼 · B','fly_startA':'起飞 · A','fly_startB':'起飞 · B','idleA1':'静止 · A1','idleA2':'静止 · A2','idleB1':'静止 · B1'};
const clipLabel=c=>labels[c.name.replace(/_bird_GLTF_created_0|_GLTF_created_0/g,'')]||c.name;
function view(type='home'){const positions={home:[1.55,.7,2.25],side:[2.8,.2,0],front:[0,.2,2.8],back:[0,.35,-2.8],top:[.01,2.8,.01]};camera.position.set(...positions[type]).multiplyScalar(radius*(continuous?1.12:1));controls.target.set(0,continuous?radius*.08:0,0);controls.update()}
function startContinuous(){continuous=true;sequenceTime=0;phase=-1;mixer.stopAllAction();if(perch)perch.visible=true;$('timeline').max=sequenceDuration;$('status').textContent='连续观察 · 站立';setSequenceTime(0,false);view();}
function setSequenceTime(value,blend=false){
 renderDirty=true;
 sequenceTime=((value%sequenceDuration)+sequenceDuration)%sequenceDuration;
 const index=sequence.findIndex(s=>sequenceTime<s.end),step=sequence[index],local=sequenceTime-step.start;
 if(index!==phase||!blend){const previous=action;if(!blend)mixer.stopAllAction();action=mixer.clipAction(clips[step.clip]);if(!blend||previous!==action){action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).setLoop(step.repeat?THREE.LoopRepeat:THREE.LoopOnce,step.repeat?Infinity:1);action.clampWhenFinished=true;action.time=local%clips[step.clip].duration;action.play();if(blend&&previous&&previous!==action)action.crossFadeFrom(previous,.28,false);}phase=index;current=step.clip;}
 if(!blend){action.time=Math.min(local%clips[step.clip].duration,clips[step.clip].duration-.001);mixer.update(0);}
 const t=local/step.duration,smooth=t*t*(3-2*t),height=step.label==='起飞'?smooth:step.label==='降落'?1-smooth:step.label==='飞行'?1:0;
 model.position.copy(basePosition);model.position.y+=radius*.3*height;
 if(perch&&step.label==='站立'){model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update()});const feet=new THREE.Box3().setFromObject(model,true);model.position.y+=perch.position.y+radius*.0325-feet.min.y;}
 $('clipName').textContent='连续演示 · '+step.label;$('status').textContent='连续观察 · '+step.label;document.querySelectorAll('.phase-node').forEach(node=>node.classList.toggle('active',Number(node.dataset.phase)===index));
 window.sequenceState={time:sequenceTime,duration:sequenceDuration,phase:step.label,index};
}
new GLTFLoader().load('./kingfisher/bird.glb',gltf=>{
 model=gltf.scene;scene.add(model);model.updateMatrixWorld(true);
 window.crownDiagnostics=smoothCrown(model);
 // Reveal the continuous textured body beneath redundant chest and back tufts.
 // Keep Object_596 wing coverts and the main flight feathers to preserve wing coverage.
 const redundantPlumageCards=new Set(['Object_575','Object_581','Object_584','Object_578','Object_572']);
 model.traverse(object=>{if(redundantPlumageCards.has(object.name))object.visible=false});
 const smoothMaterials=new Map();
 model.traverse(object=>{if(!object.isMesh)return;const convert=source=>{if(!smoothMaterials.has(source))smoothMaterials.set(source,createSmoothFeatherMaterial(source));return smoothMaterials.get(source)};object.material=Array.isArray(object.material)?object.material.map(convert):convert(object.material)});
 const materials=new Set(),textures=new Set();
 model.traverse(object=>{if(!object.isMesh)return;object.frustumCulled=false;for(const material of Array.isArray(object.material)?object.material:[object.material]){
  if(materials.has(material))continue;materials.add(material);
  // Smooth feather alpha with depth writes and one double-sided pass; no noisy hash.
  material.transparent=true;material.opacity=1;material.alphaTest=.025;material.alphaHash=false;material.alphaToCoverage=false;material.depthWrite=true;material.depthTest=true;material.side=THREE.DoubleSide;material.forceSinglePass=true;material.flatShading=false;material.metalness=0;material.roughness=.52;material.roughnessMap=null;material.needsUpdate=true;
  for(const texture of [material.map,material.roughnessMap,material.metalnessMap,material.normalMap]){if(!texture||textures.has(texture))continue;textures.add(texture);texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());texture.magFilter=THREE.LinearFilter;texture.minFilter=THREE.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;}
 }});
 window.materialDiagnostics={materialCount:materials.size,smoothAlpha:[...materials].every(m=>m.transparent&&m.depthWrite&&!m.alphaHash&&m.forceSinglePass),anisotropy:[...textures].map(t=>t.anisotropy),renderScale:renderer.getPixelRatio()};
 const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());model.position.sub(center);radius=Math.max(size.x,size.y,size.z)*.56;
 controls.minDistance=radius*.8;controls.maxDistance=radius*6;camera.near=radius*.05;camera.far=radius*20;camera.updateProjectionMatrix();view();
 mixer=new THREE.AnimationMixer(model);clips=gltf.animations;
 basePosition.copy(model.position);
 const find=name=>clips.findIndex(c=>c.name.startsWith(name+'_'));
 const standing=find('idleA1'),takeoff=find('fly_startA'),flight=find('fly1'),landing=find('fly_endA');
 if([standing,takeoff,flight,landing].every(i=>i>=0)){
  sequence=[{clip:standing,label:'站立',duration:2,repeat:true},{clip:takeoff,label:'起飞',duration:clips[takeoff].duration,repeat:false},{clip:flight,label:'飞行',duration:clips[flight].duration*3,repeat:true},{clip:landing,label:'降落',duration:clips[landing].duration,repeat:false},{clip:standing,label:'站立',duration:2,repeat:true}];
  sequence.forEach(s=>{s.start=sequenceDuration;sequenceDuration+=s.duration;s.end=sequenceDuration});
  sequence.forEach((step,i)=>{const button=document.createElement('button');button.className='phase-node';button.dataset.phase=i;button.textContent=step.label;button.style.left=((step.start+step.duration/2)/sequenceDuration*100)+'%';button.setAttribute('aria-label','定位到'+step.label);button.onclick=()=>{playing=false;$('play').textContent='播放';setSequenceTime(step.start+.001,false);updateTime()};$('phaseNodes').append(button)});
 }
 if(sequence.length){startContinuous();model.updateMatrixWorld(true);model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update()});const box=new THREE.Box3().setFromObject(model,true);perch=new THREE.Mesh(new THREE.CylinderGeometry(radius*.32,radius*.36,radius*.065,64),new THREE.MeshStandardMaterial({color:0xb4bd9e,roughness:1}));perch.position.set(0,box.min.y-radius*.0325,0);scene.add(perch);$('play').disabled=false;$('reset').disabled=false;$('phase').disabled=false;$('play').textContent='暂停';}else throw new Error('缺少连续动作素材');
 renderDirty=true;window.demoReady=true;
},xhr=>{if(xhr.total)$('status').textContent='正在加载翠鸟… '+Math.round(xhr.loaded/xhr.total*100)+'%'},error=>{$('status').textContent='翠鸟加载失败，请刷新重试';console.error(error)});
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'暂停':'播放'};
$('timeline').oninput=()=>{if(!action)return;renderDirty=true;if(continuous)setSequenceTime(Number($('timeline').value),false);else{action.time=Number($('timeline').value);mixer.update(0)}updateTime()};
$('speed').oninput=()=>{$('speedText').textContent=Number($('speed').value)+'×'};
const backButton=document.createElement('button');backButton.dataset.view='back';backButton.textContent='背面';document.querySelector('.buttons.views').append(backButton);
document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>view(button.dataset.view));
$('reset').onclick=()=>{playing=false;startContinuous();$('play').textContent='播放';updateTime()};
function updateTime(){if(!action)return;const time=continuous?sequenceTime:action.time,duration=continuous?sequenceDuration:clips[current].duration;$('time').textContent=time.toFixed(2)+' / '+duration.toFixed(2)+' s';if(document.activeElement!==$('timeline'))$('timeline').value=time}
const clock=new THREE.Clock();
function resize(){renderDirty=true;const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
new ResizeObserver(resize).observe(canvas);resize();
renderer.setAnimationLoop(()=>{const dt=Math.min(clock.getDelta(),.1)*Number($('speed').value);if(mixer&&playing){mixer.update(dt);if(continuous)setSequenceTime(sequenceTime+dt,true);renderDirty=true}controls.update();updateTime();if(renderDirty){renderer.render(scene,camera);renderDirty=false}});
