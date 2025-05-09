import React from 'react';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { InputColor } from '../../buildingBlocks/InputColor';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { useAdvancedSettings } from '../contexts/AdvancedSettingsContext';

export const AdvancedSettingsPanel: React.FC = () => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.advanced;
  const { advancedSettings, updateAdvancedSettings } = useAdvancedSettings();

  if (!isOpen) return null;

  return (
    <PanelBase
      title='Advanced Settings'
      panelId="advanced"
      zIndex={zIndex}
      onClose={() => closePanel("advanced")}
    >
      <div className="space-y-4">
        <InputColor
          label="Background Color"
          value={advancedSettings.backgroundColor}
          onChange={(value) => updateAdvancedSettings('backgroundColor', value)}
        />
        <LabelWithSettings
          label="Show Ground Plane"
          value={advancedSettings.showGroundPlane}
          onChange={(value) => updateAdvancedSettings('showGroundPlane', value)}
          showToggle={true}
        />
        <LabelWithSettings
          label="Gravity"
          value={advancedSettings.gravity}
          onChange={(value) => updateAdvancedSettings('gravity', value)}
          showToggle={true}
        />
      </div>
    </PanelBase>
  );
};