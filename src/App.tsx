import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cn } from './utils/cn';
import { PromptComposer } from './components/PromptComposer';
import { ImageCanvas } from './components/ImageCanvas';
import { HistoryPanel } from './components/HistoryPanel';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './store/useAppStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function AppContent() {
  useKeyboardShortcuts();
  
  const {
    showPromptPanel,
    setShowPromptPanel,
    showHistory,
    setShowHistory,
    selectedTool,
    canvasImage,
    openPhotoEditor,
  } = useAppStore();
  
  // Set mobile defaults on mount
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowPromptPanel(false);
        setShowHistory(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setShowPromptPanel, setShowHistory]);

  useEffect(() => {
    if (selectedTool === 'edit' && canvasImage) {
      openPhotoEditor(canvasImage);
    }
  }, [selectedTool, canvasImage, openPhotoEditor]);

  return (
    <div className="h-screen bg-gray-900 text-gray-100 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        <div className={cn("flex-shrink-0 transition-all duration-300", !showPromptPanel && "w-8")}>
          <PromptComposer />
        </div>
        <div className="flex-1 min-w-0">
          <ImageCanvas />
        </div>
        <div className="flex-shrink-0">
          <HistoryPanel />
        </div>
      </div>
      <PhotoEditorModal />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
