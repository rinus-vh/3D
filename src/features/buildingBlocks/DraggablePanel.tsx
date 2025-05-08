import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import Draggable from 'react-draggable';

interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  defaultPosition?: { x: number; y: number };
  className?: string;
}

/**
 * Base component for draggable panels
 * Used by all floating panels in the application
 */
export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  title,
  children,
  onClose,
  defaultPosition = { x: 20, y: 20 },
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Draggable handle=".panel-handle" defaultPosition={defaultPosition}>
      <div className={`bg-black border border-white/20 rounded-lg overflow-hidden shadow-lg z-50 ${className}`}>
        <div className="panel-handle flex items-center justify-between p-3 bg-white/5 cursor-move">
          <span className="font-medium">{title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-white/10"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/10"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && children}
      </div>
    </Draggable>
  );
};