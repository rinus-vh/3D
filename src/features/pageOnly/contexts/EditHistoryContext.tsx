import React, { createContext, useContext, useState, useCallback } from 'react';
import { ModelSettings, RotationSettings } from '../../../types';
import { createProjectArchive } from '../../../utils/fileUtils';
import { useModelSettings } from './ModelSettingsContext';
import { useRotation } from './RotationContext';
import { useCamera } from './CameraContext';

interface HistoryState {
  modelSettings: ModelSettings;
  rotation: RotationSettings;
  zoom: number;
  orbitX: number;
  orbitY: number;
}

interface EditHistoryState {
  canUndo: boolean;
  canRedo: boolean;
  history: HistoryState[];
  currentIndex: number;
}

interface EditHistoryContextType extends Omit<EditHistoryState, 'history' | 'currentIndex'> {
  resetAll: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => void;
  uploadProject: () => void;
  addToHistory: (state: HistoryState) => void;
}

const MAX_HISTORY = 25;

const EditHistoryContext = createContext<EditHistoryContextType | undefined>(undefined);

export function EditHistoryProvider({ children }: { children: React.ReactNode }) {
  const { modelSettings, handleModelSettingsChange, resetModelSettings } = useModelSettings();
  const { rotation, setRotation, resetRotation } = useRotation();
  const { zoom, orbitX, orbitY, handleZoomChange, handleOrbitChange, resetCamera } = useCamera();

  const [state, setState] = useState<EditHistoryState>({
    canUndo: false,
    canRedo: false,
    history: [{
      modelSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    }],
    currentIndex: 0
  });

  const addToHistory = useCallback((newState: HistoryState) => {
    setState(prev => {
      // Don't add if the state is identical to the current state
      if (prev.currentIndex >= 0 && 
          JSON.stringify(prev.history[prev.currentIndex]) === JSON.stringify(newState)) {
        return prev;
      }

      // Remove any future states if we're not at the end
      const newHistory = prev.history.slice(0, prev.currentIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Keep only the last MAX_HISTORY states
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      const newIndex = newHistory.length - 1;

      return {
        history: newHistory,
        currentIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: false
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (!prev.canUndo || prev.currentIndex <= 0) return prev;

      const newIndex = prev.currentIndex - 1;
      const previousState = prev.history[newIndex];

      // Apply the previous state
      handleModelSettingsChange(previousState.modelSettings);
      setRotation(previousState.rotation);
      handleZoomChange(previousState.zoom);
      handleOrbitChange(previousState.orbitX, previousState.orbitY);

      return {
        ...prev,
        currentIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true
      };
    });
  }, [handleModelSettingsChange, setRotation, handleZoomChange, handleOrbitChange]);

  const redo = useCallback(() => {
    setState(prev => {
      if (!prev.canRedo || prev.currentIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.currentIndex + 1;
      const nextState = prev.history[newIndex];

      // Apply the next state
      handleModelSettingsChange(nextState.modelSettings);
      setRotation(nextState.rotation);
      handleZoomChange(nextState.zoom);
      handleOrbitChange(nextState.orbitX, nextState.orbitY);

      return {
        ...prev,
        currentIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < prev.history.length - 1
      };
    });
  }, [handleModelSettingsChange, setRotation, handleZoomChange, handleOrbitChange]);

  const resetAll = useCallback(() => {
    resetModelSettings();
    resetRotation();
    resetCamera();

    const initialState = {
      modelSettings,
      rotation,
      zoom,
      orbitX,
      orbitY
    };

    // Clear history and start fresh
    setState({
      canUndo: false,
      canRedo: false,
      history: [initialState],
      currentIndex: 0
    });
  }, [resetModelSettings, resetRotation, resetCamera, modelSettings, rotation, zoom, orbitX, orbitY]);

  const saveProject = useCallback(() => {
    // TODO: Implement save project functionality
    console.log('Save project');
  }, []);

  const uploadProject = useCallback(() => {
    // TODO: Implement upload project functionality
    console.log('Upload project');
  }, []);

  return (
    <EditHistoryContext.Provider
      value={{
        canUndo: state.canUndo,
        canRedo: state.canRedo,
        resetAll,
        undo,
        redo,
        saveProject,
        uploadProject,
        addToHistory,
      }}
    >
      {children}
    </EditHistoryContext.Provider>
  );
}

export function useEditHistory() {
  const context = useContext(EditHistoryContext);
  if (context === undefined) {
    throw new Error('useEditHistory must be used within an EditHistoryProvider');
  }
  return context;
}