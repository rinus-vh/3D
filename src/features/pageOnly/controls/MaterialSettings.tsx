import React from 'react';
import { Slider } from '../../buildingBlocks/Slider';
import { InputColor } from '../../buildingBlocks/InputColor';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

export const MaterialSettings: React.FC = () => {
  const { modelSettings, handleModelSettingsChange } = useModelSettings();
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  const handleSettingChange = (key: keyof typeof modelSettings, value: any) => {
    const newSettings = {
      ...modelSettings,
      [key]: value
    };
    
    handleModelSettingsChange(newSettings);
    addToHistory({
      modelSettings: newSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  return (
    <div className="space-y-4">
      <InputColor
        label="Color"
        value={modelSettings.color}
        onChange={(value) => handleSettingChange('color', value)}
        disabled={modelSettings.wireframe}
      />

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
    </div>
  );
};