import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface CameraContextType {
  zoom: number;
  setZoom: (zoom: number) => void;
  orbitX: number;
  orbitY: number;
  setOrbitX: (value: number) => void;
  setOrbitY: (value: number) => void;
  cameraRef: React.RefObject<THREE.Camera>;
  controlsRef: React.RefObject<any>;
  handleZoomChange: (newZoom: number) => void;
  handleOrbitChange: (x: number, y: number) => void;
  resetCamera: () => void;
}

const DEFAULT_ZOOM = 5;
const DEFAULT_ORBIT = { x: 0, y: 15 };

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: React.ReactNode }) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [orbitX, setOrbitX] = useState(DEFAULT_ORBIT.x);
  const [orbitY, setOrbitY] = useState(DEFAULT_ORBIT.y);
  const cameraRef = useRef<THREE.Camera>();
  const controlsRef = useRef<any>();

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleOrbitChange = useCallback((x: number, y: number) => {
    setOrbitX(x);
    setOrbitY(y);
  }, []);

  const resetCamera = useCallback(() => {
    setZoom(DEFAULT_ZOOM);
    setOrbitX(DEFAULT_ORBIT.x);
    setOrbitY(DEFAULT_ORBIT.y);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <CameraContext.Provider
      value={{
        zoom,
        setZoom,
        orbitX,
        orbitY,
        setOrbitX,
        setOrbitY,
        cameraRef,
        controlsRef,
        handleZoomChange,
        handleOrbitChange,
        resetCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
}

export function useCamera() {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
}