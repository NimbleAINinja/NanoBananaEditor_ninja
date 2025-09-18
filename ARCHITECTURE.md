# NanoBananaEditor Architecture

## Overview
NanoBananaEditor is a React + TypeScript web application that provides AI-powered image generation and editing capabilities using Google's Gemini 2.5 Flash API. The application follows a modern React architecture with clean separation of concerns.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand for global state
- **Canvas**: React-Konva for interactive image editing
- **API Client**: Google Gemini AI (@google/genai)
- **Styling**: Tailwind CSS + Radix UI components
- **Photo Editor**: @ente-io/photo-editor-sdk
- **Storage**: IndexedDB for local caching
- **Build Tool**: Vite with React plugin

## Core Architecture Patterns

### State Management
The application uses Zustand (`src/store/useAppStore.ts`) for centralized state management:
- Canvas state (zoom, pan, loaded images)
- Generation parameters (prompts, temperature, seed)
- UI panel visibility and tool selection
- Upload state and brush strokes for masking
- History tracking for generations and edits

### Data Flow
1. **Image Generation**: Text prompts + optional reference images → Gemini API → New Generation with assets
2. **Image Editing**: Existing image + text instruction + optional mask → Gemini API → New Edit linked to parent
3. **Mask Creation**: Canvas brush strokes → binary masks → used in edit requests
4. **Photo Editing**: Image → Photo Editor → Edits applied → Save

### Service Layer
- **GeminiService** (`src/services/geminiService.ts`): Handles all AI API interactions
- **CacheService** (`src/services/cacheService.ts`): Manages local storage and offline access
- **ImageProcessor** (`src/services/imageProcessing.ts`): Handles image manipulation and mask processing

## Component Architecture

### Core Components
- **App.tsx**: Main application shell and routing
- **ImageCanvas.tsx**: Interactive canvas using React-Konva for image display and mask drawing
- **PromptComposer.tsx**: Input interface for prompts and generation parameters
- **HistoryPanel.tsx**: Version history and project management
- **PhotoEditorModal.tsx**: Modal for the photo editor
- **Header.tsx**: Navigation and app controls

### UI Components (`src/components/ui/`)
- Reusable components built on Radix UI primitives
- Consistent styling with Tailwind CSS
- Button, Input, Textarea components with proper accessibility

### Custom Hooks (`src/hooks/`)
- **useImageGeneration.ts**: Core API integration and generation logic
- **useKeyboardShortcuts.ts**: Keyboard navigation and shortcuts

## Data Models

### Core Types (`src/types/index.ts`)
- **Project**: Container for related generations and edits
- **Generation**: Initial AI-created images from text prompts
- **Edit**: Modified versions of existing images with masks/instructions
- **Asset**: Individual image files with metadata
- **SegmentationMask**: Binary masks for selective editing

### Relationships
```
Project
├── Generation[] (initial creations)
│   ├── Asset[] (output images)
│   └── Edit[] (modifications)
│       ├── Asset[] (edited images)
│       └── SegmentationMask? (optional mask)
```

## Canvas System

### Interactive Features
- Zoom and pan controls with mouse/touch support
- Brush tool for creating selection masks
- Coordinate conversion between screen space and image space
- Mobile-responsive touch interactions

### Technical Implementation
- React-Konva for performant canvas rendering
- Stage-based coordinate system
- Real-time brush stroke tracking
- Mask overlay visualization

## API Integration

### Gemini Service
- Uses `gemini-2.5-flash-image-preview` model
- Supports text-to-image generation
- Handles masked image editing
- Base64 encoding for image data transfer
- Comprehensive error handling

### Request Types
- **GenerationRequest**: Text prompts with optional reference images
- **EditRequest**: Image modifications with masks and instructions
- **SegmentationRequest**: Interactive image segmentation

## Caching Strategy

### Local Storage
- Projects and generations cached in IndexedDB
- Asset data stored as Blobs for offline access
- Automatic cleanup of old cache entries
- Metadata caching for quick access

### Performance Optimization
- Lazy loading of large images
- Efficient mask processing
- Memory management for multiple images
- Optimized re-renders with Zustand

## Security Considerations

### API Key Management
- Environment variables for sensitive data
- Client-side API calls (development only)
- Production recommendation: backend proxy

### Data Handling
- Local-only image processing
- No server-side storage of user images
- Secure base64 encoding for API transmission
