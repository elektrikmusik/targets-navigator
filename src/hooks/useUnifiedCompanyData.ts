import { useState, useEffect, useCallback } from "react";
import { supabase, Database } from "@/lib/supabase";
import { retryWithBackoff, isTimeoutError } from "@/lib/retryUtils";

// Types from individual tables
type CompanyProfile = Database["public"]["Tables"]["companies_profile"]["Row"];
type HydrogenData = Database["public"]["Tables"]["companies_hydrogen"]["Row"];
type IndustryData = Database["public"]["Tables"]["companies_industry"]["Row"];
type ManufacturingData = Database["public"]["Tables"]["companies_manufacturing"]["Row"];
type FinancialData = Database["public"]["Tables"]["company_financial"]["Row"];
type OwnershipData = Database["public"]["Tables"]["companies_ownership"]["Row"];
type IPData = Database["public"]["Tables"]["companies_ip"]["Row"];

// Unified company data interface
export interface UnifiedCompanyData {
  key: number;
  profile: CompanyProfile;
  hydrogen: HydrogenData | null;
  industry: IndustryData | null;
  manufacturing: ManufacturingData | null;
  financial: FinancialData | null;
  ownership: OwnershipData | null;
  ip: IPData | null;
  overallScores: {
    hydrogen: number | null;
    industry: number | null;
    manufacturing: number | null;
    financial: number | null;
    ownership: number | null;
    ip: number | null;
    average: number | null;
  };
}

// Dashboard summary interface
export interface CompanyDashboardSummary {
  key: number;
  englishName: string | null;
  companyName: string | null;
  scores: {
    hydrogen: number | null;
    industry: number | null;
    manufacturing: number | null;
    financial: number | null;
    ownership: number | null;
    ip: number | null;
    average: number | null;
  };
  financialMetrics: {
    annualRevenue: number | null;
    investmentCapacity: number | null;
  };
  overallRating: string;
}

// Options for unified data fetching
interface UseUnifiedCompanyDataOptions {
  limit?: number;
  includeHydrogen?: boolean;
  includeIndustry?: boolean;
  includeManufacturing?: boolean;
  includeFinancial?: boolean;
  includeOwnership?: boolean;
  includeIP?: boolean;
  minOverallScore?: number;
  searchTerm?: string;
}

