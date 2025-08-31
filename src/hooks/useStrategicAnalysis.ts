import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface StrategicCompanyData {
  id: string;
  name: string;
  abilityToExecute: number;
  strategicFit: number;
  quadrant: string;
  scores: {
    hydrogen: number;
    industry: number;
    manufacturing: number;
    financial: number;
    ownership: number;
    ip: number;
  };
  key: number;
}

export interface CompanyScores {
  hydrogen: number;
  industry: number;
  manufacturing: number;
  financial: number;
  ownership: number;
  ip: number;
}

export interface StrategicAnalysisStats {
  totalCompanies: number;
  avgHydrogenScore: number;
  avgIndustryScore: number;
  avgManufacturingScore: number;
  avgFinancialScore: number;
  avgOwnershipScore: number;
  avgIPScore: number;
  topPerformer: string;
  topPerformerScore: number;
  highPerformersCount: number;
  priorityTargets: number;
  quadrantBreakdown: {
    "Monitor / Opportunistic": number;
    "Priority leads (Investigate now)": number;
    "Not a focus": number;
    "Nurture with Support": number;
  };
}

export const useStrategicAnalysis = () => {
  const [companies, setCompanies] = useState<StrategicCompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate Ability to Execute score based on IP, Revenue, Ownership
  const calculateAbilityToExecute = (scores: CompanyScores): number => {
    const ipScore = scores.ip || 0;
    const financialScore = scores.financial || 0;
    const ownershipScore = scores.ownership || 0;

    // Weighted calculation with bonus/demerit on IP and Revenue
    let score = ipScore * 0.4 + financialScore * 0.4 + ownershipScore * 0.2;

    // Bonus for high IP activity
    if (ipScore >= 7.0) score += 0.5;
    if (ipScore >= 8.0) score += 0.5;

    // Bonus for strong financial performance
    if (financialScore >= 7.0) score += 0.3;
    if (financialScore >= 8.0) score += 0.3;

    // Demerit for low IP activity
    if (ipScore <= 3.0) score -= 0.5;
    if (ipScore <= 2.0) score -= 0.5;

    // Demerit for poor financial performance
    if (financialScore <= 3.0) score -= 0.3;
    if (financialScore <= 2.0) score -= 0.3;

    return Math.max(0, Math.min(10, score));
  };

  // Calculate Strategic Fit score based on Industry, H2 strategy, Manufacturing
  const calculateStrategicFit = (scores: CompanyScores): number => {
    const industryScore = scores.industry || 0;
    const hydrogenScore = scores.hydrogen || 0;
    const manufacturingScore = scores.manufacturing || 0;

    // Weighted calculation with bonus/demerit on manufacturing capability
    let score = industryScore * 0.4 + hydrogenScore * 0.4 + manufacturingScore * 0.2;

    // Bonus for high industry alignment
    if (industryScore >= 7.0) score += 0.4;
    if (industryScore >= 8.0) score += 0.4;

    // Bonus for strong hydrogen focus
    if (hydrogenScore >= 7.0) score += 0.4;
    if (hydrogenScore >= 8.0) score += 0.4;

    // Bonus for manufacturing capability
    if (manufacturingScore >= 7.0) score += 0.2;
    if (manufacturingScore >= 8.0) score += 0.2;

    // Demerit for low manufacturing capability
    if (manufacturingScore <= 3.0) score -= 0.3;
    if (manufacturingScore <= 2.0) score -= 0.3;

    return Math.max(0, Math.min(10, score));
  };

  // Determine quadrant based on scores
  const determineQuadrant = (abilityToExecute: number, strategicFit: number): string => {
    if (abilityToExecute >= 7.0 && strategicFit >= 7.0) {
      return "Priority leads (Investigate now)";
    } else if (abilityToExecute >= 7.0 && strategicFit < 7.0) {
      return "Monitor / Opportunistic";
    } else if (abilityToExecute < 7.0 && strategicFit < 7.0) {
      return "Not a focus";
    } else {
      return "Nurture with Support";
    }
  };

  const fetchStrategicData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all companies with their scores
      const { data: profiles, error: profileError } = await supabase
        .from("companies_profile")
        .select("key, englishName, companyName")
        .order("englishName", { ascending: true });

      if (profileError) throw profileError;

      if (!profiles) {
        setCompanies([]);
        return;
      }

      const strategicCompanies: StrategicCompanyData[] = [];

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

        const scores = {
          hydrogen: hydrogenRes.data?.H2Score || 0,
          industry: industryRes.data?.industry_score || 0,
          manufacturing: manufacturingRes.data?.manufacturing_score || 0,
          financial: financialRes.data?.finance_score || 0,
          ownership: ownershipRes.data?.OwnershipScore || 0,
          ip: ipRes.data?.IPActivityScore || 0,
        };

        const abilityToExecute = calculateAbilityToExecute(scores);
        const strategicFit = calculateStrategicFit(scores);
        const quadrant = determineQuadrant(abilityToExecute, strategicFit);

        strategicCompanies.push({
          id: profile.key.toString(),
          name: profile.englishName || profile.companyName || "Unknown Company",
          abilityToExecute,
          strategicFit,
          quadrant,
          scores,
          key: profile.key,
        });
      }

      setCompanies(strategicCompanies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching strategic data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate comprehensive statistics
  const stats: StrategicAnalysisStats = useMemo(() => {
    if (companies.length === 0) {
      return {
        totalCompanies: 0,
        avgHydrogenScore: 0,
        avgIndustryScore: 0,
        avgManufacturingScore: 0,
        avgFinancialScore: 0,
        avgOwnershipScore: 0,
        avgIPScore: 0,
        topPerformer: "",
        topPerformerScore: 0,
        highPerformersCount: 0,
        priorityTargets: 0,
        quadrantBreakdown: {
          "Monitor / Opportunistic": 0,
          "Priority leads (Investigate now)": 0,
          "Not a focus": 0,
          "Nurture with Support": 0,
        },
      };
    }

    const totalCompanies = companies.length;

    // Calculate average scores
    const avgHydrogenScore =
      companies.reduce((sum, company) => sum + company.scores.hydrogen, 0) / totalCompanies;
    const avgIndustryScore =
      companies.reduce((sum, company) => sum + company.scores.industry, 0) / totalCompanies;
    const avgManufacturingScore =
      companies.reduce((sum, company) => sum + company.scores.manufacturing, 0) / totalCompanies;
    const avgFinancialScore =
      companies.reduce((sum, company) => sum + company.scores.financial, 0) / totalCompanies;
    const avgOwnershipScore =
      companies.reduce((sum, company) => sum + company.scores.ownership, 0) / totalCompanies;
    const avgIPScore =
      companies.reduce((sum, company) => sum + company.scores.ip, 0) / totalCompanies;

    // Find top performer
    const topPerformer = companies.reduce((top, company) =>
      company.scores.hydrogen > top.scores.hydrogen ? company : top,
    );

    // Count high performers
    const highPerformersCount = companies.filter(
      (company) => company.scores.hydrogen >= 8.0,
    ).length;

    // Count priority targets
    const priorityTargets = companies.filter(
      (company) => company.quadrant === "Priority leads (Investigate now)",
    ).length;

    // Calculate quadrant breakdown
    const quadrantBreakdown = {
      "Monitor / Opportunistic": companies.filter((c) => c.quadrant === "Monitor / Opportunistic")
        .length,
      "Priority leads (Investigate now)": companies.filter(
        (c) => c.quadrant === "Priority leads (Investigate now)",
      ).length,
      "Not a focus": companies.filter((c) => c.quadrant === "Not a focus").length,
      "Nurture with Support": companies.filter((c) => c.quadrant === "Nurture with Support").length,
    };

    return {
      totalCompanies,
      avgHydrogenScore: Number(avgHydrogenScore.toFixed(1)),
      avgIndustryScore: Number(avgIndustryScore.toFixed(1)),
      avgManufacturingScore: Number(avgManufacturingScore.toFixed(1)),
      avgFinancialScore: Number(avgFinancialScore.toFixed(1)),
      avgOwnershipScore: Number(avgOwnershipScore.toFixed(1)),
      avgIPScore: Number(avgIPScore.toFixed(1)),
      topPerformer: topPerformer.name,
      topPerformerScore: Number(topPerformer.scores.hydrogen.toFixed(2)),
      highPerformersCount,
      priorityTargets,
      quadrantBreakdown,
    };
  }, [companies]);

  // Get companies by quadrant
  const getCompaniesByQuadrant = (quadrant: string): StrategicCompanyData[] => {
    return companies.filter((company) => company.quadrant === quadrant);
  };

  // Get scatter plot data for visualization
  const getScatterData = useCallback(() => {
    const colors = {
      "Monitor / Opportunistic": "#f59e0b",
      "Priority leads (Investigate now)": "#ef4444",
      "Not a focus": "#6b7280",
      "Nurture with Support": "#3b82f6",
    };

    return companies.map((company) => ({
      x: company.strategicFit,
      y: company.abilityToExecute,
      text: company.name,
      marker: {
        size: 12,
        color: colors[company.quadrant as keyof typeof colors] || "#6b7280",
      },
    }));
  }, [companies]);

  useEffect(() => {
    fetchStrategicData();
  }, [fetchStrategicData]);

  const refresh = () => {
    fetchStrategicData();
  };

  return {
    companies,
    stats,
    loading,
    error,
    refresh,
    getCompaniesByQuadrant,
    getScatterData,
  };
};
