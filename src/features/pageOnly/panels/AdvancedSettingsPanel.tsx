import React from 'react';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useModelSettings } from '../contexts/ModelSettingsContext';

interface AdvancedSettingsProps {
  showPlane: boolean;
  onShowPlaneChange: (value: boolean) => void;
}

export const AdvancedSettingsPanel: React.FC<AdvancedSettingsProps> = ({
  showPlane,
  onShowPlaneChange,
}) => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.advanced;
  const { modelSettings, handleModelSettingsChange } = useModelSettings();

  if (!isOpen) return null;

  const handleGravityChange = (value: boolean) => {
    handleModelSettingsChange({
      ...modelSettings,
      gravity: value
    });
  };

  return (
    <PanelBase
      title='Advanced Settings'
      panelId="advanced"
      zIndex={zIndex}
      onClose={() => closePanel("advanced")}
    >
      <div className="space-y-4">
        <LabelWithSettings
          label="Show Ground Plane"
          value={showPlane}
          onChange={onShowPlaneChange}
          showToggle={true}
        />
        <LabelWithSettings
          label="Gravity"
          value={modelSettings.gravity}
          onChange={handleGravityChange}
          showToggle={true}
        />
      </div>
    </PanelBase>
  );
};