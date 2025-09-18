import React, { useState } from 'react';
import { Slider } from './ui/Slider';
import { Label } from './ui/Label';
import { useAppStore } from '../store/useAppStore';

interface ColorAdjustmentPanelProps {
  disabled?: boolean;
  onValuesChange: (values: Record<string, any>) => void;
}

export const ColorAdjustmentPanel: React.FC<ColorAdjustmentPanelProps> = ({
  disabled,
  onValuesChange,
}) => {
  const { addPhotoEditOperation } = useAppStore();

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
  });

  const handleValueChange = (name: keyof typeof adjustments, value: number) => {
    const newAdjustments = { ...adjustments, [name]: value };
    setAdjustments(newAdjustments);
    
    addPhotoEditOperation({
      type: 'color-adjustment',
      parameters: { [name]: value },
      timestamp: Date.now(),
    });
    onValuesChange(newAdjustments);
  };

  const adjustmentConfigs = [
    { name: 'Brightness', key: 'brightness', min: -100, max: 100 },
    { name: 'Contrast', key: 'contrast', min: -100, max: 100 },
    { name: 'Saturation', key: 'saturation', min: -100, max: 100 },
    { name: 'Blur', key: 'blur', min: 0, max: 100 },
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Color Adjustments</h3>
      {adjustmentConfigs.map((adj) => (
        <div key={adj.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm text-gray-300">{adj.name}</Label>
            <span className="text-xs text-gray-400">{adjustments[adj.key as keyof typeof adjustments]}</span>
          </div>
          <Slider
            value={[adjustments[adj.key as keyof typeof adjustments]]}
            max={adj.max}
            min={adj.min}
            step={1}
            disabled={disabled}
            onValueChange={(value: number[]) => handleValueChange(adj.key as keyof typeof adjustments, value[0])}
          />
        </div>
      ))}
    </div>
  );
};
