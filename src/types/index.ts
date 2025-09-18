export interface PhotoEditorError {
  type: 'sdk-load' | 'image-load' | 'save-failure' | 'unknown';
  message: string;
  recoverable: boolean;
  retryAction?: () => void;
  details?: string;
}

export interface PhotoEditSession {
  originalImageUrl: string;
  finalImageUrl: string;
  operations: any[];
  duration: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  generations: Generation[];
  edits: Edit[];
}

export interface Asset {
  id: string;
  url: string;
  createdAt: string;
}

export interface Generation {
  id: string;
  prompt: string;
  modelVersion: string;
  parameters: {
    seed?: number;
  };
  sourceAssets: Asset[];
  outputAssets: Asset[];
  createdAt: number;
}

export interface Edit {
  id: string;
  parentGenerationId: string;
  instruction: string;
  outputAssets: Asset[];
  timestamp: number;
  maskAssetId?: string;
  maskReferenceAsset?: Asset;
}

export interface SegmentationMask {
  id: string;
  imageUrl: string;
  createdAt: number;
}

export interface BrushStroke {
  id: string;
  points: number[];
  brushSize: number;
}

export interface EditingHistory {
  operation: string;
  timestamp: number;
}

export interface PhotoEditAsset extends Asset {
  type: 'photo-edit';
  photoEditMetadata: PhotoEditSession;
}
