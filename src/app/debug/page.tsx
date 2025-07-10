'use client';

import { useState, useEffect } from 'react';
import { AudioRecorder } from '@/lib/audio-recorder';

export default function DebugPage() {
  const [logs, setLogs] = useState<Array<{timestamp: string, level: string, message: string}>>([]);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<any>({});

  // Capture console logs
  useEffect(() => {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    const addLog = (level: string, ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => {
        const newLogs = [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          level,
          message
        }];
        return newLogs.slice(-100); // Keep only last 100 logs
      });
    };
    
    console.log = (...args) => {
      originalConsole.log(...args);
      addLog('log', ...args);
    };
    
    console.error = (...args) => {
      originalConsole.error(...args);
      addLog('error', ...args);
    };
    
    console.warn = (...args) => {
      originalConsole.warn(...args);
      addLog('warn', ...args);
    };
    
    console.info = (...args) => {
      originalConsole.info(...args);
      addLog('info', ...args);
    };
    
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, []);

  // Collect device info
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    
    const collectDeviceInfo = async () => {
      const info: any = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth
        },
        window: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        },
        mediaDevices: {
          supported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
          enumerateDevices: !!navigator.mediaDevices?.enumerateDevices
        },
        audioContext: {
          supported: !!(window.AudioContext || (window as any).webkitAudioContext),
          maxChannelCount: 'unknown',
          sampleRate: 'unknown'
        },
        permissions: {
          microphone: 'unknown',
          camera: 'unknown'
        }
      };

      // Test AudioContext
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const testContext = new AudioContextClass();
          info.audioContext.maxChannelCount = testContext.destination.maxChannelCount;
          info.audioContext.sampleRate = testContext.sampleRate;
          info.audioContext.state = testContext.state;
          info.audioContext.baseLatency = testContext.baseLatency;
          info.audioContext.outputLatency = testContext.outputLatency;
          testContext.close();
        }
      } catch (e: any) {
        info.audioContext.error = e.message;
      }

      // Check permissions
      if (navigator.permissions) {
        try {
          const micResult = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          info.permissions.microphone = micResult.state;
        } catch (e: any) {
          info.permissions.microphone = `error: ${e.message}`;
        }
        
        try {
          const cameraResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
          info.permissions.camera = cameraResult.state;
        } catch (e: any) {
          info.permissions.camera = `error: ${e.message}`;
        }
      }

      // Enumerate devices
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          info.mediaDevices.devices = devices.map(device => ({
            kind: device.kind,
            label: device.label,
            deviceId: device.deviceId ? 'present' : 'missing'
          }));
        } catch (e: any) {
          info.mediaDevices.devicesError = e.message;
        }
      }

      setDeviceInfo(info);
    };

    collectDeviceInfo();
  }, []);

  const startRecording = async () => {
    try {
      // Critical iOS Safari fix: Resume AudioContext before starting
      const ensureAudioContextResumed = async () => {
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const testContext = new AudioContextClass();
            if (testContext.state === 'suspended') {
              await testContext.resume();
            }
            testContext.close();
          }
        } catch (error: any) {
          console.error('AudioContext resume failed:', error);
        }
      };
      
      await ensureAudioContextResumed();
      
      const recorder = new AudioRecorder(16000);
      
      recorder.on('volume', (vol) => {
        setVolume(vol);
      });
      
      recorder.on('data', (data) => {
        console.log('Audio data received, length:', data.length);
      });
      
      await recorder.start();
      setAudioRecorder(recorder);
      setIsRecording(true);
      console.log('Recording started successfully');
    } catch (error: any) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (audioRecorder) {
      audioRecorder.stop();
      setAudioRecorder(null);
      setIsRecording(false);
      setVolume(0);
      console.log('Recording stopped');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testPermissions = async () => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      console.error('Cannot test permissions: not in browser environment');
      return;
    }
    
    try {
      console.log('Testing microphone permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Microphone permission test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Voice Mode Debug Tool</h1>
          <p className="text-gray-600 mb-4">
            This page helps debug voice mode issues on mobile devices.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={testPermissions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Permissions
            </button>
            
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop Recording
              </button>
            )}
            
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
          
          {isRecording && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Recording Active</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">Volume:</span>
                  <div className="w-20 h-2 bg-green-200 rounded">
                    <div 
                      className="h-full bg-green-500 rounded transition-all duration-100"
                      style={{ width: `${Math.min(volume * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-600">{volume.toFixed(3)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Device Information</h2>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(deviceInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Console Logs ({logs.length})</h2>
            <button
              onClick={clearLogs}
              className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-center py-4">
                No logs yet. Try testing permissions or starting recording.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs font-mono ${
                    log.level === 'error' ? 'bg-red-50 text-red-800' :
                    log.level === 'warn' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="text-gray-500 text-xs mb-1">{log.timestamp}</div>
                  <div className="break-all whitespace-pre-wrap">{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 