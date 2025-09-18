# Troubleshooting Guide

## Common Issues and Solutions

### API and Authentication Issues

#### API Key Problems
**Problem**: "Invalid API key" or generation failures
**Solutions**:
1. Check `.env` file exists and contains `VITE_GEMINI_API_KEY=your_key`
2. Verify API key is valid and has Gemini access
3. Restart development server after changing `.env`
4. Ensure no extra spaces or quotes around the API key

**Problem**: "Rate limit exceeded" errors
**Solutions**:
1. Wait before making additional requests
2. Reduce the number of simultaneous generations
3. Check your Gemini API quota and billing status
4. Implement request queuing in development

#### Network and Connectivity
**Problem**: Generation requests timeout or fail
**Solutions**:
1. Check internet connection stability
2. Verify Gemini API service status
3. Try generating smaller/simpler images first
4. Check browser console for detailed error messages

### Canvas and Drawing Issues

#### Canvas Not Loading
**Problem**: Blank canvas or images not displaying
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify image URLs are valid base64 data
3. Clear browser cache and reload
4. Try a different browser (Chrome/Firefox recommended)

**Problem**: Canvas performance is slow
**Solutions**:
1. Reduce canvas zoom level
2. Close other browser tabs to free memory
3. Use smaller images (under 2MB recommended)
4. Restart browser if memory usage is high

#### Drawing and Masking Problems
**Problem**: Brush strokes not appearing or inaccurate
**Solutions**:
1. Ensure canvas is properly loaded before drawing
2. Check zoom level - very high zoom can cause issues
3. Try refreshing the page and reloading the image
4. Verify touch/mouse events are being captured

**Problem**: Mask coordinates seem offset
**Solutions**:
1. Check coordinate conversion between stage and image space
2. Verify image scaling and positioning
3. Reset canvas view (fit to screen) and try again
4. Clear existing brush strokes and redraw

### Image Generation Issues

#### Generation Quality Problems
**Problem**: Generated images are low quality or distorted
**Solutions**:
1. Improve prompt specificity and detail
2. Adjust temperature parameter (lower = more consistent)
3. Try different seed values
4. Use reference images for better guidance

**Problem**: Generated images don't match prompt
**Solutions**:
1. Make prompts more specific and descriptive
2. Use negative prompts to exclude unwanted elements
3. Experiment with different prompt structures
4. Add style keywords (e.g., "photorealistic", "artistic")

#### Edit and Mask Issues
**Problem**: Edits affect wrong areas of image
**Solutions**:
1. Create more precise masks around target areas
2. Use feathering to blend edit boundaries
3. Make edit instructions more specific
4. Try multiple smaller edits instead of one large edit

**Problem**: Edits look unnatural or jarring
**Solutions**:
1. Increase mask feathering for smoother transitions
2. Use gentler edit instructions
3. Lower the edit strength parameter
4. Ensure mask covers appropriate transition areas

### Performance and Memory Issues

#### Browser Performance
**Problem**: Application becomes slow or unresponsive
**Solutions**:
1. Close unused browser tabs
2. Clear browser cache and storage
3. Restart browser to free memory
4. Use browser task manager to identify memory usage

**Problem**: Large images cause crashes
**Solutions**:
1. Compress images before uploading
2. Use images under 5MB when possible
3. Generate at lower resolutions initially
4. Clear generation history to free memory

#### Storage and Caching
**Problem**: "Storage quota exceeded" errors
**Solutions**:
1. Clear old cached generations from history panel
2. Use browser settings to clear IndexedDB storage
3. Reduce the number of stored generations
4. Export important images before clearing cache

### Mobile and Touch Issues

#### Touch Interactions
**Problem**: Touch drawing doesn't work properly
**Solutions**:
1. Ensure touch events aren't being intercepted by browser
2. Disable browser zoom/pan gestures on canvas
3. Use single finger for drawing, two fingers for pan/zoom
4. Try landscape orientation for better drawing area

