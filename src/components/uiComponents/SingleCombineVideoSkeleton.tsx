import React from 'react';
import { Play } from 'lucide-react';

const SingleCombineVideoSkeleton = () => {
  return (
    <div className="w-[453px] h-[337px] flex flex-col gap-[24px] opacity-100 animate-pulse">
      <div className="w-[453px] h-[10px] flex items-end">
        <span
          className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
          style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif', fontWeight: 600 }}
        >
          Single combined video
        </span>
      </div>
      <div className="w-[453px] h-[303px] flex flex-col gap-[16px] opacity-100">
        <div
          className="w-[453px] h-[260px] rounded-[24px] opacity-100 overflow-hidden flex items-center justify-center relative"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)',
          }}
        >
          <div
            className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] opacity-100 absolute"
            style={{
              top: '216px',
              left: '12px',
              paddingTop: 10,
              paddingRight: 12,
              paddingBottom: 10,
              paddingLeft: 10,
              background: '#FFFFFF1A',
              backdropFilter: 'blur(16px)',
              gap: 8
            }}
          >
            <div className="w-4 h-4 flex items-center justify-center" style={{ position: 'relative' }}>
              <Play color="#A3A3A3" fill="#A3A3A3" />
            </div>
            <div
              className="w-[27px] h-[10px] flex items-center justify-center ml-1"
              style={{
                borderRadius: '8px',
                padding: 0,
              }}
            >
              <span
                className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-gray-400"
                style={{
                  fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif',
                  width: '27px',
                  height: '10px',
                  display: 'inline-block',
                  lineHeight: '1',
                  verticalAlign: 'bottom'
                }}
              >
                Play
              </span>
            </div>
          </div>
        </div>
        <div className="w-[453px] h-[27px] flex flex-col gap-[10px] opacity-100">
          <div
            className="flex items-end opacity-100"
            style={{
              width: 193,
              height: 10,
              borderRadius: 100,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)',
            }}
          />
          <div
            className="flex items-end opacity-100 mt-1"
            style={{
              width: 39,
              height: 10,
              borderRadius: 100,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleCombineVideoSkeleton;
