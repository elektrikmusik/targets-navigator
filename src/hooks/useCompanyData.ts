import { useState, useEffect } from "react";
import { supabase, CompanyProfile, CompanyScores, CompanyDetails } from "@/lib/supabase";

export const useCompanyData = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("companies_profile")
        .select(
          `
          id,
          englishName,
          companyName,
          key,
          basicInformation,
          productServices,
          marketPosition
        `,
        )
        .order("englishName", { ascending: true })
        .limit(limit);

      if (error) throw error;
      setCompanies(data || []);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async (key: number): Promise<CompanyDetails | null> => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from("companies_profile")
        .select("*")
        .eq("key", key)
        .single();

      if (!profile) return null;

      // Fetch all related data in parallel
      const [hydrogenRes, industryRes, manufacturingRes, financialRes, ownershipRes, ipRes] =
        await Promise.all([
          supabase.from("companies_hydrogen").select("*").eq("key", key).single(),
          supabase.from("companies_industry").select("*").eq("key", key).single(),
          supabase.from("companies_manufacturing").select("*").eq("key", key).single(),
          supabase.from("company_financial").select("*").eq("key", key).single(),
          supabase.from("companies_ownership").select("*").eq("key", key).single(),
          supabase.from("companies_ip").select("*").eq("key", key).single(),
        ]);

      return {
        ...profile,
        hydrogen: hydrogenRes.data,
        industry: industryRes.data,
        manufacturing: manufacturingRes.data,
        financial: financialRes.data,
        ownership: ownershipRes.data,
        ip: ipRes.data,
      };
    } catch (error: unknown) {
      console.error("Error fetching company details:", error);
      return null;
    }
  };

  const fetchCompanyScores = async (limit = 100): Promise<CompanyScores[]> => {
    try {
      // Get all companies with their scores from different tables
      const { data: profiles } = await supabase
        .from("companies_profile")
        .select("key, englishName, companyName")
        .order("englishName", { ascending: true })
        .limit(limit);

      if (!profiles) return [];

      const scores: CompanyScores[] = [];

      for (const profile of profiles) {
        if (!profile.key) continue;

        // Fetch scores from all evaluation tables
        const [hydrogenRes, industryRes, manufacturingRes, financialRes, ownershipRes, ipRes] =
          await Promise.all([
            supabase.from("companies_hydrogen").select("H2Score").eq("key", profile.key).single(),
            supabase
              .from("companies_industry")
              .select("industry_score")
              .eq("key", profile.key)
              .single(),
            supabase
              .from("companies_manufacturing")
              .select("manufacturing_score")
              .eq("key", profile.key)
              .single(),
            supabase
              .from("company_financial")
              .select("finance_score")
              .eq("key", profile.key)
              .single(),
            supabase
              .from("companies_ownership")
              .select("OwnershipScore")
              .eq("key", profile.key)
              .single(),
            supabase.from("companies_ip").select("IPActivityScore").eq("key", profile.key).single(),
          ]);

        scores.push({
          key: profile.key,
          companyName: profile.companyName,
          englishName: profile.englishName,
          hydrogen_score: hydrogenRes.data?.H2Score || null,
          industry_score: industryRes.data?.industry_score || null,
          manufacturing_score: manufacturingRes.data?.manufacturing_score || null,
          finance_score: financialRes.data?.finance_score || null,
          ownership_score: ownershipRes.data?.OwnershipScore || null,
          ip_activity_score: ipRes.data?.IPActivityScore || null,
        });
      }

      return scores;
    } catch (error: unknown) {
      console.error("Error fetching company scores:", error);
      return [];
    }
  };

  const searchCompanies = async (searchTerm: string, limit = 20): Promise<CompanyProfile[]> => {
    if (!searchTerm.trim()) {
      await fetchCompanies(limit);
      return companies;
    }

    try {
      const { data, error } = await supabase
        .from("companies_profile")
        .select(
          `
          id,
          englishName,
          companyName,
          key,
          basicInformation,
          productServices,
          marketPosition
        `,
        )
        .or(`englishName.ilike.%${searchTerm}%,companyName.ilike.%${searchTerm}%`)
        .order("englishName", { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error: unknown) {
      console.error("Error searching companies:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    fetchCompanyDetails,
    fetchCompanyScores,
    searchCompanies,
  };
};
