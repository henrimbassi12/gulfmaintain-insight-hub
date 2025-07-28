
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from "sonner";
import { PermissionGuide } from './PermissionGuide';

interface CallInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
  contactName: string;
  callType: 'audio' | 'video';
}

export function CallInterface({ isVisible, onClose, contactName, callType }: CallInterfaceProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [callDuration, setCallDuration] = useState(0);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    try {
      // Vérifier d'abord si les APIs sont supportées
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('API multimédia non supportée');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideoEnabled
      });
      
      streamRef.current = stream;
      
      if (localVideoRef.current && isVideoEnabled) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
      toast.success(`Appel ${callType === 'video' ? 'vidéo' : 'audio'} démarré avec ${contactName}`);
      
      // Simuler une connexion après 2 secondes
      setTimeout(() => {
        if (remoteVideoRef.current && isVideoEnabled) {
          // Simuler le flux vidéo distant
          remoteVideoRef.current.srcObject = stream;
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'appel:', error);
      
      let errorMessage = 'Impossible d\'accéder à la caméra/microphone';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permission refusée pour la caméra/microphone. Veuillez autoriser l\'accès dans les paramètres du navigateur.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Aucune caméra ou microphone détecté sur cet appareil.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Caméra/microphone non supporté par ce navigateur.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Caméra/microphone déjà utilisé par une autre application.';
        }
      }
      
      toast.error(errorMessage);
      setShowPermissionGuide(true);
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoEnabled(callType === 'video');
    onClose();
    toast.info('Appel terminé');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  if (!isVisible) return null;

  // Afficher le guide des permissions si nécessaire
  if (showPermissionGuide) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="space-y-4">
          <PermissionGuide 
            type="camera" 
            onRetry={() => {
              setShowPermissionGuide(false);
              startCall();
            }} 
          />
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPermissionGuide(false);
                onClose();
              }}
              className="bg-white"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {isCallActive ? 'En communication avec' : 'Appel en cours...'} {contactName}
            </h3>
            {isCallActive && (
              <p className="text-gray-600">{formatDuration(callDuration)}</p>
            )}
          </div>

          {callType === 'video' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Vidéo distante */}
              <div className="relative bg-gray-900 rounded-lg aspect-video">
                <video 
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {contactName}
                </div>
              </div>

              {/* Vidéo locale */}
              <div className="relative bg-gray-900 rounded-lg aspect-video">
                <video 
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Vous
                </div>
              </div>
            </div>
          )}

          {callType === 'audio' && (
            <div className="flex items-center justify-center mb-8">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
                <Phone className="w-16 h-16 text-white" />
              </div>
            </div>
          )}

          {/* Contrôles d'appel */}
          <div className="flex justify-center gap-4">
            {!isCallActive ? (
              <Button 
                onClick={startCall}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
              >
                {callType === 'video' ? <Video className="w-5 h-5 mr-2" /> : <Phone className="w-5 h-5 mr-2" />}
                Décrocher
              </Button>
            ) : (
              <>
                {/* Bouton micro */}
                <Button
                  onClick={toggleMute}
                  variant={isMuted ? "destructive" : "outline"}
                  size="lg"
                  className="rounded-full"
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>

                {/* Bouton vidéo (seulement pour les appels vidéo) */}
                {callType === 'video' && (
                  <Button
                    onClick={toggleVideo}
                    variant={!isVideoEnabled ? "destructive" : "outline"}
                    size="lg"
                    className="rounded-full"
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                )}

                {/* Bouton raccrocher */}
                <Button
                  onClick={endCall}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full"
                  size="lg"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </>
            )}

            {!isCallActive && (
              <Button 
                onClick={onClose}
                variant="outline"
                className="px-8 py-3 rounded-full"
              >
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
