'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import type { Tier } from '@/types';

export interface Profile {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tier: Exclude<Tier, 'anonymous'>;
}

export function useProfile() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const token = await getToken();
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }
      } catch {
        // Profile fetch failed
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isLoaded, isSignedIn, getToken]);

  return { profile, loading };
}
