import React from 'react';
import { Settings } from 'lucide-react';
import { Toggle } from './Toggle';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface ToggleWithLabelProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  onSettingsClick?: () => void;
}

export const ToggleWithLabel: React.FC<ToggleWithLabelProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  onSettingsClick
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={disabled ? 'line-through text-white/30' : ''}>{label}</span>
        {onSettingsClick && value && !disabled && (
          <ButtonSimpleIcon
            icon={Settings}
            onClick={onSettingsClick}
            title={`${label} settings`}
          />
        )}
      </div>
      <Toggle
        offLabel="Off"
        onLabel="On"
        {...{ value, onChange, disabled }}
      />
    </div>
  );
};