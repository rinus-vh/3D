import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import Draggable from 'react-draggable';
import { PanelId, usePanelManager } from '../pageOnly/contexts/PanelManagerContext';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface PanelBaseProps {
  title?: string;
  panelId: PanelId;
  zIndex: number;
  onClose: () => void;
  children: React.ReactNode;
}

export const PanelBase: React.FC<PanelBaseProps> = ({
  title,
  panelId,
  zIndex,
  onClose,
  children,
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
        className="absolute top-20 right-20 w-[280px] bg-black border border-white/20 rounded-lg overflow-hidden shadow-lg"
        style={{ zIndex }}
      >
        <div className="panel-handle flex items-center justify-between p-3 bg-white/5 cursor-move">
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
          <div className="p-4 space-y-4">
            {children}
          </div>
        )}
      </div>
    </Draggable>
  );
};