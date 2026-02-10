# Permissions Implementation Guide

Complete extraction of all permissions used in this project (notifications, tracking, biometric, etc.) for reuse in another Expo/React Native app.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Dependencies](#2-dependencies)
3. [App / Native Configuration](#3-app--native-configuration)
4. [Notification Permissions](#4-notification-permissions)
5. [App Tracking Transparency (iOS)](#5-app-tracking-transparency-ios)
6. [Biometric (Face ID / Touch ID)](#6-biometric-face-id--touch-id)
7. [Document Picker (no explicit permission)](#7-document-picker)
8. [Where Each Permission Is Requested](#8-where-each-permission-is-requested)
9. [Checklist for New Project](#9-checklist-for-new-project)

---

## 1. Overview

| Permission / Feature               | Platform      | When requested                    | Config / Code                                       |
| ---------------------------------- | ------------- | --------------------------------- | --------------------------------------------------- |
| **Notifications**                  | iOS + Android | On reminder form mount            | `notificationService.ts`, `reminder-form.tsx`       |
| **App Tracking Transparency**      | iOS only      | App launch (before ads)           | `trackingPermission.ts`, `_layout.tsx`              |
| **Biometric (Face ID / Touch ID)** | iOS + Android | On first auth use (system dialog) | `biometric.ts`, `app.json` NSFaceIDUsageDescription |
| **Document picker**                | Both          | User action (system handles)      | No explicit request                                 |

---

## 2. Dependencies

```json
{
  "dependencies": {
    "expo-notifications": "^0.32.15",
    "expo-tracking-transparency": "^6.0.8",
    "expo-local-authentication": "^17.0.8",
    "expo-device": "^8.0.10",
    "expo-document-picker": "~14.0.8",
    "expo-secure-store": "^15.0.8"
  }
}
```

Install:

```bash
npx expo install expo-notifications expo-tracking-transparency expo-local-authentication expo-device expo-document-picker expo-secure-store
```

---

## 3. App / Native Configuration

### 3.1 `app.json` (Expo config)

Relevant fields and plugins:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Your app uses Face ID to securely authenticate and protect your data.",
        "NSUserTrackingUsageDescription": "This allows us to show you relevant ads. Your data is never shared with third parties."
      }
    },
    "plugins": [
      "expo-router",
      ["expo-notifications", { "sounds": [] }],
      "expo-secure-store"
    ]
  }
}
```

- **NSFaceIDUsageDescription** – Required for Face ID (iOS). Shown when biometric is used.
- **NSUserTrackingUsageDescription** – Required if you use App Tracking Transparency (e.g. before ads).
- **expo-notifications** – Adds notification capabilities and (on Android) notification permission.
- **expo-secure-store** – No extra permission strings; uses keychain/Keystore.

If you use **expo-tracking-transparency**, ensure `NSUserTrackingUsageDescription` is set; the plugin uses it. No need to add the plugin to `plugins` unless you use a config plugin that requires it.

---

## 4. Notification Permissions

### 4.1 Service: `src/services/notificationService.ts`

```typescript
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null;

  // Check if it's a physical device
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push notification permissions");
    return null;
  }

  // Set up Android notification channel (required for Android 8+)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3B82F6",
      sound: "default",
    });
  }

  return token;
}
```

Notes:

- **iOS**: `requestPermissionsAsync()` triggers the system alert (includes sound/badge if you ask for them).
- **Android 13+**: Same call requests `POST_NOTIFICATIONS`; the plugin declares the permission.

### 4.2 Where notification permission is requested

Request when the user enters a screen that needs notifications (e.g. reminder form), not on first app launch:

```typescript
// In app/reminder-form.tsx (or your “schedule reminder” screen)
import { registerForPushNotificationsAsync } from "../src/services/notificationService";

