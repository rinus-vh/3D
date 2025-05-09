import React from 'react';

interface InputColorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

export const InputColor: React.FC<InputColorProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className={`block text-sm ${disabled ? 'line-through text-white/30' : 'text-white/60'}`}>
        {label}
      </label>

      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-8 bg-transparent cursor-pointer ${disabled ? 'opacity-30' : ''}`}
        {...{ disabled }}
      />
    </div>
  );
};