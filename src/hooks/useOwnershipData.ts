import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type OwnershipData = Database["public"]["Tables"]["companies_ownership"]["Row"];

interface UseOwnershipDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  sortBy?: keyof OwnershipData;
  sortOrder?: "asc" | "desc";
}

interface UseOwnershipDataReturn {
  data: OwnershipData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
}

export const useOwnershipData = (options: UseOwnershipDataOptions = {}): UseOwnershipDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    sortBy = "OwnershipScore",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<OwnershipData[]>([]);
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
            .from("companies_ownership")
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
            query = query.gte("OwnershipScore", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("OwnershipScore", maxScore);
          }

          return await query;
        });

        const { data: ownershipData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(ownershipData || [])]);
        } else {
          setData(ownershipData || []);
        }

        setTotalCount(count || 0);
        setHasMore((ownershipData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch ownership data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching ownership data:", err);
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

// Hook for getting ownership data by company key
export const useCompanyOwnershipData = (key: number | null) => {
  const [data, setData] = useState<OwnershipData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: ownershipData, error } = await supabase
        .from("companies_ownership")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(ownershipData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch company ownership data";
      setError(errorMessage);
      console.error("Error fetching company ownership data:", err);
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

// Utility hook for ownership structure insights
export const useOwnershipInsights = () => {
  const [insights, setInsights] = useState({
    averageScore: 0,
    totalCompanies: 0,
    dimensionBreakdown: {
      ownershipType: 0,
      decisionMaking: 0,
      alignment: 0,
      partnerships: 0,
    },
    ratingDistribution: {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
    },
    topGovernance: [] as OwnershipData[],
    strongPartnerships: [] as OwnershipData[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("companies_ownership")
        .select("*")
        .not("OwnershipScore", "is", null)
        .order("OwnershipScore", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const averageScore =
          data.reduce((sum, item) => sum + (item.OwnershipScore || 0), 0) / totalCompanies;

        const dimensionBreakdown = {
          ownershipType:
            data.reduce((sum, item) => sum + (item.OwnershipTypeScore || 0), 0) / totalCompanies,
          decisionMaking:
            data.reduce((sum, item) => sum + (item.OwnershipDecisionMakingScore || 0), 0) /
            totalCompanies,
          alignment:
            data.reduce((sum, item) => sum + (item.OwnershipAlignmentScore || 0), 0) /
            totalCompanies,
          partnerships:
            data.reduce((sum, item) => sum + (item.OwnershipPartnershipsScore || 0), 0) /
            totalCompanies,
        };

        const ratingDistribution = {
          excellent: data.filter((item) => (item.OwnershipScore || 0) >= 80).length,
          good: data.filter(
            (item) => (item.OwnershipScore || 0) >= 60 && (item.OwnershipScore || 0) < 80,
          ).length,
          fair: data.filter(
            (item) => (item.OwnershipScore || 0) >= 40 && (item.OwnershipScore || 0) < 60,
          ).length,
          poor: data.filter((item) => (item.OwnershipScore || 0) < 40).length,
        };

        const topGovernance = [...data]
          .sort(
            (a, b) => (b.OwnershipDecisionMakingScore || 0) - (a.OwnershipDecisionMakingScore || 0),
          )
          .slice(0, 5);

        const strongPartnerships = [...data]
          .sort((a, b) => (b.OwnershipPartnershipsScore || 0) - (a.OwnershipPartnershipsScore || 0))
          .slice(0, 5);

        setInsights({
          averageScore: Math.round(averageScore * 100) / 100,
          totalCompanies,
          dimensionBreakdown: {
            ownershipType: Math.round(dimensionBreakdown.ownershipType * 100) / 100,
            decisionMaking: Math.round(dimensionBreakdown.decisionMaking * 100) / 100,
            alignment: Math.round(dimensionBreakdown.alignment * 100) / 100,
            partnerships: Math.round(dimensionBreakdown.partnerships * 100) / 100,
          },
          ratingDistribution,
          topGovernance,
          strongPartnerships,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch ownership insights";
      setError(errorMessage);
      console.error("Error fetching ownership insights:", err);
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
