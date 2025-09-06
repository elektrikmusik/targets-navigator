import { useState, useEffect, useCallback } from "react";
import { supabase, CompanyOverview } from "@/lib/supabase";
import { isTimeoutError } from "@/lib/retryUtils";

interface UseCompanyOverviewOptions {
  limit?: number;
  searchTerm?: string;
  sortBy?: keyof CompanyOverview;
  sortOrder?: "asc" | "desc";
  filterBy?: {
    country?: string;
    ceres_region?: string;
    company_state?: string;
    tier?: string;
    minOverallScore?: number;
    maxOverallScore?: number;
    minStrategicFit?: number;
    maxStrategicFit?: number;
    minAbilityToExecute?: number;
    maxAbilityToExecute?: number;
  };
}

interface UseCompanyOverviewReturn {
  data: CompanyOverview[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  loadAll: () => Promise<void>;
  filterOptions: {
    countries: string[];
    ceresRegions: string[];
    tiers: string[];
    companyStates: string[];
  };
}

export const useCompanyOverview = (
  options: UseCompanyOverviewOptions = {},
): UseCompanyOverviewReturn => {
  const [data, setData] = useState<CompanyOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    countries: [] as string[],
    ceresRegions: [] as string[],
    tiers: [] as string[],
    companyStates: [] as string[],
  });

  const {
    limit = 500, // Default to load all companies
    searchTerm = "",
    sortBy = "overallScore",
    sortOrder = "desc",
    filterBy = {},
  } = options;

  // Fetch filter options from database
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [countriesResult, ceresRegionsResult, tiersResult, companyStatesResult] =
        await Promise.all([
          supabase.from("company_overview").select("country").not("country", "is", null),
          supabase.from("company_overview").select("ceres_region").not("ceres_region", "is", null),
          supabase.from("company_overview").select("Tier").not("Tier", "is", null),
          supabase
            .from("company_overview")
            .select("company_state")
            .not("company_state", "is", null),
        ]);

      const countries = [
        ...new Set(countriesResult.data?.map((item) => item.country).filter(Boolean) || []),
      ].sort();
      const ceresRegions = [
        ...new Set(ceresRegionsResult.data?.map((item) => item.ceres_region).filter(Boolean) || []),
      ].sort();
      const tiers = [
        ...new Set(tiersResult.data?.map((item) => item.Tier).filter(Boolean) || []),
      ].sort();
      const companyStates = [
        ...new Set(
          companyStatesResult.data?.map((item) => item.company_state).filter(Boolean) || [],
        ),
      ].sort();

      setFilterOptions({
        countries,
        ceresRegions,
        tiers,
        companyStates,
      });
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  }, []);

  const fetchData = useCallback(
    async (page = 0, append = false) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("company_overview").select("*", { count: "exact" });

        // Apply search filter
        if (searchTerm.trim()) {
          query = query.or(`englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`);
        }

        // Apply filters
        if (filterBy.country) {
          query = query.eq("country", filterBy.country);
        }
        if (filterBy.ceres_region) {
          query = query.eq("ceres_region", filterBy.ceres_region);
        }
        if (filterBy.company_state) {
          query = query.eq("company_state", filterBy.company_state);
        }
        if (filterBy.tier) {
          query = query.eq("Tier", filterBy.tier);
        }
        if (filterBy.minOverallScore !== undefined) {
          query = query.gte("overallScore", filterBy.minOverallScore);
        }
        if (filterBy.maxOverallScore !== undefined) {
          query = query.lte("overallScore", filterBy.maxOverallScore);
        }
        if (filterBy.minStrategicFit !== undefined) {
          query = query.gte("strategicFit", filterBy.minStrategicFit);
        }
        if (filterBy.maxStrategicFit !== undefined) {
          query = query.lte("strategicFit", filterBy.maxStrategicFit);
        }
        if (filterBy.minAbilityToExecute !== undefined) {
          query = query.gte("abilityToExecute", filterBy.minAbilityToExecute);
        }
        if (filterBy.maxAbilityToExecute !== undefined) {
          query = query.lte("abilityToExecute", filterBy.maxAbilityToExecute);
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === "asc" });

        // Apply pagination only if limit is reasonable
        if (limit < 1000) {
          const offset = page * limit;
          query = query.range(offset, offset + limit - 1);
        }

        const result = await query;
        const { data: resultData, error, count } = result;

        if (error) {
          if (isTimeoutError(error)) {
            throw new Error("Request timed out. Please try again.");
          }
          throw error;
        }

        const newData = resultData || [];
        setTotalCount(count || 0);
        setHasMore(limit < 1000 && newData.length === limit);

        if (append) {
          setData((prev) => [...prev, ...newData]);
        } else {
          setData(newData);
        }
        setCurrentPage(page);
      } catch (err) {
        console.error("Error fetching company overview data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [limit, searchTerm, sortBy, sortOrder, filterBy],
  );

  const fetchMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await fetchData(currentPage + 1, true);
  }, [currentPage, fetchData, hasMore, loading]);

  const refresh = useCallback(async () => {
    await fetchData(0, false);
  }, [fetchData]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("company_overview").select("*", { count: "exact" });

      // Apply search filter
      if (searchTerm.trim()) {
        query = query.or(`englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`);
      }

      // Apply filters
      if (filterBy.country) {
        query = query.eq("country", filterBy.country);
      }
      if (filterBy.ceres_region) {
        query = query.eq("ceres_region", filterBy.ceres_region);
      }
      if (filterBy.company_state) {
        query = query.eq("company_state", filterBy.company_state);
      }
      if (filterBy.tier) {
        query = query.eq("Tier", filterBy.tier);
      }
      if (filterBy.minOverallScore !== undefined) {
        query = query.gte("overallScore", filterBy.minOverallScore);
      }
      if (filterBy.maxOverallScore !== undefined) {
        query = query.lte("overallScore", filterBy.maxOverallScore);
      }
      if (filterBy.minStrategicFit !== undefined) {
        query = query.gte("strategicFit", filterBy.minStrategicFit);
      }
      if (filterBy.maxStrategicFit !== undefined) {
        query = query.lte("strategicFit", filterBy.maxStrategicFit);
      }
      if (filterBy.minAbilityToExecute !== undefined) {
        query = query.gte("abilityToExecute", filterBy.minAbilityToExecute);
      }
      if (filterBy.maxAbilityToExecute !== undefined) {
        query = query.lte("abilityToExecute", filterBy.maxAbilityToExecute);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      const result = await query;
      const { data: resultData, error, count } = result;

      if (error) {
        if (isTimeoutError(error)) {
          throw new Error("Request timed out. Please try again.");
        }
        throw error;
      }

      const newData = resultData || [];
      setTotalCount(count || 0);
      setHasMore(false); // No more data to load
      setData(newData);
      setCurrentPage(0);
    } catch (err) {
      console.error("Error loading all company data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy, sortOrder, filterBy]);

  useEffect(() => {
    fetchData(0, false);
    fetchFilterOptions();
  }, [fetchData, fetchFilterOptions]);

  return {
    data,
    loading,
    error,
    totalCount,
    hasMore,
    fetchMore,
    refresh,
    loadAll,
    filterOptions,
  };
};

// Hook for fetching a single company
export const useSingleCompanyOverview = (key: number | null) => {
  const [data, setData] = useState<CompanyOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setData(null);
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await supabase.from("company_overview").select("*").eq("key", key).single();
        const { data: resultData, error } = result;

        if (error) {
          if (isTimeoutError(error)) {
            throw new Error("Request timed out. Please try again.");
          }
          throw error;
        }

        setData(resultData);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [key]);

  return { data, loading, error };
};