export default function ReminderFormScreen() {
  // Request notification permissions on mount
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // ... rest of component
}
```

You can reuse `registerForPushNotificationsAsync()` in any screen where you first need to schedule or show notifications.

---

## 5. App Tracking Transparency (iOS)

Used to comply with Apple’s rule: request ATT **before** collecting tracking data (e.g. initializing ad SDKs).

### 5.1 Utility: `src/utils/trackingPermission.ts`

```typescript
import * as TrackingTransparency from "expo-tracking-transparency";
import { Platform } from "react-native";

let permissionRequested = false;
let permissionRequestPromise: Promise<boolean> | null = null;

export async function requestTrackingPermission(): Promise<boolean> {
  if (Platform.OS !== "ios") {
    return true; // Android doesn't use ATT
  }

  if (permissionRequestPromise) {
    return permissionRequestPromise;
  }

  permissionRequestPromise = (async () => {
    try {
      const { status } =
        await TrackingTransparency.getTrackingPermissionsAsync();

      if (status === "granted") {
        permissionRequested = true;
        return true;
      }
      if (status === "denied" || (status as string) === "restricted") {
        permissionRequested = true;
        return false;
      }

      console.log("Requesting App Tracking Transparency permission...");
      const { status: requestStatus } =
        await TrackingTransparency.requestTrackingPermissionsAsync();
      permissionRequested = true;
      console.log("Tracking permission status:", requestStatus);
      return requestStatus === "granted";
    } catch (error) {
      console.error("Error requesting tracking permission:", error);
      permissionRequested = true;
      return false;
    }
  })();

  return permissionRequestPromise;
}

export async function getTrackingPermissionStatus(): Promise<
  "granted" | "denied" | "restricted" | "undetermined"
> {
  if (Platform.OS !== "ios") {
    return "granted";
  }
  try {
    const { status } = await TrackingTransparency.getTrackingPermissionsAsync();
    return status;
  } catch (error) {
    console.error("Error getting tracking permission status:", error);
    return "denied";
  }
}

export function hasPermissionBeenRequested(): boolean {
  return permissionRequested;
}

export async function waitForPermissionRequest(): Promise<boolean> {
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
```

### 5.2 Request on app launch (before any tracking/ads)

In root layout so ATT is requested before initializing ads:

```typescript
// app/_layout.tsx
import { requestTrackingPermission } from '../src/utils/trackingPermission';

export default function RootLayout() {
  useEffect(() => {
    requestTrackingPermission().catch((error) => {
      console.error('Failed to request tracking permission:', error);
    });
    // ... other init (e.g. splash, rating)
  }, []);

  return (
    // ...
  );
}
```

### 5.3 Wait for ATT before initializing ads

So ads only run after the ATT dialog has been shown (or already denied):

```typescript
// Example: in BannerAd or wherever you init ad SDK
import { waitForPermissionRequest } from "../utils/trackingPermission";

useEffect(() => {
  waitForPermissionRequest()
    .then(() => {
      return MobileAds().initialize(); // or your ad SDK init
    })
    .then(() => {
      setAdUnitId(getBannerAdUnitId());
      setIsAdAvailable(true);
    })
    .catch(console.error);
}, []);
```

Required **app.json** for ATT: **NSUserTrackingUsageDescription** (see section 3).

---

## 6. Biometric (Face ID / Touch ID)

No separate “request permission” call: the system shows the Face ID / Touch ID dialog when you call `authenticateAsync`. You must declare usage in `app.json` (iOS: `NSFaceIDUsageDescription`).

### 6.1 Utility: `src/utils/biometric.ts`

```typescript
import * as LocalAuthentication from "expo-local-authentication";

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export const checkBiometricAvailability = async (): Promise<boolean> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) return false;
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return enrolled;
  } catch {
    return false;
  }
};

