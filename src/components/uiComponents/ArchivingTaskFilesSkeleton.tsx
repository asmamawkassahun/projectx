import React from 'react';
import { File, ArrowDown } from 'lucide-react';

const ArchivingTaskFilesSkeleton = () => {
  return (
    <div className="w-[335px] h-[119px] flex flex-col gap-[32px] opacity-100 animate-pulse">
      <div
        className="font-sans font-bold text-[32px] leading-[1.1] tracking-normal text-white"
        style={{ fontFamily: 'Neue Haas Grotesk Display Pro, sans-serif', fontWeight: 700 }}
      >
        Archiving task files
      </div>
      <div
        className="w-[335px] h-[64px] flex items-center justify-between rounded-[100px] opacity-100 px-4"
        style={{ background: '#FFFFFF', paddingTop: 16, paddingBottom: 16 }}
      >
        <div className="w-[128px] h-[32px] flex items-center gap-[10px] opacity-100">
          {/* File icon box */}
          <div className="w-[32px] h-[32px] flex items-center justify-center gap-[10px] opacity-100">
            <div className="w-[16px] h-[16px] flex items-center justify-center opacity-100 relative">
              <File className="w-[14px] h-[11px] text-[#00000040]" style={{ position: 'absolute', top: '2.3px', left: '0.83px' }} />
            </div>
          </div>
          {/* File info box */}
          <div className="w-[86px] h-[32px] flex flex-col justify-between opacity-100 gap-1">
            <div
              className="flex items-end opacity-100"
              style={{
                width: 193,
                height: 10,
                borderRadius: 100,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.025) 100%)',
              }}
            />
            <div
              className="flex items-end opacity-100 mt-1"
              style={{
                width: 39,
                height: 10,
                borderRadius: 100,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.025) 100%)',
              }}
            />
          </div>
        </div>
        <div className="w-[32px] h-[32px] flex items-center justify-center rounded-full gap-[10px] opacity-100 p-[10px]" style={{ background: '#00000040' }}>
          <ArrowDown className="w-[14px] h-[16px]" color="#fff" />
        </div>
      </div>
    </div>
  );
};

export default ArchivingTaskFilesSkeleton;
