import * as THREE from '../vendor/three.module.js';

export function createSmoothFeatherMaterial(source){
 const material=new THREE.MeshPhysicalMaterial({map:source.map,color:source.color,transparent:true,alphaTest:.025,depthWrite:true,side:THREE.DoubleSide,metalness:0,roughness:.52,clearcoat:.28,clearcoatRoughness:.38,envMapIntensity:.6});
 material.forceSinglePass=true;
 material.onBeforeCompile=shader=>{
  const image=material.map?.image;
  shader.uniforms.featherTexel={value:new THREE.Vector2(1.1/(image?.width||1024),1.1/(image?.height||1024))};
  shader.fragmentShader='uniform vec2 featherTexel;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   #ifdef USE_MAP
    vec4 featherCenter=texture2D(map,vMapUv);
    vec3 featherSum=featherCenter.rgb*featherCenter.a*4.0;
    float featherWeight=featherCenter.a*4.0;
    for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++){
     if(x==0&&y==0)continue;
     vec4 tap=texture2D(map,vMapUv+vec2(float(x),float(y))*featherTexel);
     float weight=(x==0||y==0)?2.0:1.0;
     featherSum+=tap.rgb*tap.a*weight;
     featherWeight+=tap.a*weight;
    }
    vec3 featherSoft=featherSum/max(featherWeight,0.0001);
    // Keep dark eyes and beak crisp while softening the feather atlas colors.
    float featherLuma=dot(featherCenter.rgb,vec3(.2126,.7152,.0722));
    float featherBlend=.25*smoothstep(.025,.16,featherLuma);
    vec3 featherColor=mix(featherCenter.rgb,featherSoft,featherBlend);
    float bluePlumage=smoothstep(.015,.14,featherColor.b-featherColor.r);
    featherColor=mix(featherColor,featherColor*vec3(.94,1.10,1.13),bluePlumage*.8);
    diffuseColor*=vec4(featherColor,featherCenter.a);
   #endif
  `);
 };
 material.customProgramCacheKey=()=> 'kingfisher-plumage-v6';
 return material;
}
