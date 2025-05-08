import React from 'react';
import { ModelSettings } from '../../../types';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { Slider } from '../../buildingBlocks/Slider';
import { usePanelManager } from '../contexts/PanelManagerContext';

interface MaterialPanelProps {
  modelSettings: ModelSettings;
  onModelSettingsChange: (settings: ModelSettings) => void;
}

export const MaterialPanel: React.FC<MaterialPanelProps> = ({
  modelSettings,
  onModelSettingsChange,
}) => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.material;

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof ModelSettings, value: any) => {
    onModelSettingsChange({
      ...modelSettings,
      [key]: value
    });
  };

  return (
    <PanelBase
      title='Material Settings'
      panelId="material"
      zIndex={zIndex}
      onClose={() => closePanel("material")}
    >
      <div className="space-y-2">
        <label className="block text-sm text-white/60">Color</label>
        <input
          type="color"
          value={modelSettings.color}
          onChange={(e) => handleSettingChange('color', e.target.value)}
          className="w-full h-8 bg-transparent cursor-pointer"
          disabled={modelSettings.wireframe}
        />
      </div>

      <Slider
        value={modelSettings.roughness}
        onChange={(value) => handleSettingChange('roughness', value)}
        min={0}
        max={1}
        step={0.1}
        minLabel="Smooth"
        maxLabel="Rough"
        label="Roughness"
        disabled={modelSettings.wireframe}
      />

      <Slider
        value={modelSettings.metalness}
        onChange={(value) => handleSettingChange('metalness', value)}
        min={0}
        max={1}
        step={0.1}
        minLabel="Non-metallic"
        maxLabel="Metallic"
        label="Metalness"
        disabled={modelSettings.wireframe}
      />
    </PanelBase>
  );
};