import React, { createContext, useContext, useState, useCallback } from 'react';
import { RotationSettings } from '../../../types';

const DEFAULT_SETTINGS = {
  masterSpeed: 0.2,
  rotation: {
    x: { speed: 0, fixed: 0 },
    y: { speed: 0.2, fixed: 0 },
    z: { speed: 0, fixed: 0 },
  },
};

interface RotationContextType {
  masterSpeed: number;
  rotation: RotationSettings;
  setMasterSpeed: (speed: number) => void;
  setRotation: (rotation: RotationSettings) => void;
  resetRotation: () => void;
  handleAxisChange: (axis: 'x' | 'y' | 'z', isAnimated: boolean, value: number) => void;
}

const RotationContext = createContext<RotationContextType | undefined>(undefined);

export function RotationProvider({ children }: { children: React.ReactNode }) {
  const [masterSpeed, setMasterSpeed] = useState(DEFAULT_SETTINGS.masterSpeed);
  const [rotation, setRotation] = useState<RotationSettings>(DEFAULT_SETTINGS.rotation);

  const resetRotation = useCallback(() => {
    setMasterSpeed(DEFAULT_SETTINGS.masterSpeed);
    setRotation(DEFAULT_SETTINGS.rotation);
  }, []);

  const handleAxisChange = useCallback((axis: 'x' | 'y' | 'z', isAnimated: boolean, value: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: {
        speed: isAnimated ? masterSpeed : 0,
        fixed: (value * Math.PI) / 180 // Convert degrees to radians
      }
    }));
  }, [masterSpeed]);

  return (
    <RotationContext.Provider
      value={{
        masterSpeed,
        rotation,
        setMasterSpeed,
        setRotation,
        resetRotation,
        handleAxisChange,
      }}
    >
      {children}
    </RotationContext.Provider>
  );
}

export function useRotation() {
  const context = useContext(RotationContext);
  if (context === undefined) {
    throw new Error('useRotation must be used within a RotationProvider');
  }
  return context;
}