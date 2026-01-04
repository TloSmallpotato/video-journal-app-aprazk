
import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// TODO: Backend Integration - Replace with your actual backend URL
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  plugins: [
    expoClient({
      scheme: "video-journal",
      storagePrefix: "video-journal",
      storage: SecureStore,
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;
