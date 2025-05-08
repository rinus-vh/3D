import { useState, useCallback } from 'react';
import { FileUpload } from './features/pageOnly/FileUpload';
import { ModelViewer } from './features/pageOnly/ModelViewer';
import { AppContainer } from './features/pageOnly/AppContainer';
import { ModelSettingsProvider } from './features/pageOnly/contexts/ModelSettingsContext';
import { RotationProvider } from './features/pageOnly/contexts/RotationContext';
import { CameraProvider } from './features/pageOnly/contexts/CameraContext';
import { ExportProvider } from './features/pageOnly/contexts/ExportContext';
import { ControlPanelProvider } from './features/pageOnly/contexts/ControlPanelContext';

function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleModelLoaded = useCallback((url: string) => {
    setModelUrl(url);
    setIsLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setModelUrl(null);
  }, []);

  const resetState = useCallback(() => {
    setModelUrl(null);
    setIsLoading(false);
    setError(null);
    setShowDiscardModal(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleDiscardClick = useCallback(() => {
    setShowDiscardModal(true);
  }, []);

  return (
    <ModelSettingsProvider>
      <RotationProvider>
        <CameraProvider>
          <ExportProvider>
            <ControlPanelProvider>
              <AppContainer
                showControls={!!modelUrl}
                onToggleFullscreen={toggleFullscreen}
                onDiscard={handleDiscardClick}
                isFullscreen={isFullscreen}
              >
                {!modelUrl ? (
                  <div className="w-full p-4">
                    <FileUpload
                      onModelLoaded={handleModelLoaded}
                      onLoading={setIsLoading}
                      onError={handleError}
                      {...{ isLoading, error }}
                    />
                  </div>
                ) : (
                  <ModelViewer
                    onCloseDiscardModal={() => setShowDiscardModal(false)}
                    onConfirmDiscard={resetState}
                    {...{
                      modelUrl,
                      showDiscardModal,
                    }}
                  />
                )}
              </AppContainer>
            </ControlPanelProvider>
          </ExportProvider>
        </CameraProvider>
      </RotationProvider>
    </ModelSettingsProvider>
  );
}

export default App