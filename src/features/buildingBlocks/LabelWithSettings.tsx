import React from 'react';
import { Settings } from 'lucide-react';
import { Toggle } from './Toggle';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface LabelWithSettingsProps {
  label: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  onSettingsClick?: () => void;
  showToggle?: boolean;
}

export const LabelWithSettings: React.FC<LabelWithSettingsProps> = ({
  label,
  value = false,
  onChange,
  disabled = false,
  onSettingsClick,
  showToggle = true
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={disabled ? 'line-through text-white/30' : ''}>{label}</span>
        {onSettingsClick && (!showToggle || value) && !disabled && (
          <ButtonSimpleIcon
            icon={Settings}
            onClick={onSettingsClick}
            title={`${label} settings`}
          />
        )}
      </div>
      {showToggle && (
        <Toggle
          offLabel="Off"
          onLabel="On"
          value={value}
          onChange={onChange!}
          disabled={disabled}
        />
      )}
    </div>
  );
};