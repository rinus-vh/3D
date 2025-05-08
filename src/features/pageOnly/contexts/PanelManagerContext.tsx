import React, { createContext, useContext, useState, useCallback } from 'react';

export type PanelId = 'material' | 'lighting' | 'export' | 'advanced' | 'wireframe';

interface PanelState {
  isOpen: boolean;
  zIndex: number;
}

type PanelStates = Record<PanelId, PanelState>;

interface PanelManagerContextType {
  panelStates: PanelStates;
  openPanel: (panelId: PanelId) => void;
  closePanel: (panelId: PanelId) => void;
  togglePanel: (panelId: PanelId) => void;
  focusPanel: (panelId: PanelId) => void;
}

const defaultPanelStates: PanelStates = {
  material: { isOpen: false, zIndex: 0 },
  lighting: { isOpen: false, zIndex: 0 },
  export: { isOpen: false, zIndex: 0 },
  advanced: { isOpen: false, zIndex: 0 },
  wireframe: { isOpen: false, zIndex: 0 }
};

let nextZIndex = 100;

const PanelManagerContext = createContext<PanelManagerContextType | undefined>(undefined);

export function PanelManagerProvider({ children }: { children: React.ReactNode }) {
  const [panelStates, setPanelStates] = useState<PanelStates>(defaultPanelStates);

  const openPanel = useCallback((panelId: PanelId) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: { isOpen: true, zIndex: nextZIndex++ }
    }));
  }, []);

  const closePanel = useCallback((panelId: PanelId) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: { ...prev[panelId], isOpen: false }
    }));
  }, []);

  const togglePanel = useCallback((panelId: PanelId) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: {
        isOpen: !prev[panelId].isOpen,
        zIndex: !prev[panelId].isOpen ? nextZIndex++ : prev[panelId].zIndex
      }
    }));
  }, []);

  const focusPanel = useCallback((panelId: PanelId) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: { ...prev[panelId], zIndex: nextZIndex++ }
    }));
  }, []);

  return (
    <PanelManagerContext.Provider
      value={{
        panelStates,
        openPanel,
        closePanel,
        togglePanel,
        focusPanel,
      }}
    >
      {children}
    </PanelManagerContext.Provider>
  );
}

export function usePanelManager() {
  const context = useContext(PanelManagerContext);
  if (context === undefined) {
    throw new Error('usePanelManager must be used within a PanelManagerProvider');
  }
  return context;
}