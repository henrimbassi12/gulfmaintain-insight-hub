import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { toast } from 'sonner';

interface CameraImage {
  webPath?: string;
  format: string;
  saved: boolean;
}

export function useCamera() {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CameraImage[]>([]);

  const isNativeApp = Capacitor.isNativePlatform();

  const takePicture = async (
    source: CameraSource = CameraSource.Camera
  ): Promise<Photo | null> => {
    if (!isNativeApp && source === CameraSource.Camera) {
      toast.error('Appareil photo non disponible sur le web');
      return null;
    }

    try {
      setIsLoading(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: source,
      });

      // Ajouter l'image capturée à la liste
      const newImage: CameraImage = {
        webPath: image.webPath,
        format: image.format,
        saved: false
      };

      setCapturedImages(prev => [newImage, ...prev]);
      
      toast.success('Photo capturée avec succès');
      return image;
    } catch (error) {
      console.error('Error taking picture:', error);
      toast.error('Erreur lors de la capture de la photo');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const selectFromGallery = async (): Promise<Photo | null> => {
    return await takePicture(CameraSource.Photos);
  };

  const clearCapturedImages = () => {
    setCapturedImages([]);
  };

  const removeImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Convertir une image en base64 pour l'upload
  const imageToBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Retirer le préfixe data:image/...;base64,
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  return {
    isNativeApp,
    isLoading,
    capturedImages,
    takePicture,
    selectFromGallery,
    clearCapturedImages,
    removeImage,
    imageToBase64
  };
}