import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      companies_profile: {
        Row: {
          id: number;
          created_at: string;
          englishName: string | null;
          companyName: string | null;
          EvaluationDate: string | null;
          basicInformation: string | null;
          missionVisionValues: string | null;
          historyBackground: string | null;
          productServices: string | null;
          productTags: string | null;
          marketPosition: string | null;
          visualElement: string | null;
          narrative: string | null;
          key: number | null;
          executiveTeam: string | null;
          customerSegments: string | null;
          products: string | null;
          news_md: string | null;
          sentiment_md: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          englishName?: string | null;
          companyName?: string | null;
          EvaluationDate?: string | null;
          basicInformation?: string | null;
          missionVisionValues?: string | null;
          historyBackground?: string | null;
          productServices?: string | null;
          productTags?: string | null;
          marketPosition?: string | null;
          visualElement?: string | null;
          narrative?: string | null;
          key?: number | null;
          executiveTeam?: string | null;
          customerSegments?: string | null;
          products?: string | null;
          news_md?: string | null;
          sentiment_md?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          englishName?: string | null;
          companyName?: string | null;
          EvaluationDate?: string | null;
          basicInformation?: string | null;
          missionVisionValues?: string | null;
          historyBackground?: string | null;
          productServices?: string | null;
          productTags?: string | null;
          marketPosition?: string | null;
          visualElement?: string | null;
          narrative?: string | null;
          key?: number | null;
          executiveTeam?: string | null;
          customerSegments?: string | null;
          products?: string | null;
          news_md?: string | null;
          sentiment_md?: string | null;
        };
      };
      companies_hydrogen: {
        Row: {
          id: number;
          created_at: string;
          englishName: string | null;
          companyName: string | null;
          EvaluationDate: string | null;
          H2investScore: number | null;
          H2investJustification: string | null;
          H2partnersScore: number | null;
          H2partnersJustification: string | null;
          H2TechScore: number | null;
          H2TechJustification: string | null;
          H2CommitScore: number | null;
          H2CommitJustification: string | null;
          H2ParticipationScore: number | null;
          H2ParticipationJustification: string | null;
          H2OverallRating: string | null;
          H2Summary: string | null;
          H2investmentFocus: string | null;
          H2partnershipStrategy: string | null;
          H2technologyReadiness: string | null;
          H2marketPositioning: string | null;
          H2Research: string | null;
          key: number | null;
          H2Score: number | null;
        };
      };
      companies_industry: {
        Row: {
          id: number;
          created_at: string;
          companyName: string | null;
          evaluation_date: string | null;
          core_business_score: number | null;
          core_business_justification: string | null;
          technology_score: number | null;
          technology_justification: string | null;
          market_score: number | null;
          market_justification: string | null;
          rationale: string | null;
          opportunities: string | null;
          industry_output: Record<string, unknown> | null;
          englishName: string | null;
          key: number | null;
          industry_score: number | null;
        };
      };
      companies_ip: {
        Row: {
          id: number;
          created_at: string;
          englishName: string | null;
          companyName: string | null;
          IPRelevantPatentsScore: number | null;
          IPRelevantPatentsJustification: string | null;
          IPCeresCitationsScore: number | null;
          IPCeresCitationsJustification: string | null;
          IPPortfolioGrowthScore: number | null;
          IPPortfolioGrowthJustification: string | null;
          IPFilingRecencyScore: number | null;
          IPFilingRecencyJustification: string | null;
          IPOverallRating: string | null;
          IPStrategySummary: string | null;
          IPResearch: Record<string, unknown> | null;
          IPActivityScore: number | null;
          key: number | null;
          evaluationDate: string | null;
        };
      };
      companies_manufacturing: {
        Row: {
          id: number;
          englishName: string | null;
          companyName: string | null;
          EvaluationDate: string | null;
          ManufacturingMaterialsScore: number | null;
          ManufacturingMaterialsJustification: string | null;
          ManufacturingScaleScore: number | null;
          ManufacturingScaleJustification: string | null;
          ManufacturingQualityScore: number | null;
          ManufacturingQualityJustification: string | null;
          ManufacturingSupplyChainScore: number | null;
          ManufacturingSupplyChainJustification: string | null;
          ManufacturingRDScore: number | null;
          ManufacturingRDJustification: string | null;
          ManufacturingOverallRating: string | null;
          ManufacturingSummary: string | null;
          ManufacturingResearch: string | null;
          key: number | null;
          manufacturing_score: number | null;
        };
      };
      companies_ownership: {
        Row: {
          id: number;
          englishName: string | null;
          companyName: string | null;
          EvaluationDate: string | null;
          OwnershipTypeScore: number | null;
          OwnershipTypeJustification: string | null;
          OwnershipDecisionMakingScore: number | null;
          OwnershipDecisionMakingJustification: string | null;
          OwnershipAlignmentScore: number | null;
          OwnershipAlignmentJustification: string | null;
          OwnershipPartnershipsScore: number | null;
          OwnershipPartnershipsJustification: string | null;
          OwnershipOverallRating: string | null;
          OwnershipSummary: string | null;
          OwnershipResearch: string | null;
          key: number | null;
          OwnershipScore: number | null;
        };
      };
      company_financial: {
        Row: {
          id: number;
          created_at: string;
          companyName: string | null;
          englishName: string | null;
          annual_revenue: number | null;
          revenue_score: number | null;
          revenue_justification: string | null;
          "3Y_score": number | null;
          "3Y_justification": string | null;
          netProfitScore: number | null;
          netProfitJustification: string | null;
          investCapacityScore: number | null;
          investCapacityJustification: string | null;
          overallRating: string | null;
          financialSummary: string | null;
          revenueTrend: string | null;
          profitabilityAssessment: string | null;
          investmentReadiness: string | null;
          financialReserach: Record<string, unknown> | null;
          evaluation_date: string | null;
          finance_score: number | null;
          key: number | null;
        };
      };
    };
  };
};

// Company types for easier use
export interface CompanyProfile {
  id: number;
  englishName: string | null;
  companyName: string | null;
  key: number | null;
  basicInformation: string | null;
  productServices: string | null;
  marketPosition: string | null;
  executiveTeam: string | null;
  customerSegments: string | null;
  products: string | null;
  news_md: string | null;
  sentiment_md: string | null;
}

export interface CompanyScores {
  key: number;
  companyName: string | null;
  englishName: string | null;
  hydrogen_score: number | null;
  industry_score: number | null;
  manufacturing_score: number | null;
  finance_score: number | null;
  ownership_score: number | null;
  ip_activity_score: number | null;
}

export interface CompanyDetails extends CompanyProfile {
  hydrogen: Database["public"]["Tables"]["companies_hydrogen"]["Row"] | null;
  industry: Database["public"]["Tables"]["companies_industry"]["Row"] | null;
  manufacturing: Database["public"]["Tables"]["companies_manufacturing"]["Row"] | null;
  financial: Database["public"]["Tables"]["company_financial"]["Row"] | null;
  ownership: Database["public"]["Tables"]["companies_ownership"]["Row"] | null;
  ip: Database["public"]["Tables"]["companies_ip"]["Row"] | null;
}
