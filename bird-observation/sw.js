const CACHE_NAME='bird-observation-assets-v4';

self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const names=await caches.keys();
 await Promise.all(names.filter(name=>name.startsWith('bird-observation-assets-')&&name!==CACHE_NAME).map(name=>caches.delete(name)));
 await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==location.origin||url.pathname.endsWith('/__heartbeat'))return;
 if(!/\.(?:bin|gz|png|jpe?g|webp)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME),cached=await cache.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response.ok)event.waitUntil(cache.put(request,response.clone()).catch(()=>{}));
  return response;
 })());
});
