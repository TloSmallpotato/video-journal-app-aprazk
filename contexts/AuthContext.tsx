
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Try to use the session hook, but handle errors gracefully
  let session: any = { data: null, isPending: false, error: null };
  
  try {
    session = authClient.useSession();
  } catch (error) {
    console.log("Auth session hook error (backend not configured):", error);
  }

  useEffect(() => {
    if (session?.data?.user) {
      setUser(session.data.user);
    }
  }, [session?.data?.user]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Call BetterAuth sign-in endpoint
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to sign in");
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(error.message || "Failed to sign in. Please check your backend configuration.");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Call BetterAuth sign-up endpoint
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to sign up");
      }
      
      if (result.data?.user) {
        setUser(result.data.user);
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw new Error(error.message || "Failed to sign up. Please check your backend configuration.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // TODO: Backend Integration - Call BetterAuth sign-out endpoint
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || session?.data?.user,
        loading: loading || session?.isPending || false,
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
