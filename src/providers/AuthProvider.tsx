'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { JWTAuthProvider, authConfig } from '@/config/Auth';
import QueryProvider from './QueryProvider';

// Google Client ID from environment variable
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <JWTAuthProvider config={authConfig}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </JWTAuthProvider>
    </GoogleOAuthProvider>
  );
};

export default AuthProvider; 