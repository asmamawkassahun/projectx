/**
 * PCM player AudioWorklet processor code
 * This is injected into a separate audio thread to efficiently process audio data
 */
const pcmPlayerWorkletCode = `
class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    
    // Audio data buffer and playback position
    this.buffer = null;
    this.position = 0;
    this.isActive = true;
    
    // Sample rate info for resampling
    this.sourceSampleRate = options.processorOptions?.sourceSampleRate || 24000;
    this.contextSampleRate = options.processorOptions?.contextSampleRate || 44100;
    this.resampleRatio = this.contextSampleRate / this.sourceSampleRate;
    
    // Flag to track if resampling is needed
    this.needsResampling = Math.abs(this.resampleRatio - 1.0) > 0.001;
    
    console.log('PCM Player processor initialized with sourceSampleRate:', this.sourceSampleRate, 
                'contextSampleRate:', this.contextSampleRate, 
                'resampleRatio:', this.resampleRatio,
                'needsResampling:', this.needsResampling);
    
    // Handle messages from the main thread
    this.port.onmessage = (event) => {
      try {
        // New PCM data to play
        if (event.data.pcmData) {
          // Store sample rate if provided
          if (event.data.sampleRate) {
            this.sourceSampleRate = event.data.sampleRate;
            this.resampleRatio = this.contextSampleRate / this.sourceSampleRate;
            this.needsResampling = Math.abs(this.resampleRatio - 1.0) > 0.001;
            console.log('Updated sample rate:', this.sourceSampleRate, 'ratio:', this.resampleRatio);
          }
          
          this.buffer = event.data.pcmData;
          this.position = 0;
        }
        
        // Stop command
        if (event.data.stop) {
          this.buffer = null;
          this.position = 0;
        }
        
        // Terminate command
        if (event.data.terminate) {
          this.isActive = false;
        }
      } catch (error) {
        console.error('Error in PCMPlayerProcessor onmessage:', error);
        this.port.postMessage({ error: 'Failed to process message' });
      }
    };
  }
  
  /**
   * Process audio data - called with each audio processing quantum
   * @param {Array} inputs - Input audio data (not used)
   * @param {Array} outputs - Output audio data to fill
   * @returns {boolean} - Whether to continue processing
   */
  process(inputs, outputs) {
    try {
      const output = outputs[0];
      
      // If no data or finished playing, continue processing but output silence
      if (!this.buffer || this.position >= this.buffer.length) {
        // Return true to keep processor alive
        return this.isActive;
      }
      
      // Fill all output channels with the same mono data
      for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
        const channel = output[channelIndex];
        
        if (this.needsResampling) {
          // With resampling, we need to calculate the correct position for each output sample
          for (let i = 0; i < channel.length; i++) {
            // Calculate the position in the source buffer
            const sourcePos = this.position + i / this.resampleRatio;
            
            if (sourcePos < this.buffer.length) {
              // Linear interpolation
              const index1 = Math.floor(sourcePos);
              const index2 = Math.min(index1 + 1, this.buffer.length - 1);
              const fraction = sourcePos - index1;
              
              channel[i] = this.buffer[index1] * (1 - fraction) + this.buffer[index2] * fraction;
            } else {
              channel[i] = 0;
              
              // If we've reached the end of the buffer
              if (i === 0) {
                this.port.postMessage({ done: true });
                this.buffer = null;
                break;
              }
            }
          }
          
          // Advance position based on resampling ratio
          this.position += channel.length / this.resampleRatio;
        } else {
          // No resampling needed, simple copy
          for (let i = 0; i < channel.length; i++) {
            if (this.position < this.buffer.length) {
              channel[i] = this.buffer[this.position++];
            } else {
              channel[i] = 0;
              
              // If we've just reached the end, notify the main thread
              if (this.position === this.buffer.length) {
                this.port.postMessage({ done: true });
                this.buffer = null;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in PCMPlayerProcessor process:', error);
      this.port.postMessage({ error: 'Error processing audio' });
      this.buffer = null;
    }
    
    // Continue processing as long as we're active
    return this.isActive;
  }
}

// Register the processor with a name that matches what we use in the main thread
registerProcessor('pcm-player-processor', PCMPlayerProcessor);
`;

export default pcmPlayerWorkletCode; 