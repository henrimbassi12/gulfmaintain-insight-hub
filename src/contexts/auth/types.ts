
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: any;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, role?: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'facebook' | 'linkedin_oidc') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  agency?: string;
  account_status: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
