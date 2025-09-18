# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
NanoBananaEditor is a React + TypeScript application that provides AI-powered image generation and editing capabilities. It's built with Vite and uses the Gemini 2.5 Flash image API for AI operations. The app supports text-to-image generation, image editing with masks, reference images, and version history tracking.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Setup
Copy `.env.example` to `.env` and add your Gemini API key:
```bash
cp .env.example .env
# Edit .env to add: VITE_GEMINI_API_KEY=your_api_key_here
```

**Important**: The app requires a valid Gemini API key to function properly. Without it, image generation will fail.

## Architecture

### State Management
The app uses **Zustand** for global state management via `src/store/useAppStore.ts`. This store manages:
- Current project and canvas state (zoom, pan, loaded image)
- Upload state and brush strokes for masking
- Generation parameters (prompt, temperature, seed)
- UI panel visibility and tool selection
- History tracking (generations and edits)

### Core Data Flow
1. **Generation**: Text prompts + optional reference images → Gemini API → New `Generation` with output assets
2. **Editing**: Existing image + text instruction + optional mask → Gemini API → New `Edit` linked to parent generation
3. **Masking**: Canvas brush strokes → converted to binary masks → used in edit requests

### Key Architecture Patterns
- **React Query** for API state management and caching
- **Konva** for the image canvas with zoom/pan and mask drawing
- **Fabric.js** for some advanced image manipulation
- **IndexedDB** (via idb-keyval) for local storage/caching
- **Component composition** with a clean separation between UI components and business logic

### File Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ImageCanvas.tsx  # Main canvas with Konva
│   ├── PromptComposer.tsx # Prompt input and controls
│   └── HistoryPanel.tsx # Generation/edit history
├── hooks/              # Custom React hooks
│   ├── useImageGeneration.ts # Core API integration
│   └── useKeyboardShortcuts.ts
├── services/           # External API integrations
│   ├── geminiService.ts # Gemini API wrapper
│   └── cacheService.ts  # Local caching
├── store/              # Global state
│   └── useAppStore.ts   # Zustand store
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### API Integration
- **Gemini Service** (`src/services/geminiService.ts`) handles all AI API calls
- **Image Generation**: Uses `gemini-2.5-flash-image-preview` model
- **Image Editing**: Supports masked editing with reference images
- **Base64 encoding** for all image data transfer
- **Error handling** with user-friendly error messages

### Canvas System
The `ImageCanvas` component uses **React-Konva** for:
- Image display with zoom/pan controls
- Brush stroke drawing for mask creation
- Coordinate conversion between screen space and image space
- Mobile-responsive touch interactions

### Photo Editor System
The `PhotoEditorModal` component uses the **@ente-io/photo-editor-sdk** for:
- Non-destructive image editing
- Color adjustments, transformations, and filters
- A self-contained editing UI

### Project/History System
- **Projects** contain multiple **Generations** (initial AI creations)
- **Edits** are linked to parent generations and can have masks
- **Assets** represent individual images with metadata
- **Version tracking** allows users to navigate between different iterations

## Testing & Debugging

### Running Single Tests
The project doesn't currently have a test suite configured. To add testing:
```bash
# Add testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
# Configure vitest in vite.config.ts
# Create test files with .test.tsx extension
```

### Development Tips
- Use browser dev tools to inspect Zustand state: look for "nano-banana-store" in Redux DevTools
- Canvas coordinates: The app converts between Konva stage coordinates and image pixel coordinates
- API failures: Check browser console for Gemini API errors and network tab for request details
- Mobile testing: The app has responsive behavior - test on mobile viewports

### Common Issues
- **API Key Missing**: Ensure `VITE_GEMINI_API_KEY` is set in `.env`
- **Canvas Drawing**: Mask brush strokes are stored in image coordinates, not screen coordinates
- **Image Loading**: Large images may take time to process - loading states are handled by React Query
- **Memory**: Multiple large images can consume significant memory - the app uses caching to manage this

## Key Dependencies
- **@google/genai**: Gemini API client
- **zustand**: State management
- **@tanstack/react-query**: Server state management
- **react-konva/konva**: Canvas and drawing functionality
- **@ente-io/photo-editor-sdk**: Photo editor
- **fabric**: Advanced image manipulation
- **@radix-ui/***: UI components (Dialog, Select, Slider, Switch)
- **lucide-react**: Icon library
- **tailwindcss**: Styling

## Mobile Considerations
- Canvas interactions are optimized for touch
- Panels auto-hide on mobile to maximize canvas space
- Responsive zoom and pan controls
- Mobile-specific zoom limits and padding adjustments
