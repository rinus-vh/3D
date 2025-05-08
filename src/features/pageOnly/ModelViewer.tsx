import React, { useRef, useState } from 'react';
import * as THREE from 'three';

import { useModelSettings } from './contexts/ModelSettingsContext';
import { useRotation } from './contexts/RotationContext';
import { useCamera } from './contexts/CameraContext';
import { useExport } from './contexts/ExportContext';
import { useControlPanel } from './contexts/ControlPanelContext';

import { ViewCanvas } from './ViewCanvas';
import { Modal } from '../buildingBlocks/Modal';
import { ControlPanel } from './panels/ControlPanel';
import { LightingPanel } from './panels/LightingPanel';
import { WireframePanel } from './panels/WireframePanel';
import { MaterialPanel } from './panels/MaterialPanel';
import { ExportPanel } from './panels/ExportPanel';
import { AdvancedSettingsPanel } from './panels/AdvancedSettingsPanel';
import { CapturePanel } from './panels/CapturePanel';

const PANEL_WIDTH = 320;

interface ModelViewerProps {
  modelUrl: string;
  showDiscardModal: boolean;
  onCloseDiscardModal: () => void;
  onConfirmDiscard: () => void;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  showDiscardModal,
  onCloseDiscardModal,
  onConfirmDiscard,
}) => {
  const { modelSettings, handleModelSettingsChange, resetModelSettings } = useModelSettings();
  const { rotation, masterSpeed, setMasterSpeed, setRotation, resetRotation } = useRotation();
  const { zoom, handleZoomChange, resetCamera } = useCamera();
  const { exportSettings, isRecording, exportProgress, currentFrame } = useExport();
  const { isVisible: controlPanelIsVisible, dockPosition, dockPreview } = useControlPanel();

  const [showPlane, setShowPlane] = useState(false);

  const mainPanelRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group>(null);
  const viewPanelRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    resetRotation();
    resetCamera();
    resetModelSettings();
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <div ref={mainPanelRef} className="w-full h-full p-6 relative">
        <div className="w-full h-full bg-black/20 rounded-xl border border-white/20 overflow-hidden relative">
          {dockPreview && !dockPosition && (
            <div
              className={`absolute inset-y-0 ${dockPreview === 'left' ? 'left-0' : 'right-0'} bg-white/5 border-2 border-white/20 pointer-events-none z-40`}
              style={{ width: `${PANEL_WIDTH}px` }}
            >
              <div className="h-full grid grid-cols-4 gap-px bg-white/10">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-black/20" />
                ))}
              </div>
            </div>
          )}

          <div
            className="w-full h-full grid overflow-hidden"
            style={{
              gridTemplateAreas: controlPanelIsVisible && dockPosition === 'left' ? '"controls canvas"' :
                controlPanelIsVisible && dockPosition === 'right' ? '"canvas controls"' : '"canvas"',
              gridTemplateColumns: controlPanelIsVisible && dockPosition ? `${dockPosition === 'left' ? `${PANEL_WIDTH}px 1fr` : `1fr ${PANEL_WIDTH}px`}` : '1fr',
            }}
          >
            {controlPanelIsVisible && dockPosition && (
              <div
                className="h-full border border-white/20 overflow-hidden"
                style={{ gridArea: 'controls' }}
              >
                <div className="h-full overflow-y-auto">
                  <ControlPanel
                    onRotationChange={setRotation}
                    onModelSettingsChange={handleModelSettingsChange}
                    onMasterSpeedChange={setMasterSpeed}
                    onZoomChange={handleZoomChange}
                    onReset={handleReset}
                    {...{ rotation, modelSettings, masterSpeed, zoom }}
                  />
                </div>
              </div>
            )}

            <ViewCanvas
              {...{
                viewPanelRef,
                modelRef,
                modelUrl,
                rotation,
                modelSettings,
                zoom,
                showPlane,
                exportSettings,
              }}
            />
          </div>

          {controlPanelIsVisible && !dockPosition && (
            <ControlPanel
              onRotationChange={setRotation}
              onModelSettingsChange={handleModelSettingsChange}
              onMasterSpeedChange={setMasterSpeed}
              onZoomChange={handleZoomChange}
              onReset={handleReset}
              containerWidth={mainPanelRef.current?.clientWidth || 0}
              {...{ rotation, modelSettings, masterSpeed, zoom }}
            />
          )}

          <MaterialPanel
            onModelSettingsChange={handleModelSettingsChange}
            {...{ modelSettings }}
          />

          <LightingPanel
            onModelSettingsChange={handleModelSettingsChange}
            {...{ modelSettings }}
          />

          <WireframePanel
            onModelSettingsChange={handleModelSettingsChange}
            {...{ modelSettings }}
          />

          <ExportPanel
            {...{ modelRef, rotation, modelSettings }}
          />

          <AdvancedSettingsPanel
            onShowPlaneChange={setShowPlane}
            {...{ showPlane }}
          />

          {isRecording && (
            <CapturePanel
              progress={exportProgress}
              {...{ currentFrame }}
            />
          )}

          {showDiscardModal && (
            <Modal
              title="Discard 3D Model?"
              buttons={{
                secondary: {
                  label: "Cancel",
                  onClick: onCloseDiscardModal
                },
                primary: {
                  label: "Discard",
                  onClick: onConfirmDiscard,
                  className: "bg-red-500 hover:bg-red-600"
                }
              }}
            >
              Are you sure you want to discard this 3D model? This action cannot be undone.
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};