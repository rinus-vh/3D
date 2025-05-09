import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { ModelSettings, RotationSettings } from '../../types';
import { useAdvancedSettings } from './contexts/AdvancedSettingsContext';

interface ModelProps {
  url: string;
  rotation: RotationSettings;
  modelSettings: ModelSettings;
  isRecording?: boolean;
  isPreview?: boolean;
  showPlane?: boolean;
}

export const Model = forwardRef<THREE.Group, ModelProps>(({
  url,
  rotation,
  modelSettings,
  isRecording = false,
  isPreview = false,
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
  const textureLoader = useRef(new THREE.TextureLoader());
  const { advancedSettings } = useAdvancedSettings();

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
            const geometry = originalGeometry.clone();
            const vertexCount = Math.floor(originalGeometry.attributes.position.count * modelSettings.resolution);
            geometry.setDrawRange(0, vertexCount);

            const wireframe = child.children.find(c => c instanceof THREE.LineSegments);
            if (wireframe) {
              wireframe.geometry.dispose();
              child.remove(wireframe);
            }

            if (modelSettings.wireframe) {
              const edgesGeometry = new THREE.EdgesGeometry(originalGeometry);
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
              THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

              const material = new THREE.MeshStandardMaterial({
                color: modelSettings.color,
                metalness: modelSettings.metalness,
                roughness: modelSettings.roughness,
                normalScale: new THREE.Vector2(1, 1)
              });

              if (modelSettings.texture.enabled && modelSettings.texture.url) {
                const texture = textureLoader.current.load(modelSettings.texture.url);
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(
                  modelSettings.texture.repeat.x * modelSettings.texture.scale,
                  modelSettings.texture.repeat.y * modelSettings.texture.scale
                );
                texture.offset.set(
                  modelSettings.texture.offset.x,
                  modelSettings.texture.offset.y
                );
                material.map = texture;
              }

              if (modelSettings.bumpMap.enabled && modelSettings.bumpMap.url) {
                const bumpTexture = textureLoader.current.load(modelSettings.bumpMap.url);
                bumpTexture.wrapS = THREE.RepeatWrapping;
                bumpTexture.wrapT = THREE.RepeatWrapping;

                // Convert bump map to normal map
                const normalMap = new THREE.TextureLoader().load(modelSettings.bumpMap.url);
                normalMap.wrapS = THREE.RepeatWrapping;
                normalMap.wrapT = THREE.RepeatWrapping;

                material.normalMap = normalMap;
                material.normalScale.set(modelSettings.bumpMap.strength, modelSettings.bumpMap.strength);
                material.needsUpdate = true;
              }

              child.material = material;
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

        if (advancedSettings.gravity && !isRecording) {
          const gravity = 9.81;
          const groundLevel = -1.5 + modelHeight;
          const currentY = groupRef.current.position.y;

          if (currentY > groundLevel) {
            velocityRef.current -= gravity * delta;
            groupRef.current.position.y += velocityRef.current * delta;

            if (groupRef.current.position.y <= groundLevel) {
              groupRef.current.position.y = groundLevel;
              velocityRef.current = 0;
            }
          }
        } else {
          groupRef.current.position.y = 0;
          velocityRef.current = 0;
        }
      }
    }
  });

  const textureSize = 10;
  const data = new Uint8Array(textureSize * textureSize * 4);
  for (let i = 0; i < textureSize; i++) {
    for (let j = 0; j < textureSize; j++) {
      const index = (i * textureSize + j) * 4;
      const isEven = (i + j) % 2 === 0;
      const color = isEven ? 200 : 190;
      data[index] = color;
      data[index + 1] = color;
      data[index + 2] = color;
      data[index + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
  texture.needsUpdate = true;

  return (
    <>
      <group ref={groupRef}>
        {model && <primitive object={model} />}
      </group>

      {showPlane && (
        <mesh
          ref={planeRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
          layers={1}
        >
          <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} visible={modelSettings.wireframe} />
          <planeGeometry args={[10, 10, 10, 10]} />
          {modelSettings.wireframe ? (
            <wireframeGeometry>
              <lineBasicMaterial color="#404040" />
            </wireframeGeometry>
          ) : (
            <meshStandardMaterial
              map={texture}
              transparent={true}
              opacity={1}
            />
          )}
        </mesh>
      )}
    </>
  );
});