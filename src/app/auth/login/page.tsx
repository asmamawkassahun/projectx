'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJWTAuthContext } from '@/config/Auth';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import LoadingDots from '@/components/ui/LoadingDots';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { loginWithCredentials } = useJWTAuthContext();

  // Handle credential response from GoogleLogin component
  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {      
      // Decode JWT token
      const jwt = credentialResponse.credential as string;
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      
      // Login with the decoded data
      await loginWithCredentials({
        googleToken: jwt,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        googleId: payload.sub
      });
      
      router.push('/');
    } catch (error) {
      console.error('Google authentication error:', error);
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to authenticate with Google. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl border border-stone-200">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-widest-1 uppercase font-montserrat bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">COSTAR</h1>
          <p className="text-sm text-gray-500">Sign in with your Google account</p>
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <LoadingDots size="md" variant="primary" text="Signing you in" />
              <p className="mt-3 text-sm text-gray-500 animate-fade-in">Please wait while we authenticate your account...</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setErrorMessage('Google login failed. Please try again.')}
                useOneTap
                text="continue_with"
                shape="pill"
              />
            </div>
          )}
          
          {errorMessage && (
            <div className="mt-2 text-center animate-fade-in">
              <p className="text-sm text-red-500">{errorMessage}</p>
              <button 
                onClick={() => setErrorMessage(null)}
                className="mt-2 text-xs text-primary-600 hover:text-primary-700"
              >
                Try again
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
} 