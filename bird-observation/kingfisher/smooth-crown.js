import * as THREE from '../vendor/three.module.js';

// Fit the crown feather cards to the existing scalp, preserving their UVs and rig.
export function smoothCrown(model){
 const crown=model.getObjectByName('Object_569'),body=model.getObjectByName('Object_566');
 if(!crown||!body)return;
 const geometry=crown.geometry.clone(),positions=geometry.attributes.position;
 const bodyPositions=body.geometry.attributes.position,index=body.geometry.index;
 const toBody=new THREE.Matrix4().copy(body.matrixWorld).invert().multiply(crown.matrixWorld);
 const toCrown=toBody.clone().invert(),normalMatrix=new THREE.Matrix3().getNormalMatrix(toCrown);
 const triangle=new THREE.Triangle(),point=new THREE.Vector3(),closest=new THREE.Vector3(),bestPoint=new THREE.Vector3(),bestNormal=new THREE.Vector3(),normal=new THREE.Vector3();
 const normals=new Float32Array(positions.count*3),bodyNormals=body.geometry.attributes.normal,bary=new THREE.Vector3(),na=new THREE.Vector3(),nb=new THREE.Vector3(),nc=new THREE.Vector3();
 let adjusted=0;
 for(let vertex=0;vertex<positions.count;vertex++){
  point.fromBufferAttribute(positions,vertex).applyMatrix4(toBody);
  let distance=Infinity;
  for(let face=0;face<(index?index.count:bodyPositions.count);face+=3){
   const ia=index?index.getX(face):face,ib=index?index.getX(face+1):face+1,ic=index?index.getX(face+2):face+2;
   triangle.a.fromBufferAttribute(bodyPositions,ia);triangle.b.fromBufferAttribute(bodyPositions,ib);triangle.c.fromBufferAttribute(bodyPositions,ic);
   triangle.closestPointToPoint(point,closest);const d=point.distanceToSquared(closest);if(!Number.isFinite(d)||d>=distance)continue;
   distance=d;bestPoint.copy(closest);
   if(bodyNormals){triangle.getBarycoord(closest,bary);na.fromBufferAttribute(bodyNormals,ia);nb.fromBufferAttribute(bodyNormals,ib);nc.fromBufferAttribute(bodyNormals,ic);bestNormal.copy(na).multiplyScalar(bary.x).addScaledVector(nb,bary.y).addScaledVector(nc,bary.z).normalize();}else triangle.getNormal(bestNormal);
  }
  // Keep a thin feather layer above the scalp instead of a protruding tuft.
  point.lerp(bestPoint.clone().addScaledVector(bestNormal,.007),.88).applyMatrix4(toCrown);
  positions.setXYZ(vertex,point.x,point.y,point.z);
  normal.copy(bestNormal).applyMatrix3(normalMatrix).normalize();normal.toArray(normals,vertex*3);adjusted++;
 }
 geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));positions.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();crown.geometry=geometry;
 return {vertices:adjusted,finite:positions.array.every(Number.isFinite)&&normals.every(Number.isFinite)};
}
