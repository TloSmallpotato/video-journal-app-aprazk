
import React, { createContext, useContext, ReactNode, useState } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TESTING MODE: Mock user as always authenticated
  const [user] = useState<any>({
    id: "test-user-123",
    email: "test@example.com",
    name: "Test User",
  });
  const [loading] = useState(false);

  const signInWithEmail = async (email: string, password: string) => {
    console.log("Auth bypassed - signInWithEmail called but no-op for testing");
    // No-op for testing
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    console.log("Auth bypassed - signUpWithEmail called but no-op for testing");
    // No-op for testing
  };

  const signOut = async () => {
    console.log("Auth bypassed - signOut called but no-op for testing");
    // No-op for testing
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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
