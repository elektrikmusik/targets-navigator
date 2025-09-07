"use client";

import { useState, useMemo, useCallback } from "react";
import { CompanyOverview } from "@/lib/supabase";
import { CompanyBubbleChart } from "@/components/charts/CompanyBubbleChart";
import { CompanyBubbleChartExample } from "@/components/charts/CompanyBubbleChartExample";
import { CompanyOverviewTable } from "@/components/tables/CompanyOverviewTable";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  BarChart3,
  Table,
  Target,
  Search,
  RefreshCw,
  EyeOff,
  Download,
  Info,
  TrendingUp,
  Globe,
  Users,
  Star,
} from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DashboardSkeleton } from "@/components/ui/skeleton";

// Statistics cards component
const StatisticsCards = ({
  data,
  selectedCompanies,
}: {
  data: CompanyOverview[];
  selectedCompanies: CompanyOverview[];
}) => {
  const stats = useMemo(() => {
    if (!data.length) return {};

    const avgOverallScore =
      data.reduce((sum, company) => sum + (Number(company.overallScore) || 0), 0) / data.length;
    const avgStrategicFit =
      data.reduce((sum, company) => sum + (Number(company.strategicFit) || 0), 0) / data.length;
    const avgAbilityToExecute =
      data.reduce((sum, company) => sum + (Number(company.abilityToExecute) || 0), 0) / data.length;

    const topPerformers = data.filter((company) => (Number(company.overallScore) || 0) >= 8).length;
    const countries = new Set(data.map((company) => company.country).filter(Boolean)).size;
    const regions = new Set(data.map((company) => company.ceres_region).filter(Boolean)).size;

    return {
      avgOverallScore: avgOverallScore.toFixed(1),
      avgStrategicFit: avgStrategicFit.toFixed(1),
      avgAbilityToExecute: avgAbilityToExecute.toFixed(1),
      topPerformers,
      countries,
      regions,
      totalCompanies: data.length,
      selectedCount: selectedCompanies.length,
    };
  }, [data, selectedCompanies]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          <Star className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgOverallScore}</div>
          <p className="text-muted-foreground text-xs">Average across all companies</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Strategic Fit</CardTitle>
          <Target className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgStrategicFit}</div>
          <p className="text-muted-foreground text-xs">Average strategic alignment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Execution Ability</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgAbilityToExecute}</div>
          <p className="text-muted-foreground text-xs">Average execution capability</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Selected</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.selectedCount}</div>
          <p className="text-muted-foreground text-xs">Companies selected</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Chart controls component
