import React, { useState } from 'react';
import { PanelBase } from '../../buildingBlocks/PanelBase';
import { usePanelManager } from '../contexts/PanelManagerContext';
import { MaterialSettings } from '../controls/MaterialSettings';
import { TextureSettings } from '../controls/TextureSettings';
import { BumpMapSettings } from '../controls/BumpMapSettings';
import { ModelSettings } from '../../../types';

type TabsType = ModelSettings["panelTabs"];
const tabs: TabsType[] = ['general', 'texture', 'bumpMap'];

export const MaterialPanel: React.FC = () => {
  const { panelStates, closePanel } = usePanelManager();
  const { isOpen, zIndex } = panelStates.material;
  const [activeTab, setActiveTab] = useState<TabsType>('general');

  if (!isOpen) return null;

  return (
    <PanelBase
      title='Material Settings'
      panelId="material"
      zIndex={zIndex}
      onClose={() => closePanel("material")}
      onTabChange={setActiveTab}
      {...{ tabs, activeTab }}
    >
      {activeTab === 'general' && <MaterialSettings />}
      {activeTab === 'texture' && <TextureSettings />}
      {activeTab === 'bumpMap' && <BumpMapSettings />}
    </PanelBase>
  );
};