import React, { useEffect, useState } from 'react';

interface AudioDebugInfoProps {
  isPlaying: boolean;
  sourceSampleRate?: number;
  contextSampleRate?: number;
  className?: string;
  audioContext?: AudioContext | null;
  showDetails?: boolean;
}

/**
 * Displays debugging information for audio playback
 */
export function AudioDebugInfo({
  isPlaying,
  sourceSampleRate = 0,
  contextSampleRate = 0,
  className = '',
  audioContext,
  showDetails = false
}: AudioDebugInfoProps) {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [contextState, setContextState] = useState<string>('unknown');
  const [outputDevice, setOutputDevice] = useState<string>('default');
  
  // Get audio devices if allowed
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log('Media devices enumeration not supported');
      return;
    }
    
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
        setAudioDevices(audioOutputs);
        
        // Get system default audio output
        const defaultDevice = audioOutputs.find(d => d.deviceId === 'default' || d.label.includes('Default'));
        if (defaultDevice) {
          setOutputDevice(defaultDevice.label);
        }
      } catch (error) {
        console.error('Error getting audio devices:', error);
      }
    };
    
    getDevices();
  }, []);
  
  // Update audio context state
  useEffect(() => {
    if (audioContext) {
      setContextState(audioContext.state);
      
      const stateChangeHandler = () => setContextState(audioContext.state);
      audioContext.addEventListener('statechange', stateChangeHandler);
      
      return () => {
        audioContext.removeEventListener('statechange', stateChangeHandler);
      };
    }
  }, [audioContext]);

  if (!showDetails) {
    return null;
  }
  
  return (
    <div className={`text-xs bg-gray-100 p-2 rounded ${className}`}>
      <h4 className="font-bold mb-1">Audio Debug</h4>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div className="text-gray-600">Status:</div>
        <div className={isPlaying ? 'text-green-600' : 'text-gray-800'}>
          {isPlaying ? 'Playing' : 'Idle'}
        </div>
        
        <div className="text-gray-600">Context State:</div>
        <div className={
          contextState === 'running' ? 'text-green-600' : 
          contextState === 'suspended' ? 'text-orange-600' : 'text-red-600'
        }>
          {contextState}
        </div>
        
        <div className="text-gray-600">Source Rate:</div>
        <div>{sourceSampleRate} Hz</div>
        
        <div className="text-gray-600">Context Rate:</div>
        <div>{contextSampleRate || (audioContext?.sampleRate || 0)} Hz</div>
        
        <div className="text-gray-600">Ratio:</div>
        <div>
          {contextSampleRate && sourceSampleRate 
            ? (contextSampleRate / sourceSampleRate).toFixed(3)
            : 'N/A'
          }
        </div>
        
        <div className="text-gray-600">Output Device:</div>
        <div className="truncate" title={outputDevice}>{outputDevice}</div>
      </div>
      
      {audioDevices.length > 0 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-blue-600">All Audio Devices ({audioDevices.length})</summary>
          <ul className="mt-1 pl-2">
            {audioDevices.map((device, i) => (
              <li key={i} className="truncate text-gray-700" title={device.label}>
                {device.label || `Device ${i+1}`}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
} 