export const useUnifiedCompanyData = (options: UseUnifiedCompanyDataOptions = {}) => {
  const {
    limit = 100, // Set reasonable default to prevent timeouts
    includeHydrogen = true,
    includeIndustry = true,
    includeManufacturing = true,
    includeFinancial = true,
    includeOwnership = true,
    includeIP = true,
    minOverallScore,
    searchTerm = "",
  } = options;

  const [data, setData] = useState<UnifiedCompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUnifiedData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use retry logic for database queries
      const profileResult = await retryWithBackoff(async () => {
        // First, get all company profiles
        let profileQuery = supabase
          .from("companies_profile")
          .select("*", { count: "exact" })
          .order("englishName", { ascending: true });

        // Apply limit (always use limit now)
        profileQuery = profileQuery.limit(limit);

        if (searchTerm.trim()) {
          profileQuery = profileQuery.or(
            `englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`,
          );
        }

        return await profileQuery;
      });

      const { data: profiles, error: profileError, count } = profileResult;
      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) {
        setData([]);
        setTotalCount(0);
        return;
      }

      setTotalCount(count || 0);
      const companyKeys = profiles.map((p) => p.key).filter(Boolean) as number[];

      // Fetch data from all evaluation tables in parallel with retry logic
      const fetchPromises = [];

      if (includeHydrogen) {
        fetchPromises.push(
          retryWithBackoff(() =>
            supabase.from("companies_hydrogen").select("*").in("key", companyKeys),
          ),
        );
      }

      if (includeIndustry) {
        fetchPromises.push(
          retryWithBackoff(() =>
            supabase.from("companies_industry").select("*").in("key", companyKeys),
          ),
        );
      }

      if (includeManufacturing) {
        fetchPromises.push(
          retryWithBackoff(() =>
            supabase.from("companies_manufacturing").select("*").in("key", companyKeys),
          ),
        );
      }

      if (includeFinancial) {
        fetchPromises.push(
          retryWithBackoff(() =>
            supabase.from("company_financial").select("*").in("key", companyKeys),
          ),
        );
      }

      if (includeOwnership) {
        fetchPromises.push(
          retryWithBackoff(() =>
            supabase.from("companies_ownership").select("*").in("key", companyKeys),
          ),
        );
      }

      if (includeIP) {
        fetchPromises.push(
          retryWithBackoff(() => supabase.from("companies_ip").select("*").in("key", companyKeys)),
        );
      }

      const results = await Promise.all(fetchPromises);

      // Check for errors in any of the fetches
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        throw new Error(
          `Failed to fetch some data: ${errors.map((e) => e.error?.message).join(", ")}`,
        );
      }

      // Extract data arrays
      let resultIndex = 0;
      const hydrogenData = includeHydrogen ? results[resultIndex++]?.data || [] : [];
      const industryData = includeIndustry ? results[resultIndex++]?.data || [] : [];
      const manufacturingData = includeManufacturing ? results[resultIndex++]?.data || [] : [];
      const financialData = includeFinancial ? results[resultIndex++]?.data || [] : [];
      const ownershipData = includeOwnership ? results[resultIndex++]?.data || [] : [];
      const ipData = includeIP ? results[resultIndex++]?.data || [] : [];

      // Create lookup maps for efficient joining
      const hydrogenMap = new Map(hydrogenData.map((item: HydrogenData) => [item.key, item]));
      const industryMap = new Map(industryData.map((item: IndustryData) => [item.key, item]));
      const manufacturingMap = new Map(
        manufacturingData.map((item: ManufacturingData) => [item.key, item]),
      );
      const financialMap = new Map(financialData.map((item: FinancialData) => [item.key, item]));
      const ownershipMap = new Map(ownershipData.map((item: OwnershipData) => [item.key, item]));
      const ipMap = new Map(ipData.map((item: IPData) => [item.key, item]));

      // Join all data
      const unifiedData: UnifiedCompanyData[] = profiles
        .filter((profile) => profile.key) // Only include profiles with valid keys
        .map((profile) => {
          const key = profile.key!;
          const hydrogen = hydrogenMap.get(key) || null;
          const industry = industryMap.get(key) || null;
          const manufacturing = manufacturingMap.get(key) || null;
          const financial = financialMap.get(key) || null;
          const ownership = ownershipMap.get(key) || null;
          const ip = ipMap.get(key) || null;

          // Calculate overall scores
          const scores = {
            hydrogen: hydrogen?.H2Score || null,
            industry: industry?.industry_score || null,
            manufacturing: manufacturing?.manufacturing_score || null,
            financial: financial?.finance_score || null,
            ownership: ownership?.OwnershipScore || null,
            ip: ip?.IPActivityScore || null,
            average: null as number | null,
          };

          // Calculate average score
          const validScores = Object.values(scores).filter((score) => score !== null) as number[];
          if (validScores.length > 0) {
            scores.average =
              Math.round(
                (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) * 100,
              ) / 100;
          }

          return {
            key,
            profile,
            hydrogen,
            industry,
            manufacturing,
            financial,
            ownership,
            ip,
            overallScores: scores,
          };
        });

      // Apply overall score filter if specified
      const filteredData =
        minOverallScore !== undefined
          ? unifiedData.filter((company) => (company.overallScores.average || 0) >= minOverallScore)
          : unifiedData;

      setData(filteredData);
    } catch (err) {
      let errorMessage =
        err instanceof Error ? err.message : "Failed to fetch unified company data";

      // Provide more helpful error messages for timeouts
      if (isTimeoutError(err)) {
        errorMessage =
          "Query timed out. The database query took too long to complete. Try reducing the data range or refreshing.";
      }

      setError(errorMessage);
      console.error("Error fetching unified company data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    limit,
    includeHydrogen,
    includeIndustry,
    includeManufacturing,
    includeFinancial,
    includeOwnership,
    includeIP,
    minOverallScore,
    searchTerm,
  ]);

  useEffect(() => {
    fetchUnifiedData();
  }, [fetchUnifiedData]);

  return {
    data,
    loading,
    error,
    totalCount,
    refresh: fetchUnifiedData,
  };
};

