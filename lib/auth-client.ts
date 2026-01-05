
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Get backend URL from app.json extra config or environment variable
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 
                    process.env.EXPO_PUBLIC_API_URL || 
                    "https://placeholder-backend.com";

console.log("Auth client initialized with backend URL:", BACKEND_URL);

// Lazy initialization to prevent build-time errors
let _authClient: ReturnType<typeof createAuthClient> | null = null;

function getAuthClient() {
  if (_authClient) {
    return _authClient;
  }

  try {
    _authClient = createAuthClient({
      baseURL: BACKEND_URL,
      plugins: [
        expoClient({
          scheme: "natively",
          storagePrefix: "natively",
          storage: SecureStore,
        }),
      ],
      // Add fetch options to handle errors gracefully
      fetchOptions: {
        onError(context) {
          console.error("Auth client error:", context.error);
          // Don't throw errors during initialization
          return {
            error: {
              message: "Backend not configured. Please set up your backend URL.",
            },
          };
        },
      },
    });
    
    return _authClient;
  } catch (error) {
    console.error("Failed to initialize auth client:", error);
    // Return a mock client that won't crash the app
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

export type Session = any; // Simplified type to avoid build-time issues
