import React from 'react';
import { ModelSettings } from '../../../types';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

interface WireframePanelProps {
  modelSettings: ModelSettings;
  onModelSettingsChange: (settings: ModelSettings) => void;
}

export const WireframePanel: React.FC<WireframePanelProps> = ({
  modelSettings,
  onModelSettingsChange,
}) => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.wireframe;
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof ModelSettings, value: any) => {
    const newSettings = {
      ...modelSettings,
      [key]: value
    };
    
    onModelSettingsChange(newSettings);
    
    // Add to history
    addToHistory({
      modelSettings: newSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  return (
    <PanelBase
      title="Wireframe Settings"
      panelId="wireframe"
      zIndex={zIndex}
      onClose={() => closePanel("wireframe")}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-white/60">Wireframe Color</label>
          <input
            type="color"
            value={modelSettings.wireframeColor}
            onChange={(e) => handleSettingChange('wireframeColor', e.target.value)}
            className="w-full h-8 bg-transparent cursor-pointer"
          />
        </div>
      </div>
    </PanelBase>
  );
};