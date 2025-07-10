import { useState, useCallback, useRef, useEffect } from 'react';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationState {
  coordinates: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown';
}

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    permissionStatus: 'unknown'
  });

  const watchIdRef = useRef<number | null>(null);

  // Check if geolocation is supported
  const isGeolocationSupported = useCallback(() => {
    return 'geolocation' in navigator;
  }, []);

  // Check current permission status
  const checkPermissionStatus = useCallback(async () => {
    if (!('permissions' in navigator)) {
      return 'unknown';
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      return permissionStatus.state as 'prompt' | 'granted' | 'denied';
    } catch (error) {
      console.warn('Could not check geolocation permission:', error);
      return 'unknown';
    }
  }, []);

  // Request location permission and get current position
  const requestLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    if (!isGeolocationSupported()) {
      const error = 'Geolocation is not supported by this browser';
      setLocationState(prev => ({ ...prev, error, permissionStatus: 'denied' }));
      return null;
    }

    setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check permission status first
      const permissionStatus = await checkPermissionStatus();
      setLocationState(prev => ({ ...prev, permissionStatus }));

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const coordinates: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      setLocationState(prev => ({
        ...prev,
        coordinates,
        isLoading: false,
        error: null,
        permissionStatus: 'granted'
      }));

      return coordinates;
    } catch (error: any) {
      let errorMessage = 'Failed to get location';
      let permissionStatus: 'prompt' | 'granted' | 'denied' | 'unknown' = 'unknown';

      if (error.code === 1) { // PERMISSION_DENIED
        errorMessage = 'Location access denied. Please enable location services.';
        permissionStatus = 'denied';
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        errorMessage = 'Location information is unavailable.';
      } else if (error.code === 3) { // TIMEOUT
        errorMessage = 'Location request timed out.';
      }

      setLocationState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        permissionStatus
      }));

      return null;
    }
  }, [isGeolocationSupported, checkPermissionStatus]);

  // Start watching location changes
  const startWatching = useCallback(() => {
    if (!isGeolocationSupported()) {
      return;
    }

    if (watchIdRef.current !== null) {
      // Already watching
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const coordinates: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        setLocationState(prev => ({
          ...prev,
          coordinates,
          error: null,
          permissionStatus: 'granted'
        }));
      },
      (error) => {
        let errorMessage = 'Failed to watch location';
        
        if (error.code === 1) {
          errorMessage = 'Location access denied.';
        } else if (error.code === 2) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out.';
        }

        setLocationState(prev => ({
          ...prev,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000 // 10 minutes
      }
    );
  }, [isGeolocationSupported]);

  // Stop watching location changes
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Clear location data
  const clearLocation = useCallback(() => {
    stopWatching();
    setLocationState({
      coordinates: null,
      isLoading: false,
      error: null,
      permissionStatus: 'unknown'
    });
  }, [stopWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  return {
    ...locationState,
    isGeolocationSupported: isGeolocationSupported(),
    requestLocation,
    startWatching,
    stopWatching,
    clearLocation,
    checkPermissionStatus
  };
}; 