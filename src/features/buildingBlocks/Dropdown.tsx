import React from 'react';

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label?: string;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  label,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="block mb-2">{label}</label>}
      <select
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-white/20 p-2 text-white focus:outline-none focus:border-white"
        {...{ value, disabled }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};