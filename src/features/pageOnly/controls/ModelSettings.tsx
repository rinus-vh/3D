import React from 'react';
import { ControlGroup } from '../../buildingBlocks/ControlGroup';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { Slider } from '../../buildingBlocks/Slider';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

export const ModelSettings: React.FC = () => {
  const { modelSettings, handleModelSettingsChange } = useModelSettings();
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { openPanel } = usePanelManager();
  const { addToHistory } = useEditHistory();

  const handleSettingChange = (key: keyof typeof modelSettings, value: any) => {
    const newSettings = {
      ...modelSettings,
      [key]: value
    };
    
    handleModelSettingsChange(newSettings);
    
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
    <ControlGroup title="Model Settings">
      <div className="space-y-4">
        <LabelWithSettings
          label="Wireframe"
          value={modelSettings.wireframe}
          onChange={(value) => handleSettingChange('wireframe', value)}
          onSettingsClick={modelSettings.wireframe ? () => openPanel('wireframe') : undefined}
          showToggle={true}
        />

        <LabelWithSettings
          label="Lighting"
          value={modelSettings.lighting}
          onChange={(value) => handleSettingChange('lighting', value)}
          disabled={modelSettings.wireframe}
          onSettingsClick={modelSettings.lighting ? () => openPanel('lighting') : undefined}
          showToggle={true}
        />

        <LabelWithSettings
          label="Material"
          onSettingsClick={!modelSettings.wireframe ? () => openPanel('material') : undefined}
          showToggle={false}
          disabled={modelSettings.wireframe}
        />

        <Slider
          value={modelSettings.resolution}
          onChange={(value) => handleSettingChange('resolution', value)}
          min={0.1}
          max={1}
          step={0.1}
          minLabel="Low"
          maxLabel="High"
          label="Resolution"
        />
      </div>
    </ControlGroup>
  );
};