import { AuthUser } from 'next-jwt-auth';

export interface LoggedInUser extends AuthUser {
  // Base fields from AuthUser (id: string | number)
  email: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  googleId?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
} 