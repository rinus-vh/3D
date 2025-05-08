import React from 'react';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  offLabel?: string;
  onLabel?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  offLabel = 'Off',
  onLabel = 'On',
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className={`${disabled ? 'text-white/30' : !value ? 'text-white' : 'text-white/50'}`}>{offLabel}</span>
      <button
        onClick={() => !disabled && onChange?.(!value)}
        className={`relative w-12 h-6 ${disabled ? 'bg-white/10 cursor-not-allowed' : value ? 'bg-[#ff6600]' : 'bg-white/20'
          } rounded-full transition-colors`}
        {...{ disabled }}
      >
        <div
          className={`absolute w-4 h-4 ${disabled ? 'bg-white/30' : 'bg-white'} rounded-full top-1 transition-transform ${value ? 'left-7' : 'left-1'
            }`}
        />
      </button>
      <span className={`${disabled ? 'text-white/30' : value ? 'text-white' : 'text-white/50'}`}>{onLabel}</span>
    </div>
  );
};