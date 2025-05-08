import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import * as THREE from 'three';

import { PanelBase } from '../../buildingBlocks/PanelBase';
import { ButtonWhite } from '../../buildingBlocks/Button';
import { LabelWithSettings } from '../../buildingBlocks/LabelWithSettings';
import { Dropdown } from '../../buildingBlocks/Dropdown';
import { Modal } from '../../buildingBlocks/Modal';
import { ModelSettings, RotationSettings } from '../../../types';
import { useExport } from '../contexts/ExportContext';
import { useCamera } from '../contexts/CameraContext';
import { usePanelManager } from '../contexts/PanelManagerContext';

interface ExportPanelProps {
  modelRef: React.RefObject<THREE.Group>;
  rotation: RotationSettings;
  modelSettings: ModelSettings;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  modelRef,
  rotation,
  modelSettings,
}) => {
  const { isRecording, exportSettings, setExportSettings, handleExport } = useExport();
  const { cameraRef } = useCamera();
  const { panelStates, closePanel } = usePanelManager();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { isOpen, zIndex } = panelStates.export;

  if (!isOpen) return null;

  const handleSettingChange = (key: string, value: any) => {
    setExportSettings({
      ...exportSettings,
      [key]: value
    });
  };

  const startExport = async () => {
    if (!modelRef.current || !cameraRef.current) return;

    try {
      await handleExport({
        modelRef,
        rotation,
        modelSettings,
        cameraPosition: cameraRef.current.position,
      });
      closePanel('export');
    } catch (error) {
      setErrorMessage(`Export failed: ${error.message}`);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <PanelBase
        title='Export Settings'
        panelId="export"
        zIndex={zIndex}
        onClose={() => closePanel("export")}
      >
        <Dropdown
          value={exportSettings.aspectRatio}
          onChange={(value) => handleSettingChange('aspectRatio', value)}
          options={[
            { value: '16:9', label: 'Widescreen (16:9)' },
            { value: '4:3', label: 'Landscape (4:3)' },
            { value: '3:4', label: 'Portrait (3:4)' },
            { value: '1:1', label: 'Square (1:1)' }
          ]}
          label="Aspect Ratio"
        />

        <LabelWithSettings
          label="Render drop shadow"
          value={exportSettings.shadows}
          onChange={(value) => handleSettingChange('shadows', value)}
          showToggle={true}
        />

        <div className="flex flex-col gap-2 pt-4 border-t border-white/20">
          <ButtonWhite
            onClick={startExport}
            disabled={isRecording}
            fullWidth
            icon={isRecording ? Loader : Download}
          >
            {isRecording ? "Capturing frames" : "Export frame sequence"}
          </ButtonWhite>
        </div>
      </PanelBase>

      {showErrorModal && (
        <Modal
          title="Error"
          buttons={{
            primary: {
              label: "Close",
              onClick: () => setShowErrorModal(false)
            }
          }}
        >
          {errorMessage}
        </Modal>
      )}
    </>
  );
};