import React from 'react';
import { Slider } from '../../buildingBlocks/Slider';
import { InputFile } from '../../buildingBlocks/InputFile';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

export const BumpMapSettings: React.FC = () => {
  const { modelSettings, handleModelSettingsChange } = useModelSettings();
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  const handleBumpMapChange = (key: keyof typeof modelSettings.bumpMap, value: any) => {
    const newSettings = {
      ...modelSettings,
      bumpMap: {
        ...modelSettings.bumpMap,
        [key]: value,
        enabled: value !== ''
      }
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
      <InputFile
        value={modelSettings.bumpMap.url}
        onChange={(url) => handleBumpMapChange('url', url)}
        accept=".jpg,.jpeg,.png,.dds"
        label="Bump Map"
      />

      <Slider
        value={modelSettings.bumpMap.strength}
        onChange={(value) => handleBumpMapChange('strength', value)}
        min={0}
        max={1}
        step={0.01}
        minLabel="0"
        maxLabel="1"
        label="Strength"
        disabled={!modelSettings.bumpMap.enabled}
      />
    </div>
  );
};