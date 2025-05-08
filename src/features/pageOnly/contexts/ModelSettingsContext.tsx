import React, { createContext, useContext, useState, useCallback } from 'react';
import { ModelSettings } from '../../../types';

const DEFAULT_MODEL_SETTINGS: ModelSettings = {
  wireframe: false,
  wireframeColor: '#ffffff',
  color: '#ffffff',
  roughness: 0.5,
  metalness: 0.5,
  resolution: 1,
  lighting: false,
  shadows: false,
  lightColor: '#ffffff',
  lightStrength: 2,
};

interface ModelSettingsContextType {
  modelSettings: ModelSettings;
  handleModelSettingsChange: (settings: ModelSettings) => void;
  resetModelSettings: () => void;
}

const ModelSettingsContext = createContext<ModelSettingsContextType | undefined>(undefined);

export function ModelSettingsProvider({ children }: { children: React.ReactNode }) {
  const [modelSettings, setModelSettings] = useState<ModelSettings>(DEFAULT_MODEL_SETTINGS);

  const handleModelSettingsChange = useCallback((newSettings: ModelSettings) => {
    setModelSettings(newSettings);
  }, []);

  const resetModelSettings = useCallback(() => {
    setModelSettings(DEFAULT_MODEL_SETTINGS);
  }, []);

  return (
    <ModelSettingsContext.Provider
      value={{
        modelSettings,
        handleModelSettingsChange,
        resetModelSettings,
      }}
    >
      {children}
    </ModelSettingsContext.Provider>
  );
}

export function useModelSettings() {
  const context = useContext(ModelSettingsContext);
  if (context === undefined) {
    throw new Error('useModelSettings must be used within a ModelSettingsProvider');
  }
  return context;
}