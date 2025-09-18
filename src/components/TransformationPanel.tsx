import React from 'react';
import { Button } from './ui/Button';
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

interface TransformationPanelProps {
  disabled?: boolean;
  onValuesChange: () => void;
}

export const TransformationPanel: React.FC<TransformationPanelProps> = ({
  disabled,
  onValuesChange,
}) => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">Transform</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          disabled={disabled}
          onClick={onValuesChange}
          className="flex flex-col h-16 items-center justify-center"
        >
          <RotateCw className="h-6 w-6 mb-1" />
          <span className="text-xs">Rotate</span>
        </Button>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={onValuesChange}
          className="flex flex-col h-16 items-center justify-center"
        >
          <FlipHorizontal className="h-6 w-6 mb-1" />
          <span className="text-xs">Flip H</span>
        </Button>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={onValuesChange}
          className="flex flex-col h-16 items-center justify-center"
        >
          <FlipVertical className="h-6 w-6 mb-1" />
          <span className="text-xs">Flip V</span>
        </Button>
      </div>
    </div>
  );
};
