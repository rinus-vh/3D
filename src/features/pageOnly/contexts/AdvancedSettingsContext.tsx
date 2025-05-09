import React, { createContext, useContext, useState, useCallback } from 'react';

interface AdvancedSettings {
  backgroundColor: string;
  showGroundPlane: boolean;
  gravity: boolean;
}

interface AdvancedSettingsContextType {
  advancedSettings: AdvancedSettings;
  setAdvancedSettings: (settings: AdvancedSettings) => void;
  updateAdvancedSettings: (key: keyof AdvancedSettings, value: any) => void;
}

const DEFAULT_SETTINGS: AdvancedSettings = {
  backgroundColor: '#000000',
  showGroundPlane: false,
  gravity: false,
};

const AdvancedSettingsContext = createContext<AdvancedSettingsContextType | undefined>(undefined);

export function AdvancedSettingsProvider({ children }: { children: React.ReactNode }) {
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>(DEFAULT_SETTINGS);

  const updateAdvancedSettings = useCallback((key: keyof AdvancedSettings, value: any) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return (
    <AdvancedSettingsContext.Provider
      value={{
        advancedSettings,
        setAdvancedSettings,
        updateAdvancedSettings,
      }}
    >
      {children}
    </AdvancedSettingsContext.Provider>
  );
}

export function useAdvancedSettings() {
  const context = useContext(AdvancedSettingsContext);
  if (context === undefined) {
    throw new Error('useAdvancedSettings must be used within a AdvancedSettingsProvider');
  }
  return context;
}