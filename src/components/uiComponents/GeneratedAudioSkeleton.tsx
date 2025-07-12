import { ArrowDown, ChartNoAxesColumn, Play } from 'lucide-react';
import React from 'react';

const GeneratedAudioSkeleton = () => {
  return (
    <div className="w-[389px] h-[186px] flex flex-col gap-4 opacity-100 animate-pulse">
      {/* Leave the header as it is, do not skeletonize */}
      <div className="w-[159px] h-[32px] flex items-center justify-start gap-[16px] rotate-0 opacity-100">
        <span
          className="w-[120px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
          style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}
        >
          Generated audio
        </span>
        <div
          className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] rounded-full p-[10px] opacity-100"
          style={{ background: '#FFFFFF0D' }}
        >
          <span
            className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white opacity-100"
            style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}
          >
            2
          </span>
        </div>
      </div>
      <div className="w-[389px] h-[138px] flex flex-col gap-[10px] opacity-100">
        {[0, 1].map((_, idx) => (
          <div
            key={idx}
            className="w-[389px] h-[64px] flex flex-row gap-[48px] rounded-[100px] p-[16px] opacity-100"
            style={{ background: '#FFFFFF1A' }}
          >
            <div className="w-[235px] h-[32px] flex flex-row items-center gap-[10px] opacity-100">
              <div className="w-[32px] h-[32px] flex items-center gap-[10px] opacity-100">
                {/* Icon or play button here */}
                <ChartNoAxesColumn color="#A3A3A3" />
              </div>
              <div className="w-[193px] h-[32px] flex flex-col justify-between opacity-100">
                <div
                  className="flex items-end opacity-100"
                  style={{
                    width: 193,
                    height: 10,
                    borderRadius: 100,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)',
                  }}
                />
                <div
                  className="flex items-end opacity-100 mt-1"
                  style={{
                    width: 39,
                    height: 10,
                    borderRadius: 100,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)',
                  }}
                />
              </div>
            </div>
            <div className="w-[74px] h-[32px] flex items-center gap-[10px] opacity-100">
              <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full p-[10px] opacity-100" style={{ background: '#FFFFFF1A' }}>
                <div className="w-4 h-4 flex items-center justify-center opacity-100">
                  <ArrowDown color="#A3A3A3" />
                </div>
              </div>
              <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full p-[10px] opacity-100" style={{ background: '#FFFFFF1A' }}>
                <div className="w-4 h-4 flex items-center justify-center opacity-100">
                  <Play color="#A3A3A3" fill="#A3A3A3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedAudioSkeleton;
