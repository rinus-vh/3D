import React from 'react';
import { ControlGroup } from '../../buildingBlocks/ControlGroup';
import { Knob } from '../../buildingBlocks/Knob';
import { useCamera } from '../contexts/CameraContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useRotation } from '../contexts/RotationContext';

export const CameraSettings: React.FC = () => {
  const { zoom, orbitX, orbitY, handleZoomChange, handleOrbitChange } = useCamera();
  const { modelSettings } = useModelSettings();
  const { rotation } = useRotation();
  const { addToHistory } = useEditHistory();

  const handleZoomUpdate = (newZoom: number) => {
    handleZoomChange(newZoom);
    
    // Add to history
    addToHistory({
      modelSettings,
      rotation,
      zoom: newZoom,
      orbitX,
      orbitY
    });
  };

  const handleOrbitUpdate = (x: number, y: number) => {
    handleOrbitChange(x, y);
    
    // Add to history
    addToHistory({
      modelSettings,
      rotation,
      zoom,
      orbitX: x,
      orbitY: y
    });
  };

  return (
    <ControlGroup title="Camera Settings">
      <div className="grid grid-cols-3 gap-4">
        <Knob
          value={zoom}
          onChange={handleZoomUpdate}
          min={1}
          max={10}
          step={0.1}
          label="Zoom"
          loop={false}
        />
        <Knob
          value={orbitX}
          onChange={(x) => handleOrbitUpdate(x, orbitY)}
          min={-180}
          max={180}
          step={1}
          label="Orbit X"
          unit="°"
          loop={true}
        />
        <Knob
          value={orbitY}
          onChange={(y) => handleOrbitUpdate(orbitX, y)}
          min={-89}
          max={89}
          step={1}
          label="Orbit Y"
          unit="°"
          loop={false}
        />
      </div>
    </ControlGroup>
  );
};