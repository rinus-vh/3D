import React, { createContext, useContext, useState, useCallback } from 'react';

const PANEL_WIDTH = 320;
const SNAP_THRESHOLD = 15;

interface ControlPanelState {
  isVisible: boolean;
  isCollapsed: boolean;
  dockPosition: 'left' | 'right' | null;
  dockPreview: 'left' | 'right' | null;
  position: { x: number; y: number };
}

interface ControlPanelContextType extends ControlPanelState {
  toggleVisibility: () => void;
  toggleCollapse: () => void;
  handleDrag: (x: number, y: number, containerWidth: number) => void;
  handleDragStop: (x: number, y: number, containerWidth: number) => void;
  undock: () => void;
}

const ControlPanelContext = createContext<ControlPanelContextType | undefined>(undefined);

export function ControlPanelPositionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ControlPanelState>({
    isVisible: true,
    isCollapsed: false,
    dockPosition: null,
    dockPreview: null,
    position: { x: 16, y: 16 },
  });

  const toggleVisibility = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setState(prev => {
      const nextCollapsed = !prev.isCollapsed;
      // If collapsing and currently docked, undock the panel
      return {
        ...prev,
        isCollapsed: nextCollapsed,
        dockPosition: nextCollapsed ? null : prev.dockPosition,
      };
    });
  }, []);

  const handleDrag = useCallback((x: number, y: number, containerWidth: number) => {
    const distanceToLeft = x;
    const distanceToRight = containerWidth - (x + PANEL_WIDTH);

    setState(prev => ({
      ...prev,
      dockPreview: distanceToLeft <= SNAP_THRESHOLD ? 'left' :
        distanceToRight <= SNAP_THRESHOLD ? 'right' : null,
      position: { x, y },
    }));
  }, []);

  const handleDragStop = useCallback((x: number, y: number, containerWidth: number) => {
    const distanceToLeft = x;
    const distanceToRight = containerWidth - (x + PANEL_WIDTH);

    setState(prev => ({
      ...prev,
      dockPosition: distanceToLeft <= SNAP_THRESHOLD ? 'left' :
        distanceToRight <= SNAP_THRESHOLD ? 'right' : null,
      dockPreview: null,
      isCollapsed: false,
      position: { x, y },
    }));
  }, []);

  const undock = useCallback(() => {
    setState(prev => ({
      ...prev,
      dockPosition: null,
      dockPreview: null,
    }));
  }, []);

  return (
    <ControlPanelContext.Provider
      value={{
        ...state,
        toggleVisibility,
        toggleCollapse,
        handleDrag,
        handleDragStop,
        undock,
      }}
    >
      {children}
    </ControlPanelContext.Provider>
  );
}

export function useControlPanelPosition() {
  const context = useContext(ControlPanelContext);
  if (context === undefined) {
    throw new Error('useControlPanelPosition must be used within a ControlPanelPositionProvider');
  }
  return context;
}