import { useState, useEffect } from "react";
import { CompanyProfile, CompanyScores } from "@/lib/supabase";

const COMPANY_STORAGE_KEY = "scoring_navigator_companies";
const SCORES_STORAGE_KEY = "scoring_navigator_scores";

// Mock data for demonstration
const generateMockCompanies = (): CompanyProfile[] => {
  const companies = [
    {
      id: 1,
      key: 1,
      englishName: "Tesla Inc.",
      companyName: "Tesla Inc.",
      basicInformation: "Electric vehicle manufacturer",
      productServices: "Electric cars, energy storage, solar panels",
      marketPosition: "Leading EV manufacturer",
    },
    {
      id: 2,
      key: 2,
      englishName: "Toyota Motor Corporation",
      companyName: "Toyota Motor Corporation",
      basicInformation: "Automotive manufacturer",
      productServices: "Vehicles, hydrogen fuel cells",
      marketPosition: "Global automotive leader",
    },
    {
      id: 3,
      key: 3,
      englishName: "Ballard Power Systems",
      companyName: "Ballard Power Systems",
      basicInformation: "Fuel cell technology",
      productServices: "Hydrogen fuel cells, clean energy solutions",
      marketPosition: "Fuel cell technology leader",
    },
    {
      id: 4,
      key: 4,
      englishName: "Air Liquide",
      companyName: "Air Liquide",
      basicInformation: "Industrial gas company",
      productServices: "Hydrogen production, industrial gases",
      marketPosition: "Global gas solutions provider",
    },
    {
      id: 5,
      key: 5,
      englishName: "Plug Power Inc.",
      companyName: "Plug Power Inc.",
      basicInformation: "Hydrogen fuel cell systems",
      productServices: "Fuel cell solutions, hydrogen infrastructure",
      marketPosition: "Hydrogen economy enabler",
    },
    {
      id: 6,
      key: 6,
      englishName: "Linde plc",
      companyName: "Linde plc",
      basicInformation: "Industrial gas and engineering",
      productServices: "Hydrogen, industrial gases, engineering",
      marketPosition: "Leading industrial gas company",
    },
    {
      id: 7,
      key: 7,
      englishName: "Nel Hydrogen",
      companyName: "Nel ASA",
      basicInformation: "Hydrogen technology company",
      productServices: "Electrolyzers, hydrogen stations",
      marketPosition: "Pure-play hydrogen company",
    },
    {
      id: 8,
      key: 8,
      englishName: "ITM Power",
      companyName: "ITM Power plc",
      basicInformation: "Electrolyzer manufacturer",
      productServices: "PEM electrolyzers, hydrogen systems",
      marketPosition: "Electrolyzer specialist",
    },
    {
      id: 9,
      key: 9,
      englishName: "FuelCell Energy",
      companyName: "FuelCell Energy Inc.",
      basicInformation: "Fuel cell power generation",
      productServices: "Fuel cell power plants, carbon capture",
      marketPosition: "Stationary fuel cell leader",
    },
    {
      id: 10,
      key: 10,
      englishName: "Bloom Energy",
      companyName: "Bloom Energy Corporation",
      basicInformation: "Solid oxide fuel cells",
      productServices: "On-site power generation, fuel cells",
      marketPosition: "Distributed energy pioneer",
    },
  ];
  return companies;
};