**Problem**: Interface elements too small on mobile
**Solutions**:
1. Use browser zoom to increase interface size
2. Switch to landscape mode for more space
3. Collapse panels to maximize canvas area
4. Use accessibility settings to increase touch target size

### Development Issues

#### Build and Development Problems
**Problem**: `npm run dev` fails to start
**Solutions**:
1. Delete `node_modules` and run `npm install`
2. Check Node.js version (16+ required)
3. Clear npm cache: `npm cache clean --force`
4. Check for port conflicts (default: 5173)

**Problem**: Hot reload not working
**Solutions**:
1. Check file watcher limits on Linux/macOS
2. Restart development server
3. Clear browser cache
4. Check for TypeScript compilation errors

#### TypeScript Errors
**Problem**: Type errors preventing compilation
**Solutions**:
1. Run `npm run lint` to see all errors
2. Check for missing type definitions
3. Verify import paths are correct
4. Update TypeScript and related packages

### Photo Editor Issues

#### Editor Not Loading
**Problem**: The photo editor modal doesn't open or appears empty.
**Solutions**:
1. Check the browser console for any errors related to the photo editor SDK.
2. Ensure that the image you are trying to edit is a valid and supported format.
3. Try clearing your browser's cache and reloading the application.

#### Adjustments Not Applying
**Problem**: Color adjustments or transformations are not being applied to the image.
**Solutions**:
1. Verify that you are in "Edit" mode and have an image loaded in the editor.
2. Check the browser console for any errors when you try to apply an adjustment.
3. Ensure that the photo editor SDK is properly initialized.

### Browser Compatibility

#### Supported Browsers
- **Chrome 90+**: Full feature support
- **Firefox 88+**: Full feature support  
- **Safari 14+**: Most features (some canvas limitations)
- **Edge 90+**: Full feature support

#### Browser-Specific Issues
**Safari**:
- Canvas performance may be slower
- Some touch gestures might conflict
- IndexedDB storage limits are stricter

**Firefox**:
- Canvas rendering may differ slightly
- Memory usage can be higher with large images
- Some Konva features may behave differently

### Debugging Tools

#### Browser Developer Tools
1. **Console**: Check for JavaScript errors and API responses
2. **Network**: Monitor API requests and response times
3. **Application**: Inspect IndexedDB storage and cached data
4. **Performance**: Profile canvas rendering and memory usage

#### Application Debugging
```javascript
// Access Zustand store state
const store = useAppStore.getState();
console.log('Current state:', store);

// Check canvas stage
const stage = stageRef.current;
console.log('Stage info:', {
  scale: stage.scaleX(),
  position: stage.position(),
  size: stage.size()
});

// Monitor API calls
console.log('Generation request:', request);
```

### Getting Help

#### Before Reporting Issues
1. Check browser console for error messages
2. Try reproducing the issue in incognito/private mode
3. Test with a different browser
4. Clear cache and try again
5. Check if the issue occurs with different images/prompts

#### Information to Include
- Browser version and operating system
- Steps to reproduce the issue
- Error messages from console
- Screenshots or screen recordings
- Sample images or prompts that cause issues

#### Community Resources
- GitHub Issues: Report bugs and feature requests
- Discussions: Ask questions and share tips
- Documentation: Check for updated guides and examples

### Prevention Tips

#### Best Practices
1. **Regular Cleanup**: Clear old generations periodically
2. **Image Optimization**: Compress large images before upload
3. **Prompt Testing**: Start with simple prompts and iterate
4. **Browser Maintenance**: Keep browser updated and clear cache regularly
5. **API Management**: Monitor API usage and respect rate limits

#### Performance Optimization
1. Use appropriate image sizes for your needs
2. Close unused browser tabs while using the app
3. Generate images in batches rather than all at once
4. Save important work frequently
5. Use reference images efficiently (compress when possible)
