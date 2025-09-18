import React from 'react';
import { Button } from './ui/Button';
import { Palette, Crop, Wand2, FileOutput } from 'lucide-react';

export type PhotoEditorTab = 'color' | 'transform' | 'filters' | 'export';

interface PhotoEditorToolbarProps {
  activeTab: PhotoEditorTab;
  onTabChange: (tab: PhotoEditorTab) => void;
  disabled?: boolean;
}

const tabs: { id: PhotoEditorTab; label: string; icon: React.ElementType }[] = [
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'transform', label: 'Transform', icon: Crop },
  { id: 'filters', label: 'Filters', icon: Wand2 },
  { id: 'export', label: 'Export', icon: FileOutput },
];

export const PhotoEditorToolbar: React.FC<PhotoEditorToolbarProps> = ({
  activeTab,
  onTabChange,
  disabled,
}) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-md">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? 'secondary' : 'ghost'}
          onClick={() => onTabChange(tab.id)}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <tab.icon className="h-4 w-4" />
          {tab.label}
        </Button>
      ))}
    </div>
  );
};
