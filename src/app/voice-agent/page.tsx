'use client';

import React from 'react';
import VoiceAgent from '@/components/VoiceAgent';
import { LiveAPIProvider } from '@/contexts/LiveAPIContext';

export default function VoiceAgentPage() {
  // Define API key for the LiveAPIProvider - make sure to configure in env file
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';

  return (
    <div className="flex flex-col h-screen">
      {/* Voice Agent Component */}
      <div className="flex-1 overflow-hidden">
        <LiveAPIProvider apiKey={API_KEY}>
          <VoiceAgent/>
        </LiveAPIProvider>
      </div>
    </div>
  );
} 