import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

import { ModelSettings, RotationSettings } from '../../types';
import { Model } from './Model';
import { useCamera } from './contexts/CameraContext';

interface ViewCanvasProps {
  viewPanelRef: React.RefObject<HTMLDivElement>;
  modelRef: React.RefObject<THREE.Group>;
  modelUrl: string;
  rotation: RotationSettings;
  modelSettings: ModelSettings;
  zoom: number;
  showPlane: boolean;
  showExportPanel: boolean;
  exportSettings: { shadows: boolean };
}

export const ViewCanvas: React.FC<ViewCanvasProps> = ({
  viewPanelRef,
  modelRef,
  modelUrl,
  rotation,
  modelSettings,
  zoom,
  showPlane,
  showExportPanel,
  exportSettings,
}) => {
  const { cameraRef, controlsRef, handleZoomChange, handleOrbitChange, orbitX, orbitY } = useCamera();
  const isUpdatingFromKnobs = useRef(false);

  // Update camera when knob values change
  useEffect(() => {
    if (!controlsRef.current || isUpdatingFromKnobs.current) return;

    isUpdatingFromKnobs.current = true;
    
    const camera = controlsRef.current.object;
    const radius = camera.position.length();
    
    // Convert degrees to radians
    const theta = THREE.MathUtils.degToRad(orbitX);
    const phi = THREE.MathUtils.degToRad(90 - orbitY);
    
    // Calculate new camera position
    camera.position.setFromSpherical(new THREE.Spherical(radius, phi, theta));
    controlsRef.current.update();
    
    isUpdatingFromKnobs.current = false;
  }, [orbitX, orbitY, controlsRef]);

  // Update camera when zoom changes
  useEffect(() => {
    if (!controlsRef.current || isUpdatingFromKnobs.current) return;

    isUpdatingFromKnobs.current = true;
    
    const camera = controlsRef.current.object;
    const direction = camera.position.clone().normalize();
    // Invert the zoom value for the camera position
    camera.position.copy(direction.multiplyScalar(11 - zoom));
    controlsRef.current.update();
    
    isUpdatingFromKnobs.current = false;
  }, [zoom, controlsRef]);

  return (
    <div
      ref={viewPanelRef}
      className="relative h-full overflow-hidden"
      style={{ gridArea: 'canvas' }}
    >
      <Canvas
        camera={{ position: [0, 0, 11 - zoom], fov: 50 }}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        shadows={modelSettings.shadows && !modelSettings.wireframe}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
          camera.layers.enableAll();
        }}
      >
        <ambientLight intensity={0.5} />

        {modelSettings.lighting && !modelSettings.wireframe && (
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={modelSettings.lightStrength}
            color={modelSettings.lightColor}
            castShadow={modelSettings.shadows}
            shadow-mapSize={[2048, 2048]}
          />
        )}

        <Suspense fallback={null}>
          <Model
            ref={modelRef}
            url={modelUrl}
            showShadowPlane={!showExportPanel || exportSettings.shadows}
            {...{ rotation, modelSettings, showPlane }}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping={false}
          onChange={() => {
            if (controlsRef.current && !isUpdatingFromKnobs.current) {
              const camera = controlsRef.current.object;
              // Invert the zoom value when updating from camera position
              const newZoom = 11 - camera.position.length();
              
              const spherical = new THREE.Spherical().setFromVector3(camera.position);
              const newOrbitX = THREE.MathUtils.radToDeg(spherical.theta);
              const newOrbitY = 90 - THREE.MathUtils.radToDeg(spherical.phi);
              
              handleZoomChange(newZoom);
              handleOrbitChange(newOrbitX, newOrbitY);
            }
          }}
        />
      </Canvas>
    </div>
  );
};