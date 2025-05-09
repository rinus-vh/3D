import React from 'react';

interface ModalProps {
  title: string;
  message: string;
  renderSecondaryButton?: () => React.ReactNode;
  renderPrimaryButton: () => React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  message,
  renderSecondaryButton = undefined,
  renderPrimaryButton,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-black border border-white/20 p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium mb-4">{title}</h2>

        <div className="text-white/60 mb-6">
          {message}
        </div>

        <div className="flex gap-4 justify-end">
          {renderSecondaryButton && renderSecondaryButton()}
          {renderPrimaryButton()}
        </div>
      </div>
    </div>
  );
};