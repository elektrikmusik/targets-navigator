import { Session, User, AuthError } from "@supabase/supabase-js";
import { createContext } from "react";

interface AuthResponse {
  data?: { user?: User | null; session?: Session | null };
  error?: AuthError | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{ error?: AuthError | null }>;
  resetPassword: (email: string) => Promise<AuthResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
