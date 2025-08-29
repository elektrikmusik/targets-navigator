import { useState, useEffect, useCallback, useRef } from "react";

interface UseRealtimeDataOptions {
  refreshInterval?: number; // milliseconds
  enableAutoRefresh?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseRealtimeDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  isStale: boolean;
  retryCount: number;
}

export function useRealtimeData<T>(
  fetchFunction: () => Promise<{ data: T[]; totalCount: number }>,
  options: UseRealtimeDataOptions = {},
): UseRealtimeDataReturn<T> {
  const {
    refreshInterval = 30000, // 30 seconds default
    enableAutoRefresh = false,
    maxRetries = 3,
    retryDelay = 2000,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // Calculate if data is stale (older than refresh interval)
  const isStale = lastUpdated ? Date.now() - lastUpdated.getTime() > refreshInterval : true;

  const fetchData = useCallback(
    async (attempt = 0): Promise<void> => {
      if (!isMountedRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction();

        if (!isMountedRef.current) return;

        setData(result.data);
        setTotalCount(result.totalCount);
        setLastUpdated(new Date());
        setRetryCount(0);
      } catch (err) {
        if (!isMountedRef.current) return;

        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";

        if (attempt < maxRetries) {
          console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${retryDelay}ms...`, err);
          setRetryCount(attempt + 1);

          setTimeout(
            () => {
              fetchData(attempt + 1);
            },
            retryDelay * Math.pow(2, attempt),
          ); // Exponential backoff
        } else {
          console.error("Max retries reached, giving up:", err);
          setError(errorMessage);
          setRetryCount(maxRetries);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [fetchFunction, maxRetries, retryDelay],
  );

  const refresh = useCallback(async (): Promise<void> => {
    await fetchData(0);
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (enableAutoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoRefresh, refreshInterval, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Visibility change handling (pause/resume when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (enableAutoRefresh) {
        if (document.visibilityState === "visible") {
          // Resume auto-refresh and refresh immediately if data is stale
          if (isStale) {
            fetchData();
          }
          if (refreshInterval > 0) {
            intervalRef.current = setInterval(() => {
              fetchData();
            }, refreshInterval);
          }
        } else {
          // Pause auto-refresh when tab is not visible
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enableAutoRefresh, refreshInterval, fetchData, isStale]);

  return {
    data,
    loading,
    error,
    totalCount,
    lastUpdated,
    refresh,
    isStale,
    retryCount,
  };
}

// Enhanced hook with cache management
interface UseCachedRealtimeDataOptions extends UseRealtimeDataOptions {
  cacheKey: string;
  cacheExpiry?: number; // milliseconds
}

export function useCachedRealtimeData<T>(
  fetchFunction: () => Promise<{ data: T[]; totalCount: number }>,
  options: UseCachedRealtimeDataOptions,
): UseRealtimeDataReturn<T> {
  const { cacheKey, cacheExpiry = 60000, ...realtimeOptions } = options;

  // Try to load from cache first
  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, totalCount, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;
        if (age < cacheExpiry) {
          return { data, totalCount };
        }
      }
    } catch (err) {
      console.warn("Failed to load cached data:", err);
    }
    return null;
  }, [cacheKey, cacheExpiry]);

  // Enhanced fetch function with caching
  const enhancedFetchFunction = useCallback(async () => {
    const result = await fetchFunction();

    // Cache the result
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          ...result,
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      console.warn("Failed to cache data:", err);
    }

    return result;
  }, [fetchFunction, cacheKey]);

  const realtimeData = useRealtimeData(enhancedFetchFunction, realtimeOptions);

  // Initialize with cached data if available
  useEffect(() => {
    const cachedData = getCachedData();
    if (cachedData && realtimeData.data.length === 0 && !realtimeData.loading) {
      // Use cached data initially, but trigger a refresh to get fresh data
      realtimeData.refresh();
    }
  }, [getCachedData, realtimeData]);

  return realtimeData;
}
