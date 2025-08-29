// Legacy hooks
export { useAnalytics } from "./useAnalytics";
export { useSampleData } from "./useSampleData";
export { useLocalAnalytics } from "./useLocalAnalytics";
export { useLocalData } from "./useLocalData";
export { useLocalCompanyData } from "./useLocalCompanyData";

// Enhanced company data hooks
export { useCompanyData } from "./useCompanyData";

// Individual evaluation dimension hooks
export { useCompanyProfiles, useCompanyProfile } from "./useCompanyProfiles";
export { useHydrogenData, useCompanyHydrogenData, useHydrogenStats } from "./useHydrogenData";
export { useIndustryData, useCompanyIndustryData, useIndustryInsights } from "./useIndustryData";
export {
  useManufacturingData,
  useCompanyManufacturingData,
  useManufacturingInsights,
} from "./useManufacturingData";
export {
  useFinancialData,
  useCompanyFinancialData,
  useFinancialInsights,
} from "./useFinancialData";
export {
  useOwnershipData,
  useCompanyOwnershipData,
  useOwnershipInsights,
} from "./useOwnershipData";
export { useIPData, useCompanyIPData, useIPInsights } from "./useIPData";

// Unified data service
export {
  useUnifiedCompanyData,
  useCompanyDashboardData,
  useSingleCompanyData,
} from "./useUnifiedCompanyData";
export type { UnifiedCompanyData, CompanyDashboardSummary } from "./useUnifiedCompanyData";
