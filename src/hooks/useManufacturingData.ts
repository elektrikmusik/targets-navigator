import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type ManufacturingData = Database["public"]["Tables"]["companies_manufacturing"]["Row"];

interface UseManufacturingDataOptions {
  limit?: number;
  searchTerm?: string;
  minScore?: number;
  maxScore?: number;
  sortBy?: keyof ManufacturingData;
  sortOrder?: "asc" | "desc";
}

interface UseManufacturingDataReturn {
  data: ManufacturingData[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
  filterByScore: (min?: number, max?: number) => Promise<void>;
}

export const useManufacturingData = (
  options: UseManufacturingDataOptions = {},
): UseManufacturingDataReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    minScore,
    maxScore,
    sortBy = "manufacturing_score",
    sortOrder = "desc",
  } = options;

  const [data, setData] = useState<ManufacturingData[]>([]);
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
            .from("companies_manufacturing")
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
            query = query.gte("manufacturing_score", minScore);
          }
          if (maxScore !== undefined) {
            query = query.lte("manufacturing_score", maxScore);
          }

          return await query;
        });

        const { data: manufacturingData, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(manufacturingData || [])]);
        } else {
          setData(manufacturingData || []);
        }

        setTotalCount(count || 0);
        setHasMore((manufacturingData?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage =
          err instanceof Error ? err.message : "Failed to fetch manufacturing data";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching manufacturing data:", err);
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

// Hook for getting manufacturing data by company key
export const useCompanyManufacturingData = (key: number | null) => {
  const [data, setData] = useState<ManufacturingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: manufacturingData, error } = await supabase
        .from("companies_manufacturing")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(manufacturingData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch company manufacturing data";
      setError(errorMessage);
      console.error("Error fetching company manufacturing data:", err);
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

// Utility hook for manufacturing capability analysis
export const useManufacturingInsights = () => {
  const [insights, setInsights] = useState({
    averageScore: 0,
    totalCompanies: 0,
    capabilityBreakdown: {
      materials: 0,
      scale: 0,
      quality: 0,
      supplyChain: 0,
      rd: 0,
    },
    topPerformers: [] as ManufacturingData[],
    ratingDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("companies_manufacturing")
        .select("*")
        .not("manufacturing_score", "is", null)
        .order("manufacturing_score", { ascending: false });

      if (error) throw error;

      if (data) {
        const totalCompanies = data.length;
        const averageScore =
          data.reduce((sum, item) => sum + (item.manufacturing_score || 0), 0) / totalCompanies;

        const capabilityBreakdown = {
          materials:
            data.reduce((sum, item) => sum + (item.ManufacturingMaterialsScore || 0), 0) /
            totalCompanies,
          scale:
            data.reduce((sum, item) => sum + (item.ManufacturingScaleScore || 0), 0) /
            totalCompanies,
          quality:
            data.reduce((sum, item) => sum + (item.ManufacturingQualityScore || 0), 0) /
            totalCompanies,
          supplyChain:
            data.reduce((sum, item) => sum + (item.ManufacturingSupplyChainScore || 0), 0) /
            totalCompanies,
          rd:
            data.reduce((sum, item) => sum + (item.ManufacturingRDScore || 0), 0) / totalCompanies,
        };

        const topPerformers = data.slice(0, 10);

        const ratingDistribution = {
          excellent: data.filter((item) => (item.manufacturing_score || 0) >= 80).length,
          good: data.filter(
            (item) => (item.manufacturing_score || 0) >= 60 && (item.manufacturing_score || 0) < 80,
          ).length,
          fair: data.filter(
            (item) => (item.manufacturing_score || 0) >= 40 && (item.manufacturing_score || 0) < 60,
          ).length,
          poor: data.filter((item) => (item.manufacturing_score || 0) < 40).length,
        };

        setInsights({
          averageScore: Math.round(averageScore * 100) / 100,
          totalCompanies,
          capabilityBreakdown: {
            materials: Math.round(capabilityBreakdown.materials * 100) / 100,
            scale: Math.round(capabilityBreakdown.scale * 100) / 100,
            quality: Math.round(capabilityBreakdown.quality * 100) / 100,
            supplyChain: Math.round(capabilityBreakdown.supplyChain * 100) / 100,
            rd: Math.round(capabilityBreakdown.rd * 100) / 100,
          },
          topPerformers,
          ratingDistribution,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch manufacturing insights";
      setError(errorMessage);
      console.error("Error fetching manufacturing insights:", err);
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
