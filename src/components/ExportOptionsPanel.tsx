import React from 'react';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Slider } from './ui/Slider';

interface ExportOptionsPanelProps {
  disabled?: boolean;
  onConfigChange: () => void;
}

export const ExportOptionsPanel: React.FC<ExportOptionsPanelProps> = ({
  disabled,
  onConfigChange,
}) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Export Options</h3>
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Format</Label>
        <Select defaultValue="image/jpeg" onValueChange={onConfigChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image/jpeg">JPEG</SelectItem>
            <SelectItem value="image/png">PNG</SelectItem>
            <SelectItem value="image/webp">WEBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Quality</Label>
        <Slider
          defaultValue={[90]}
          max={100}
          min={10}
          step={1}
          disabled={disabled}
          onValueChange={onConfigChange}
        />
      </div>
    </div>
  );
};
