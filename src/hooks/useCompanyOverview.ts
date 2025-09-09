import { useState, useEffect, useCallback, useRef } from "react";
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

  // Use refs to store the latest options to prevent infinite loops
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Remove this unused destructuring since we now use optionsRef.current directly in functions

  // Memoized fetch function to prevent recreation
  const fetchData = useCallback(async (page = 0, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const {
        searchTerm: currentSearchTerm = "",
        filterBy: currentFilterBy = {},
        sortBy: currentSortBy = "overallScore",
        sortOrder: currentSortOrder = "desc",
        limit: currentLimit = 500,
      } = optionsRef.current;

      let query = supabase.from("company_overview").select("*", { count: "exact" });

      // Apply search filter
      if (currentSearchTerm.trim()) {
        query = query.or(
          `englishName.ilike.%${currentSearchTerm}%,companyName.ilike.%${currentSearchTerm}%`,
        );
      }

      // Apply filters
      if (currentFilterBy.country) {
        query = query.eq("country", currentFilterBy.country);
      }
      if (currentFilterBy.ceres_region) {
        query = query.eq("ceres_region", currentFilterBy.ceres_region);
      }
      if (currentFilterBy.company_state) {
        query = query.eq("company_state", currentFilterBy.company_state);
      }
      if (currentFilterBy.tier) {
        query = query.eq("Tier", currentFilterBy.tier);
      }
      if (currentFilterBy.minOverallScore !== undefined) {
        query = query.gte("overallScore", currentFilterBy.minOverallScore);
      }
      if (currentFilterBy.maxOverallScore !== undefined) {
        query = query.lte("overallScore", currentFilterBy.maxOverallScore);
      }
      if (currentFilterBy.minStrategicFit !== undefined) {
        query = query.gte("strategicFit", currentFilterBy.minStrategicFit);
      }
      if (currentFilterBy.maxStrategicFit !== undefined) {
        query = query.lte("strategicFit", currentFilterBy.maxStrategicFit);
      }
      if (currentFilterBy.minAbilityToExecute !== undefined) {
        query = query.gte("abilityToExecute", currentFilterBy.minAbilityToExecute);
      }
      if (currentFilterBy.maxAbilityToExecute !== undefined) {
        query = query.lte("abilityToExecute", currentFilterBy.maxAbilityToExecute);
      }

      // Apply sorting
      query = query.order(currentSortBy, { ascending: currentSortOrder === "asc" });

      // Apply pagination only if limit is reasonable
      if (currentLimit < 1000) {
        const offset = page * currentLimit;
        query = query.range(offset, offset + currentLimit - 1);
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
      setHasMore(currentLimit < 1000 && newData.length === currentLimit);

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
  }, []); // Empty dependency array since we use optionsRef.current inside

  const fetchFilterOptions = async () => {
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
  };

  const fetchMore = async () => {
    if (!hasMore || loading) return;
    await fetchData(currentPage + 1, true);
  };

  const refresh = async () => {
    await fetchData(0, false);
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        searchTerm: currentSearchTerm = "",
        filterBy: currentFilterBy = {},
        sortBy: currentSortBy = "overallScore",
        sortOrder: currentSortOrder = "desc",
      } = optionsRef.current;

      let query = supabase.from("company_overview").select("*", { count: "exact" });

      // Apply search filter
      if (currentSearchTerm.trim()) {
        query = query.or(
          `englishName.ilike.%${currentSearchTerm}%,companyName.ilike.%${currentSearchTerm}%`,
        );
      }

      // Apply filters
      if (currentFilterBy.country) {
        query = query.eq("country", currentFilterBy.country);
      }
      if (currentFilterBy.ceres_region) {
        query = query.eq("ceres_region", currentFilterBy.ceres_region);
      }
      if (currentFilterBy.company_state) {
        query = query.eq("company_state", currentFilterBy.company_state);
      }
      if (currentFilterBy.tier) {
        query = query.eq("Tier", currentFilterBy.tier);
      }
      if (currentFilterBy.minOverallScore !== undefined) {
        query = query.gte("overallScore", currentFilterBy.minOverallScore);
      }
      if (currentFilterBy.maxOverallScore !== undefined) {
        query = query.lte("overallScore", currentFilterBy.maxOverallScore);
      }
      if (currentFilterBy.minStrategicFit !== undefined) {
        query = query.gte("strategicFit", currentFilterBy.minStrategicFit);
      }
      if (currentFilterBy.maxStrategicFit !== undefined) {
        query = query.lte("strategicFit", currentFilterBy.maxStrategicFit);
      }
      if (currentFilterBy.minAbilityToExecute !== undefined) {
        query = query.gte("abilityToExecute", currentFilterBy.minAbilityToExecute);
      }
      if (currentFilterBy.maxAbilityToExecute !== undefined) {
        query = query.lte("abilityToExecute", currentFilterBy.maxAbilityToExecute);
      }

      // Apply sorting
      query = query.order(currentSortBy, { ascending: currentSortOrder === "asc" });

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
  };

  // Initial data fetch - only run once on mount
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const {
          searchTerm: currentSearchTerm = "",
          filterBy: currentFilterBy = {},
          sortBy: currentSortBy = "overallScore",
          sortOrder: currentSortOrder = "desc",
          limit: currentLimit = 500,
        } = optionsRef.current;

        let query = supabase.from("company_overview").select("*", { count: "exact" });

        // Apply search filter
        if (currentSearchTerm.trim()) {
          query = query.or(
            `englishName.ilike.%${currentSearchTerm}%,companyName.ilike.%${currentSearchTerm}%`,
          );
        }

        // Apply filters
        if (currentFilterBy.country) {
          query = query.eq("country", currentFilterBy.country);
        }
        if (currentFilterBy.ceres_region) {
          query = query.eq("ceres_region", currentFilterBy.ceres_region);
        }
        if (currentFilterBy.company_state) {
          query = query.eq("company_state", currentFilterBy.company_state);
        }
        if (currentFilterBy.tier) {
          query = query.eq("Tier", currentFilterBy.tier);
        }
        if (currentFilterBy.minOverallScore !== undefined) {
          query = query.gte("overallScore", currentFilterBy.minOverallScore);
        }
        if (currentFilterBy.maxOverallScore !== undefined) {
          query = query.lte("overallScore", currentFilterBy.maxOverallScore);
        }
        if (currentFilterBy.minStrategicFit !== undefined) {
          query = query.gte("strategicFit", currentFilterBy.minStrategicFit);
        }
        if (currentFilterBy.maxStrategicFit !== undefined) {
          query = query.lte("strategicFit", currentFilterBy.maxStrategicFit);
        }
        if (currentFilterBy.minAbilityToExecute !== undefined) {
          query = query.gte("abilityToExecute", currentFilterBy.minAbilityToExecute);
        }
        if (currentFilterBy.maxAbilityToExecute !== undefined) {
          query = query.lte("abilityToExecute", currentFilterBy.maxAbilityToExecute);
        }

        // Apply sorting
        query = query.order(currentSortBy, { ascending: currentSortOrder === "asc" });

        // Apply pagination only if limit is reasonable
        if (currentLimit < 1000) {
          query = query.range(0, currentLimit - 1);
        }

        const result = await query;
        const { data: resultData, error, count } = result;

        if (!isMounted) return;

        if (error) {
          if (isTimeoutError(error)) {
            throw new Error("Request timed out. Please try again.");
          }
          throw error;
        }

        const newData = resultData || [];
        setTotalCount(count || 0);
        setHasMore(currentLimit < 1000 && newData.length === currentLimit);
        setData(newData);
        setCurrentPage(0);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching company overview data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    fetchFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once

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
