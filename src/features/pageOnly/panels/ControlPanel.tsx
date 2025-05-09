import React from 'react';
import Draggable from 'react-draggable';
import { Settings, ChevronDown, ChevronRight } from 'lucide-react';

import { usePanelManager } from '../contexts/PanelManagerContext';
import { useControlPanelPosition } from '../contexts/ControlPanelContext';
import { ButtonGrey } from '../../buildingBlocks/Button';
import { ButtonSimpleIcon } from '../../buildingBlocks/ButtonSimpleIcon';
import { AnimationSpeed } from '../controls/AnimationSpeed';
import { ModelRotation } from '../controls/ModelRotation';
import { ModelSettings } from '../controls/ModelSettings';
import { CameraSettings } from '../controls/CameraSettings';
import { EditHistoryBar } from '../controls/EditHistoryBar';

interface ControlPanelProps {
  containerWidth: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  containerWidth,
}) => {
  const { openPanel } = usePanelManager();
  const { isCollapsed, toggleCollapse, dockPosition } = useControlPanelPosition();

  const Container = dockPosition ? ContainerDocked : ContainerDraggable

  return (
    <Container {...{ containerWidth }}>
      <div className="bg-black flex flex-col">
        <div className="sticky top-0 panel-handle bg-[#0d0d0d] border-b border-white/20 cursor-move z-[10]">
          <div className="sticky top-0 panel-handle flex items-center justify-between p-3 bg-[#0d0d0d] cursor-move">
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

          {!isCollapsed && <EditHistoryBar />}
        </div>

        {!isCollapsed && (
          <div className="overflow-y-auto flex-1">
            <div className="p-4 space-y-6">
              <AnimationSpeed />
              <ModelRotation />
              <ModelSettings />
              <CameraSettings />

              <div className="pt-4 border-t border-white/20">
                <ButtonGrey
                  fullWidth
                  label='Advanced Settings'
                  icon={Settings}
                  onClick={() => openPanel('advanced')}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

interface ContainerDockedProps {
  children: React.ReactNode;
}

const ContainerDocked: React.FC<ContainerDockedProps> = ({
  children,
}) => {
  return (
    <div
      className="h-full border border-white/20 overflow-hidden"
      style={{ gridArea: 'controls' }}
    >
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

interface ContainerDraggableProps {
  children: React.ReactNode;
  containerWidth: number;
}

const ContainerDraggable: React.FC<ContainerDraggableProps> = ({
  children,
  containerWidth,
}) => {
  const { isCollapsed, position, handleDrag, handleDragStop } = useControlPanelPosition();

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
        {children}
      </div>
    </Draggable>
  )
}