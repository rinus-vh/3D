import React from 'react';
import { Undo, Redo, RotateCcw, Save, Upload } from 'lucide-react';
import { ButtonSimpleIcon } from '../../buildingBlocks/ButtonSimpleIcon';
import { useEditHistory } from '../contexts/EditHistoryContext';

export const EditHistoryBar: React.FC = () => {
  const { canUndo, canRedo, undo, redo, resetAll, saveProject, uploadProject } = useEditHistory();

  return (
    <div className="border-b border-white/20 p-3 bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ButtonSimpleIcon
            icon={Undo}
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
          />
          <ButtonSimpleIcon
            icon={Redo}
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
          />
          <ButtonSimpleIcon
            icon={RotateCcw}
            onClick={resetAll}
            title="Reset all settings"
          />
        </div>
        <div className="flex items-center gap-2">
          <ButtonSimpleIcon
            icon={Upload}
            onClick={uploadProject}
            title="Upload saved model and settings"
          />
          <ButtonSimpleIcon
            icon={Save}
            onClick={saveProject}
            title="Save model and settings"
          />
        </div>
      </div>
    </div>
  );
};