import React, { Suspense, useEffect } from 'react';
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
  const { cameraRef, controlsRef, handleZoomChange, handleOrbitChange } = useCamera();

  return (
    <div
      ref={viewPanelRef}
      className="relative h-full overflow-hidden"
      style={{ gridArea: 'canvas' }}
    >
      <Canvas
        camera={{ position: [0, 0, zoom], fov: 50 }}
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
            if (controlsRef.current) {
              const camera = controlsRef.current.object;
              const newZoom = camera.position.length();
              handleZoomChange(newZoom);

              const spherical = new THREE.Spherical().setFromVector3(camera.position);
              const orbitX = THREE.MathUtils.radToDeg(spherical.theta);
              const orbitY = 90 - THREE.MathUtils.radToDeg(spherical.phi);
              
              handleOrbitChange(orbitX, orbitY);
            }
          }}
        />
      </Canvas>
    </div>
  );
};