import { useEffect, useState } from 'react';
import {
  fetchUserSubscription,
  planMeta,
  type Plan,
  type SubscriptionStatus,
} from '../services/subscriptionService';
import { useAuth } from './useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan>('free');
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [limit, setLimit] = useState(planMeta.free.limit);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setPlan('free');
      setStatus('free');
      setLimit(planMeta.free.limit);
      setLoading(false);
      return;
    }
    let ignore = false;
    const load = async () => {
      setLoading(true);
      const data = await fetchUserSubscription(user.uid!);
      if (ignore) return;
      setPlan(data.activePlan);
      setStatus(data.subscriptionStatus);
      setLimit(planMeta[data.activePlan].limit);
      setLoading(false);
    };
    load();
    return () => {
      ignore = true;
    };
  }, [user?.uid]);

  return { plan, status, limit, loading };
};

