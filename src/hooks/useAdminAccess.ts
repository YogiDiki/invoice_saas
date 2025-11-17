import { useEffect, useState } from 'react';
import { fetchUserSubscription } from '../services/subscriptionService';
import { useAuth } from './useAuth';

export const useAdminAccess = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let ignore = false;
    const load = async () => {
      setLoading(true);
      const profile = await fetchUserSubscription(user.uid!);
      if (ignore) return;
      setIsAdmin(profile.role === 'admin');
      setLoading(false);
    };
    load();

    return () => {
      ignore = true;
    };
  }, [user?.uid]);

  return { isAdmin, loading };
};

