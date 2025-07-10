import pcmPlayerWorkletCode from './pcm-player-worklet';

/**
 * A simple and modern PCM audio player using AudioWorklet with fallback
 */
export class PCMPlayer {
  private audioContext: AudioContext;
  private workletNode: AudioWorkletNode | null = null;
  private gainNode: GainNode | null = null;
  private isWorkletLoaded = false;
  private workletLoadPromise: Promise<boolean> | null = null;
  private isWorkletSupported = false;
  
  // Sample rate defaults to 24000 (assistant voice)
  public sampleRate: number = 24000;
  
  // Playback speed (1.0 = normal speed)
  public playbackSpeed: number = 1.0;
  
  // Callback for when audio playback is complete
  public onComplete: () => void = () => {};
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    
    // Check if AudioWorklet is supported
    this.isWorkletSupported = (
      typeof this.audioContext.audioWorklet !== 'undefined' && 
      typeof AudioWorkletNode !== 'undefined'
    );
    
    if (!this.isWorkletSupported) {
      console.log('AudioWorklet not supported, will use fallback mechanism');
    }
  }
  
  /**
   * Initialize the worklet if not already loaded
   */
  private async initWorklet(): Promise<boolean> {
    // If worklet not supported, skip initialization
    if (!this.isWorkletSupported) {
      return Promise.resolve(false);
    }
    
    if (this.isWorkletLoaded) {
      return Promise.resolve(true);
    }
    
    if (this.workletLoadPromise) {
      return this.workletLoadPromise;
    }
    
    this.workletLoadPromise = new Promise<boolean>(async (resolve, reject) => {
      try {
        // Create a blob URL for the worklet code
        const blob = new Blob([pcmPlayerWorkletCode], { type: 'application/javascript' });
        const workletUrl = URL.createObjectURL(blob);
        
        // Add the worklet module to the audio context
        await this.audioContext.audioWorklet.addModule(workletUrl);
        
        // Clean up the blob URL
        URL.revokeObjectURL(workletUrl);
        
        this.isWorkletLoaded = true;
        resolve(true);
      } catch (error) {
        console.error('Failed to load PCM player worklet:', error);
        resolve(false); // Still resolve but with false
      }
    });
    
    return this.workletLoadPromise;
  }
  
  /**
   * Play PCM16 audio data
   * @param pcmData Uint8Array containing PCM16 data
   */
  async playPCM16(pcmData: Uint8Array): Promise<void> {
    // Convert PCM16 to Float32Array for Web Audio API
    const float32Array = this.pcm16ToFloat32(pcmData);
    
    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Stop any current playback
      await this.stop();
      
      // Try to use AudioWorklet if supported
      const workletInitialized = await this.initWorklet();
      
      if (workletInitialized) {
        // Create a new worklet node
        this.workletNode = new AudioWorkletNode(this.audioContext, 'pcm-player-processor', {
          processorOptions: {
            sourceSampleRate: this.sampleRate,
            contextSampleRate: this.audioContext.sampleRate,
            playbackSpeed: this.playbackSpeed
          }
        });
        
        this.workletNode.connect(this.gainNode!);
        
        // Set up completion handler
        this.workletNode.port.onmessage = (event) => {
          if (event.data.done) {
            this.onComplete();
          }
          
          if (event.data.error) {
            console.error('Worklet error:', event.data.error);
          }
        };
        
        // Pass the sample rate along with the data to the worklet
        this.workletNode.port.postMessage({ 
          pcmData: float32Array,
          sampleRate: this.sampleRate,
          playbackSpeed: this.playbackSpeed
        });
      } else {
        // Use fallback approach with AudioBuffer
        await this.playWithAudioBuffer(float32Array);
      }
      
    } catch (error) {
      console.error('Error playing PCM audio:', error);
      throw error;
    }
  }
  
  /**
   * Fallback playback method using AudioBuffer
   */
  private async playWithAudioBuffer(float32Array: Float32Array): Promise<void> {
    console.log(`Playing audio with sample rate ${this.sampleRate}, context rate ${this.audioContext.sampleRate}, speed ${this.playbackSpeed}x`);
    
    try {
      // Create the audio buffer with the right sample rate
      let audioBuffer: AudioBuffer;
      
      // Check if we need to do sample rate conversion
      if (this.audioContext.sampleRate !== this.sampleRate) {
        // Need to do sample rate conversion
        const resampledData = await this.resampleAudio(float32Array, this.sampleRate, this.audioContext.sampleRate);
        audioBuffer = this.audioContext.createBuffer(1, resampledData.length, this.audioContext.sampleRate);
        audioBuffer.getChannelData(0).set(resampledData);
      } else {
        // Sample rates match, no conversion needed
        audioBuffer = this.audioContext.createBuffer(1, float32Array.length, this.sampleRate);
        audioBuffer.getChannelData(0).set(float32Array);
      }
  
      // Create a source node
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Apply playback speed
      source.playbackRate.value = this.playbackSpeed;
      
      source.connect(this.gainNode!);
      
      // Set up completion handler
      source.onended = () => {
        this.onComplete();
      };
      
      // Start playback
      source.start(0);
    } catch (error) {
      console.error('Error in fallback playback:', error);
      throw error;
    }
  }
  
  /**
   * Simple resampling function to handle sample rate mismatches
   */
  private async resampleAudio(
    audioData: Float32Array, 
    sourceSampleRate: number, 
    targetSampleRate: number
  ): Promise<Float32Array> {
    if (sourceSampleRate === targetSampleRate) {
      return audioData;
    }
    
    const ratio = targetSampleRate / sourceSampleRate;
    const newLength = Math.round(audioData.length * ratio);
    const result = new Float32Array(newLength);
    
    // Basic linear interpolation resampling
    for (let i = 0; i < newLength; i++) {
      const originalIndex = i / ratio;
      const index1 = Math.floor(originalIndex);
      const index2 = Math.min(index1 + 1, audioData.length - 1);
      const fraction = originalIndex - index1;
      
      result[i] = audioData[index1] * (1 - fraction) + audioData[index2] * fraction;
    }
    
    return result;
  }
  
  /**
   * Convert PCM16 data to Float32Array for Web Audio API
   */
  private pcm16ToFloat32(pcmData: Uint8Array): Float32Array {
    const float32Array = new Float32Array(pcmData.length / 2);
    const dataView = new DataView(pcmData.buffer);
    
    for (let i = 0; i < pcmData.length / 2; i++) {
      try {
        const int16 = dataView.getInt16(i * 2, true);
        float32Array[i] = int16 / 32768;
      } catch (e) {
        console.error('Error converting PCM16 to Float32:', e);
      }
    }
    
    return float32Array;
  }
  
  /**
   * Stop audio playback
   */
  async stop(): Promise<void> {
    if (this.workletNode) {
      // Send stop message to worklet
      this.workletNode.port.postMessage({ stop: true });
      
      // Disconnect the worklet
      this.workletNode.disconnect();
      this.workletNode = null;
    }
  }
  
  /**
   * Set the volume of audio playback
   * @param volume Volume level from 0 to 1
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
  
  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
  
  /**
   * Set playback speed
   * @param speed Speed multiplier (1.0 = normal speed)
   */
  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.5, Math.min(2.0, speed));
  }
} 