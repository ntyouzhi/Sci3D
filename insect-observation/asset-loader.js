/* Explicit gzip works on static hosts without server compression settings. */
window.insectAssets=(()=>{
 const pending=new Map(),cacheName='insect-observation-assets-v26';
 const maxAgeMs=30*24*60*60*1000,stampHeader='X-Insect-Cached-At';
 // Bound storage lifetime and remove obsolete app versions only. Cache
 // Storage itself has no expiration policy, and browsers may evict it sooner.
 const maintenance=(async()=>{try{const names=await caches.keys();await Promise.all(names.filter(n=>/^insect-observation-assets-v\d+$/.test(n)&&n!==cacheName).map(n=>caches.delete(n)));const current=await caches.open(cacheName);await Promise.all((await current.keys()).map(async request=>{const hit=await current.match(request);const saved=Number(hit?.headers.get(stampHeader));if(!saved||Date.now()-saved>=maxAgeMs)await current.delete(request)}))}catch(e){}})();
 async function response(url){
  const request=new Request(new URL(url,document.baseURI));let cache;
  await maintenance;
  try{cache=await caches.open(cacheName);const hit=await cache.match(request);if(hit){const saved=Number(hit.headers.get(stampHeader));if(saved&&Date.now()-saved<maxAgeMs)return hit;await cache.delete(request)}}catch(e){}
  const result=await fetch(request);if(!result.ok)throw Error('资源读取失败 '+result.status);
  if(cache){const copy=result.clone();const headers=new Headers(copy.headers);headers.set(stampHeader,String(Date.now()));const stored=new Response(await copy.arrayBuffer(),{status:copy.status,statusText:copy.statusText,headers});await cache.put(request,stored).catch(()=>{})}return result;
 }
 async function unpack(url){return new Response((await response(url)).body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()}
 function script(url){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>{s.remove();reject(Error('组件读取失败'))};document.head.append(s)})}
 function once(key,task){if(!pending.has(key)){const p=task();pending.set(key,p);p.catch(()=>pending.delete(key))}return pending.get(key)}
 return {unpack,script,once,cachePolicy:{name:cacheName,maxAgeDays:30}};
})();
