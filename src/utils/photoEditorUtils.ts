import { EditingHistory, PhotoEditAsset, PhotoEditSession } from '../types';

export const getOutputMimeType = (
  originalUrl: string,
  preferredMime?: string
): string => {
  if (preferredMime) {
    return preferredMime;
  }
  const extension = originalUrl.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};

export const captureEditedImage = async (
  element: HTMLElement,
  mimeType: string = 'image/jpeg',
  quality: number = 0.92
): Promise<string> => {
  const canvas = await getCanvasFromElement(element);
  return canvas.toDataURL(mimeType, quality);
};

export const captureEditedImageWithOptions = async (
  element: HTMLElement,
  mimeType: string,
  quality: number,
  maxDimensions?: { width: number; height: number }
): Promise<{ dataUrl: string; blob: Blob; finalDimensions: { width: number; height: number } }> => {
  let canvas = await getCanvasFromElement(element);

  if (maxDimensions && (canvas.width > maxDimensions.width || canvas.height > maxDimensions.height)) {
    const scale = Math.min(maxDimensions.width / canvas.width, maxDimensions.height / canvas.height);
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = canvas.width * scale;
    resizedCanvas.height = canvas.height * scale;
    const ctx = resizedCanvas.getContext('2d');
    ctx?.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
    canvas = resizedCanvas;
  }

  const dataUrl = canvas.toDataURL(mimeType, quality / 100);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => {
      if (b) resolve(b);
      else reject(new Error('Failed to create blob from canvas'));
    }, mimeType, quality / 100);
  });

  return {
    dataUrl,
    blob,
    finalDimensions: { width: canvas.width, height: canvas.height },
  };
};

export const createPhotoEditAsset = async (
  originalAssetId: string,
  blob: Blob,
  editingHistory: EditingHistory[],
  outputMime: string
): Promise<PhotoEditAsset> => {
  const newAssetId = `edited-${originalAssetId}-${Date.now()}`;
  const url = URL.createObjectURL(blob);

  const photoEditMetadata: PhotoEditSession = {
    originalImageUrl: '', // This should be populated with the original URL
    finalImageUrl: url,
    operations: editingHistory,
    duration: 0, // This should be calculated
  };

  return {
    id: newAssetId,
    url,
    type: 'photo-edit',
    createdAt: new Date().toISOString(),
    photoEditMetadata,
  };
};

const getCanvasFromElement = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
  const canvas = element.querySelector('canvas');
  if (canvas) {
    return canvas;
  }
  // Fallback if no canvas is found (this is a simplified placeholder)
  const newCanvas = document.createElement('canvas');
  newCanvas.width = element.offsetWidth;
  newCanvas.height = element.offsetHeight;
  return newCanvas;
};
