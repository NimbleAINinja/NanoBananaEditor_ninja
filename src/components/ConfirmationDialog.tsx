import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './ui/Button';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'warning' | 'danger';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: 'text-yellow-500',
          button: 'bg-yellow-500 hover:bg-yellow-600',
        };
      case 'danger':
        return {
          icon: 'text-red-500',
          button: 'bg-red-500 hover:bg-red-600',
        };
      default:
        return {
          icon: 'text-blue-500',
          button: 'bg-blue-500 hover:bg-blue-600',
        };
    }
  };

  const variantClasses = getVariantClasses();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm w-full mx-4 z-[60]">
          <div className="flex items-start">
            <div className={`mr-4 flex-shrink-0 ${variantClasses.icon}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-gray-100 mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-400 mb-6">
                {message}
              </Dialog.Description>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button
                  className={variantClasses.button}
                  onClick={onConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : confirmText}
                </Button>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute top-2 right-2">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
