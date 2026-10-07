const CACHE_NAME='bird-observation-assets-v4';

async function checkedFetch(url){
 const request=new Request(url);
 if('caches' in globalThis){
  try{const cache=await caches.open(CACHE_NAME),cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(!response.ok)throw Error('资源加载失败：'+url);cache.put(request,response.clone()).catch(()=>{});return response;}catch(error){if(error instanceof Error&&error.message.startsWith('资源加载失败'))throw error;}
 }
 const response=await fetch(request);if(!response.ok)throw Error('资源加载失败：'+url);return response;
}
export async function loadMesh(folder,meta){
 if(meta.meshFile)return (await checkedFetch(folder+'/'+meta.meshFile)).arrayBuffer();
 const buffers=await Promise.all(meta.meshChunks.map(async name=>(await checkedFetch(folder+'/'+name)).arrayBuffer()));
 const bytes=new Uint8Array(buffers.reduce((sum,b)=>sum+b.byteLength,0));let offset=0;
 for(const buffer of buffers){bytes.set(new Uint8Array(buffer),offset);offset+=buffer.byteLength;}
 return bytes.buffer;
}
export async function loadCache(folder,meta,onProgress){
 let chunk=0,reader;
 const compressed=new ReadableStream({
  async pull(controller){try{while(true){if(!reader){if(chunk>=meta.animationChunks.length){controller.close();return;}reader=(await checkedFetch(folder+'/'+meta.animationChunks[chunk++])).body.getReader();}const result=await reader.read();if(result.done){reader.releaseLock();reader=null;onProgress?.(chunk,meta.animationChunks.length);continue;}controller.enqueue(result.value);return;}}catch(error){controller.error(error);}},
  async cancel(){await reader?.cancel();}
 });
 const buffer=await new Response(compressed.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
 const stride=meta.parts.reduce((sum,p)=>sum+p.vertexCount*3,0);
 if(buffer.byteLength!==meta.frames*stride*2)throw Error('动画数据不完整');
 if(meta.byteShuffle){const bytes=new Uint8Array(buffer),values=new Uint16Array(buffer),scratch=new Uint8Array(stride*2);
  for(let frame=0;frame<meta.frames;frame++){scratch.set(bytes.subarray(frame*stride*2,(frame+1)*stride*2));for(let i=0;i<stride;i++)values[frame*stride+i]=scratch[i]|(scratch[stride+i]<<8);}
 }
 return buffer;
}
