import React from 'react';

interface CapturePanelProps {
  progress: number;
  currentFrame: string | null;
}

export const CapturePanel: React.FC<CapturePanelProps> = ({
  progress,
  currentFrame,
}) => {
  return (
    <div className="absolute top-4 right-4 w-[280px] bg-black border border-white/20 rounded-lg overflow-hidden shadow-lg z-50">
      <div className="flex items-center justify-between p-3 bg-white/5">
        <span className="font-medium">Capturing Sequence</span>
      </div>

      <div className="p-4 space-y-4">
        {currentFrame && (
          <div className="w-full aspect-video bg-black/20 rounded overflow-hidden">
            <img
              src={currentFrame}
              alt="Current frame"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-white/60">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
};