import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  disabled?: boolean;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  disabled = false,
  label,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only trigger onChange if we're not disabled
    if (!disabled) {
      onChange(parseFloat(e.target.value));
    }
  };

  return (
    <div className="space-y-2">
      {label && <div className={`text-sm mb-2 ${disabled ? 'line-through text-white/30' : 'text-white/60'}`}>{label}</div>}

      <input
        type="range"
        onChange={handleChange}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6600] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#ff6600] [&::-moz-range-thumb]:border-0"
        {...{ min, max, step, value, disabled }}
      />

      <div className="flex justify-between mt-1 text-sm text-white/60">
        <span>{minLabel}</span>
        <span>{value}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};