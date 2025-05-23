import React from 'react';
import { ModelSettings } from '../../../types';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { Slider } from '../../buildingBlocks/Slider';
import { InputColor } from '../../buildingBlocks/InputColor';
import { ToggleWithLabel } from '../../buildingBlocks/ToggleWithLabel';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

interface LightingPanelProps {
  modelSettings: ModelSettings;
  onModelSettingsChange: (settings: ModelSettings) => void;
}

export const LightingPanel: React.FC<LightingPanelProps> = ({
  modelSettings,
  onModelSettingsChange,
}) => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.lighting;
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
      title='Lighting Settings'
      panelId="lighting"
      zIndex={zIndex}
      onClose={() => closePanel("lighting")}
    >
      <ToggleWithLabel
        label="Shadows"
        value={modelSettings.shadows}
        onChange={(value) => handleSettingChange('shadows', value)}
        disabled={!modelSettings.lighting || modelSettings.wireframe}
      />

      <InputColor
        label="Light Color"
        value={modelSettings.lightColor}
        onChange={(value) => handleSettingChange('lightColor', value)}
        disabled={!modelSettings.lighting || modelSettings.wireframe}
      />

      <Slider
        value={modelSettings.lightStrength}
        onChange={(value) => handleSettingChange('lightStrength', value)}
        min={0}
        max={10}
        step={0.1}
        minLabel="0"
        maxLabel="10"
        label="Light Strength"
        disabled={!modelSettings.lighting || modelSettings.wireframe}
      />
    </PanelBase>
  );
};