const ChartControls = ({
  showLegend,
  showGrid,
  filterTiers,
  availableTiers,
  onToggleLegend,
  onToggleGrid,
  onToggleTier,
  onClearFilters,
}: {
  showLegend: boolean;
  showGrid: boolean;
  filterTiers: string[];
  availableTiers: string[];
  onToggleLegend: () => void;
  onToggleGrid: () => void;
  onToggleTier: (tier: string) => void;
  onClearFilters: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chart Controls</CardTitle>
        <CardDescription>Customize the bubble chart display and filtering</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-legend">Show Legend</Label>
          <Switch id="show-legend" checked={showLegend} onCheckedChange={onToggleLegend} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="show-grid">Show Grid</Label>
          <Switch id="show-grid" checked={showGrid} onCheckedChange={onToggleGrid} />
        </div>
        <Separator />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Filter by Tier</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              disabled={filterTiers.length === 0}
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTiers.map((tier) => (
              <Button
                key={tier}
                variant={filterTiers.includes(tier) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleTier(tier)}
                className="text-xs"
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Selected company details component
const SelectedCompanyDetails = ({
  selectedCompany,
  onClearSelection,
}: {
  selectedCompany: CompanyOverview | null;
  onClearSelection: () => void;
}) => {
  if (!selectedCompany) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">
            {selectedCompany.englishName || selectedCompany.companyName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            <EyeOff className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
        <CardDescription className="text-blue-700">
          Company details and strategic analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <Label className="text-sm font-medium text-blue-700">Strategic Fit</Label>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.strategicFit?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Ability to Execute</Label>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.abilityToExecute?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Overall Score</Label>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.overallScore?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Tier</Label>
            <Badge variant="outline" className="text-xs">
              {selectedCompany.Tier || "Unknown"}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="text-sm font-medium text-blue-700">Country</Label>
            <div className="text-sm text-blue-600">{selectedCompany.country || "N/A"}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Primary Market</Label>
            <div className="text-sm text-blue-600">{selectedCompany.primaryMarket || "N/A"}</div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Annual Revenue</Label>
            <div className="text-sm text-blue-600">
              {selectedCompany.annual_revenue
                ? `$${selectedCompany.annual_revenue.toFixed(1)}B`
                : "N/A"}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-blue-700">Business Model</Label>
            <div className="text-sm text-blue-600">{selectedCompany.businessModel || "N/A"}</div>
          </div>
        </div>

        {selectedCompany.website && (
          <div className="pt-2">
            <a
              href={selectedCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 underline hover:text-blue-800"
            >
              <Globe className="mr-1 h-4 w-4" />
              Visit Company Website
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LinkedChartPage = () => {
  const { data, loading, error } = useCompanyOverview();
  const [selectedCompany, setSelectedCompany] = useState<CompanyOverview | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [filterTiers, setFilterTiers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Get available tiers
  const availableTiers = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.Tier).filter(Boolean))) as string[];
  }, [data]);

  // Filter data based on search and tier filters
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Apply tier filter
    if (filterTiers.length > 0) {
      filtered = filtered.filter((company) => company.Tier && filterTiers.includes(company.Tier));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.primaryMarket?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered;
  }, [data, filterTiers, searchTerm]);

  // Handle chart interactions
  const handleBubbleClick = useCallback((company: CompanyOverview) => {
    setSelectedCompany(company);
    setActiveTab("table"); // Switch to table view when company is selected
  }, []);

  const handleBubbleHover = useCallback(() => {
    // Could show tooltip or update state here
  }, []);

  // Control handlers
  const toggleLegend = () => setShowLegend(!showLegend);
  const toggleGrid = () => setShowGrid(!showGrid);

  const toggleTier = (tier: string) => {
    setFilterTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier],
    );
  };

  const clearFilters = () => {
    setFilterTiers([]);
    setSearchTerm("");
  };

  const clearSelection = () => {
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-blue-500">Loading data...</div>
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">Error loading data: {error}</div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-gray-500">No data available</div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<DashboardSkeleton />}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Linked Chart Analysis</h1>
                <p className="mt-2 text-gray-600">
                  Interactive bubble chart with synchronized table view for comprehensive company
                  analysis
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md">
              <Label htmlFor="search">Search Companies</Label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, country, or market..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8">
            <StatisticsCards
              data={filteredData}
              selectedCompanies={selectedCompany ? [selectedCompany] : []}
            />
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart View
              </TabsTrigger>
              <TabsTrigger value="company-chart" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Chart
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="combined" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Combined View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategic Analysis Bubble Chart</CardTitle>
                      <CardDescription>
                        Interactive visualization showing Strategic Fit vs Ability to Execute
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <CompanyBubbleChart
                          data={filteredData}
                          title="Company Strategic Analysis"
                          xAxisTitle="Strategic Fit"
                          yAxisTitle="Ability to Execute"
                          height={400}
                          showLegend={showLegend}
                          showGrid={showGrid}
                          filterTiers={filterTiers.length > 0 ? filterTiers : undefined}
                          onBubbleClick={handleBubbleClick}
                          onBubbleHover={handleBubbleHover}
                          xAxisRange={[0, 10]}
                          yAxisRange={[0, 10]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <ChartControls
                    showLegend={showLegend}
                    showGrid={showGrid}
                    filterTiers={filterTiers}
                    availableTiers={availableTiers}
                    onToggleLegend={toggleLegend}
                    onToggleGrid={toggleGrid}
                    onToggleTier={toggleTier}
                    onClearFilters={clearFilters}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company-chart" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Bubble Chart Example</CardTitle>
                  <CardDescription>
                    Advanced company analysis with filtering and interactive features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyBubbleChartExample data={filteredData} loading={loading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="table" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Overview Table</CardTitle>
                  <CardDescription>
                    Detailed tabular view with sorting, filtering, and search capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CompanyOverviewTable
                    data={filteredData}
                    loading={loading}
                    totalCount={filteredData.length}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="combined" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Bubble Chart</CardTitle>
                      <CardDescription>Click on bubbles to select companies</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <CompanyBubbleChart
                          data={filteredData}
                          title=""
                          xAxisTitle="Strategic Fit"
                          yAxisTitle="Ability to Execute"
                          height={320}
                          showLegend={showLegend}
                          showGrid={showGrid}
                          filterTiers={filterTiers.length > 0 ? filterTiers : undefined}
                          onBubbleClick={handleBubbleClick}
                          onBubbleHover={handleBubbleHover}
                          xAxisRange={[0, 10]}
                          yAxisRange={[0, 10]}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Table</CardTitle>
                      <CardDescription>Selected companies and detailed information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 overflow-auto">
                        <CompanyOverviewTable
                          data={filteredData}
                          loading={loading}
                          totalCount={filteredData.length}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Selected Company Details */}
          {selectedCompany && (
            <div className="mt-8">
              <SelectedCompanyDetails
                selectedCompany={selectedCompany}
                onClearSelection={clearSelection}
              />
            </div>
          )}

          {/* Info Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Use This Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">Chart Interactions</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Click on bubbles to select companies</li>
                    <li>• Hover for quick information</li>
                    <li>• Use tier filters to focus on specific categories</li>
                    <li>• Toggle legend and grid for better visibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold">Table Features</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Sort by any column</li>
                    <li>• Search across all fields</li>
                    <li>• Export data to CSV</li>
                    <li>• Responsive design for mobile</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};
