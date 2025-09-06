"use client";

import { useState, useMemo, useCallback } from "react";
import { CompanyOverviewAdvancedTable } from "@/components/tables/CompanyOverviewAdvancedTable";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  TrendingUp,
  Target,
  Globe,
  RefreshCw,
  Filter,
  Download,
  BarChart3,
  Activity,
} from "lucide-react";
import { ScoreRecalculationButton } from "@/components/ScoreRecalculationButton";

// Statistics cards component
const StatisticsCards = ({
  data,
  totalCount,
}: {
  data: Record<string, unknown>[];
  totalCount: number;
}) => {
  const stats = useMemo(() => {
    if (!data.length) return {};

    const avgOverallScore =
      data.reduce((sum, company) => sum + (Number(company.overallScore) || 0), 0) / data.length;
    const avgStrategicFit =
      data.reduce((sum, company) => sum + (Number(company.strategicFit) || 0), 0) / data.length;
    const avgAbilityToExecute =
      data.reduce((sum, company) => sum + (Number(company.abilityToExecute) || 0), 0) / data.length;

    const topPerformers = data.filter(
      (company) => (Number(company.overallScore) || 0) >= 80,
    ).length;
    const countries = new Set(data.map((company) => company.country).filter(Boolean)).size;
    const regions = new Set(data.map((company) => company.ceres_region).filter(Boolean)).size;

    return {
      avgOverallScore: avgOverallScore.toFixed(1),
      avgStrategicFit: avgStrategicFit.toFixed(1),
      avgAbilityToExecute: avgAbilityToExecute.toFixed(1),
      topPerformers,
      countries,
      regions,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          <Building2 className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-muted-foreground text-xs">Companies in database</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Overall Score</CardTitle>
          <Target className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgOverallScore || "N/A"}</div>
          <p className="text-muted-foreground text-xs">Average performance score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topPerformers}</div>
          <p className="text-muted-foreground text-xs">Score ≥ 80</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Countries</CardTitle>
          <Globe className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.countries}</div>
          <p className="text-muted-foreground text-xs">Unique countries</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Quick actions component
const QuickActions = ({
  onRefresh,
  onExport,
  onLoadAll,
  loading,
  dataCount,
  totalCount,
}: {
  onRefresh: () => void;
  onExport: () => void;
  onLoadAll: () => void;
  loading: boolean;
  dataCount: number;
  totalCount: number;
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </Button>

      <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export All
      </Button>

      {dataCount < totalCount && (
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadAll}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Load All ({totalCount})
        </Button>
      )}

      <Badge variant="secondary" className="flex items-center gap-1">
        <Activity className="h-3 w-3" />
        {dataCount}/{totalCount} Companies
      </Badge>

      <ScoreRecalculationButton onSuccess={onRefresh} variant="outline" size="sm" />
    </div>
  );
};

// Advanced filters component
const AdvancedFilters = ({
  onFilterChange,
}: {
  onFilterChange: (filters: Record<string, unknown>) => void;
}) => {
  const [filters, setFilters] = useState({
    minOverallScore: "",
    maxOverallScore: "",
    minStrategicFit: "",
    maxStrategicFit: "",
    minAbilityToExecute: "",
    maxAbilityToExecute: "",
    tier: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Convert to proper format for the hook
    const formattedFilters = {
      minOverallScore: newFilters.minOverallScore
        ? parseFloat(newFilters.minOverallScore)
        : undefined,
      maxOverallScore: newFilters.maxOverallScore
        ? parseFloat(newFilters.maxOverallScore)
        : undefined,
      minStrategicFit: newFilters.minStrategicFit
        ? parseFloat(newFilters.minStrategicFit)
        : undefined,
      maxStrategicFit: newFilters.maxStrategicFit
        ? parseFloat(newFilters.maxStrategicFit)
        : undefined,
      minAbilityToExecute: newFilters.minAbilityToExecute
        ? parseFloat(newFilters.minAbilityToExecute)
        : undefined,
      maxAbilityToExecute: newFilters.maxAbilityToExecute
        ? parseFloat(newFilters.maxAbilityToExecute)
        : undefined,
      tier: newFilters.tier || undefined,
    };

    onFilterChange(formattedFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </CardTitle>
        <CardDescription>Filter companies by score ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tier</label>
            <select
              value={filters.tier}
              onChange={(e) => handleFilterChange("tier", e.target.value)}
              className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Tiers</option>
              <option value="Partner">Partner</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
              <option value="Tier 4">Tier 4</option>
              <option value="Unclassified">Unclassified</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Overall Score Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minOverallScore}
                onChange={(e) => handleFilterChange("minOverallScore", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxOverallScore}
                onChange={(e) => handleFilterChange("maxOverallScore", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Strategic Fit Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minStrategicFit}
                onChange={(e) => handleFilterChange("minStrategicFit", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxStrategicFit}
                onChange={(e) => handleFilterChange("maxStrategicFit", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ability to Execute Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAbilityToExecute}
                onChange={(e) => handleFilterChange("minAbilityToExecute", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAbilityToExecute}
                onChange={(e) => handleFilterChange("maxAbilityToExecute", e.target.value)}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CompanyOverviewDashboard = () => {
  const [globalSearch] = useState("");
  const [currentFilters, setCurrentFilters] = useState<{
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
  }>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const {
    data,
    loading,
    error,
    totalCount,

    refresh,
    loadAll,
    filterOptions,
  } = useCompanyOverview({
    limit: 500, // Increased to load all companies
    searchTerm: globalSearch,
    sortBy: "overallScore",
    sortOrder: "desc",
    filterBy: currentFilters,
  });

  const handleGlobalRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const handleExport = useCallback(() => {
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, "company-overview-export.csv");
  }, [data]);

  const convertToCSV = (data: Record<string, unknown>[]) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = useCallback((filters: Record<string, unknown>) => {
    setCurrentFilters(filters);
  }, []);

  // Use data directly since filtering is now handled by the table
  const filteredData = data;

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Data</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Button onClick={handleGlobalRefresh} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-8xl mx-auto h-full space-y-6 overflow-auto p-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Company Overview Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Advanced company analysis with comprehensive scoring across all dimensions
            </p>
          </div>
          <QuickActions
            onRefresh={handleGlobalRefresh}
            onExport={handleExport}
            onLoadAll={loadAll}
            loading={loading}
            dataCount={filteredData.length}
            totalCount={totalCount}
          />
        </div>

        {/* Statistics Cards */}
        <StatisticsCards data={filteredData} totalCount={totalCount} />

        {/* Data Status */}
        <div className="text-center text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
              Loading companies...
            </div>
          ) : (
            <div>
              Showing {filteredData.length} of {totalCount} companies
              {filteredData.length < totalCount && (
                <span className="ml-2 text-orange-600">(Some companies may be filtered out)</span>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 transition-colors ${
                showAdvancedFilters
                  ? "border-purple-600 bg-purple-600 text-white hover:bg-purple-700"
                  : "hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <Filter className="h-4 w-4" />
              {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
            </Button>
          </div>
        </div>

        {showAdvancedFilters && <AdvancedFilters onFilterChange={handleFilterChange} />}

        {/* Main Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Company Data
            </CardTitle>
            <CardDescription>
              Comprehensive company analysis with advanced filtering and sorting capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyOverviewAdvancedTable
              data={filteredData}
              loading={loading}
              filterOptions={filterOptions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
