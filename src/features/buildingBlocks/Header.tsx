import React from 'react';
import { Maximize, Minimize, Settings, Download, Trash2 } from 'lucide-react';
import { ToggleButton } from './ToggleButton';
import { usePanelManager } from '../pageOnly/contexts/PanelManagerContext';
import { useControlPanelPosition } from '../pageOnly/contexts/ControlPanelContext';

interface HeaderProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  showControls?: boolean;
  onDiscard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isFullscreen = false,
  onToggleFullscreen,
  showControls = false,
  onDiscard
}) => {
  const { panelStates, togglePanel } = usePanelManager();
  const { isVisible, toggleVisibility } = useControlPanelPosition();

  return (
    <header className="bg-black p-4 border-b border-white/20">
      <div className="container mx-auto flex items-center justify-between max-w-none px-4">
        <h1 className="text-2xl font-medium">3D Model Viewer</h1>
        {showControls && (
          <div className="flex items-center gap-3">
            <ToggleButton
              icon={Settings}
              isActive={isVisible}
              onClick={toggleVisibility}
              title="Toggle controls"
            />
            <ToggleButton
              icon={Download}
              isActive={panelStates.export.isOpen}
              onClick={() => togglePanel('export')}
              title="Export Frame Sequence"
            />
            <ToggleButton
              icon={Trash2}
              isActive={false}
              onClick={onDiscard}
              title="Discard 3D Model"
            />
            <ToggleButton
              icon={isFullscreen ? Minimize : Maximize}
              isActive={isFullscreen}
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            />
          </div>
        )}
      </div>
    </header>
  );
};