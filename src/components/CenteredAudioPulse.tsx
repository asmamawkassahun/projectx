import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';

interface CenteredAudioPulseProps {
  isActive: boolean;
}

/**
 * CenteredAudioPulse - A large centered audio visualization
 * showing pill-shaped bars that react to audio volume
 */
export default function CenteredAudioPulse({ isActive }: CenteredAudioPulseProps) {
  // Get volume directly from context
  const { volume } = useLiveAPIContext();
  
  const pillCount = 4;
  const pills = useRef<HTMLDivElement[]>([]);
  
  // Base heights for the pills when there's no audio (greatly increased)
  const baseHeights = [80, 100, 90, 85]; // px
  
  useEffect(() => {
    let timeout: number | null = null;
    const update = () => {
      pills.current.forEach((pill, i) => {
        if (!pill) return;
        
        // Scale factor makes middle pills slightly taller
        const scaleFactor = i === 1 || i === 2 ? 1.2 : 1;
        
        // Match AudioPulse's approach exactly
        const multiplier = i === 1 ? 400 : (i === 0 ? 300 : 350);
        
        // Use baseHeights as minimum and add volume-based height
        const height = baseHeights[i] + Math.min(
          100, // max additional height (greatly increased)
          volume * multiplier * scaleFactor
        );
        
        // Apply with a CSS transition for smoother animation
        pill.style.height = `${height}px`;
      });
      
      // Update rate for visualization
      timeout = window.setTimeout(update, 100);
    };
    
    update();
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [volume]);
  
  return (
    <motion.div
      className="flex items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {Array(pillCount).fill(null).map((_, i) => (
        <div
          key={i}
          ref={(el) => (pills.current[i] = el!)}
          className={cn(
            "w-16 rounded-full bg-gradient-to-t from-gray-800 to-gray-600 transition-height duration-200 ease-out",
            !isActive && "opacity-70"
          )}
          style={{ 
            height: baseHeights[i],
            opacity: isActive ? 0.9 : 0.5
          }}
        />
      ))}
    </motion.div>
  );
} 