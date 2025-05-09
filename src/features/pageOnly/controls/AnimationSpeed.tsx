import React from 'react';
import { ControlGroup } from '../../buildingBlocks/ControlGroup';
import { Slider } from '../../buildingBlocks/Slider';
import { useRotation } from '../contexts/RotationContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useCamera } from '../contexts/CameraContext';

export const AnimationSpeed: React.FC = () => {
  const { masterSpeed, setMasterSpeed, rotation, setRotation } = useRotation();
  const { modelSettings } = useModelSettings();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  const handleMasterSpeedChange = (newSpeed: number) => {
    setMasterSpeed(newSpeed);
    const updatedRotation = { ...rotation };
    if (updatedRotation.x.speed !== 0) updatedRotation.x.speed = newSpeed;
    if (updatedRotation.y.speed !== 0) updatedRotation.y.speed = newSpeed;
    if (updatedRotation.z.speed !== 0) updatedRotation.z.speed = newSpeed;
    setRotation(updatedRotation);

    // Add to history
    addToHistory({
      modelSettings,
      rotation: updatedRotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  return (
    <ControlGroup title="Animation Speed">
      <Slider
        value={masterSpeed}
        onChange={handleMasterSpeedChange}
        min={-1}
        max={1}
        step={0.01}
        minLabel="-1"
        maxLabel="1"
      />
    </ControlGroup>
  );
};