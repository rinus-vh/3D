import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ModelSettings, RotationSettings } from '../../types';

interface ModelProps {
  url: string;
  rotation: RotationSettings;
  modelSettings: ModelSettings;
  isRecording?: boolean;
  isPreview?: boolean;
  showShadowPlane?: boolean;
  showPlane?: boolean;
}

export const Model = forwardRef<THREE.Group, ModelProps>(({
  url,
  rotation,
  modelSettings,
  isRecording = false,
  isPreview = false,
  showShadowPlane = true,
  showPlane = false
}, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [originalGeometries, setOriginalGeometries] = useState<Map<string, THREE.BufferGeometry>>(new Map());
  const planeRef = useRef<THREE.Mesh>(null);
  const frameCountRef = useRef(0);
  const totalFrames = 60;
  const velocityRef = useRef(0);
  const [modelHeight, setModelHeight] = useState(0);

  useImperativeHandle(ref, () => groupRef.current!, []);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const fbxLoader = new FBXLoader();
        const loadedModel = await fbxLoader.loadAsync(url);

        if (loadedModel) {
          const box = new THREE.Box3().setFromObject(loadedModel);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          loadedModel.scale.setScalar(scale);

          // Calculate scaled height for gravity
          setModelHeight((size.y * scale) / 2);

          loadedModel.position.sub(center.multiplyScalar(scale));
          
          loadedModel.layers.set(0);
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Object3D) {
              child.layers.set(0);
            }
          });

          const geometries = new Map<string, THREE.BufferGeometry>();
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              geometries.set(child.uuid, child.geometry.clone());
            }
          });
          setOriginalGeometries(geometries);

          setModel(loadedModel);
        }
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();

    return () => {
      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [url]);

  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const originalGeometry = originalGeometries.get(child.uuid);
          if (originalGeometry) {
            // Create a new geometry with the current resolution
            const geometry = originalGeometry.clone();
            const vertexCount = Math.floor(originalGeometry.attributes.position.count * modelSettings.resolution);
            geometry.setDrawRange(0, vertexCount);

            // Remove any existing wireframe lines
            const wireframe = child.children.find(c => c instanceof THREE.LineSegments);
            if (wireframe) {
              wireframe.geometry.dispose();
              child.remove(wireframe);
            }

            if (modelSettings.wireframe) {
              // Create edges geometry from the original geometry first
              const edgesGeometry = new THREE.EdgesGeometry(originalGeometry);
              // Then apply the same vertex count limit
              const edgeVertexCount = Math.floor(edgesGeometry.attributes.position.count * modelSettings.resolution);
              edgesGeometry.setDrawRange(0, edgeVertexCount);
              
              const wireframeMaterial = new THREE.LineBasicMaterial({
                color: modelSettings.wireframeColor,
                linewidth: 1
              });
              const newWireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
              newWireframe.layers.set(0);
              child.add(newWireframe);
              child.material.visible = false;
            } else {
              child.material = new THREE.MeshStandardMaterial({
                color: modelSettings.color,
                metalness: modelSettings.metalness,
                roughness: modelSettings.roughness
              });
              child.material.visible = true;
            }

            child.geometry = geometry;
            child.castShadow = modelSettings.shadows && !modelSettings.wireframe;
            child.receiveShadow = modelSettings.shadows && !modelSettings.wireframe;
          }
        }
      });
    }
  }, [modelSettings, model, originalGeometries]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isRecording && !isPreview) {
        const progress = frameCountRef.current / totalFrames;
        const angle = progress * Math.PI * 2;

        if (rotation.x.speed !== 0) {
          groupRef.current.rotation.x = rotation.x.fixed + (angle * Math.sign(rotation.x.speed));
        } else {
          groupRef.current.rotation.x = rotation.x.fixed;
        }

        if (rotation.y.speed !== 0) {
          groupRef.current.rotation.y = rotation.y.fixed + (angle * Math.sign(rotation.y.speed));
        } else {
          groupRef.current.rotation.y = rotation.y.fixed;
        }

        if (rotation.z.speed !== 0) {
          groupRef.current.rotation.z = rotation.z.fixed + (angle * Math.sign(rotation.z.speed));
        } else {
          groupRef.current.rotation.z = rotation.z.fixed;
        }

        frameCountRef.current++;
      } else {
        frameCountRef.current = 0;

        if (rotation.x.speed !== 0) {
          groupRef.current.rotation.x += rotation.x.speed * delta * Math.PI;
        } else {
          groupRef.current.rotation.x = rotation.x.fixed;
        }

        if (rotation.y.speed !== 0) {
          groupRef.current.rotation.y += rotation.y.speed * delta * Math.PI;
        } else {
          groupRef.current.rotation.y = rotation.y.fixed;
        }

        if (rotation.z.speed !== 0) {
          groupRef.current.rotation.z += rotation.z.speed * delta * Math.PI;
        } else {
          groupRef.current.rotation.z = rotation.z.fixed;
        }

        // Apply gravity
        if (modelSettings.gravity && !isRecording) {
          const gravity = 9.81; // m/s²
          const groundLevel = -1.5 + modelHeight; // Adjust ground level based on model height
          const currentY = groupRef.current.position.y;

          if (currentY > groundLevel) {
            velocityRef.current -= gravity * delta;
            groupRef.current.position.y += velocityRef.current * delta;

            // Check if we hit the ground
            if (groupRef.current.position.y <= groundLevel) {
              groupRef.current.position.y = groundLevel;
              velocityRef.current = 0;
            }
          }
        } else {
          // Reset position and velocity when gravity is disabled
          groupRef.current.position.y = 0;
          velocityRef.current = 0;
        }
      }
    }
  });

  // Create checkerboard texture
  const textureSize = 10;
  const data = new Uint8Array(textureSize * textureSize * 4);
  for (let i = 0; i < textureSize; i++) {
    for (let j = 0; j < textureSize; j++) {
      const index = (i * textureSize + j) * 4;
      const isEven = (i + j) % 2 === 0;
      const color = isEven ? 100 : 95; // Two shades of grey
      data[index] = color;     // R
      data[index + 1] = color; // G
      data[index + 2] = color; // B
      data[index + 3] = 255;   // A
    }
  }
  const texture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
  texture.needsUpdate = true;

  return (
    <>
      <group ref={groupRef}>
        {model && <primitive object={model} />}
      </group>
      
      {(modelSettings.shadows || (!isRecording && showPlane)) && showShadowPlane && (
        <mesh
          ref={planeRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
          layers={1}
        >
          <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} visible={modelSettings.wireframe && showPlane} />
          <planeGeometry args={[10, 10, 10, 10]} />
          {modelSettings.wireframe ? (
            <wireframeGeometry>
              <lineBasicMaterial color="#404040" visible={showPlane} />
            </wireframeGeometry>
          ) : (
            <meshStandardMaterial
              map={texture}
              transparent={true}
              opacity={showPlane ? 1 : 0}
              visible={showPlane}
            />
          )}
        </mesh>
      )}
    </>
  );
});