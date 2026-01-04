
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// Get backend URL from app.json extra config or environment variable
const BACKEND_URL = Constants.expoConfig?.extra?.backendUrl || 
                    process.env.EXPO_PUBLIC_API_URL || 
                    "https://placeholder-backend.com";

console.log("Auth client initialized with backend URL:", BACKEND_URL);

export const authClient = createAuthClient({
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

export type Session = typeof authClient.$Infer.Session;
