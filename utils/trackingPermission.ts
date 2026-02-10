/**
 * App Tracking Transparency (iOS)
 * Request ATT before any tracking/ads. Call from root layout on app launch.
 */

import * as TrackingTransparency from 'expo-tracking-transparency';
import { Platform } from 'react-native';

let permissionRequested = false;
let permissionRequestPromise: Promise<boolean> | null = null;

export async function requestTrackingPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return true;
  }

  if (permissionRequestPromise) {
    return permissionRequestPromise;
  }

  permissionRequestPromise = (async () => {
    try {
      const { status } = await TrackingTransparency.getTrackingPermissionsAsync();

      if (status === 'granted') {
        permissionRequested = true;
        return true;
      }
      if (status === 'denied' || (status as string) === 'restricted') {
        permissionRequested = true;
        return false;
      }

      const { status: requestStatus } =
        await TrackingTransparency.requestTrackingPermissionsAsync();
      permissionRequested = true;
      return requestStatus === 'granted';
    } catch (error) {
      console.error('Error requesting tracking permission:', error);
      permissionRequested = true;
      return false;
    }
  })();

  return permissionRequestPromise;
}

export async function getTrackingPermissionStatus(): Promise<
  'granted' | 'denied' | 'restricted' | 'undetermined'
> {
  if (Platform.OS !== 'ios') {
    return 'granted';
  }
  try {
    const { status } = await TrackingTransparency.getTrackingPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting tracking permission status:', error);
    return 'denied';
  }
}

export function hasTrackingPermissionBeenRequested(): boolean {
  return permissionRequested;
}

/**
 * Wait until the ATT request has been shown (or already resolved).
 * Use before initializing ad SDKs so ads only run after the user has seen the prompt.
 */
export async function waitForTrackingPermissionRequest(): Promise<boolean> {
  if (permissionRequested && permissionRequestPromise) {
    return permissionRequestPromise;
  }
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (permissionRequested && permissionRequestPromise) {
        clearInterval(checkInterval);
        permissionRequestPromise.then(resolve);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, 5000);
  });
}
