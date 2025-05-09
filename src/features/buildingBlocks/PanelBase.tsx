import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

import { ModelSettings } from '../../types';

import { PanelId, usePanelManager } from '../pageOnly/contexts/PanelManagerContext';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

type TabsType = ModelSettings["panelTabs"];

interface PanelBaseProps {
  title?: string;
  panelId: PanelId;
  zIndex: number;
  onClose: () => void;
  children: React.ReactNode;
  tabs?: Array<string>;
  activeTab?: string;
  onTabChange?: (tab: TabsType) => void;
}

export const PanelBase: React.FC<PanelBaseProps> = ({
  title,
  panelId,
  zIndex,
  onClose,
  children,
  tabs,
  activeTab,
  onTabChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { focusPanel } = usePanelManager();

  const handleDrag = () => {
    focusPanel(panelId);
  };

  return (
    <Draggable
      handle=".panel-handle"
      bounds="parent"
      onDrag={handleDrag}
      onMouseDown={() => focusPanel(panelId)}
    >
      <div
        className="absolute top-20 right-20 w-[280px] bg-black border border-white/20 rounded-lg overflow-auto shadow-lg"
        style={{ zIndex, maxHeight: '90%' }}
      >
        <div className="sticky top-0 panel-handle bg-[#0d0d0d] bg-white/5 border-b border-white/20 cursor-move">
          <div className="flex items-center justify-between p-3">
            <span className="font-medium">{title}</span>
            <div className="flex items-center gap-2">
              <ButtonSimpleIcon
                icon={isCollapsed ? ChevronRight : ChevronDown}
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand panel" : "Collapse panel"}
              />
              <ButtonSimpleIcon
                icon={X}
                onClick={onClose}
                title="Close panel"
              />
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex">
              {onTabChange && tabs?.map((tab, i) => (
                <button
                  key={i}
                  className={`px-4 py-3 text-sm hover:text-white
                          ${activeTab === tab
                      ? 'border-b-2 border-white'
                      : 'text-white/60'
                    }`}
                  onClick={() => onTabChange(tab as TabsType)}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="p-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    </Draggable>
  );
};