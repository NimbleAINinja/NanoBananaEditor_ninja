import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useImageGeneration } from './useImageGeneration';

export const useKeyboardShortcuts = () => {
  const {
    setSelectedTool,
    setShowHistory,
    showHistory,
    setShowPromptPanel,
    showPromptPanel,
    currentPrompt,
    isGenerating,
    seed,
    temperature,
    uploadedImages,
  } = useAppStore();
  const { generate } = useImageGeneration();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        // Only handle Cmd/Ctrl + Enter for generation
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          event.preventDefault();
          if (!isGenerating && currentPrompt.trim()) {
            generate({
              prompt: currentPrompt,
              seed: seed ?? undefined,
              temperature,
              referenceImages: uploadedImages.map(img => img.split('base64,')[1]),
            });
          }
        }
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'e':
          event.preventDefault();
          setSelectedTool('edit');
          break;
        case 'g':
          event.preventDefault();
          setSelectedTool('generate');
          break;
        case 'm':
          event.preventDefault();
          setSelectedTool('mask');
          break;
        case 'h':
          event.preventDefault();
          setShowHistory(!showHistory);
          break;
        case 'p':
          event.preventDefault();
          setShowPromptPanel(!showPromptPanel);
          break;
        case 'r':
          if (event.shiftKey) {
            event.preventDefault();
            console.log('Re-roll variants');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setSelectedTool, 
    setShowHistory, 
    showHistory, 
    setShowPromptPanel, 
    showPromptPanel, 
    currentPrompt, 
    isGenerating, 
    generate, 
    seed, 
    temperature, 
    uploadedImages
  ]);
};
