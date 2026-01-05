
/**
 * BetterAuth Client Configuration Template
 *
 * This template provides a ready-to-use BetterAuth client with:
 * - Platform-specific storage (localStorage for web, SecureStore for native)
 * - Bearer token handling for web to avoid cross-origin issues
 * - Expo client plugin for deep linking
 * - Lazy initialization to prevent build-time errors
 *
 * Usage:
 * 1. Replace YOUR_BACKEND_URL with actual backend URL in app.json
 * 2. Import and use authClient in your components
 */

import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Backend URL is automatically configured in app.json under expo.extra.backendUrl
const API_URL = Constants.expoConfig?.extra?.backendUrl || "https://placeholder-backend.com";
const BEARER_TOKEN_KEY = "natively_bearer_token";

// Platform-specific storage adapter
const storage = Platform.OS === "web"
  ? {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      deleteItem: (key: string) => localStorage.removeItem(key),
    }
  : SecureStore;

// Lazy initialization to prevent build-time errors
let _authClient: ReturnType<typeof createAuthClient> | null = null;

function getAuthClient() {
  if (_authClient) {
    return _authClient;
  }

  try {
    _authClient = createAuthClient({
      baseURL: API_URL,
      plugins: [
        expoClient({
          scheme: "natively",
          storagePrefix: "natively",
          storage,
        }),
      ],
      // Web-specific configuration to handle bearer tokens
      ...(Platform.OS === "web" && {
        fetchOptions: {
          auth: {
            type: "Bearer" as const,
            token: () => localStorage.getItem(BEARER_TOKEN_KEY) || "",
          },
        },
      }),
    });
    
    return _authClient;
  } catch (error) {
    console.error("Failed to initialize auth client:", error);
    return null;
  }
}

// Export a proxy that lazily initializes the client
export const authClient = new Proxy({} as ReturnType<typeof createAuthClient>, {
  get(target, prop) {
    const client = getAuthClient();
    if (!client) {
      console.warn(`Auth client not initialized. Cannot access property: ${String(prop)}`);
      // Return a no-op function for method calls
      if (prop === 'useSession') {
        return () => ({ data: null, isPending: false, error: null });
      }
      return () => Promise.resolve({ error: { message: "Auth client not initialized" } });
    }
    return (client as any)[prop];
  }
});

/**
 * Store bearer token for web authentication
 * This is required for the popup-based OAuth flow on web
 */
export function storeWebBearerToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(BEARER_TOKEN_KEY, token);
  }
}

/**
 * Clear stored authentication tokens
 */
export function clearAuthTokens() {
  if (Platform.OS === "web") {
    localStorage.removeItem(BEARER_TOKEN_KEY);
  }
}
