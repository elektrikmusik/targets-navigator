import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type FinancialData = Database["public"]["Tables"]["company_financial"]["Row"];

interface UseFinancialDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  minRevenue?: number;
  maxRevenue?: number;
  sortBy?: keyof FinancialData;
  sortOrder?: "asc" | "desc";
}

interface UseFinancialDataReturn {
  data: FinancialData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
  filterByRevenue: (min?: number, max?: number) => Promise<void>;
}

export const useFinancialData = (options: UseFinancialDataOptions = {}): UseFinancialDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    minRevenue,
    maxRevenue,
    sortBy = "finance_score",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<FinancialData[]>([]);
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
            .from("company_financial")
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
            query = query.gte("finance_score", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("finance_score", maxScore);
          }

          // Apply revenue filters
          if (minRevenue !== undefined) {
            query = query.gte("annual_revenue", minRevenue);
          }
          if (maxRevenue !== undefined) {
            query = query.lte("annual_revenue", maxRevenue);
          }

          return await query;
        });

        const { data: financialData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(financialData || [])]);
        } else {
          setData(financialData || []);
        }

        setTotalCount(count || 0);
        setHasMore((financialData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch financial data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching financial data:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit, searchTerm, minScore, maxScore, minRevenue, maxRevenue, sortBy, sortOrder],
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

  const filterByRevenue = useCallback(async () => {
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
    filterByRevenue,
  };
};

// Hook for getting financial data by company key
export const useCompanyFinancialData = (key: number | null) => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: financialData, error } = await supabase
        .from("company_financial")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(financialData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch company financial data";
      setError(errorMessage);
      console.error("Error fetching company financial data:", err);
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

// Utility hook for financial insights and analytics
export const useFinancialInsights = () => {
  const [insights, setInsights] = useState({
    totalRevenue: 0,
    averageRevenue: 0,
    medianRevenue: 0,
    averageScore: 0,
    totalCompanies: 0,
    scoreBreakdown: {
      revenue: 0,
      threeYear: 0,
      netProfit: 0,
      investCapacity: 0,
    },
    revenueRanges: {
      mega: 0, // >$10B
      large: 0, // $1B-$10B
      medium: 0, // $100M-$1B
      small: 0, // <$100M
    },
    topPerformers: [] as FinancialData[],
    investmentReady: [] as FinancialData[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("company_financial")
        .select("*")
        .not("finance_score", "is", null)
        .order("finance_score", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const validRevenues = data.filter((item) => item.annual_revenue && item.annual_revenue > 0);

        const totalRevenue = validRevenues.reduce(
          (sum, item) => sum + (item.annual_revenue || 0),
          0,
        );
        const averageRevenue = totalRevenue / validRevenues.length;
        const revenues = validRevenues
          .map((item) => item.annual_revenue || 0)
          .sort((a, b) => a - b);
        const medianRevenue = revenues[Math.floor(revenues.length / 2)] || 0;

        const averageScore =
          data.reduce((sum, item) => sum + (item.finance_score || 0), 0) / totalCompanies;

        const scoreBreakdown = {
          revenue: data.reduce((sum, item) => sum + (item.revenue_score || 0), 0) / totalCompanies,
          threeYear: data.reduce((sum, item) => sum + (item["3Y_score"] || 0), 0) / totalCompanies,
          netProfit:
            data.reduce((sum, item) => sum + (item.netProfitScore || 0), 0) / totalCompanies,
          investCapacity:
            data.reduce((sum, item) => sum + (item.investCapacityScore || 0), 0) / totalCompanies,
        };

        const revenueRanges = {
          mega: validRevenues.filter((item) => (item.annual_revenue || 0) >= 10).length, // >$10B
          large: validRevenues.filter(
            (item) => (item.annual_revenue || 0) >= 1 && (item.annual_revenue || 0) < 10,
          ).length, // $1B-$10B
          medium: validRevenues.filter(
            (item) => (item.annual_revenue || 0) >= 0.1 && (item.annual_revenue || 0) < 1,
          ).length, // $100M-$1B
          small: validRevenues.filter((item) => (item.annual_revenue || 0) < 0.1).length, // <$100M
        };

        const topPerformers = data.slice(0, 10);
        const investmentReady = data
          .filter((item) => (item.investCapacityScore || 0) >= 75)
          .slice(0, 10);

        setInsights({
          totalRevenue,
          averageRevenue: Math.round(averageRevenue),
          medianRevenue: Math.round(medianRevenue),
          averageScore: Math.round(averageScore * 100) / 100,
          totalCompanies,
          scoreBreakdown: {
            revenue: Math.round(scoreBreakdown.revenue * 100) / 100,
            threeYear: Math.round(scoreBreakdown.threeYear * 100) / 100,
            netProfit: Math.round(scoreBreakdown.netProfit * 100) / 100,
            investCapacity: Math.round(scoreBreakdown.investCapacity * 100) / 100,
          },
          revenueRanges,
          topPerformers,
          investmentReady,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch financial insights";
      setError(errorMessage);
      console.error("Error fetching financial insights:", err);
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
