import React from 'react';
import { Settings, Undo, Redo, Save, Upload, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useControlPanel } from '../contexts/ControlPanelContext';
import { ModelSettings, RotationSettings } from '../../../types';
import { ButtonGrey } from '../../buildingBlocks/Button';
import { ButtonSimpleIcon } from '../../buildingBlocks/ButtonSimpleIcon';
import { Toggle } from '../../buildingBlocks/Toggle';
import { Slider } from '../../buildingBlocks/Slider';
import { Knob } from '../../buildingBlocks/Knob';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { ControlGroup } from '../../buildingBlocks/ControlGroup';
import { useCamera } from '../contexts/CameraContext';
import Draggable from 'react-draggable';

interface ControlPanelProps {
  rotation: RotationSettings;
  modelSettings: ModelSettings;
  onRotationChange: (rotation: RotationSettings) => void;
  onModelSettingsChange: (settings: ModelSettings) => void;
  masterSpeed: number;
  onMasterSpeedChange: (speed: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onUpload?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  containerWidth?: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  rotation,
  modelSettings,
  onRotationChange,
  onModelSettingsChange,
  masterSpeed,
  onMasterSpeedChange,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onUpload,
  canUndo = false,
  canRedo = false,
  containerWidth = 0,
}) => {
  const { openPanel } = usePanelManager();
  const {
    isCollapsed,
    toggleCollapse,
    position,
    handleDrag,
    handleDragStop,
    dockPosition
  } = useControlPanel();

  const { zoom, orbitX, orbitY, handleZoomChange, handleOrbitChange } = useCamera();

  const handleMasterSpeedChange = (newSpeed: number) => {
    onMasterSpeedChange(newSpeed);
    const updatedRotation = { ...rotation };
    if (updatedRotation.x.speed !== 0) updatedRotation.x.speed = newSpeed;
    if (updatedRotation.y.speed !== 0) updatedRotation.y.speed = newSpeed;
    if (updatedRotation.z.speed !== 0) updatedRotation.z.speed = newSpeed;
    onRotationChange(updatedRotation);
  };

  const handleAxisChange = (axis: 'x' | 'y' | 'z', isAnimated: boolean, value: number) => {
    onRotationChange({
      ...rotation,
      [axis]: {
        speed: isAnimated ? masterSpeed : 0,
        fixed: (value * Math.PI) / 180 // Convert degrees to radians
      }
    });
  };

  const getAxisDegrees = (axis: 'x' | 'y' | 'z') => {
    return (rotation[axis].fixed * 180) / Math.PI; // Convert radians to degrees
  };

  const handleModelSettingChange = (key: keyof ModelSettings, value: any) => {
    onModelSettingsChange({
      ...modelSettings,
      [key]: value
    });
  };

  const content = (
    <div className="bg-black flex flex-col">
      <div className="panel-handle flex items-center justify-between p-3 bg-white/5 cursor-move">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <span className="font-medium">Controls</span>
        </div>
        <ButtonSimpleIcon
          icon={isCollapsed ? ChevronRight : ChevronDown}
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand panel" : "Collapse panel"}
        />
      </div>

      {!isCollapsed && (
        <>
          <div className="border-b border-white/20 p-3 bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ButtonSimpleIcon
                  icon={Undo}
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Undo"
                />
                <ButtonSimpleIcon
                  icon={Redo}
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Redo"
                />
                <ButtonSimpleIcon
                  icon={RotateCcw}
                  onClick={onReset}
                  title="Reset all settings"
                />
              </div>
              <div className="flex items-center gap-2">
                <ButtonSimpleIcon
                  icon={Upload}
                  onClick={onUpload}
                  title="Upload saved model and settings"
                />
                <ButtonSimpleIcon
                  icon={Save}
                  onClick={onSave}
                  title="Save model and settings"
                />
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-4 space-y-6">
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

              <ControlGroup title="Model Settings">
                <div className="space-y-4">
                  <LabelWithSettings
                    label="Wireframe"
                    value={modelSettings.wireframe}
                    onChange={(value) => handleModelSettingChange('wireframe', value)}
                    onSettingsClick={modelSettings.wireframe ? () => openPanel('wireframe') : undefined}
                    showToggle={true}
                  />

                  <LabelWithSettings
                    label="Lighting"
                    value={modelSettings.lighting}
                    onChange={(value) => handleModelSettingChange('lighting', value)}
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
                    onChange={(value) => handleModelSettingChange('resolution', value)}
                    min={0.1}
                    max={1}
                    step={0.1}
                    minLabel="Low"
                    maxLabel="High"
                    label="Resolution"
                  />
                </div>
              </ControlGroup>

              <ControlGroup title="Camera Settings">
                <div className="grid grid-cols-3 gap-4">
                  <Knob
                    value={zoom}
                    onChange={handleZoomChange}
                    min={1}
                    max={10}
                    step={0.1}
                    label="Zoom"
                    loop={false}
                  />
                  <Knob
                    value={orbitX}
                    onChange={(x) => handleOrbitChange(x, orbitY)}
                    min={-180}
                    max={180}
                    step={1}
                    label="Orbit X"
                    unit="°"
                    loop={true}
                  />
                  <Knob
                    value={orbitY}
                    onChange={(y) => handleOrbitChange(orbitX, y)}
                    min={-89}
                    max={89}
                    step={1}
                    label="Orbit Y"
                    unit="°"
                    loop={false}
                  />
                </div>
              </ControlGroup>

              <div className="pt-4 border-t border-white/20">
                <ButtonGrey
                  fullWidth
                  onClick={() => openPanel('advanced')}
                  icon={Settings}
                >
                  Advanced Settings
                </ButtonGrey>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (dockPosition) {
    return content;
  }

  return (
    <Draggable
      handle=".panel-handle"
      onDrag={(_, data) => handleDrag(data.x, data.y, containerWidth)}
      onStop={(_, data) => handleDragStop(data.x, data.y, containerWidth)}
      position={position}
      bounds="parent"
    >
      <div
        style={{
          width: isCollapsed ? 'auto' : '320px',
          maxHeight: '90%',
        }}
        className="absolute top-0 left-0 z-50 border border-white/20 rounded-lg overflow-auto shadow-lg"
      >
        {content}
      </div>
    </Draggable>
  );
};