const generateMockScores = (): CompanyScores[] => {
  return [
    {
      key: 1,
      englishName: "Tesla Inc.",
      companyName: "Tesla Inc.",
      hydrogen_score: 65,
      industry_score: 95,
      manufacturing_score: 88,
      finance_score: 82,
      ownership_score: 75,
      ip_activity_score: 90,
    },
    {
      key: 2,
      englishName: "Toyota Motor Corporation",
      companyName: "Toyota Motor Corporation",
      hydrogen_score: 85,
      industry_score: 92,
      manufacturing_score: 95,
      finance_score: 90,
      ownership_score: 88,
      ip_activity_score: 85,
    },
    {
      key: 3,
      englishName: "Ballard Power Systems",
      companyName: "Ballard Power Systems",
      hydrogen_score: 95,
      industry_score: 78,
      manufacturing_score: 72,
      finance_score: 68,
      ownership_score: 70,
      ip_activity_score: 88,
    },
    {
      key: 4,
      englishName: "Air Liquide",
      companyName: "Air Liquide",
      hydrogen_score: 88,
      industry_score: 85,
      manufacturing_score: 82,
      finance_score: 85,
      ownership_score: 80,
      ip_activity_score: 75,
    },
    {
      key: 5,
      englishName: "Plug Power Inc.",
      companyName: "Plug Power Inc.",
      hydrogen_score: 92,
      industry_score: 75,
      manufacturing_score: 70,
      finance_score: 65,
      ownership_score: 68,
      ip_activity_score: 82,
    },
    {
      key: 6,
      englishName: "Linde plc",
      companyName: "Linde plc",
      hydrogen_score: 80,
      industry_score: 88,
      manufacturing_score: 85,
      finance_score: 92,
      ownership_score: 85,
      ip_activity_score: 78,
    },
    {
      key: 7,
      englishName: "Nel Hydrogen",
      companyName: "Nel ASA",
      hydrogen_score: 90,
      industry_score: 72,
      manufacturing_score: 75,
      finance_score: 70,
      ownership_score: 65,
      ip_activity_score: 85,
    },
    {
      key: 8,
      englishName: "ITM Power",
      companyName: "ITM Power plc",
      hydrogen_score: 88,
      industry_score: 70,
      manufacturing_score: 68,
      finance_score: 62,
      ownership_score: 60,
      ip_activity_score: 80,
    },
    {
      key: 9,
      englishName: "FuelCell Energy",
      companyName: "FuelCell Energy Inc.",
      hydrogen_score: 85,
      industry_score: 68,
      manufacturing_score: 65,
      finance_score: 58,
      ownership_score: 62,
      ip_activity_score: 75,
    },
    {
      key: 10,
      englishName: "Bloom Energy",
      companyName: "Bloom Energy Corporation",
      hydrogen_score: 82,
      industry_score: 75,
      manufacturing_score: 78,
      finance_score: 75,
      ownership_score: 72,
      ip_activity_score: 78,
    },
  ];
};

export const useLocalCompanyData = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [scores, setScores] = useState<CompanyScores[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const savedCompanies = localStorage.getItem(COMPANY_STORAGE_KEY);
      const savedScores = localStorage.getItem(SCORES_STORAGE_KEY);

      if (savedCompanies) {
        setCompanies(JSON.parse(savedCompanies));
      } else {
        // Initialize with mock data
        const mockCompanies = generateMockCompanies();
        setCompanies(mockCompanies);
        localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(mockCompanies));
      }

      if (savedScores) {
        setScores(JSON.parse(savedScores));
      } else {
        // Initialize with mock scores
        const mockScores = generateMockScores();
        setScores(mockScores);
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(mockScores));
      }
    } catch (error) {
      console.error("Error loading company data from localStorage:", error);
      // Fallback to mock data
      const mockCompanies = generateMockCompanies();
      const mockScores = generateMockScores();
      setCompanies(mockCompanies);
      setScores(mockScores);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(companies));
    }
  }, [companies]);

  useEffect(() => {
    if (scores.length > 0) {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores));
    }
  }, [scores]);

  const searchCompanies = (searchTerm: string): CompanyProfile[] => {
    if (!searchTerm.trim()) {
      return companies;
    }

    return companies.filter(
      (company) =>
        company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const getCompanyScores = (key: number): CompanyScores | undefined => {
    return scores.find((score) => score.key === key);
  };

  const getTopPerformers = (category: keyof CompanyScores, limit = 5): CompanyScores[] => {
    if (category === "key" || category === "englishName" || category === "companyName") {
      return [];
    }

    return [...scores]
      .filter((score) => score[category] !== null && score[category] !== undefined)
      .sort((a, b) => (b[category] as number) - (a[category] as number))
      .slice(0, limit);
  };

  const getScoreDistribution = (
    category: keyof CompanyScores,
  ): { range: string; count: number }[] => {
    if (category === "key" || category === "englishName" || category === "companyName") {
      return [];
    }

    const validScores = scores
      .map((score) => score[category])
      .filter((score): score is number => score !== null && score !== undefined);

    const ranges = [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 0 },
      { range: "61-80", count: 0 },
      { range: "81-100", count: 0 },
    ];

    validScores.forEach((score) => {
      if (score <= 20) ranges[0].count++;
      else if (score <= 40) ranges[1].count++;
      else if (score <= 60) ranges[2].count++;
      else if (score <= 80) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  const generateNewMockData = () => {
    const newCompanies = generateMockCompanies();
    const newScores = generateMockScores();

    setCompanies(newCompanies);
    setScores(newScores);
  };

  const clearAllData = () => {
    setCompanies([]);
    setScores([]);
    localStorage.removeItem(COMPANY_STORAGE_KEY);
    localStorage.removeItem(SCORES_STORAGE_KEY);
  };

  return {
    companies,
    scores,
    loading,
    searchCompanies,
    getCompanyScores,
    getTopPerformers,
    getScoreDistribution,
    generateNewMockData,
    clearAllData,
  };
};
