import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonSimpleIconProps {
  icon: typeof LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}

export const ButtonSimpleIcon: React.FC<ButtonSimpleIconProps> = ({
  icon: Icon,
  onClick,
  disabled = false,
  title,
}) => {
  return (
    <button
      className={`p-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
      {...{ onClick, title, disabled }}
    >
      <Icon size={16} />
    </button>
  );
};