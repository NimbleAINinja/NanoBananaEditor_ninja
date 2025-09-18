import React, { useRef, useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';
import { PhotoEditorControls } from './PhotoEditorControls';
import { PhotoEditorToolbar, type PhotoEditorTab } from './PhotoEditorToolbar';
import { ColorAdjustmentPanel } from './ColorAdjustmentPanel';
import { TransformationPanel } from './TransformationPanel';
import { ExportOptionsPanel } from './ExportOptionsPanel';
import { PhotoEditorErrorBoundary } from './PhotoEditorErrorBoundary';
import { ConfirmationDialog } from './ConfirmationDialog';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorNotification } from './ErrorNotification';
import { 
  captureEditedImage, 
  captureEditedImageWithOptions,
  createPhotoEditAsset, 
  getOutputMimeType 
} from '../utils/photoEditorUtils';
import { PhotoEditSession, PhotoEditorError } from '../types';

// Import the photo editor SDK components
import { 
  PhotoEditorProvider, 
  PhotoEditorPreview 
} from '../lib/PhotoEditorSDK';

interface PhotoEditorModalProps {
  onSave?: (editedImageUrl: string, editMetadata: any) => void;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({ onSave }) => {
  const parentElementRef = useRef<HTMLDivElement>(null);
  const imagePreviewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<PhotoEditorTab>('color');
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  const { 
    photoEditor, 
    closePhotoEditor, 
    setHasUnsavedChanges,
    clearPhotoEditHistory,
    resetPhotoEditor,
    savePhotoEdit,
    setPhotoEditorError,
    setPhotoEditorLoading
  } = useAppStore();
  
  const { 
    isEditorOpen, 
    currentEditingImageUrl, 
    currentEditingAssetId,
    hasUnsavedChanges,
    editingHistory,
    editorConfig,
    currentError,
    isLoading,
    loadingMessage,
    loadingProgress
  } = photoEditor;

  // Handle unsaved changes warning
  const handleClose = () => {
    if (hasUnsavedChanges && !isLoading) {
      setShowCloseConfirmation(true);
      return;
    }
    closePhotoEditor();
  };

  const confirmClose = () => {
    setShowCloseConfirmation(false);
    closePhotoEditor();
  };

  // Handle save functionality
  const handleSave = async () => {
    if (!currentEditingImageUrl || !parentElementRef.current) {
      const error: PhotoEditorError = {
        type: 'save-failure',
        message: 'Photo editor is not ready for saving',
        recoverable: true,
        retryAction: handleSave,
        details: !currentEditingImageUrl ? 'Missing image URL' : 
                'Missing parent element reference'
      };
      setPhotoEditorError(error);
      return;
    }

    setPhotoEditorLoading(true, 'Saving edited image...', 0);
    
    try {
      // Determine output format
      setPhotoEditorLoading(true, 'Processing image format...', 20);
      const outputMime = getOutputMimeType(currentEditingImageUrl, editorConfig.outputMime);
      const quality = editorConfig.quality / 100; // Convert percentage to decimal

      // Capture the edited image from the canvas with export options
      setPhotoEditorLoading(true, 'Capturing edited image...', 40);
      const { dataUrl, blob, finalDimensions } = await captureEditedImageWithOptions(
        parentElementRef.current,
        outputMime,
        editorConfig.quality,
        editorConfig.maxDimensions
      );

      // Create new asset for the edited image
      setPhotoEditorLoading(true, 'Creating asset...', 70);
      const originalAssetId = currentEditingAssetId || 'unknown';
      const editedAsset = await createPhotoEditAsset(
        originalAssetId,
        blob,
        editingHistory,
        outputMime
      );

      // Create photo edit session metadata
      setPhotoEditorLoading(true, 'Finalizing save...', 90);
      const photoEditSession: PhotoEditSession = {
        originalImageUrl: currentEditingImageUrl,
        finalImageUrl: editedAsset.url,
        operations: editingHistory,
        duration: Date.now() - (editingHistory[0]?.timestamp || Date.now())
      };

      // Save to store and update canvas
      savePhotoEdit(editedAsset, photoEditSession);

      // Call onSave callback if provided
      if (onSave) {
        onSave(editedAsset.url, editedAsset.photoEditMetadata);
      }

      setPhotoEditorLoading(true, 'Save complete!', 100);
      setTimeout(() => {
        setPhotoEditorLoading(false);
      }, 500);

      console.log('Photo edit saved successfully:', editedAsset.id);
    } catch (error) {
      console.error('Failed to save edited image:', error);
      
      const photoError: PhotoEditorError = {
        type: 'save-failure',
        message: 'Failed to save the edited image. Please try again.',
        recoverable: true,
        retryAction: handleSave,
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      
      setPhotoEditorError(photoError);
      setPhotoEditorLoading(false);
    }
  };

  // Handle reset functionality
  const handleReset = () => {
    if (!hasUnsavedChanges) return;
    setShowResetConfirmation(true);
  };

  const confirmReset = async () => {
    setShowResetConfirmation(false);
    setPhotoEditorLoading(true, 'Resetting changes...', 0);
    
    try {
      // Clear the editing history and reset unsaved changes
      clearPhotoEditHistory();
      
      setPhotoEditorLoading(true, 'Reset complete!', 100);
      setTimeout(() => {
        setPhotoEditorLoading(false);
      }, 500);
      
      console.log('Editor reset - editing history cleared');
    } catch (error) {
      console.error('Failed to reset editor:', error);
      
      const photoError: PhotoEditorError = {
        type: 'unknown',
        message: 'Failed to reset the editor. Please try again.',
        recoverable: true,
        retryAction: confirmReset,
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      
      setPhotoEditorError(photoError);
      setPhotoEditorLoading(false);
    }
  };

  // Reset state when editor opens
  useEffect(() => {
    if (isEditorOpen) {
      setHasUnsavedChanges(false);
      setActiveTab('color'); // Reset to default tab
      setShowCloseConfirmation(false);
      setShowResetConfirmation(false);
      
      // Clear any previous errors
      setPhotoEditorError(null);
      setPhotoEditorLoading(false);
    }
  }, [isEditorOpen, setHasUnsavedChanges, setPhotoEditorError, setPhotoEditorLoading]);

  // Handle SDK loading errors
  const handleSDKError = (error: Error) => {
    console.error('Photo Editor SDK Error:', error);
    
    const photoError: PhotoEditorError = {
      type: 'sdk-load',
      message: 'Failed to load the photo editor. This could be due to a missing reference or SDK initialization issue.',
      recoverable: true,
      retryAction: () => {
        window.location.reload();
      },
      details: error.message
    };
    
    setPhotoEditorError(photoError);
  };

  // Handle image loading errors
  const handleImageLoadError = () => {
    const photoError: PhotoEditorError = {
      type: 'image-load',
      message: 'Failed to load the image in the editor. The image may be corrupted or in an unsupported format.',
      recoverable: true,
      retryAction: () => {
        setPhotoEditorError(null);
        // Trigger a re-render by closing and reopening
        closePhotoEditor();
      },
      details: `Image URL: ${currentEditingImageUrl}`
    };
    
    setPhotoEditorError(photoError);
  };

  if (!currentEditingImageUrl) {
    return null;
  }

  return (
    <>
      <Dialog.Root open={isEditorOpen} onOpenChange={(open) => !open && handleClose()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <Dialog.Content 
            className="fixed inset-0 sm:inset-4 bg-gray-900 border-0 sm:border sm:border-gray-700 rounded-none sm:rounded-lg overflow-hidden z-50 flex flex-col"
            aria-labelledby="photo-editor-title"
            aria-describedby="photo-editor-description"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <Dialog.Title 
                  id="photo-editor-title"
                  className="text-base sm:text-lg font-semibold text-gray-100 truncate"
                >
                  Photo Editor
                </Dialog.Title>
                <div className="hidden sm:block">
                  <PhotoEditorToolbar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <div className="hidden sm:block">
                  <PhotoEditorControls
                    onSave={handleSave}
                    onCancel={handleClose}
                    onReset={handleReset}
                    hasChanges={hasUnsavedChanges}
                    isSaving={isLoading}
                    isResetting={false}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setShowKeyboardHelp(true)}
                  disabled={isLoading}
                  aria-label="Show keyboard shortcuts help"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Dialog.Close asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={handleClose}
                    disabled={isLoading}
                    aria-label="Close photo editor"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div>
            </div>

            {/* Mobile Toolbar */}
            <div className="block sm:hidden border-b border-gray-700 p-2">
              <PhotoEditorToolbar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                disabled={isLoading}
              />
            </div>

            {/* Photo Editor Content */}
            <div className="flex-1 overflow-hidden flex flex-col sm:flex-row relative" ref={parentElementRef}>
              <div 
                id="photo-editor-description" 
                className="sr-only"
              >
                Photo editor interface with color adjustments, transformations, and filters. Use tab navigation to switch between editing modes.
              </div>
              <PhotoEditorErrorBoundary onError={handleSDKError}>
                <PhotoEditorProvider
                  value={{
                    parentElementRef,
                    fileURL: currentEditingImageUrl || '',
                    outputMime: editorConfig.outputMime,
                  }}
                >
                  {/* Main Editor Area */}
                  <div 
                    ref={imagePreviewRef}
                    className="flex-1 h-full min-h-0 relative touch-manipulation"
                  >
                    <PhotoEditorPreview show={true} />
                  </div>
                
                {/* Side Panel for Controls - Desktop */}
                <div className="hidden sm:block w-80 border-l border-gray-700 bg-gray-800 overflow-y-auto">
                  {activeTab === 'color' && (
                    <ColorAdjustmentPanel
                      imagePreviewRef={imagePreviewRef}
                      disabled={isLoading}
                      onValuesChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                  {activeTab === 'transform' && (
                    <TransformationPanel
                      disabled={isLoading}
                      onValuesChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                  {activeTab === 'filters' && (
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-100 mb-4">Filters</h3>
                      <p className="text-gray-400 text-sm">Filter controls will be implemented in a future task.</p>
                    </div>
                  )}
                  {activeTab === 'export' && (
                    <ExportOptionsPanel
                      disabled={isLoading}
                      onConfigChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                </div>
                
                {/* Bottom Panel for Controls - Mobile */}
                <div className="block sm:hidden border-t border-gray-700 bg-gray-800 max-h-64 overflow-y-auto">
                  {activeTab === 'color' && (
                    <ColorAdjustmentPanel
                      imagePreviewRef={imagePreviewRef}
                      disabled={isLoading}
                      onValuesChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                  {activeTab === 'transform' && (
                    <TransformationPanel
                      disabled={isLoading}
                      onValuesChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                  {activeTab === 'filters' && (
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-100 mb-4">Filters</h3>
                      <p className="text-gray-400 text-sm">Filter controls will be implemented in a future task.</p>
                    </div>
                  )}
                  {activeTab === 'export' && (
                    <ExportOptionsPanel
                      disabled={isLoading}
                      onConfigChange={() => setHasUnsavedChanges(true)}
                    />
                  )}
                </div>
              </PhotoEditorProvider>
              </PhotoEditorErrorBoundary>

              {/* Loading Overlay */}
              <LoadingOverlay
                isVisible={isLoading}
                message={loadingMessage}
                progress={loadingProgress}
              />
            </div>

            {/* Mobile Controls Footer */}
            <div className="block sm:hidden border-t border-gray-700 p-3 bg-gray-900">
              <PhotoEditorControls
                onSave={handleSave}
                onCancel={handleClose}
                onReset={handleReset}
                hasChanges={hasUnsavedChanges}
                isSaving={isLoading}
                isResetting={false}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showCloseConfirmation}
        onClose={() => setShowCloseConfirmation(false)}
        onConfirm={confirmClose}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close the editor? All changes will be lost."
        confirmText="Close Editor"
        cancelText="Keep Editing"
        variant="warning"
      />

      <ConfirmationDialog
        isOpen={showResetConfirmation}
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={confirmReset}
        title="Reset Changes"
        message="Are you sure you want to reset all changes? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
        isLoading={isLoading}
      />

      {/* Error Notification */}
      <ErrorNotification
        error={currentError}
        onDismiss={() => setPhotoEditorError(null)}
        onRetry={() => {
          if (currentError?.retryAction) {
            currentError.retryAction();
          }
        }}
        autoHide={!currentError?.recoverable}
      />
    </>
  );
};
