import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ToggleButtonProps {
  icon: typeof LucideIcon;
  isActive: boolean;
  onClick: () => void;
  title?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  icon: Icon,
  isActive,
  onClick,
  title,
}) => {
  return (
    <button
      className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors ${isActive ? 'bg-white text-black' : 'hover:bg-white/10'}`}
      {...{ onClick, title }}
    >
      <Icon size={20} />
    </button>
  );
};