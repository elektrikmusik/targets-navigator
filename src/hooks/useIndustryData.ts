import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type IndustryData = Database["public"]["Tables"]["companies_industry"]["Row"];

interface UseIndustryDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  sortBy?: keyof IndustryData;
  sortOrder?: "asc" | "desc";
}

interface UseIndustryDataReturn {
  data: IndustryData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
}

export const useIndustryData = (options: UseIndustryDataOptions = {}): UseIndustryDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    sortBy = "industry_score",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<IndustryData[]>([]);
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
            .from("companies_industry")
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
            query = query.gte("industry_score", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("industry_score", maxScore);
          }

          return await query;
        });

        const { data: industryData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(industryData || [])]);
        } else {
          setData(industryData || []);
        }

        setTotalCount(count || 0);
        setHasMore((industryData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch industry data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching industry data:", err);
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

// Hook for getting industry data by company key
export const useCompanyIndustryData = (key: number | null) => {
  const [data, setData] = useState<IndustryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: industryData, error } = await supabase
        .from("companies_industry")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(industryData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch company industry data";
      setError(errorMessage);
      console.error("Error fetching company industry data:", err);
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

// Utility hook for industry analysis insights
export const useIndustryInsights = () => {
  const [insights, setInsights] = useState({
    averageScore: 0,
    topCoreBusiness: [] as IndustryData[],
    topTechnology: [] as IndustryData[],
    topMarket: [] as IndustryData[],
    scoreBreakdown: {
      core_business: 0,
      technology: 0,
      market: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("companies_industry")
        .select("*")
        .not("industry_score", "is", null)
        .order("industry_score", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const averageScore =
          data.reduce((sum, item) => sum + (item.industry_score || 0), 0) / totalCompanies;

        const scoreBreakdown = {
          core_business:
            data.reduce((sum, item) => sum + (item.core_business_score || 0), 0) / totalCompanies,
          technology:
            data.reduce((sum, item) => sum + (item.technology_score || 0), 0) / totalCompanies,
          market: data.reduce((sum, item) => sum + (item.market_score || 0), 0) / totalCompanies,
        };

        const topCoreBusiness = [...data]
          .sort((a, b) => (b.core_business_score || 0) - (a.core_business_score || 0))
          .slice(0, 5);

        const topTechnology = [...data]
          .sort((a, b) => (b.technology_score || 0) - (a.technology_score || 0))
          .slice(0, 5);

        const topMarket = [...data]
          .sort((a, b) => (b.market_score || 0) - (a.market_score || 0))
          .slice(0, 5);

        setInsights({
          averageScore: Math.round(averageScore * 100) / 100,
          topCoreBusiness,
          topTechnology,
          topMarket,
          scoreBreakdown: {
            core_business: Math.round(scoreBreakdown.core_business * 100) / 100,
            technology: Math.round(scoreBreakdown.technology * 100) / 100,
            market: Math.round(scoreBreakdown.market * 100) / 100,
          },
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch industry insights";
      setError(errorMessage);
      console.error("Error fetching industry insights:", err);
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