// Hook for dashboard summary data
export const useCompanyDashboardData = (limit = 100) => {
  const { data: unifiedData, loading, error, refresh } = useUnifiedCompanyData({ limit });

  const [dashboardData, setDashboardData] = useState<CompanyDashboardSummary[]>([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    averageScores: {
      hydrogen: 0,
      industry: 0,
      manufacturing: 0,
      financial: 0,
      ownership: 0,
      ip: 0,
      overall: 0,
    },
    topPerformers: [] as CompanyDashboardSummary[],
  });

  useEffect(() => {
    if (unifiedData && unifiedData.length > 0) {
      // Transform to dashboard summary format
      const transformed: CompanyDashboardSummary[] = unifiedData.map((company) => ({
        key: company.key,
        englishName: company.profile.englishName,
        companyName: company.profile.companyName,
        scores: company.overallScores,
        financialMetrics: {
          annualRevenue: company.financial?.annual_revenue || null,
          investmentCapacity: company.financial?.investCapacityScore || null,
        },
        overallRating: determineOverallRating(company.overallScores.average),
      }));

      // Calculate statistics
      const totalCompanies = transformed.length;
      const validScores = {
        hydrogen: transformed.filter((c) => c.scores.hydrogen !== null),
        industry: transformed.filter((c) => c.scores.industry !== null),
        manufacturing: transformed.filter((c) => c.scores.manufacturing !== null),
        financial: transformed.filter((c) => c.scores.financial !== null),
        ownership: transformed.filter((c) => c.scores.ownership !== null),
        ip: transformed.filter((c) => c.scores.ip !== null),
        overall: transformed.filter((c) => c.scores.average !== null),
      };

      const averageScores = {
        hydrogen:
          validScores.hydrogen.length > 0
            ? validScores.hydrogen.reduce((sum, c) => sum + (c.scores.hydrogen || 0), 0) /
              validScores.hydrogen.length
            : 0,
        industry:
          validScores.industry.length > 0
            ? validScores.industry.reduce((sum, c) => sum + (c.scores.industry || 0), 0) /
              validScores.industry.length
            : 0,
        manufacturing:
          validScores.manufacturing.length > 0
            ? validScores.manufacturing.reduce((sum, c) => sum + (c.scores.manufacturing || 0), 0) /
              validScores.manufacturing.length
            : 0,
        financial:
          validScores.financial.length > 0
            ? validScores.financial.reduce((sum, c) => sum + (c.scores.financial || 0), 0) /
              validScores.financial.length
            : 0,
        ownership:
          validScores.ownership.length > 0
            ? validScores.ownership.reduce((sum, c) => sum + (c.scores.ownership || 0), 0) /
              validScores.ownership.length
            : 0,
        ip:
          validScores.ip.length > 0
            ? validScores.ip.reduce((sum, c) => sum + (c.scores.ip || 0), 0) / validScores.ip.length
            : 0,
        overall:
          validScores.overall.length > 0
            ? validScores.overall.reduce((sum, c) => sum + (c.scores.average || 0), 0) /
              validScores.overall.length
            : 0,
      };

      const topPerformers = [...transformed]
        .sort((a, b) => (b.scores.average || 0) - (a.scores.average || 0))
        .slice(0, 10);

      setDashboardData(transformed);
      setStats({
        totalCompanies,
        averageScores: {
          hydrogen: Math.round(averageScores.hydrogen * 100) / 100,
          industry: Math.round(averageScores.industry * 100) / 100,
          manufacturing: Math.round(averageScores.manufacturing * 100) / 100,
          financial: Math.round(averageScores.financial * 100) / 100,
          ownership: Math.round(averageScores.ownership * 100) / 100,
          ip: Math.round(averageScores.ip * 100) / 100,
          overall: Math.round(averageScores.overall * 100) / 100,
        },
        topPerformers,
      });
    }
  }, [unifiedData]);

  return {
    data: dashboardData,
    loading,
    error,
    stats,
    refresh,
  };
};

// Utility function to determine overall rating
function determineOverallRating(averageScore: number | null): string {
  if (!averageScore) return "Not Rated";
  if (averageScore >= 85) return "Excellent";
  if (averageScore >= 70) return "Good";
  if (averageScore >= 55) return "Fair";
  return "Poor";
}

// Hook for getting a single company's complete data
export const useSingleCompanyData = (key: number | null) => {
  const [data, setData] = useState<UnifiedCompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSingleCompany = useCallback(async () => {
    if (!key) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch all data for a single company in parallel
      const [
        profileRes,
        hydrogenRes,
        industryRes,
        manufacturingRes,
        financialRes,
        ownershipRes,
        ipRes,
      ] = await Promise.all([
        supabase.from("companies_profile").select("*").eq("key", key).single(),
        supabase.from("companies_hydrogen").select("*").eq("key", key).single(),
        supabase.from("companies_industry").select("*").eq("key", key).single(),
        supabase.from("companies_manufacturing").select("*").eq("key", key).single(),
        supabase.from("company_financial").select("*").eq("key", key).single(),
        supabase.from("companies_ownership").select("*").eq("key", key).single(),
        supabase.from("companies_ip").select("*").eq("key", key).single(),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (!profileRes.data) throw new Error("Company profile not found");

      const profile = profileRes.data;
      const hydrogen = hydrogenRes.data;
      const industry = industryRes.data;
      const manufacturing = manufacturingRes.data;
      const financial = financialRes.data;
      const ownership = ownershipRes.data;
      const ip = ipRes.data;

      // Calculate overall scores
      const scores = {
        hydrogen: hydrogen?.H2Score || null,
        industry: industry?.industry_score || null,
        manufacturing: manufacturing?.manufacturing_score || null,
        financial: financial?.finance_score || null,
        ownership: ownership?.OwnershipScore || null,
        ip: ip?.IPActivityScore || null,
        average: null as number | null,
      };

      // Calculate average score
      const validScores = Object.values(scores).filter((score) => score !== null) as number[];
      if (validScores.length > 0) {
        scores.average =
          Math.round(
            (validScores.reduce((sum, score) => sum + score, 0) / validScores.length) * 100,
          ) / 100;
      }

      setData({
        key,
        profile,
        hydrogen,
        industry,
        manufacturing,
        financial,
        ownership,
        ip,
        overallScores: scores,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch company data";
      setError(errorMessage);
      console.error("Error fetching single company data:", err);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    if (key) {
      fetchSingleCompany();
    }
  }, [fetchSingleCompany, key]);

  return {
    data,
    loading,
    error,
    refresh: fetchSingleCompany,
  };
};
