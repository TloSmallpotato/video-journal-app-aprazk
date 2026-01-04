
import React, { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  const signInWithEmail = async (email: string, password: string) => {
    // TODO: Backend Integration - Call BetterAuth sign-in endpoint
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to sign in");
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    // TODO: Backend Integration - Call BetterAuth sign-up endpoint
    const result = await authClient.signUp.email({
      email,
      password,
      name,
    });

    if (result.error) {
      throw new Error(result.error.message || "Failed to sign up");
    }
  };

  const signOut = async () => {
    // TODO: Backend Integration - Call BetterAuth sign-out endpoint
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user: session.data?.user,
        loading: session.isPending,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
