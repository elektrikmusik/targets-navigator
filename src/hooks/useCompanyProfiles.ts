import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

type CompanyProfile = Database["public"]["Tables"]["companies_profile"]["Row"];

interface UseCompanyProfilesOptions {
  limit?: number;
  searchTerm?: string;
  sortBy?: keyof CompanyProfile;
  sortOrder?: "asc" | "desc";
}

interface UseCompanyProfilesReturn {
  data: CompanyProfile[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (term: string) => Promise<void>;
}

export const useCompanyProfiles = (
  options: UseCompanyProfilesOptions = {},
): UseCompanyProfilesReturn => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    searchTerm = "",
    sortBy = "englishName",
    sortOrder = "asc",
  } = options;

  const [data, setData] = useState<CompanyProfile[]>([]);
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
            .from("companies_profile")
            .select("*", { count: "exact" })
            .order(sortBy, { ascending: sortOrder === "asc" });

          // Apply pagination (always use limit now)
          query = query.range(page * limit, (page + 1) * limit - 1);

          // Apply search filter if provided
          if (searchTerm.trim()) {
            query = query.or(`englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`);
          }

          return await query;
        });

        const { data: profiles, error, count } = result;
        if (error) throw error;

        if (append) {
          setData((prev) => [...prev, ...(profiles || [])]);
        } else {
          setData(profiles || []);
        }

        setTotalCount(count || 0);
        setHasMore((profiles?.length || 0) === limit && (page + 1) * limit < (count || 0));
        setCurrentPage(page);
      } catch (err) {
        let errorMessage = err instanceof Error ? err.message : "Failed to fetch company profiles";

        // Provide more helpful error messages for timeouts
        if (isTimeoutError(err)) {
          errorMessage =
            "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
        }

        setError(errorMessage);
        console.error("Error fetching company profiles:", err);
      } finally {
        setLoading(false);
      }
    },
    [limit, searchTerm, sortBy, sortOrder],
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
    // The search will be handled by the fetchData function through searchTerm in options
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
  };
};

// Additional utility hook for getting a single company profile
export const useCompanyProfile = (key: number | null) => {
  const [data, setData] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      const { data: profile, error } = await supabase
        .from("companies_profile")
        .select("*")
        .eq("key", key)
        .single();

      if (error) throw error;
      setData(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch company profile";
      setError(errorMessage);
      console.error("Error fetching company profile:", err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (key) {
      fetchProfile();
    }
  }, [fetchProfile, key]);

  return {
    data,
    loading,
    error,
    refresh: fetchProfile,
  };
};
