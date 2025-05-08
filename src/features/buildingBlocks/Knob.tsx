import React, { useEffect, useRef, useState } from 'react';

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
  onRelease?: () => void;
  loop?: boolean;
}

export const Knob: React.FC<KnobProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit = '',
  disabled = false,
  onRelease,
  loop = false
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || disabled) return;
      
      const deltaY = startY - e.clientY;
      const range = max - min;
      const sensitivity = isShiftPressed ? 0.1 : 1;
      const deltaValue = (deltaY / 100) * range * sensitivity;
      
      let newValue = startValue + deltaValue;

      if (loop) {
        // For looping behavior, wrap around at boundaries
        if (newValue > max) newValue = min + (newValue - max);
        if (newValue < min) newValue = max - (min - newValue);
      } else {
        // For non-looping behavior, clamp at boundaries
        newValue = Math.max(min, Math.min(max, newValue));
      }
      
      if (isShiftPressed) {
        newValue = Math.round(newValue * 10) / 10;
      } else {
        newValue = Math.round(newValue / step) * step;
      }
      
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onRelease?.();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, step, onChange, startY, startValue, disabled, onRelease, isShiftPressed, loop]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!disabled) {
      setIsDragging(true);
      setStartY(e.clientY);
      setStartValue(value);
    }
  };

  const handleDoubleClick = () => {
    if (!disabled) {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    onRelease?.();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const inputValue = Number(inputRef.current?.value || 0);
      if (!isNaN(inputValue)) {
        let newValue = inputValue;
        if (loop) {
          // Wrap around for looping values
          while (newValue > max) newValue -= (max - min);
          while (newValue < min) newValue += (max - min);
        } else {
          // Clamp for non-looping values
          newValue = Math.max(min, Math.min(max, newValue));
        }
        onChange(newValue);
      }
      setIsEditing(false);
      onRelease?.();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Calculate rotation angle (270 degrees total range)
  const getNormalizedValue = () => {
    if (loop) {
      // For looping behavior, normalize to 0-1 range
      let normalizedValue = (value - min) / (max - min);
      normalizedValue = normalizedValue - Math.floor(normalizedValue);
      return normalizedValue;
    } else {
      // For non-looping behavior, clamp to 0-1 range
      return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }
  };

  const rotation = getNormalizedValue() * 270 - 135;

  return (
    <div className="space-y-2">
      {label && <div className="text-sm text-white/60">{label}</div>}
      <div className="flex items-center gap-4">
        <div
          ref={knobRef}
          className={`w-16 h-16 rounded-full bg-black border-2 ${
            disabled ? 'border-white/10 cursor-not-allowed' : 'border-white/20 cursor-pointer'
          } relative`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <div
            className={`absolute w-1 h-6 ${
              disabled ? 'bg-white/30' : 'bg-white'
            } rounded-full left-1/2 -translate-x-1/2 origin-bottom`}
            style={{ transform: `rotate(${rotation}deg)`, bottom: '50%' }}
          />
          <div className={`absolute inset-0 flex items-center justify-center ${disabled ? 'text-white/50' : 'text-white'} text-sm font-medium`}>
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                defaultValue={value.toFixed(1)}
                className="w-12 bg-transparent text-center"
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
              />
            ) : (
              `${value.toFixed(1)}${unit}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};