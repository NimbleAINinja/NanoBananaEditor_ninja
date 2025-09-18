import React, { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { blobToBase64 } from '../utils/imageUtils';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Upload, Link } from 'lucide-react';

export const ImageUploader: React.FC = () => {
  const {
    selectedTool,
    uploadedImages,
    addUploadedImage,
    removeUploadedImage,
    editReferenceImages,
    addEditReferenceImage,
    removeEditReferenceImage,
    canvasImage,
    setCanvasImage,
    clearUploadedImages,
  } = useAppStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageProcessing = (dataUrl: string) => {
    if (selectedTool === 'generate') {
      if (uploadedImages.length < 2) {
        addUploadedImage(dataUrl);
      }
    } else if (selectedTool === 'edit') {
      if (editReferenceImages.length < 2) {
        addEditReferenceImage(dataUrl);
      }
      if (!canvasImage) {
        setCanvasImage(dataUrl);
      }
    } else if (selectedTool === 'mask') {
      clearUploadedImages();
      addUploadedImage(dataUrl);
      setCanvasImage(dataUrl);
    }
  };

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      try {
        setError(null);
        const base64 = await blobToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;
        handleImageProcessing(dataUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
        setError('Failed to process file.');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUrlImport = async () => {
    if (!imageUrl.trim()) {
      setError('Please enter a valid image URL.');
      return;
    }

    try {
      setError(null);
      
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        setError('The URL does not point to a valid image file.');
        return;
      }
      
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      const dataUrl = `data:${blob.type};base64,${base64}`;
      
      handleImageProcessing(dataUrl);
      setImageUrl('');
    } catch (error) {
      console.error('Failed to import image from URL:', error);
      setError('Could not fetch image. The URL may be incorrect or blocked by CORS policy.');
    }
  };

  const imagesToShow = selectedTool === 'generate' ? uploadedImages : editReferenceImages;
  const removeAction = selectedTool === 'generate' ? removeUploadedImage : removeEditReferenceImage;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
        isDragOver ? 'border-blue-500 bg-gray-800/50' : 'border-gray-700'
      }`}
    >
      <label className="text-sm font-medium text-gray-300 mb-1 block">
        {selectedTool === 'generate' ? 'Reference Images' : selectedTool === 'edit' ? 'Style References' : 'Upload Image'}
      </label>
      {selectedTool === 'mask' && <p className="text-xs text-gray-400 mb-3">Edit an image with masks</p>}
      {selectedTool === 'generate' && <p className="text-xs text-gray-500 mb-3">Optional, up to 2 images</p>}
      {selectedTool === 'edit' && (
        <p className="text-xs text-gray-500 mb-3">
          {canvasImage ? 'Optional style references, up to 2 images' : 'Upload image to edit, up to 2 images'}
        </p>
      )}

      {/* URL Import */}
      <div className="flex space-x-2 mb-2">
        <Input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Paste image URL"
          className="flex-grow"
        />
        <Button variant="outline" onClick={handleUrlImport} disabled={!imageUrl.trim()}>
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* File Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
        disabled={
          (selectedTool === 'generate' && uploadedImages.length >= 2) ||
          (selectedTool === 'edit' && editReferenceImages.length >= 2)
        }
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload or Drop Image
      </Button>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      {imagesToShow.length > 0 && (
        <div className="mt-3 space-y-2">
          {imagesToShow.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Reference ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-gray-700"
              />
              <button
                onClick={() => removeAction(index)}
                className="absolute top-1 right-1 bg-gray-900/80 text-gray-400 hover:text-gray-200 rounded-full p-1 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-1 left-1 bg-gray-900/80 text-xs px-2 py-1 rounded text-gray-300">
                Ref {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
