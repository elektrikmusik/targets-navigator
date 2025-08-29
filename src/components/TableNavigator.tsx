import { useState, useEffect, useMemo, useCallback } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  CompanyProfileTable,
  HydrogenTable,
  IndustryTable,
  ManufacturingTable,
  FinancialTable,
  OwnershipTable,
  IPTable,
} from "@/components/tables";
import {
  useCompanyProfiles,
  useHydrogenData,
  useIndustryData,
  useManufacturingData,
  useFinancialData,
  useOwnershipData,
  useIPData,
} from "@/hooks";
import {
  Building2,
  Fuel,
  Factory,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  BarChart3,
  Loader2,
  AlertCircle,
  Search,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Enhanced Loading component with skeleton states
const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
    <p className="text-gray-600">{message}</p>
    <div className="mt-8 w-full max-w-4xl">
      <div className="animate-pulse space-y-4">
        {/* Skeleton table header */}
        <div className="h-4 w-full rounded bg-gray-200"></div>
        {/* Skeleton table rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
            <div className="h-4 flex-1 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 py-12">
    <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
    <h3 className="mb-2 text-lg font-semibold text-red-800">Data Loading Error</h3>
    <p className="mb-6 max-w-md text-center text-red-600">{message}</p>
    <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
      <RefreshCw className="mr-2 h-4 w-4" />
      Retry Loading
    </Button>
  </div>
);

type TableView =
  | "dashboard"
  | "profiles"
  | "hydrogen"
  | "industry"
  | "manufacturing"
  | "financial"
  | "ownership"
  | "ip";

export const TableNavigator = () => {
  const [currentView, setCurrentView] = useState<TableView>("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Real data hooks with optimized limits to prevent timeouts
  const profilesHook = useCompanyProfiles({ limit: 200 });
  const hydrogenHook = useHydrogenData({ limit: 200 });
  const industryHook = useIndustryData({ limit: 200 });
  const manufacturingHook = useManufacturingData({ limit: 200 });
  const financialHook = useFinancialData({ limit: 200 });
  const ownershipHook = useOwnershipData({ limit: 200 });
  const ipHook = useIPData({ limit: 200 });

  // Global refresh handler
  const handleGlobalRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        profilesHook.refresh(),
        hydrogenHook.refresh(),
        industryHook.refresh(),
        manufacturingHook.refresh(),
        financialHook.refresh(),
        ownershipHook.refresh(),
        ipHook.refresh(),
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Global refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    profilesHook,
    hydrogenHook,
    industryHook,
    manufacturingHook,
    financialHook,
    ownershipHook,
    ipHook,
  ]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    return {
      totalCompanies: profilesHook.totalCount || 0,
      evaluatedCompanies: {
        hydrogen: hydrogenHook.totalCount || 0,
        industry: industryHook.totalCount || 0,
        manufacturing: manufacturingHook.totalCount || 0,
        financial: financialHook.totalCount || 0,
        ownership: ownershipHook.totalCount || 0,
        ip: ipHook.totalCount || 0,
      },
      avgScores: {
        hydrogen:
          hydrogenHook.data?.reduce((sum, item) => sum + (item.H2Score || 0), 0) /
            Math.max(hydrogenHook.data?.length || 1, 1) || 0,
        industry:
          industryHook.data?.reduce((sum, item) => sum + (item.industry_score || 0), 0) /
            Math.max(industryHook.data?.length || 1, 1) || 0,
        manufacturing:
          manufacturingHook.data?.reduce((sum, item) => sum + (item.manufacturing_score || 0), 0) /
            Math.max(manufacturingHook.data?.length || 1, 1) || 0,
        financial:
          financialHook.data?.reduce((sum, item) => sum + (item.finance_score || 0), 0) /
            Math.max(financialHook.data?.length || 1, 1) || 0,
        ownership:
          ownershipHook.data?.reduce((sum, item) => sum + (item.OwnershipScore || 0), 0) /
            Math.max(ownershipHook.data?.length || 1, 1) || 0,
        ip:
          ipHook.data?.reduce((sum, item) => sum + (item.IPActivityScore || 0), 0) /
            Math.max(ipHook.data?.length || 1, 1) || 0,
      },
    };
  }, [
    profilesHook,
    hydrogenHook,
    industryHook,
    manufacturingHook,
    financialHook,
    ownershipHook,
    ipHook,
  ]);

  // Listen for navigation events from floating dock
  useEffect(() => {
    const handleNavigation = (event: CustomEvent<string>) => {
      setCurrentView(event.detail as TableView);
    };

    window.addEventListener("navigate-to-table", handleNavigation as EventListener);

    return () => {
      window.removeEventListener("navigate-to-table", handleNavigation as EventListener);
    };
  }, []);

  // Enhanced dock items with counters
  const dockItems = [
    { title: "Dashboard", icon: <BarChart3 className="h-full w-full" />, href: "dashboard" },
    {
      title: `Profiles (${overallStats.totalCompanies})`,
      icon: <Building2 className="h-full w-full" />,
      href: "profiles",
    },
    {
      title: `Hydrogen (${overallStats.evaluatedCompanies.hydrogen})`,
      icon: <Fuel className="h-full w-full" />,
      href: "hydrogen",
    },
    {
      title: `Industry (${overallStats.evaluatedCompanies.industry})`,
      icon: <Factory className="h-full w-full" />,
      href: "industry",
    },
    {
      title: `Manufacturing (${overallStats.evaluatedCompanies.manufacturing})`,
      icon: <TrendingUp className="h-full w-full" />,
      href: "manufacturing",
    },
    {
      title: `Financial (${overallStats.evaluatedCompanies.financial})`,
      icon: <DollarSign className="h-full w-full" />,
      href: "financial",
    },
    {
      title: `Ownership (${overallStats.evaluatedCompanies.ownership})`,
      icon: <Users className="h-full w-full" />,
      href: "ownership",
    },
    {
      title: `IP & Patents (${overallStats.evaluatedCompanies.ip})`,
      icon: <FileText className="h-full w-full" />,
      href: "ip",
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "profiles":
        if (profilesHook.loading) return <LoadingSpinner message="Loading company profiles..." />;
        if (profilesHook.error)
          return <ErrorMessage message={profilesHook.error} onRetry={profilesHook.refresh} />;
        return (
          <CompanyProfileTable
            data={profilesHook.data}
            loading={profilesHook.loading}
            totalCount={profilesHook.totalCount}
            hasMore={profilesHook.hasMore}
            onLoadMore={profilesHook.fetchMore}
          />
        );

      case "hydrogen":
        if (hydrogenHook.loading)
          return <LoadingSpinner message="Loading hydrogen evaluation data..." />;
        if (hydrogenHook.error)
          return <ErrorMessage message={hydrogenHook.error} onRetry={hydrogenHook.refresh} />;
        return (
          <HydrogenTable
            data={hydrogenHook.data}
            loading={hydrogenHook.loading}
            totalCount={hydrogenHook.totalCount}
            hasMore={hydrogenHook.hasMore}
            onLoadMore={hydrogenHook.fetchMore}
          />
        );

      case "industry":
        if (industryHook.loading)
          return <LoadingSpinner message="Loading industry analysis data..." />;
        if (industryHook.error)
          return <ErrorMessage message={industryHook.error} onRetry={industryHook.refresh} />;
        return (
          <IndustryTable
            data={industryHook.data}
            loading={industryHook.loading}
            totalCount={industryHook.totalCount}
            hasMore={industryHook.hasMore}
            onLoadMore={industryHook.fetchMore}
          />
        );

      case "manufacturing":
        if (manufacturingHook.loading)
          return <LoadingSpinner message="Loading manufacturing capability data..." />;
        if (manufacturingHook.error)
          return (
            <ErrorMessage message={manufacturingHook.error} onRetry={manufacturingHook.refresh} />
          );
        return (
          <ManufacturingTable
            data={manufacturingHook.data}
            loading={manufacturingHook.loading}
            totalCount={manufacturingHook.totalCount}
            hasMore={manufacturingHook.hasMore}
            onLoadMore={manufacturingHook.fetchMore}
          />
        );

      case "financial":
        if (financialHook.loading)
          return <LoadingSpinner message="Loading financial performance data..." />;
        if (financialHook.error)
          return <ErrorMessage message={financialHook.error} onRetry={financialHook.refresh} />;
        return (
          <FinancialTable
            data={financialHook.data}
            loading={financialHook.loading}
            totalCount={financialHook.totalCount}
            hasMore={financialHook.hasMore}
            onLoadMore={financialHook.fetchMore}
          />
        );

      case "ownership":
        if (ownershipHook.loading)
          return <LoadingSpinner message="Loading ownership structure data..." />;
        if (ownershipHook.error)
          return <ErrorMessage message={ownershipHook.error} onRetry={ownershipHook.refresh} />;
        return (
          <OwnershipTable
            data={ownershipHook.data}
            loading={ownershipHook.loading}
            totalCount={ownershipHook.totalCount}
            hasMore={ownershipHook.hasMore}
            onLoadMore={ownershipHook.fetchMore}
          />
        );

      case "ip":
        if (ipHook.loading) return <LoadingSpinner message="Loading IP & patent data..." />;
        if (ipHook.error) return <ErrorMessage message={ipHook.error} onRetry={ipHook.refresh} />;
        return (
          <IPTable
            data={ipHook.data}
            loading={ipHook.loading}
            totalCount={ipHook.totalCount}
            hasMore={ipHook.hasMore}
            onLoadMore={ipHook.fetchMore}
          />
        );

      default:
        return (
          <div className="space-y-8">
            {/* Enhanced header with controls */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Company Evaluation Dashboard</h2>
                <p className="mt-2 text-gray-600">
                  Real-time data from {overallStats.totalCompanies} companies across multiple
                  evaluation dimensions
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Global search..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="w-64 pl-10"
                  />
                </div>
                <Button
                  onClick={handleGlobalRefresh}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Enhanced data summary cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-blue-900">Total Companies</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      {overallStats.totalCompanies}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-500" />
                </div>
                <p className="mt-2 text-xs text-blue-700">Active in database</p>
              </div>

              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-green-900">Hydrogen Evaluated</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {overallStats.evaluatedCompanies.hydrogen}
                    </p>
                  </div>
                  <Fuel className="h-8 w-8 text-green-500" />
                </div>
                <p className="mt-2 text-xs text-green-700">
                  Avg Score: {overallStats.avgScores.hydrogen.toFixed(1)}
                </p>
              </div>

              <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-purple-900">Financial Analysis</h4>
                    <p className="text-3xl font-bold text-purple-600">
                      {overallStats.evaluatedCompanies.financial}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
                <p className="mt-2 text-xs text-purple-700">
                  Avg Score: {overallStats.avgScores.financial.toFixed(1)}
                </p>
              </div>

              <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1 text-sm font-medium text-orange-900">IP Analysis</h4>
                    <p className="text-3xl font-bold text-orange-600">
                      {overallStats.evaluatedCompanies.ip}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-500" />
                </div>
                <p className="mt-2 text-xs text-orange-700">
                  Avg Score: {overallStats.avgScores.ip.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Enhanced navigation cards */}
            <div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Evaluation Dimensions</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {dockItems.slice(1).map((item, index) => {
                  const colors = ["blue", "green", "purple", "yellow", "red", "indigo", "pink"];
                  const color = colors[index % colors.length];
                  return (
                    <button
                      key={item.href}
                      onClick={() => setCurrentView(item.href as TableView)}
                      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-${color}-300 group transition-all duration-200`}
                    >
                      <div
                        className={`mx-auto mb-3 h-10 w-10 text-${color}-600 transition-transform group-hover:scale-110`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                        {item.title.replace(/\(\d+\)/, "")}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.title.match(/\((\d+)\)/)?.[1]} companies
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick insights */}
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Insights</h3>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-gray-600">Coverage Rate</p>
                  <p className="font-semibold text-gray-900">
                    {(
                      (overallStats.evaluatedCompanies.hydrogen / overallStats.totalCompanies) *
                      100
                    ).toFixed(1)}
                    % hydrogen evaluated
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Top Category</p>
                  <p className="font-semibold text-gray-900">
                    {
                      Object.entries(overallStats.avgScores).reduce((a, b) =>
                        a[1] > b[1] ? a : b,
                      )[0]
                    }{" "}
                    (avg:{" "}
                    {Object.values(overallStats.avgScores)
                      .reduce((a, b) => Math.max(a, b), 0)
                      .toFixed(1)}
                    )
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Data Freshness</p>
                  <p className="font-semibold text-green-600">Live data connected</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="container mx-auto max-w-7xl px-4 py-8">{renderCurrentView()}</div>

      {/* Enhanced Floating Dock Navigation */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
        <FloatingDock
          items={dockItems}
          desktopClassName="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg"
          mobileClassName="bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg"
        />
      </div>

      {/* Global refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 right-4 z-40">
          <div className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Refreshing data...</span>
          </div>
        </div>
      )}
    </div>
  );
};
