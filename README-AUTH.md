# Google OAuth Integration with Next-JWT-Auth

This project uses Google OAuth for authentication with JWT token management.

## Setup Instructions

### 1. Create a Google OAuth Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Go to "APIs & Services" > "Credentials".
4. Click "Create Credentials" > "OAuth client ID".
5. Select "Web application" as the application type.
6. Add a name for your client ID.
7. Under "Authorized JavaScript origins", add:
   - `http://localhost:3000` (for local development)
   - Your production domain (if applicable)
8. Under "Authorized redirect URIs", add:
   - `http://localhost:3000` (for local development)
   - Your production domain (if applicable)
9. Click "Create" to generate your client ID and client secret.

### 2. Set up Environment Variables

Create a `.env.local` file in the frontend directory with the following content:

```
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

Replace `your-google-client-id-here.apps.googleusercontent.com` with the actual client ID from Google Cloud Console.

### 3. Backend API Requirements

The backend should implement the following endpoints to work with this authentication flow:

- `/auth/google` (POST) - Validates Google credential tokens and returns JWT tokens
- `/auth/signin` (POST) - Traditional login endpoint
- `/auth/signout` (POST) - Logout endpoint
- `/auth/refresh-token` (POST) - Refresh token endpoint
- `/auth/profile` (GET) - Get user profile endpoint

Each endpoint should respond with the format expected by next-jwt-auth:

```json
{
  "user": {
    "id": "user-id",
    "email": "user-email@example.com",
    "firstName": "First",
    "lastName": "Last",
    "picture": "https://example.com/profile.jpg",
    ...
  },
  "access": {
    "token": "jwt-access-token",
    "expiresAt": "2023-12-31T23:59:59Z"
  },
  "refresh": {
    "token": "jwt-refresh-token",
    "expiresAt": "2023-12-31T23:59:59Z"
  }
}
```

## Available Authentication Methods

### 1. Google Sign-In Button

The official Google Sign-In button is available on the login page and uses the `GoogleLogin` component from `@react-oauth/google`.

### 2. Custom Google Login Button

A custom styled button is also available, which uses the `useGoogleLogin` hook from `@react-oauth/google`. 