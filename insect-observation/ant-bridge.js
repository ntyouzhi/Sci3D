// Only the dedicated embedded copy uses this bridge; the source stays intact.
(() => {
 const ant=document.getElementById('viewer');
 const butterfly=ant.dataset.species==='butterfly';
 const firefly=ant.dataset.species==='firefly';
 const notify=type=>parent.postMessage({type,paused:ant.paused,speed:ant.timeScale,clip:ant.animationName},'*');
 let clipRequest=0,finishPending=false,butterflyRadius=null;
 const freeOrbit=()=>`35deg 68deg ${butterflyRadius?butterflyRadius+'m':'auto'}`;
 async function changeClip(name){
  if(!ant.availableAnimations.includes(name))return;
  // The motion clips already ease their wing/height transitions. Keep the
  // viewer from blending paused or clamped actions into the next root pose.
  const request=++clipRequest;ant.pause();ant.animationCrossfadeDuration=0;ant.animationName=name;await ant.updateComplete;if(request!==clipRequest)return;
  ant.currentTime=0;ant.play({repetitions:name==='Landing'?1:Infinity});notify('insect-animation-state');
 }
 function finishLanding(){if(butterfly&&ant.animationName==='Landing'&&!finishPending){finishPending=true;changeClip('Gentle wing flutter').finally(()=>{finishPending=false})}}
 ant.addEventListener('finished',finishLanding);
 // Some bundled viewer versions clamp one-shot playback without relaying
 // the mixer event. Check the public playback clock too; pause/slow-motion
 // remain respected, unlike a fixed wall-clock timeout.
 function checkLanding(){if(butterfly&&ant.loaded&&!ant.paused&&ant.animationName==='Landing'&&ant.currentTime>=ant.duration-.015)finishLanding();requestAnimationFrame(checkLanding)}
 if(butterfly)requestAnimationFrame(checkLanding);
 ant.addEventListener('load',()=>{ant.exposure=firefly?1.1:butterfly?1.05:1.45;ant.shadowIntensity=firefly?.2:butterfly?.12:.65;ant.minCameraOrbit='auto 0deg auto';ant.maxCameraOrbit='auto 180deg auto';ant.minFieldOfView='12deg';ant.maxFieldOfView='65deg';if(butterfly||firefly){const target=ant.getCameraTarget();ant.cameraTarget=`${target.x}m ${target.y}m ${target.z}m`;butterflyRadius=ant.getCameraOrbit().radius}notify('insect-animation-ready')});
 ant.addEventListener('error',()=>notify('insect-animation-error'));
 window.addEventListener('message',async event=>{
  if(event.source!==parent||event.data?.type!=='insect-animation-command')return;
  const {action,value}=event.data;
  if(action==='play')ant.play({repetitions:butterfly&&ant.animationName==='Landing'?1:Infinity});
  if(action==='pause')ant.pause();
  if(action==='speed')ant.timeScale=value;
  if(action==='clip'&&butterfly)await changeClip(value);
  if(action==='angle'){
   ant.autoRotate=false;
   const distance=butterflyRadius?butterflyRadius+'m':'auto';
   ant.cameraOrbit=({free:`35deg 68deg ${distance}`,top:`0deg 0.5deg ${distance}`,side:`0deg 80deg ${distance}`,front:`90deg 80deg ${distance}`})[value];
   ant.fieldOfView='auto';await ant.updateComplete;ant.jumpCameraToGoal();
  }
  if(action==='spin')ant.autoRotate=value;
  if(action==='zoom'){ant.fieldOfView=Math.max(18,Math.min(65,ant.getFieldOfView()*value))+'deg';await ant.updateComplete;ant.jumpCameraToGoal()}
  if(action==='reset'){ant.autoRotate=false;ant.timeScale=1;ant.currentTime=0;ant.cameraOrbit=freeOrbit();ant.fieldOfView='auto';await ant.updateComplete;ant.jumpCameraToGoal();if(butterfly&&ant.animationName==='Landing')await changeClip('Gentle wing flutter');else ant.play({repetitions:Infinity})}
  notify('insect-animation-state');
 });
 if(ant.loaded)notify('insect-animation-ready');
 window.antEmbeddedState=()=>({ready:ant.loaded,paused:ant.paused,time:ant.currentTime,speed:ant.timeScale,orbit:ant.getCameraOrbit(),fov:ant.getFieldOfView(),rotating:ant.autoRotate,animations:ant.availableAnimations,clip:ant.animationName});
 window.insectAnimatedState=window.antEmbeddedState;
})();
