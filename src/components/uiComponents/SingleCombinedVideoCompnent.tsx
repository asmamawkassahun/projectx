import React from 'react';
import { Play } from 'lucide-react';

const SingleCombinedVideoComponent = () => {
  return (
    <div
      className="w-[453px] h-[337px] flex flex-col gap-[24px] opacity-100"
    >
      <div
        className="w-[453px] h-[10px] flex items-end"
      >
        <span
          className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
          style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif', fontWeight: 600 }}
        >
          Single combined video
        </span>
      </div>
      <div className="w-[453px] h-[303px] flex flex-col gap-[16px] opacity-100">
        <div className="w-[453px] h-[260px] rounded-[24px] opacity-100 overflow-hidden flex items-center justify-center relative">
          <img src="/SCImage1.png" alt="Clip 1" className="object-cover w-full h-full" />
          <div
            className="w-[73px] h-[32px] flex items-center gap-2 rounded-[1000px] pt-[10px] pr-[12px] pb-[10px] pl-[10px] opacity-100 absolute"
            style={{
              top: '208px',
              left: '16px',
              background: '#00000066',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div className="w-4 h-4 flex items-center justify-center" style={{ position: 'relative' }}>
              <Play color="#fff" fill="#fff" />
            </div>
            <div
              className="w-[27px] h-[10px] flex items-center justify-center ml-1"
              style={{
                borderRadius: '8px',
                padding: 0
              }}
            >
              <span
                className="font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
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
            className="w-[453px] h-[10px] font-sans font-semibold text-[14px] leading-[1] tracking-normal align-bottom text-white"
            style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif', fontWeight: 600 }}
          >
            final_video_with_new_audio.mp4
          </div>
          <div
            className="w-[453px] h-[7px] font-sans font-medium text-[10px] leading-[1] tracking-normal align-bottom"
            style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif', fontWeight: 500, color: '#FFFFFF66' }}
          >
            0:26 sec  •  720x1280
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCombinedVideoComponent;
