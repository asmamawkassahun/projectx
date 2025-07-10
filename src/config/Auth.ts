import { JWTAuthConfig, createJWTAuthProvider } from 'next-jwt-auth';
import { useContext } from 'react';
import { LoggedInUser } from '../types/Auth';

// In a real application, you would get this from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authConfig: JWTAuthConfig = {
  apiBaseUrl: API_BASE_URL,
  user: {
    // Property in response where user object is located
    property: 'user',
  },
  accessToken: {
    // Property in response where access token is located
    property: 'access.token',
    // Optional: expiry time property
    expireTimeProperty: 'access.expiresAt',
  },
  refreshToken: {
    // Property in response where refresh token is located
    property: 'refresh.token',
    // Optional: expiry time property
    expireTimeProperty: 'refresh.expiresAt',
  },
  endpoints: {
    login: { url: '/auth/login/google', method: 'post' },
    logout: { url: '/auth/logout', method: 'post' },
    // refresh: { url: '/auth/refresh-token', method: 'post' },
    user: { url: '/auth/profile', method: 'get' },
  },
  pages: {
    login: { url: '/auth/login' },
  },
  unauthorizedStatusCode: 401
};

// Create context and provider with our LoggedInUser type
export const { JWTAuthContext, JWTAuthProvider } = createJWTAuthProvider<LoggedInUser>();

// Custom hook for easier context access
export const useJWTAuthContext = () => {
  const context = useContext(JWTAuthContext);

  if (!context) {
    throw new Error('JWTAuthContext not found, please check the provider');
  }

  return context;
} 