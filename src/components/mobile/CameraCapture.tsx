import React from 'react';
import { Camera, ImageIcon, Trash2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CameraCaptureProps {
  onImageCaptured?: (imageUrl: string) => void;
  onImageSelected?: (base64: string) => void;
  maxImages?: number;
}

export function CameraCapture({ 
  onImageCaptured, 
  onImageSelected, 
  maxImages = 5 
}: CameraCaptureProps) {
  const {
    isNativeApp,
    isLoading,
    capturedImages,
    takePicture,
    selectFromGallery,
    clearCapturedImages,
    removeImage,
    imageToBase64
  } = useCamera();

  const handleTakePicture = async () => {
    if (capturedImages.length >= maxImages) {
      return;
    }

    const photo = await takePicture();
    if (photo && photo.webPath) {
      onImageCaptured?.(photo.webPath);
      
      // Convertir en base64 si nécessaire
      if (onImageSelected) {
        const base64 = await imageToBase64(photo.webPath);
        if (base64) {
          onImageSelected(base64);
        }
      }
    }
  };

  const handleSelectFromGallery = async () => {
    if (capturedImages.length >= maxImages) {
      return;
    }

    const photo = await selectFromGallery();
    if (photo && photo.webPath) {
      onImageCaptured?.(photo.webPath);
      
      // Convertir en base64 si nécessaire
      if (onImageSelected) {
        const base64 = await imageToBase64(photo.webPath);
        if (base64) {
          onImageSelected(base64);
        }
      }
    }
  };

  if (!isNativeApp) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">
            Fonctionnalité appareil photo disponible uniquement sur mobile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleTakePicture}
          disabled={isLoading || capturedImages.length >= maxImages}
          className="flex-1"
        >
          <Camera className="w-4 h-4 mr-2" />
          Prendre une photo
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSelectFromGallery}
          disabled={isLoading || capturedImages.length >= maxImages}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Galerie
        </Button>
      </div>

      {capturedImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Images capturées ({capturedImages.length}/{maxImages})
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCapturedImages}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {capturedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.webPath}
                  alt={`Captured ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}