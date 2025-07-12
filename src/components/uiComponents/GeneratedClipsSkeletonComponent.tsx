import React from 'react';

const GeneratedClipsSkeletonComponent = () => {
  return (
    <div
      className="w-[691px] h-[404px] flex flex-col gap-6 rotate-0 opacity-100"
    >
      {/* Header section (Generated clips and 7) */}
      <div className="w-[147px] h-[32px] flex items-center justify-start gap-[10px] rotate-0 opacity-100">
        <span
          className="h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
          style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}
        >
          Generated clips
        </span>
        <div
          className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] rounded-full p-[10px] opacity-100"
          style={{ background: '#FFFFFF0D' }}
        >
          <span
            className="w-[8px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white opacity-100"
            style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}
          >
            7
          </span>
        </div>
      </div>
      {/* Skeleton main content */}
      <div className="w-[691px] h-[303px] flex gap-4 rotate-0 opacity-100">
        {/* Three skeleton boxes */}
        {[1,2,3].map((_, idx) => (
          <div key={idx} className="w-[217px] h-[303px] flex flex-col items-center">
            <div className="w-[217px] h-[260px] rounded-[24px] opacity-100 rotate-0 overflow-hidden flex items-center justify-center relative animate-pulse"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)'
              }}
            >
              <div
                className="w-[73px] h-[32px] flex items-center rounded-[1000px] opacity-100 absolute"
                style={{
                  top: '216px',
                  left: '12px',
                  paddingTop: 10,
                  paddingRight: 12,
                  paddingBottom: 10,
                  paddingLeft: 10,
                  gap: 8,
                  color: '#FFFFFF1A',
                  background: '#00000066',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="w-4 h-4 flex items-center justify-center" style={{ position: 'relative' }}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'absolute', top: '2px', left: '2px' }}
                  >
                    <polygon points="2,2 10,6 2,10" fill="#FFFFFF" />
                  </svg>
                </div>
                <div
                  className="w-[27px] h-[10px] flex items-center justify-center ml-1"
                  style={{
                    borderRadius: '8px',
                    padding: 0
                  }}
                >
                  <span
                    className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white opacity-60"
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
            <div className="w-[193px] h-[32px] flex flex-col gap-2 mt-4">
              <div
                className="w-[193px] h-[10px] rounded-[100px] mb-1 animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)'
                }}
              />
              <div
                className="w-[39px] h-[10px] rounded-[100px] animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) 100%)'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* See more button skeleton */}
      <div
        className="w-[85px] h-[29px] flex items-center justify-center gap-[10px] rotate-0 opacity-100 rounded-full pt-[10px] pr-[12px] pb-[10px] pl-[12px]"
        style={{ background: '#FFFFFF0D' }}
      >
        <span
          className="w-[61px] h-[9px] font-sans font-semibold text-[12px] leading-[1] tracking-normal align-bottom text-white opacity-60"
          style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif' }}
        >
          See more
        </span>
      </div>
    </div>
  );
};

export default GeneratedClipsSkeletonComponent;
