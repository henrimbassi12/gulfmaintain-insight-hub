
import { useState } from 'react';

export interface CallState {
  isVisible: boolean;
  contactName: string;
  callType: 'audio' | 'video';
}

export function useCallState() {
  const [callState, setCallState] = useState<CallState>({
    isVisible: false,
    contactName: '',
    callType: 'audio'
  });

  const startCall = (contactName: string, callType: 'audio' | 'video') => {
    setCallState({
      isVisible: true,
      contactName,
      callType
    });
  };

  const endCall = () => {
    setCallState({
      isVisible: false,
      contactName: '',
      callType: 'audio'
    });
  };

  return {
    callState,
    startCall,
    endCall
  };
}
