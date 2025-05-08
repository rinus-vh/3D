import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ButtonSimpleIcon } from './ButtonSimpleIcon';

interface ControlGroupProps {
  title: string;
  children: React.ReactNode;
}

export const ControlGroup: React.FC<ControlGroupProps> = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="border border-white/20 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-white/5">
        <h3 className="text-lg font-medium">{title}</h3>
        <ButtonSimpleIcon
          icon={isCollapsed ? ChevronRight : ChevronDown}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand section" : "Collapse section"}
        />
      </div>
      {!isCollapsed && (
        <div className="p-4 space-y-4 border-t border-white/20">
          {children}
        </div>
      )}
    </div>
  );
};