export const authenticateWithBiometric = async (): Promise<BiometricResult> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return {
        success: false,
        error: "Biometric authentication not available on this device",
      };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return { success: false, error: "No biometric credentials enrolled" };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access the app",
      cancelLabel: "Cancel",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || "Authentication failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getBiometricType = async (): Promise<string> => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      return "Face ID";
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
    ) {
      return "Touch ID";
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return "Iris";
    }
    return "Biometric";
  } catch {
    return "Biometric";
  }
};
```

### 6.2 Usage (e.g. auth screen)

- Call `checkBiometricAvailability()` to decide whether to show “Use Face ID” / “Use Touch ID”.
- When user chooses biometric, call `authenticateWithBiometric()`. The system will show the Face ID / Touch ID dialog; no separate permission request.

**app.json** (iOS): set **NSFaceIDUsageDescription** (see section 3).

---

## 7. Document Picker

Document picker uses the system UI; the user explicitly picks a file. No runtime permission request in this project. If your Expo/React Native version or future OS changes require it, you would use the appropriate storage/permission API for that context.

---

## 8. Where Each Permission Is Requested

| Permission    | File / place                                                      | Trigger                                                                       |
| ------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Notifications | `registerForPushNotificationsAsync()` in `notificationService.ts` | Called in `reminder-form.tsx` on mount (when user opens reminder form).       |
| ATT           | `requestTrackingPermission()` in `trackingPermission.ts`          | Called once in `app/_layout.tsx` on app launch.                               |
| Biometric     | `authenticateWithBiometric()` in `biometric.ts`                   | When user taps “Use Face ID” / “Use Touch ID” on auth screen (system dialog). |
| Document      | None                                                              | User taps “Pick file”; system handles access.                                 |

---

## 9. Checklist for New Project

### Install packages

- [ ] `expo-notifications`
- [ ] `expo-tracking-transparency` (if using ads/tracking on iOS)
- [ ] `expo-local-authentication` (if using Face ID / Touch ID)
- [ ] `expo-device` (for `Device.isDevice` in notification registration)

### Configure `app.json`

- [ ] **NSFaceIDUsageDescription** (if using biometric)
- [ ] **NSUserTrackingUsageDescription** (if using ATT)
- [ ] Plugin: `["expo-notifications", { "sounds": [] }]` (or with sounds)
- [ ] Plugin: `expo-secure-store` if you use SecureStore

### Copy / adapt code

- [ ] `src/services/notificationService.ts` – notification handler + `registerForPushNotificationsAsync()` + Android channel
- [ ] `src/utils/trackingPermission.ts` – if using ATT (request on launch, wait before ads)
- [ ] `src/utils/biometric.ts` – if using Face ID / Touch ID

### Wire up in app

- [ ] Call `registerForPushNotificationsAsync()` when user first enters a flow that needs notifications (e.g. reminder or settings).
- [ ] Call `requestTrackingPermission()` in root layout on launch if using ATT; call `waitForPermissionRequest()` before initializing ad SDKs.
- [ ] Use `checkBiometricAvailability()` and `authenticateWithBiometric()` where you need biometric (e.g. auth screen).

### Optional

- [ ] Add a “Notification settings” entry that deep-links to app notification settings if permission was denied.
- [ ] Handle Android 13+ notification permission in a pre-prompt or explanation before calling `requestPermissionsAsync()`.

---

## Summary

- **Notifications**: Request via `Notifications.getPermissionsAsync()` / `requestPermissionsAsync()` when entering a feature that needs them; set notification handler and (on Android) create a channel.
- **App Tracking Transparency**: Request once at app launch in root layout; wait for that request to finish before initializing tracking/ads; set `NSUserTrackingUsageDescription` in `app.json`.
- **Biometric**: No separate permission; declare `NSFaceIDUsageDescription` and call `authenticateWithBiometric()` when the user chooses biometric; system shows the dialog.
- **Document Picker**: No explicit permission in this project; rely on system picker.

Copy the files and config snippets above into your other project and adjust strings and channel IDs to match your app.
