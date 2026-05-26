import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats } from '../types';
import { activityService } from '../services/activityService';

// Global event so any page can trigger a stats refresh
export function notifyStatsChanged() {
  window.dispatchEvent(new CustomEvent('stats:refresh'));
}

export function useStats(pollInterval = 15000) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch = useCallback(async () => {
    try {
      const data = await activityService.getStats();
      setStats(data);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, pollInterval);
    window.addEventListener('stats:refresh', fetch);
    return () => {
      clearInterval(interval);
      window.removeEventListener('stats:refresh', fetch);
    };
  }, [fetch, pollInterval]);

  return { stats, loading, lastUpdated, refresh: fetch };
}
