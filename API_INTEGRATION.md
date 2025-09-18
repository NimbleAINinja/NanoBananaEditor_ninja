# API Integration Guide

## Gemini AI Integration

NanoBananaEditor integrates with Google's Gemini 2.5 Flash API for AI-powered image generation and editing capabilities.

## Setup

### Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Add your Gemini API key
VITE_GEMINI_API_KEY=your_api_key_here
```

### API Key Requirements
- Valid Google Gemini API key required
- Key must have access to `gemini-2.5-flash-image-preview` model
- Without valid key, all image generation will fail

## Service Architecture

### GeminiService Class (`src/services/geminiService.ts`)

The main service class handles three core operations:

#### 1. Image Generation
```typescript
async generateImage(request: GenerationRequest): Promise<string[]>
```
- Converts text prompts to images
- Supports optional reference images
- Returns array of base64-encoded image URLs
- Uses generation parameters (temperature, seed, etc.)

#### 2. Image Editing
```typescript
async editImage(request: EditRequest): Promise<string[]>
```
- Modifies existing images based on text instructions
- Supports selective editing with masks
- Can use reference images for style guidance
- Returns edited image variations

#### 3. Image Segmentation
```typescript
async segmentImage(request: SegmentationRequest): Promise<any>
```
- Interactive image segmentation
- Creates masks from click points
- Used for precise editing selections

## Request Types

### GenerationRequest
```typescript
interface GenerationRequest {
  prompt: string;
  referenceImages?: string[]; // base64 encoded
  temperature?: number;
  seed?: number;
  aspectRatio?: string;
  outputCount?: number;
}
```

### EditRequest
```typescript
interface EditRequest {
  image: string; // base64 encoded source image
  instruction: string; // text description of desired changes
  mask?: SegmentationMask; // optional selection mask
  referenceImages?: string[]; // style reference images
  strength?: number; // edit intensity (0-1)
}
```

### SegmentationRequest
```typescript
interface SegmentationRequest {
  image: string; // base64 encoded
  clickPoint: { x: number; y: number }; // pixel coordinates
  includeBackground?: boolean;
}
```

## Data Flow

### Generation Workflow
1. User enters text prompt in PromptComposer
2. Optional reference images uploaded
3. GenerationRequest sent to GeminiService
4. API returns base64 image data
5. Images cached locally via CacheService
6. New Generation object created and stored

### Editing Workflow
1. User selects existing image from history
2. Draws mask on canvas (optional)
3. Enters edit instruction
4. EditRequest built with image + mask + instruction
5. API processes edit request
6. New Edit object linked to parent Generation

### Error Handling
- Network failures gracefully handled
- Invalid API keys show user-friendly messages
- Rate limiting respected with retry logic
- Malformed responses logged and reported

## Image Processing

### Format Requirements
- All images converted to base64 for API transmission
- Supported formats: JPEG, PNG, WebP
- Maximum resolution limits enforced
- Automatic compression for large images

### Mask Processing
- Canvas brush strokes converted to binary masks
- Feathering applied for smooth edges
- Masks encoded as ImageData for API
- Coordinate conversion between canvas and image space

## Performance Optimization

### Caching Strategy
- Generated images cached in IndexedDB
- Metadata stored separately for quick access
- Automatic cleanup of old cache entries
- Offline access to previously generated content

### Request Optimization
- Batch multiple requests when possible
- Compress large images before transmission
- Use appropriate quality settings
- Implement request queuing for rate limiting

## Security Notes

### Development vs Production
- Current implementation uses client-side API calls
- Suitable for development and demonstration
- Production deployments should use backend proxy
- API keys should never be exposed in client code

### Recommended Production Setup
```typescript
// Instead of direct API calls, use backend endpoint
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(request)
});
```

## Troubleshooting

### Common Issues
1. **API Key Invalid**: Check environment variable setup
2. **Rate Limiting**: Implement exponential backoff
3. **Large Images**: Compress before sending to API
4. **Network Errors**: Add retry logic with timeout
5. **Memory Issues**: Clear cache regularly

### Debug Tips
- Check browser console for API errors
- Monitor network tab for request/response details
- Verify base64 encoding is valid
- Test with smaller images first

## Model Capabilities

### Gemini 2.5 Flash Features
- High-quality image generation from text
- Style transfer and artistic effects
- Selective editing with masks
- Multiple output variations
- Fast processing times
- Support for various aspect ratios

### Limitations
- API rate limits apply
- Maximum image resolution constraints
- Processing time varies with complexity
- Requires stable internet connection