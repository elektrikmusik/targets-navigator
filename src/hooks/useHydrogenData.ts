import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type HydrogenData = Database["public"]["Tables"]["companies_hydrogen"]["Row"];

interface UseHydrogenDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  sortBy?: keyof HydrogenData;
  sortOrder?: "asc" | "desc";
}

interface UseHydrogenDataReturn {
  data: HydrogenData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
}

export const useHydrogenData = (options: UseHydrogenDataOptions = {}): UseHydrogenDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    sortBy = "H2Score",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<HydrogenData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(
    async (page = 0, append = false) => {
      try {
        setLoading(true);
        setError(null);

        // Use retry logic for database queries
        const result = await retryWithBackoff(async () => {
          let query = supabase
            .from("companies_hydrogen")
            .select("*", { count: "exact" })
            .order(sortBy, { ascending: sortOrder === "asc" });

          // Apply pagination (always use limit now)
          query = query.range(page * limit, (page + 1) * limit - 1);

          // Apply search filter
          if (searchTerm.trim()) {
            query = query.or(`englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`);
          }

          // Apply score filters
          if (minScore !== undefined) {
            query = query.gte("H2Score", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("H2Score", maxScore);
          }

          return await query;
        });

        const { data: hydrogenData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(hydrogenData || [])]);
        } else {
          setData(hydrogenData || []);
        }

        setTotalCount(count || 0);
        setHasMore((hydrogenData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch hydrogen data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching hydrogen data:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit, searchTerm, minScore, maxScore, sortBy, sortOrder],
  );

  const fetchMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchData(currentPage + 1, true);
    }
  }, [currentPage, fetchData, hasMore, loading]);

  const refresh = useCallback(async () => {
    setCurrentPage(0);
    await fetchData(0, false);
  }, [fetchData]);

  const search = useCallback(async () => {
    setCurrentPage(0);
    await fetchData(0, false);
  }, [fetchData]);

  const filterByScore = useCallback(async () => {
    setCurrentPage(0);
    await fetchData(0, false);
  }, [fetchData]);

  useEffect(() => {
    fetchData(0, false);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    totalCount,
    hasMore,
    fetchMore,
    refresh,
    search,
    filterByScore,
  };
};

// Hook for getting hydrogen data by company key
export const useCompanyHydrogenData = (key: number | null) => {
  const [data, setData] = useState<HydrogenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: hydrogenData, error } = await supabase
        .from("companies_hydrogen")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(hydrogenData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch company hydrogen data";
      setError(errorMessage);
      console.error("Error fetching company hydrogen data:", err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (key) {
      fetchData();
    }
  }, [fetchData, key]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
};

// Utility hook for hydrogen statistics
export const useHydrogenStats = () => {
  const [stats, setStats] = useState({
    averageScore: 0,
    totalCompanies: 0,
    topPerformers: 0,
    scoreDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("companies_hydrogen")
        .select("H2Score, H2OverallRating")
        .not("H2Score", "is", null);

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const averageScore =
          data.reduce((sum, item) => sum + (item.H2Score || 0), 0) / totalCompanies;
        const topPerformers = data.filter((item) => (item.H2Score || 0) >= 80).length;

        const scoreDistribution = {
          excellent: data.filter((item) => (item.H2Score || 0) >= 80).length,
          good: data.filter((item) => (item.H2Score || 0) >= 60 && (item.H2Score || 0) < 80).length,
          fair: data.filter((item) => (item.H2Score || 0) >= 40 && (item.H2Score || 0) < 60).length,
          poor: data.filter((item) => (item.H2Score || 0) < 40).length,
        };

        setStats({
          averageScore: Math.round(averageScore * 100) / 100,
          totalCompanies,
          topPerformers,
          scoreDistribution,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch hydrogen statistics";
      setError(errorMessage);
      console.error("Error fetching hydrogen statistics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};
