'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJWTAuthContext } from '@/config/Auth';
import { useGoogleLogin } from '@react-oauth/google';
import LoadingDots from '@/components/ui/LoadingDots';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { loginWithCredentials } = useJWTAuthContext();

  // Handle Google login with access token and proper scopes
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        console.log('Google OAuth success, received access token');
        
        // Get user info using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user information');
        }
        
        const userInfo = await userInfoResponse.json();
        console.log('User info retrieved:', userInfo);
        
        // Login with the user data and Google access token
        await loginWithCredentials({
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          picture: userInfo.picture,
          googleId: userInfo.id,
          googleAccessToken: tokenResponse.access_token, // Include the access token
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
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setErrorMessage('Google login failed. Please try again.');
    },
    scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly'
  });

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
              <button
                onClick={() => googleLogin()}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>
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