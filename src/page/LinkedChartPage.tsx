"use client";

import { useState, useMemo, useRef } from "react";
import { CompanyOverview } from "@/lib/supabase";
import { LinkedChart } from "@/components/charts/LinkedChart";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, X, Download, Building2, EyeOff } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { ICON_SIZES, LOADING_DIMENSIONS, GRID_CONFIGS } from "@/constants/dimensions";

// Selected company details component
const SelectedCompanyDetails = ({
  selectedCompany,
  onClearSelection,
}: {
  selectedCompany: CompanyOverview;
  onClearSelection: () => void;
}) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">
            <Building2 className={ICON_SIZES.md} />
            {selectedCompany.englishName || selectedCompany.companyName}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClearSelection}>
            <EyeOff className={`${ICON_SIZES.sm} mr-2`} />
            Clear Selection
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className={GRID_CONFIGS.companyInfo}>
          <div>
            <div className="text-sm font-medium text-blue-700">Strategic Fit</div>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.strategicFit?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700">Ability to Execute</div>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.abilityToExecute?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700">Overall Score</div>
            <div className="text-lg font-bold text-blue-600">
              {selectedCompany.overallScore?.toFixed(1) || "N/A"}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-blue-700">Tier</div>
            <div className="text-sm text-blue-600">{selectedCompany.Tier || "Unknown"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LinkedChartPage = () => {
  const { data, loading, error } = useCompanyOverview();
  const [selectedCompany, setSelectedCompany] = useState<CompanyOverview | null>(null);
  const [searchTerm] = useState("");

  // Debug logging - only log when values actually change
  const prevDataRef = useRef<
    { dataLength: number; loading: boolean; error: string | null } | undefined
  >(undefined);
  const currentStatus = {
    dataLength: data?.length || 0,
    loading,
    error,
    hasData: !!(data && data.length > 0),
  };

  if (JSON.stringify(prevDataRef.current) !== JSON.stringify(currentStatus)) {
    console.log("LinkedChartPage - Data status:", currentStatus);
    prevDataRef.current = currentStatus;
  }

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!data) return [];

    if (!searchTerm) return data;

    return data.filter(
      (company) =>
        company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.primaryMarket?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  // Handle company selection
  const handleCompanySelect = (company: CompanyOverview | null) => {
    setSelectedCompany(company);
  };

  const clearSelection = () => {
    setSelectedCompany(null);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
        <div className="text-center">
          <div className="mb-4 text-blue-500">Loading data...</div>
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
        <div className="text-center">
          <div className="mb-4 text-red-500">Error loading data: {error}</div>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className={`${ICON_SIZES.sm} mr-2`} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="w-full px-4 py-8">
        <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
          <div className="text-center">
            <div className="mb-4 text-gray-500">No data available</div>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className={`${ICON_SIZES.sm} mr-2`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<DashboardSkeleton />}>
      <div className="flex h-screen flex-col bg-gray-50">
        <div className="flex w-full min-w-0 flex-1 flex-col px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex-shrink-0">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold text-gray-900 lg:text-3xl">
                  Strategic Mapping Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600 lg:text-base">
                  Interactive bubble chart with synchronized table view for comprehensive company
                  analysis
                </p>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  disabled={!selectedCompany}
                >
                  <X className={`${ICON_SIZES.sm} mr-2`} />
                  Clear Selection
                </Button>
                <Button variant="outline" size="sm">
                  <Download className={`${ICON_SIZES.sm} mr-2`} />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Linked Chart */}
          <div className="min-h-0 flex-1">
            <LinkedChart
              data={filteredData}
              loading={loading}
              title=""
              enableTableSync={true}
              enableChartInteractions={true}
              enableFiltering={true}
              enableSearch={true}
              onCompanySelect={handleCompanySelect}
            />
          </div>

          {/* Selected Company Details */}
          {selectedCompany && (
            <div className="mt-6 flex-shrink-0">
              <SelectedCompanyDetails
                selectedCompany={selectedCompany}
                onClearSelection={clearSelection}
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
