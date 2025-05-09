import React from 'react';
import { Slider } from '../../buildingBlocks/Slider';
import { InputFile } from '../../buildingBlocks/InputFile';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useRotation } from '../contexts/RotationContext';
import { useCamera } from '../contexts/CameraContext';

export const TextureSettings: React.FC = () => {
  const { modelSettings, handleModelSettingsChange } = useModelSettings();
  const { rotation } = useRotation();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  const handleTextureChange = (key: keyof typeof modelSettings.texture, value: any) => {
    const newSettings = {
      ...modelSettings,
      texture: {
        ...modelSettings.texture,
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
        value={modelSettings.texture.url}
        onChange={(url) => handleTextureChange('url', url)}
        accept=".jpg,.jpeg,.png,.dds"
        label="Texture"
      />

      <Slider
        value={modelSettings.texture.scale}
        onChange={(value) => handleTextureChange('scale', value)}
        min={0.1}
        max={10}
        step={0.1}
        minLabel="0.1x"
        maxLabel="10x"
        label="Scale"
        disabled={!modelSettings.texture.enabled}
      />

      <div className="space-y-4">
        <label className='block text-sm text-white/60'>Repeat</label>
        <Slider
          value={modelSettings.texture.repeat.x}
          onChange={(value) => handleTextureChange('repeat', { ...modelSettings.texture.repeat, x: value })}
          min={1}
          max={10}
          step={1}
          minLabel="1x"
          maxLabel="10x"
          label="X Repeat"
          disabled={!modelSettings.texture.enabled}
        />
        <Slider
          value={modelSettings.texture.repeat.y}
          onChange={(value) => handleTextureChange('repeat', { ...modelSettings.texture.repeat, y: value })}
          min={1}
          max={10}
          step={1}
          minLabel="1x"
          maxLabel="10x"
          label="Y Repeat"
          disabled={!modelSettings.texture.enabled}
        />
      </div>

      <div className="space-y-4">
        <label className='block text-sm text-white/60'>Offset</label>
        <Slider
          value={modelSettings.texture.offset.x}
          onChange={(value) => handleTextureChange('offset', { ...modelSettings.texture.offset, x: value })}
          min={-1}
          max={1}
          step={0.1}
          minLabel="-1"
          maxLabel="1"
          label="X Offset"
          disabled={!modelSettings.texture.enabled}
        />
        <Slider
          value={modelSettings.texture.offset.y}
          onChange={(value) => handleTextureChange('offset', { ...modelSettings.texture.offset, y: value })}
          min={-1}
          max={1}
          step={0.1}
          minLabel="-1"
          maxLabel="1"
          label="Y Offset"
          disabled={!modelSettings.texture.enabled}
        />
      </div>
    </div>
  );
};