import React from 'react';
import { ModelSettings } from '../../../types';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { usePanelManager } from '../contexts/PanelManagerContext';

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

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof ModelSettings, value: any) => {
    onModelSettingsChange({
      ...modelSettings,
      [key]: value
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