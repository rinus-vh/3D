import { ModelSettings, RotationSettings, ExportSettings } from '../types';
import * as THREE from 'three';

interface ExportFrameProps {
  modelRef: React.RefObject<THREE.Group>;
  rotation: RotationSettings;
  modelSettings: ModelSettings;
  exportSettings: ExportSettings;
  onProgress: (progress: number) => void;
  onFrameCapture?: (dataUrl: string) => void;
  onComplete: (frames: string[]) => void;
  cameraPosition?: THREE.Vector3;
}

const TOTAL_FRAMES = 60;

export async function captureFrameSequence({
  modelRef,
  rotation,
  modelSettings,
  exportSettings,
  onProgress,
  onFrameCapture,
  onComplete,
  cameraPosition,
}: ExportFrameProps) {
  const frames: string[] = [];
  let frameCount = 0;

  // Create renderer with the same settings as main canvas
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    preserveDrawingBuffer: true
  });
  
  // Set size based on aspect ratio
  let width = 1920;
  let height = 1080;
  switch (exportSettings.aspectRatio) {
    case '4:3':
      height = Math.round(width * (3/4));
      break;
    case '3:4':
      width = Math.round(height * (3/4));
      break;
    case '1:1':
      width = height = 1080;
      break;
  }
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = exportSettings.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Create scene
  const scene = new THREE.Scene();
  scene.background = null;

  // Create camera with the same settings as main camera
  const camera = new THREE.PerspectiveCamera(50, width/height, 0.1, 1000);
  // Only enable layer 0 for the recording camera
  camera.layers.disableAll();
  camera.layers.enable(0);
  
  if (cameraPosition) {
    camera.position.copy(cameraPosition);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  } else {
    camera.position.z = 5;
  }

  const renderNextFrame = () => {
    if (!modelRef.current) return;

    // Calculate rotation for current frame
    const progress = frameCount / TOTAL_FRAMES;
    const angle = progress * Math.PI * 2;

    // Clone the model for this frame
    const modelClone = modelRef.current.clone();
    scene.clear();
    scene.add(modelClone);

    // Ensure model and its parts are on layer 0
    modelClone.traverse((child) => {
      if (child instanceof THREE.Object3D) {
        child.layers.set(0);
      }
    });

    // Update model rotation
    ['x', 'y', 'z'].forEach((axis) => {
      if (rotation[axis].speed !== 0) {
        modelClone.rotation[axis] = rotation[axis].fixed + (angle * Math.sign(rotation[axis].speed));
      } else {
        modelClone.rotation[axis] = rotation[axis].fixed;
      }
    });

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.layers.enable(0);
    scene.add(ambientLight);

    if (modelSettings.lighting && !modelSettings.wireframe) {
      const spotLight = new THREE.SpotLight(
        modelSettings.lightColor,
        modelSettings.lightStrength,
        0,
        Math.PI / 6,
        1
      );
      spotLight.position.set(5, 5, 5);
      spotLight.castShadow = exportSettings.shadows;
      spotLight.shadow.mapSize.width = 2048;
      spotLight.shadow.mapSize.height = 2048;
      spotLight.layers.enable(0);
      scene.add(spotLight);
    }

    // Add shadow plane if shadows are enabled
    if (exportSettings.shadows && !modelSettings.wireframe) {
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.ShadowMaterial({
          opacity: 0.5
        })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -1.5;
      shadowPlane.receiveShadow = true;
      shadowPlane.layers.set(0);
      scene.add(shadowPlane);
    }

    // Render frame
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    frames.push(dataUrl);

    // Call frame capture callback if provided
    if (onFrameCapture) {
      onFrameCapture(dataUrl);
    }

    // Update progress
    frameCount++;
    onProgress((frameCount / TOTAL_FRAMES) * 100);

    // Continue or complete
    if (frameCount < TOTAL_FRAMES) {
      requestAnimationFrame(renderNextFrame);
    } else {
      onComplete(frames);
      renderer.dispose();
      scene.clear();
    }
  };

  renderNextFrame();
}