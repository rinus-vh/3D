import React, { createContext, useContext, useState, useCallback } from 'react';
import JSZip from 'jszip';
import { captureFrameSequence } from '../../../machinery/exportSequence';
import { ModelSettings, RotationSettings } from '../../../types';

interface ExportSettings {
  aspectRatio: string;
  shadows: boolean;
}

interface ExportContextType {
  isRecording: boolean;
  exportProgress: number;
  currentFrame: string | null;
  exportSettings: ExportSettings;
  setExportSettings: (settings: ExportSettings) => void;
  handleExport: (params: {
    modelRef: React.RefObject<THREE.Group>;
    rotation: RotationSettings;
    modelSettings: ModelSettings;
    cameraPosition: THREE.Vector3;
  }) => Promise<void>;
  cancelExport: () => void;
}

const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  aspectRatio: '16:9',
  shadows: false,
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);

  const handleExport = useCallback(async ({
    modelRef,
    rotation,
    modelSettings,
    cameraPosition,
  }) => {
    if (!modelRef.current) return;

    setIsRecording(true);
    setExportProgress(0);

    try {
      await captureFrameSequence({
        modelRef,
        rotation,
        modelSettings,
        exportSettings,
        cameraPosition,
        onProgress: (progress) => {
          setExportProgress(progress);
        },
        onFrameCapture: (frameData) => {
          setCurrentFrame(frameData);
        },
        onComplete: (frames) => {
          const zip = new JSZip();
          frames.forEach((dataUrl, index) => {
            const data = dataUrl.split(',')[1];
            zip.file(`frame_${String(index).padStart(4, '0')}.png`, data, { base64: true });
          });

          zip.generateAsync({ type: 'blob' }).then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'frame_sequence.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsRecording(false);
            setExportProgress(0);
            setCurrentFrame(null);
          });
        }
      });
    } catch (error) {
      console.error('Export failed:', error);
      setIsRecording(false);
      setExportProgress(0);
      setCurrentFrame(null);
      throw error;
    }
  }, [exportSettings]);

  const cancelExport = useCallback(() => {
    setIsRecording(false);
    setExportProgress(0);
    setCurrentFrame(null);
  }, []);

  return (
    <ExportContext.Provider
      value={{
        isRecording,
        exportProgress,
        currentFrame,
        exportSettings,
        setExportSettings,
        handleExport,
        cancelExport,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error('useExport must be used within an ExportProvider');
  }
  return context;
}