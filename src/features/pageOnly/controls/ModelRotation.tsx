import React from 'react';
import { ControlGroup } from '../../buildingBlocks/ControlGroup';
import { Knob } from '../../buildingBlocks/Knob';
import { Toggle } from '../../buildingBlocks/Toggle';
import { useRotation } from '../contexts/RotationContext';
import { useEditHistory } from '../contexts/EditHistoryContext';
import { useModelSettings } from '../contexts/ModelSettingsContext';
import { useCamera } from '../contexts/CameraContext';

export const ModelRotation: React.FC = () => {
  const { rotation, masterSpeed, setRotation } = useRotation();
  const { modelSettings } = useModelSettings();
  const { zoom, orbitX, orbitY } = useCamera();
  const { addToHistory } = useEditHistory();

  const getAxisDegrees = (axis: 'x' | 'y' | 'z') => {
    return (rotation[axis].fixed * 180) / Math.PI;
  };

  const handleAxisChange = (axis: 'x' | 'y' | 'z', isAnimated: boolean, value: number) => {
    const newRotation = {
      ...rotation,
      [axis]: {
        speed: isAnimated ? masterSpeed : 0,
        fixed: (value * Math.PI) / 180
      }
    };
    
    setRotation(newRotation);
    
    // Add to history
    addToHistory({
      modelSettings,
      rotation: newRotation,
      zoom,
      orbitX,
      orbitY
    });
  };

  return (
    <ControlGroup title="Model Rotation">
      <div className="space-y-6">
        {[
          { axis: 'x', label: 'X Axis' },
          { axis: 'y', label: 'Y Axis' },
          { axis: 'z', label: 'Z Axis' }
        ].map(({ axis, label }) => (
          <div key={axis} className="space-y-2">
            <div className="text-sm text-white/60">{label}</div>
            <div className="flex items-center justify-between">
              <Knob
                value={getAxisDegrees(axis as 'x' | 'y' | 'z')}
                onChange={(value) => handleAxisChange(axis as 'x' | 'y' | 'z', rotation[axis].speed !== 0, value)}
                min={0}
                max={360}
                step={1}
                disabled={rotation[axis].speed !== 0}
                unit="°"
                loop={false}
              />
              <Toggle
                value={rotation[axis].speed !== 0}
                onChange={(value) => handleAxisChange(axis as 'x' | 'y' | 'z', value, getAxisDegrees(axis as 'x' | 'y' | 'z'))}
                offLabel="Still"
                onLabel="Animated"
              />
            </div>
          </div>
        ))}
      </div>
    </ControlGroup>
  );
};