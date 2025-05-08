import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface TooltipProps {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left - 224, // 256px (w-64) - 32px to align right edge
      });
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block" ref={buttonRef}>
      <ButtonSimpleIcon
        icon={HelpCircle}
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        title="Show information"
      />
      {isVisible && (
        <div
          className="fixed z-50 w-64 p-2 text-sm bg-black border border-white/20 rounded-lg shadow-lg"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <div className="absolute -top-2 right-3 w-4 h-4 bg-black border-t border-l border-white/20 transform rotate-45" />
          <div className="relative text-white/80">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};