import React, { useEffect } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { PhotoEditorError } from '../types';

interface ErrorNotificationProps {
  error: PhotoEditorError | null;
  onDismiss: () => void;
  onRetry?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  error,
  onDismiss,
  onRetry,
  autoHide = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (error && autoHide) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [error, autoHide, duration, onDismiss]);

  if (!error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm p-4 bg-red-900/90 text-white rounded-lg shadow-lg border border-red-700 z-[100]">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
        <div className="flex-1">
          <p className="font-bold">{error.message}</p>
          {error.details && (
            <p className="text-xs text-red-200 mt-1">{error.details}</p>
          )}
          <div className="mt-3 flex gap-2">
            {error.recoverable && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-white border-red-400 hover:bg-red-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
