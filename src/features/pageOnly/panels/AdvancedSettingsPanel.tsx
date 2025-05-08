import React from 'react';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { usePanelManager } from '../contexts/PanelManagerContext';

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

  if (!isOpen) return null;

  return (
    <PanelBase
      title='Advanced Settings'
      panelId="advanced"
      zIndex={zIndex}
      onClose={() => closePanel("advanced")}
    >
      <LabelWithSettings
        label="Show Ground Plane"
        value={showPlane}
        onChange={onShowPlaneChange}
        showToggle={true}
      />
    </PanelBase>
  );
};