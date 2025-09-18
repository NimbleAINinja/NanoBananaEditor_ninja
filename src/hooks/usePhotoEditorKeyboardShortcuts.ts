import { useEffect, useMemo } from 'react';
import { type PhotoEditorTab } from '../components/PhotoEditorToolbar';

interface UsePhotoEditorKeyboardShortcutsProps {
  activeTab: PhotoEditorTab;
  onTabChange: (tab: PhotoEditorTab) => void;
  onSave: () => void;
  onReset: () => void;
  hasChanges: boolean;
  disabled: boolean;
  onShowHelp: () => void;
}

interface Shortcut {
  key: string;
  description: string;
}

export const usePhotoEditorKeyboardShortcuts = ({
  activeTab,
  onTabChange,
  onSave,
  onReset,
  hasChanges,
  disabled,
  onShowHelp,
}: UsePhotoEditorKeyboardShortcutsProps) => {
  const shortcuts: Shortcut[] = useMemo(() => [
    { key: 'Cmd/Ctrl + S', description: 'Save changes' },
    { key: 'Cmd/Ctrl + R', description: 'Reset all changes' },
    { key: 'Tab', description: 'Switch to next tab' },
    { key: 'Shift + Tab', description: 'Switch to previous tab' },
    { key: '?', description: 'Show this help dialog' },
  ], []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      // Handle special keys with modifiers
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            onSave();
            break;
          case 'r':
            event.preventDefault();
            if (hasChanges) {
              onReset();
            }
            break;
        }
        return;
      }

      // Handle other keys
      switch (event.key) {
        case '?':
          event.preventDefault();
          onShowHelp();
          break;
        case 'Tab':
          event.preventDefault();
          const tabs: PhotoEditorTab[] = ['color', 'transform', 'filters', 'export'];
          const currentIndex = tabs.indexOf(activeTab);
          const nextIndex = event.shiftKey
            ? (currentIndex - 1 + tabs.length) % tabs.length
            : (currentIndex + 1) % tabs.length;
          onTabChange(tabs[nextIndex]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    activeTab,
    onTabChange,
    onSave,
    onReset,
    hasChanges,
    disabled,
    onShowHelp,
  ]);

  return { shortcuts };
};
