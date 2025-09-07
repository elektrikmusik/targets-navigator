import React, { useState, useMemo, useCallback, useEffect } from "react";
import { CompanyOverview } from "@/lib/supabase";
import { CompanyBubbleChart } from "./CompanyBubbleChart";
import { CompanyOverviewTable } from "@/components/tables/CompanyOverviewTable";
import { SimpleCompanyTable } from "./SimpleCompanyTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  BarChart3,
  Table,
  Search,
  EyeOff,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ICON_SIZES,
  LOADING_DIMENSIONS,
  GRID_CONFIGS,
  CHART_RANGES,
  calculateChartHeight,
  getViewportHeight,
} from "@/constants/dimensions";

interface LinkedChartProps {
  data: CompanyOverview[];
  loading?: boolean;
  title?: string;
  height?: number;
  enableTableSync?: boolean;
  enableChartInteractions?: boolean;
  enableFiltering?: boolean;
  enableSearch?: boolean;
  onCompanySelect?: (company: CompanyOverview | null) => void;
  onDataFilter?: (filteredData: CompanyOverview[]) => void;
}

export const LinkedChart: React.FC<LinkedChartProps> = ({
  data,
  loading = false,
  title = "Linked Chart Analysis",
  height = 500,
  enableTableSync = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  enableChartInteractions = true,
  enableFiltering = true,
  enableSearch = true,
  onCompanySelect,
  onDataFilter,
}) => {
  // Calculate responsive height based on available space
  const [availableHeight, setAvailableHeight] = useState(height);
  
  useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = getViewportHeight();
      const calculatedHeight = calculateChartHeight(viewportHeight);
      setAvailableHeight(calculatedHeight);
    };
    
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);
  // State for chart-table synchronization
  const [selectedCompany, setSelectedCompany] = useState<CompanyOverview | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<CompanyOverview[]>([]);
  const [activeTab, setActiveTab] = useState<"chart" | "table" | "combined">("combined");
  
  // Chart controls
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [filterTiers, setFilterTiers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get available tiers
  const availableTiers = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map(d => d.Tier).filter(Boolean))) as string[];
  }, [data]);

  // Filter data based on search and tier filters
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Apply tier filter
    if (filterTiers.length > 0) {
      filtered = filtered.filter(company =>
        company.Tier && filterTiers.includes(company.Tier)
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        (company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         company.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         company.primaryMarket?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [data, filterTiers, searchTerm]);

  // Notify parent of filtered data changes
  React.useEffect(() => {
    if (onDataFilter) {
      onDataFilter(filteredData);
    }
  }, [filteredData, onDataFilter]);

  // Handle chart interactions
  const handleBubbleClick = useCallback((company: CompanyOverview) => {
    setSelectedCompany(company);
    if (!selectedCompanies.find(c => c.key === company.key)) {
      setSelectedCompanies(prev => [...prev, company]);
    }
    if (onCompanySelect) {
      onCompanySelect(company);
    }
    // Switch to table view when company is selected
    if (activeTab === "chart") {
      setActiveTab("combined");
    }
  }, [selectedCompanies, onCompanySelect, activeTab]);

  const handleBubbleHover = useCallback(() => {
    // Could show tooltip or update state here
  }, []);

  // Removed unused handleTableRowClick function

  // Control handlers
  const toggleLegend = () => setShowLegend(!showLegend);
  const toggleGrid = () => setShowGrid(!showGrid);

  const toggleTier = (tier: string) => {
    setFilterTiers(prev =>
      prev.includes(tier)
        ? prev.filter(t => t !== tier)
        : [...prev, tier]
    );
  };

  const clearFilters = () => {
    setFilterTiers([]);
    setSearchTerm("");
  };

  const clearSelection = () => {
    setSelectedCompany(null);
    setSelectedCompanies([]);
    if (onCompanySelect) {
      onCompanySelect(null);
    }
  };

  // Statistics for selected companies
  const selectedStats = useMemo(() => {
    if (selectedCompanies.length === 0) return null;

    const avgOverallScore = selectedCompanies.reduce((sum, company) => 
      sum + (Number(company.overallScore) || 0), 0) / selectedCompanies.length;
    const avgStrategicFit = selectedCompanies.reduce((sum, company) => 
      sum + (Number(company.strategicFit) || 0), 0) / selectedCompanies.length;
    const avgAbilityToExecute = selectedCompanies.reduce((sum, company) => 
      sum + (Number(company.abilityToExecute) || 0), 0) / selectedCompanies.length;

    return {
      count: selectedCompanies.length,
      avgOverallScore: avgOverallScore.toFixed(1),
      avgStrategicFit: avgStrategicFit.toFixed(1),
      avgAbilityToExecute: avgAbilityToExecute.toFixed(1),
    };
  }, [selectedCompanies]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
        <div className="text-center">
          <div className="text-blue-500 mb-4">Loading data...</div>
          <div className={`animate-spin rounded-full ${LOADING_DIMENSIONS.spinner.lg} border-b-2 border-blue-500 mx-auto`}></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
        <div className="text-center">
          <div className="text-gray-500 mb-4">No data available</div>
          <p className="text-sm text-gray-400">Check your data source and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{title}</h2>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {enableSearch && (
        <div className="flex-shrink-0 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Label htmlFor="search">Search Companies</Label>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${ICON_SIZES.sm} text-gray-400`} />
                <Input
                  id="search"
                  placeholder="Search by name, country, or market..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {enableFiltering && (
              <div className="flex gap-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="legend-toggle">Legend</Label>
                  <Switch
                    id="legend-toggle"
                    checked={showLegend}
                    onCheckedChange={toggleLegend}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="grid-toggle">Grid</Label>
                  <Switch
                    id="grid-toggle"
                    checked={showGrid}
                    onCheckedChange={toggleGrid}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tier Filters */}
      {enableFiltering && availableTiers.length > 0 && (
        <div className="flex-shrink-0 mb-6">
          <div className="flex flex-wrap gap-2">
            <Label className="text-sm font-medium">Tier Filters:</Label>
            {availableTiers.map((tier) => (
              <Badge
                key={tier}
                variant={filterTiers.includes(tier) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTier(tier)}
              >
                {tier}
              </Badge>
            ))}
            {filterTiers.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Selected Companies Stats */}
      {selectedStats && (
        <div className="flex-shrink-0 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className={ICON_SIZES.md} />
                Selected Companies ({selectedStats.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className={GRID_CONFIGS.details}>
              <div>
                <Label className="text-sm font-medium text-gray-500">Avg Overall Score</Label>
                <div className="text-2xl font-bold">{selectedStats.avgOverallScore}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Avg Strategic Fit</Label>
                <div className="text-2xl font-bold">{selectedStats.avgStrategicFit}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Avg Ability to Execute</Label>
                <div className="text-2xl font-bold">{selectedStats.avgAbilityToExecute}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Total Selected</Label>
                <div className="text-2xl font-bold">{selectedStats.count}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "chart" | "table" | "combined")} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 className={ICON_SIZES.sm} />
              Chart View
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className={ICON_SIZES.sm} />
              Table View
            </TabsTrigger>
            <TabsTrigger value="combined" className="flex items-center gap-2">
              <TrendingUp className={ICON_SIZES.sm} />
              Combined View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="flex-1 min-h-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardDescription>
                  Interactive visualization showing Strategic Fit vs Ability to Execute
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="w-full h-full">
                  <CompanyBubbleChart
                    data={filteredData}
                    title=""
                    xAxisTitle="Strategic Fit"
                    yAxisTitle="Ability to Execute"
                    height={availableHeight}
                    showLegend={showLegend}
                    showGrid={showGrid}
                    filterTiers={filterTiers.length > 0 ? filterTiers : undefined}
                    onBubbleClick={enableChartInteractions ? handleBubbleClick : undefined}
                    onBubbleHover={enableChartInteractions ? handleBubbleHover : undefined}
                    xAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
                    yAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="flex-1 min-h-0">
            <Card className="h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Company Overview Table</CardTitle>
                <CardDescription>
                  Detailed tabular view with sorting, filtering, and search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                <div className="w-full h-full">
                  <CompanyOverviewTable
                    data={filteredData}
                    loading={loading}
                    totalCount={filteredData.length}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="combined" className="flex-1 min-h-0">
            <div className={`${GRID_CONFIGS.chartLayout} h-full`}>
              {/* Chart - 2/3 width */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle>Bubble Chart</CardTitle>
                    <CardDescription>
                      Click on bubbles to select companies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0">
                    <div className="w-full h-full">
                      <CompanyBubbleChart
                        data={filteredData}
                        title=""
                        xAxisTitle="Strategic Fit"
                        yAxisTitle="Ability to Execute"
                        height={Math.max(300, availableHeight * 0.8)}
                        showLegend={showLegend}
                        showGrid={showGrid}
                        filterTiers={filterTiers.length > 0 ? filterTiers : undefined}
                        onBubbleClick={enableChartInteractions ? handleBubbleClick : undefined}
                        onBubbleHover={enableChartInteractions ? handleBubbleHover : undefined}
                        xAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
                        yAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Table - 1/3 width */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle>Company Table</CardTitle>
                    <CardDescription>
                      Selected companies and detailed information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-0">
                    <div className="w-full h-full">
                      <SimpleCompanyTable
                        data={filteredData}
                        loading={loading}
                        onCompanySelect={handleBubbleClick}
                        selectedCompany={selectedCompany}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Selected Company Details */}
      {selectedCompany && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className={ICON_SIZES.md} />
                {selectedCompany.englishName || selectedCompany.companyName}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                <EyeOff className={`${ICON_SIZES.sm} mr-2`} />
                Clear Selection
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={GRID_CONFIGS.details}>
              <div>
                <Label className="text-sm font-medium text-gray-500">Overall Score</Label>
                <div className="text-2xl font-bold">
                  {Number(selectedCompany.overallScore)?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Strategic Fit</Label>
                <div className="text-2xl font-bold">
                  {Number(selectedCompany.strategicFit)?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Ability to Execute</Label>
                <div className="text-2xl font-bold">
                  {Number(selectedCompany.abilityToExecute)?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Tier</Label>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {selectedCompany.Tier || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className={`mt-4 ${GRID_CONFIGS.companyInfo}`}>
              <div>
                <Label className="text-sm font-medium text-gray-500">Country</Label>
                <div className="text-sm">{selectedCompany.country || "N/A"}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Primary Market</Label>
                <div className="text-sm">{selectedCompany.primaryMarket || "N/A"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
