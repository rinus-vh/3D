import React, { ReactNode } from 'react';
import { Header } from '../buildingBlocks/Header';
import { PanelManagerProvider } from './contexts/PanelManagerContext';

interface AppContainerProps {
  children: ReactNode;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showControls?: boolean;
  isControlsVisible?: boolean;
  onToggleControls?: () => void;
  onToggleExportPanel?: () => void;
  showExportPanel?: boolean;
  onDiscard?: () => void;
}

export const AppContainer: React.FC<AppContainerProps> = ({
  children,
  isFullscreen = false,
  onToggleFullscreen,
  showControls = false,
  isControlsVisible = true,
  onToggleControls,
  onToggleExportPanel,
  showExportPanel = false,
  onDiscard
}) => {
  return (
    <PanelManagerProvider>
      <div className={`min-h-screen bg-black text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <Header
          {...{
            isFullscreen,
            onToggleFullscreen,
            showControls,
            isControlsVisible,
            onToggleControls,
            onToggleExportPanel,
            showExportPanel,
            onDiscard
          }}
        />

        <div className="flex-1 flex">
          {children}
        </div>
      </div>
    </PanelManagerProvider>
  );
};