# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Valid Gemini API key
- Modern web browser with Canvas support

### Initial Setup
```bash
# Clone and install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env to add your VITE_GEMINI_API_KEY

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint code analysis
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI primitives
│   ├── Header.tsx      # App navigation
│   ├── ImageCanvas.tsx # Main canvas with Konva
│   ├── PromptComposer.tsx # Prompt input interface
│   ├── HistoryPanel.tsx # Generation history
│   ├── ImagePreviewModal.tsx # Image preview dialog
│   ├── InfoModal.tsx   # Help and info dialog
│   ├── MaskOverlay.tsx # Canvas mask visualization
│   └── PromptHints.tsx # Prompt suggestions
├── hooks/              # Custom React hooks
│   ├── useImageGeneration.ts # Core API integration
│   └── useKeyboardShortcuts.ts # Keyboard controls
├── services/           # External integrations
│   ├── geminiService.ts # Gemini API wrapper
│   ├── cacheService.ts # Local storage management
│   └── imageProcessing.ts # Image manipulation
├── store/              # Global state management
│   └── useAppStore.ts  # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts        # Core type definitions
├── utils/              # Utility functions
│   ├── cn.ts          # Class name utilities
│   └── imageUtils.ts  # Image processing helpers
├── index.css          # Global styles
├── main.tsx           # App entry point
└── vite-env.d.ts      # Vite type definitions
```

## State Management

### Zustand Store (`src/store/useAppStore.ts`)
The app uses a single Zustand store for global state:

```typescript
interface AppState {
  // Canvas state
  canvasZoom: number;
  canvasPan: { x: number; y: number };
  loadedImage: string | null;
  
  // Generation parameters
  prompt: string;
  temperature: number;
  seed: number;
  
  // UI state
  showHistoryPanel: boolean;
  selectedTool: 'brush' | 'eraser';
  
  // Upload and masking
  uploadState: UploadState;
  brushStrokes: BrushStroke[];
  
  // History
  generations: Generation[];
  currentProject: Project | null;
}
```

### State Updates
- Use store actions for state mutations
- Avoid direct state modification
- Implement optimistic updates for better UX
- Handle async operations with proper loading states

## Component Development

### UI Components (`src/components/ui/`)
Built on Radix UI primitives with consistent styling:

```typescript
// Example: Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}
```

### Canvas Components
The ImageCanvas uses React-Konva for interactive features:
- Image display with zoom/pan
- Brush stroke drawing for masks
- Touch-friendly mobile interactions
- Coordinate conversion utilities

### Best Practices
- Use TypeScript for all components
- Implement proper error boundaries
- Add loading states for async operations
- Follow accessibility guidelines
- Use semantic HTML elements

## API Integration

### Custom Hooks
The `useImageGeneration` hook manages API interactions:

```typescript
const {
  generateImage,
  editImage,
  isGenerating,
  error
} = useImageGeneration();
```

### Error Handling
- Implement graceful error recovery
- Show user-friendly error messages
- Log detailed errors for debugging
- Handle network failures appropriately

## Canvas Development

### Konva Integration
The canvas system uses React-Konva for performance:

```typescript
// Coordinate conversion
const imageCoords = stageToImageCoords(stageX, stageY, image, stage);
const stageCoords = imageToStageCoords(imageX, imageY, image, stage);
```

### Brush System
- Brush strokes stored in image coordinates
- Real-time drawing with smooth curves
- Undo/redo functionality
- Mobile touch optimization

### Performance Tips
- Use Konva's caching for static elements
- Optimize re-renders with React.memo
- Batch canvas updates when possible
- Handle large images efficiently

## Testing Strategy

### Current State
The project doesn't have tests configured yet. To add testing:

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom

# Add to vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
});
```

### Recommended Test Structure
```
src/
├── __tests__/          # Test files
│   ├── components/     # Component tests
│   ├── hooks/         # Hook tests
│   ├── services/      # Service tests
│   └── utils/         # Utility tests
└── test/
    └── setup.ts       # Test configuration
```

## Debugging

### Development Tools
- React DevTools for component inspection
- Zustand DevTools for state debugging
- Browser DevTools for canvas debugging
- Network tab for API request monitoring

### Common Issues
1. **Canvas Coordinates**: Check coordinate conversion between stage and image space
2. **API Failures**: Verify API key and network connectivity
3. **Memory Leaks**: Monitor image loading and cleanup
4. **Mobile Touch**: Test touch interactions on actual devices

### Debug Utilities
```typescript
// Store debugging
const store = useAppStore.getState();
console.log('Current state:', store);

// Canvas debugging
const stage = stageRef.current;
console.log('Stage position:', stage.position());
```

## Performance Optimization

### Image Handling
- Lazy load large images
- Implement image compression
- Use appropriate image formats
- Cache processed images locally

### Canvas Performance
- Use Konva's built-in optimizations
- Minimize re-renders with proper dependencies
- Implement virtualization for large datasets
- Optimize brush stroke rendering

### Bundle Optimization
- Code splitting for large dependencies
- Tree shaking for unused code
- Optimize asset loading
- Use Vite's built-in optimizations

## Mobile Development

### Responsive Design
- Canvas adapts to screen size
- Touch-friendly interface elements
- Proper viewport configuration
- Mobile-specific zoom limits

### Touch Interactions
- Pan and zoom gestures
- Brush drawing with touch
- Prevent default browser behaviors
- Handle touch events properly

## Deployment

### Build Process
```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

### Environment Variables
- Set `VITE_GEMINI_API_KEY` in production
- Consider using backend proxy for API calls
- Configure proper CORS settings
- Set up error monitoring

### Production Considerations
- API key security (use backend proxy)
- Image size limits and compression
- Caching strategies for assets
- Error tracking and monitoring