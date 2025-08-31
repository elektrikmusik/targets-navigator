import React, { useMemo } from "react";
import { ScatterPlot } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  FileText,
  Trophy,
  Star,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useStrategicAnalysis, StrategicCompanyData } from "@/hooks";

export const StrategicAnalysisDashboard: React.FC = () => {
  const { companies, stats, loading, error, refresh, getScatterData } = useStrategicAnalysis();

  // Prepare quadrant chart data
  const quadrantChartData = useMemo(() => {
    const quadrants = {
      "Monitor / Opportunistic": { count: 0, companies: [] as StrategicCompanyData[] },
      "Priority leads (Investigate now)": { count: 0, companies: [] as StrategicCompanyData[] },
      "Not a focus": { count: 0, companies: [] as StrategicCompanyData[] },
      "Nurture with Support": { count: 0, companies: [] as StrategicCompanyData[] },
    };

    companies.forEach((company) => {
      if (quadrants[company.quadrant as keyof typeof quadrants]) {
        quadrants[company.quadrant as keyof typeof quadrants].count++;
        quadrants[company.quadrant as keyof typeof quadrants].companies.push(company);
      }
    });

    return quadrants;
  }, [companies]);

  // Scatter plot data for the quadrant chart
  const scatterData = useMemo(() => getScatterData(), [getScatterData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading strategic analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <p className="text-lg font-semibold">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Strategic Analysis Dashboard</h1>
          <p className="text-gray-600">Hydrogen & Manufacturing Sector Analysis</p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button onClick={refresh} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Top Section - Summary Statistics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-600">Total Companies</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</div>
            <p className="text-xs text-gray-500">In Database</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-600">Avg IP Activity Score</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgIPScore}</div>
            <p className="text-xs text-gray-500">Out of 100</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-600">Top Performer</h3>
            </div>
            <div className="text-lg font-bold text-gray-900">{stats.topPerformer}</div>
            <p className="text-xs text-gray-500">Score: {stats.topPerformerScore}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-600">High Performers</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.highPerformersCount}</div>
            <p className="text-xs text-gray-500">Score 80+</p>
          </div>
        </div>

        {/* Average Scores Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.avgHydrogenScore}</div>
              <p className="text-xs text-gray-500">Hydrogen</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.avgIndustryScore}</div>
              <p className="text-xs text-gray-500">Industry</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.avgManufacturingScore}</div>
              <p className="text-xs text-gray-500">Manufacturing</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.avgFinancialScore}</div>
              <p className="text-xs text-gray-500">Financial</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{stats.avgOwnershipScore}</div>
              <p className="text-xs text-gray-500">Ownership</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">{stats.avgIPScore}</div>
              <p className="text-xs text-gray-500">IP Activity</p>
            </div>
          </div>
        </div>

        {/* Main Content - Quadrant Chart and Flag Market */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Quadrant Chart Section */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Company Analysis Quadrant</h2>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Y-axis (Ability to Execute):</strong> How capable they are of moving
                    forward with Ceres, considering IP, Revenue, Ownership with bonus and demerit on
                    IP and Revenue.
                  </p>
                  <p>
                    <strong>X-axis (Strategic Fit):</strong> How aligned they are with our value
                    proposition, considering Industry fit, H2 strategy, Manufacturing Capability
                    with bonus and demerit on manufacturing capability.
                  </p>
                </div>
              </div>
              <div className="h-96">
                <ScatterPlot
                  data={[
                    {
                      x: scatterData.map((d) => d.x),
                      y: scatterData.map((d) => d.y),
                      mode: "markers" as const,
                      name: "Companies",
                      marker: {
                        size: scatterData.map((d) => d.marker.size),
                        color: scatterData.map((d) => d.marker.color),
                        colorscale: "Viridis",
                        showscale: false,
                      },
                    },
                  ]}
                  title="Strategic Positioning Matrix"
                  xAxisTitle="Strategic Fit"
                  yAxisTitle="Ability to Execute"
                  height={400}
                />
              </div>

              {/* Quadrant Labels and Counts */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center">
                  <h4 className="font-semibold text-yellow-800">Monitor / Opportunistic</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {quadrantChartData["Monitor / Opportunistic"].count}
                  </p>
                  <p className="text-xs text-yellow-700">companies</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <h4 className="font-semibold text-red-800">Priority leads (Investigate now)</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {quadrantChartData["Priority leads (Investigate now)"].count}
                  </p>
                  <p className="text-xs text-red-700">companies</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
                  <h4 className="font-semibold text-gray-800">Not a focus</h4>
                  <p className="text-2xl font-bold text-gray-600">
                    {quadrantChartData["Not a focus"].count}
                  </p>
                  <p className="text-xs text-gray-700">companies</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                  <h4 className="font-semibold text-blue-800">Nurture with Support</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {quadrantChartData["Nurture with Support"].count}
                  </p>
                  <p className="text-xs text-blue-700">companies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flag Market Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold">Flag Market</h3>
              <div className="space-y-3">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="relative">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Flag Market</span>
                      <div className="flex gap-1">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${(100 / Math.max(stats.totalCompanies, 1)) * 100}%` }}
                      />
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${(stats.priorityTargets / Math.max(stats.totalCompanies, 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                      <span>{100} analyzed</span>
                      <span>{stats.priorityTargets} Priority targets</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Examples by Quadrant */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-bold">Priority Leads - Examples</h3>
            <div className="space-y-2">
              {quadrantChartData["Priority leads (Investigate now)"].companies
                .slice(0, 8)
                .map((company, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-red-50 p-2"
                  >
                    <span className="text-sm font-medium">{company.name}</span>
                    <Badge variant="destructive">Priority</Badge>
                  </div>
                ))}
              {quadrantChartData["Priority leads (Investigate now)"].companies.length === 0 && (
                <p className="text-sm text-gray-500">No priority leads found</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-bold">Monitor & Nurture - Examples</h3>
            <div className="space-y-2">
              {[
                ...quadrantChartData["Monitor / Opportunistic"].companies.slice(0, 4),
                ...quadrantChartData["Nurture with Support"].companies.slice(0, 4),
              ].map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-blue-50 p-2"
                >
                  <span className="text-sm font-medium">{company.name}</span>
                  <Badge variant="secondary">
                    {company.quadrant.includes("Monitor") ? "Monitor" : "Nurture"}
                  </Badge>
                </div>
              ))}
              {quadrantChartData["Monitor / Opportunistic"].companies.length === 0 &&
                quadrantChartData["Nurture with Support"].companies.length === 0 && (
                  <p className="text-sm text-gray-500">No monitor or nurture companies found</p>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Powered by <span className="font-semibold">ceres</span> - Strategic Analysis Platform
          </p>
        </div>
      </div>
    </div>
  );
};
