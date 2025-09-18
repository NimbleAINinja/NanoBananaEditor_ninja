import React from 'react';
import { Button } from './ui/Button';
import { Save, X, RotateCcw } from 'lucide-react';

interface PhotoEditorControlsProps {
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  isResetting: boolean;
}

export const PhotoEditorControls: React.FC<PhotoEditorControlsProps> = ({
  onSave,
  onCancel,
  onReset,
  hasChanges,
  isSaving,
  isResetting,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={!hasChanges || isSaving || isResetting}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button
        onClick={onSave}
        disabled={!hasChanges || isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
};
