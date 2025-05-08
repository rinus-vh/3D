import React from 'react';
import { ButtonWhite, ButtonGrey } from './Button';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  buttons?: {
    primary?: {
      label: string;
      onClick: () => void;
      variant?: 'white' | 'grey';
      className?: string;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      variant?: 'white' | 'grey';
      className?: string;
    };
  };
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  buttons
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
      <div className="bg-black border border-white/20 p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-medium mb-4">{title}</h2>

        <div className="text-white/60 mb-6">
          {children}
        </div>

        <div className="flex gap-4 justify-end">
          {buttons?.secondary && (
            <ButtonGrey
              onClick={buttons.secondary.onClick}
              className={buttons.secondary.className}
            >
              {buttons.secondary.label}
            </ButtonGrey>
          )}
          {buttons?.primary && (
            <ButtonWhite
              onClick={buttons.primary.onClick}
              className={buttons.primary.className}
            >
              {buttons.primary.label}
            </ButtonWhite>
          )}
        </div>
      </div>
    </div>
  );
};