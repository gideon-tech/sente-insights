'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Tier } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: { email: string; full_name: string | null; avatar_url: string | null; tier: Exclude<Tier, 'anonymous'> } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthState['profile']>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(accessToken: string, authUser: User | null) {
    try {
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          // Avatar: prefer profile, fall back to OAuth user metadata
          const avatarUrl = data.profile.avatar_url
            || authUser?.user_metadata?.avatar_url
            || authUser?.user_metadata?.picture
            || null;

          // Name: prefer profile, fall back to OAuth user metadata
          const fullName = data.profile.full_name
            || authUser?.user_metadata?.full_name
            || authUser?.user_metadata?.name
            || null;

          setProfile({
            email: data.profile.email,
            full_name: fullName,
            avatar_url: avatarUrl,
            tier: data.profile.tier || 'free',
          });
        }
      }
    } catch {
      // Profile fetch failed — user is still authenticated, just no profile data
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.access_token) {
        fetchProfile(s.access_token, s.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.access_token) {
        fetchProfile(s.access_token, s.user ?? null);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
