import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type IPData = Database["public"]["Tables"]["companies_ip"]["Row"];

interface UseIPDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  sortBy?: keyof IPData;
  sortOrder?: "asc" | "desc";
}

interface UseIPDataReturn {
  data: IPData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
}

export const useIPData = (options: UseIPDataOptions = {}): UseIPDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    sortBy = "IPActivityScore",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<IPData[]>([]);
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
            .from("companies_ip")
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
            query = query.gte("IPActivityScore", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("IPActivityScore", maxScore);
          }

          return await query;
        });

        const { data: ipData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(ipData || [])]);
        } else {
          setData(ipData || []);
        }

        setTotalCount(count || 0);
        setHasMore((ipData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch IP data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching IP data:", err);
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

// Hook for getting IP data by company key
export const useCompanyIPData = (key: number | null) => {
  const [data, setData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: ipData, error } = await supabase
        .from("companies_ip")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(ipData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch company IP data";
      setError(errorMessage);
      console.error("Error fetching company IP data:", err);
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

// Utility hook for IP portfolio insights
export const useIPInsights = () => {
  const [insights, setInsights] = useState({
    averageScore: 0,
    totalCompanies: 0,
    portfolioBreakdown: {
      relevantPatents: 0,
      ceresCitations: 0,
      portfolioGrowth: 0,
      filingRecency: 0,
    },
    ratingDistribution: {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
    },
    innovationLeaders: [] as IPData[],
    growthLeaders: [] as IPData[],
    recentFilings: [] as IPData[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("companies_ip")
        .select("*")
        .not("IPActivityScore", "is", null)
        .order("IPActivityScore", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const averageScore =
          data.reduce((sum, item) => sum + (item.IPActivityScore || 0), 0) / totalCompanies;

        const portfolioBreakdown = {
          relevantPatents:
            data.reduce((sum, item) => sum + (item.IPRelevantPatentsScore || 0), 0) /
            totalCompanies,
          ceresCitations:
            data.reduce((sum, item) => sum + (item.IPCeresCitationsScore || 0), 0) / totalCompanies,
          portfolioGrowth:
            data.reduce((sum, item) => sum + (item.IPPortfolioGrowthScore || 0), 0) /
            totalCompanies,
          filingRecency:
            data.reduce((sum, item) => sum + (item.IPFilingRecencyScore || 0), 0) / totalCompanies,
        };

        const ratingDistribution = {
          excellent: data.filter((item) => (item.IPActivityScore || 0) >= 80).length,
          good: data.filter(
            (item) => (item.IPActivityScore || 0) >= 60 && (item.IPActivityScore || 0) < 80,
          ).length,
          fair: data.filter(
            (item) => (item.IPActivityScore || 0) >= 40 && (item.IPActivityScore || 0) < 60,
          ).length,
          poor: data.filter((item) => (item.IPActivityScore || 0) < 40).length,
        };

        const innovationLeaders = data.slice(0, 5);

        const growthLeaders = [...data]
          .sort((a, b) => (b.IPPortfolioGrowthScore || 0) - (a.IPPortfolioGrowthScore || 0))
          .slice(0, 5);

        const recentFilings = [...data]
          .sort((a, b) => (b.IPFilingRecencyScore || 0) - (a.IPFilingRecencyScore || 0))
          .slice(0, 5);

        setInsights({
          averageScore: Math.round(averageScore * 100) / 100,
          totalCompanies,
          portfolioBreakdown: {
            relevantPatents: Math.round(portfolioBreakdown.relevantPatents * 100) / 100,
            ceresCitations: Math.round(portfolioBreakdown.ceresCitations * 100) / 100,
            portfolioGrowth: Math.round(portfolioBreakdown.portfolioGrowth * 100) / 100,
            filingRecency: Math.round(portfolioBreakdown.filingRecency * 100) / 100,
          },
          ratingDistribution,
          innovationLeaders,
          growthLeaders,
          recentFilings,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch IP insights";
      setError(errorMessage);
      console.error("Error fetching IP insights:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    refresh: fetchInsights,
  };
};
