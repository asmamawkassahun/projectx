import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioPulseProps {
  volume: number;
  isActive: boolean;
  hover?: boolean;
  lightBackground?: boolean;
}

/**
 * AudioPulse - Visualizes audio levels with animated bars
 * 
 * @param volume - Audio volume level (0-1)
 * @param isActive - Whether the component is active
 * @param hover - Whether to apply hover animation
 * @param lightBackground - Whether the component is on a light background
 */
export default function AudioPulse({ 
  volume, 
  isActive, 
  hover = false, 
  lightBackground = true 
}: AudioPulseProps) {
  const lineCount = 3;
  const lines = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let timeout: number | null = null;
    const update = () => {
      lines.current.forEach(
        (line, i) => {
          // Create a wave-like effect with the middle bar being taller
          const multiplier = i === 1 ? 400 : (i === 0 ? 300 : 350);
          line.style.height = `${Math.min(
            24,
            4 + volume * multiplier,
          )}px`;
        }
      );
      timeout = window.setTimeout(update, 100);
    };

    update();

    return () => clearTimeout((timeout as number)!);
  }, [volume]);

  return (
    <div className={cn(
      "flex items-center justify-center gap-[3px] h-5", 
      {
        "opacity-100": isActive,
        "animate-pulse-slow": hover
      }
    )}>
      {Array(lineCount)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            ref={(el) => (lines.current[i] = el!)}
            className={cn(
              "w-[3px] rounded-full transition-all duration-75",
              isActive 
                ? lightBackground
                  ? "bg-gradient-to-t from-indigo-600 to-indigo-400 animate-pulse-slow"
                  : "bg-gradient-to-t from-indigo-500 to-indigo-300 animate-pulse-slow" 
                : lightBackground
                  ? "bg-stone-300"
                  : "bg-stone-500"
            )}
            style={{ 
              animationDelay: `${i * 150}ms`,
              opacity: isActive ? 0.9 : 0.5
            }}
          />
        ))}
    </div>
  );
} 