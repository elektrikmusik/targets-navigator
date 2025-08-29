import { useEffect, useState, useMemo, useCallback } from "react";
import { useCompanyDashboardData } from "@/hooks";
import { LineChart, BarChart, PieChart, ScatterPlot } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Dashboard = () => {
  const { data: companies, loading, error, stats, refresh } = useCompanyDashboardData(); // Fetch all data for comprehensive dashboard

  const [selectedCategory, setSelectedCategory] = useState<
    "hydrogen" | "industry" | "manufacturing" | "financial" | "ownership" | "ip"
  >("hydrogen");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");
  const [chartData, setChartData] = useState<{
    bar?: Array<{ x: string[]; y: number[]; name: string; marker?: { color: string } }>;
    pie?: { values: number[]; labels: string[]; marker?: { colors: string[] } };
    scatter?: Array<{
      x: number[];
      y: number[];
      mode: "markers";
      name: string;
      text: string[];
      marker: {
        size: number[];
        color: number[];
        colorscale: string;
        showscale: boolean;
      };
    }>;
    line?: Array<{
      x: string[];
      y: number[];
      name: string;
      type: "scatter";
      mode: "lines+markers";
      line: { color: string };
    }>;
  }>({});

  const scoreCategories = useMemo(
    () => [
      { key: "hydrogen", label: "Hydrogen Score", color: "#3b82f6", icon: "⚡" },
      { key: "industry", label: "Industry Score", color: "#10b981", icon: "🏭" },
      { key: "manufacturing", label: "Manufacturing Score", color: "#f59e0b", icon: "⚙️" },
      { key: "financial", label: "Financial Score", color: "#ef4444", icon: "💰" },
      { key: "ownership", label: "Ownership Score", color: "#8b5cf6", icon: "👥" },
      { key: "ip", label: "IP Activity Score", color: "#06b6d4", icon: "📄" },
    ],
    [],
  );

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  // Get top performers for selected category
  const topPerformers = useMemo(() => {
    return companies
      .filter((company) => company.scores[selectedCategory] !== null)
      .sort((a, b) => (b.scores[selectedCategory] || 0) - (a.scores[selectedCategory] || 0))
      .slice(0, 10);
  }, [companies, selectedCategory]);

  // Get score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: "Excellent (80-100)", min: 80, max: 100, color: "#10b981" },
      { label: "Good (60-79)", min: 60, max: 79, color: "#3b82f6" },
      { label: "Fair (40-59)", min: 40, max: 59, color: "#f59e0b" },
      { label: "Poor (20-39)", min: 20, max: 39, color: "#ef4444" },
      { label: "Very Poor (0-19)", min: 0, max: 19, color: "#991b1b" },
    ];

    return ranges.map((range) => ({
      ...range,
      count: companies.filter((company) => {
        const score = company.scores[selectedCategory];
        return score !== null && score >= range.min && score <= range.max;
      }).length,
    }));
  }, [companies, selectedCategory]);

  useEffect(() => {
    if (companies.length > 0) {
      // Bar chart for top performers
      const barData = {
        x: topPerformers.map((company) => company.englishName || company.companyName || "Unknown"),
        y: topPerformers.map((company) => company.scores[selectedCategory] || 0),
        name: scoreCategories.find((cat) => cat.key === selectedCategory)?.label || "Score",
        marker: {
          color: scoreCategories.find((cat) => cat.key === selectedCategory)?.color || "#3b82f6",
        },
      };

      // Pie chart for score distribution
      const pieData = {
        values: scoreDistribution.map((d) => d.count),
        labels: scoreDistribution.map((d) => d.label),
        marker: {
          colors: scoreDistribution.map((d) => d.color),
        },
      };

      // Scatter plot for all companies (hydrogen vs industry)
      const validCompanies = companies.filter(
        (company) => company.scores.hydrogen !== null && company.scores.industry !== null,
      );

      const scatterData = {
        x: validCompanies.map((company) => company.scores.hydrogen || 0),
        y: validCompanies.map((company) => company.scores.industry || 0),
        mode: "markers" as const,
        name: "Company Scores",
        text: validCompanies.map(
          (company) =>
            `${company.englishName || company.companyName}<br>` +
            `Financial: ${company.scores.financial || "N/A"}<br>` +
            `Manufacturing: ${company.scores.manufacturing || "N/A"}`,
        ),
        marker: {
          size: validCompanies.map((company) => Math.max((company.scores.financial || 40) / 4, 6)),
          color: validCompanies.map((company) => company.scores.manufacturing || 50),
          colorscale: "Viridis",
          showscale: true,
          line: { width: 1, color: "white" },
        },
      };

      // Line chart showing average scores by category
      const categoryData = scoreCategories.map((category) => {
        const topCompanies = companies
          .filter((company) => company.scores[category.key] !== null)
          .sort((a, b) => (b.scores[category.key] || 0) - (a.scores[category.key] || 0))
          .slice(0, 15);

        return {
          x: topCompanies.map((company) => company.englishName || company.companyName || "Unknown"),
          y: topCompanies.map((company) => company.scores[category.key] || 0),
          name: category.label,
          type: "scatter" as const,
          mode: "lines+markers" as const,
          line: { color: category.color, width: 3 },
          marker: { size: 6, color: category.color },
        };
      });

      setChartData({
        bar: [barData],
        pie: pieData,
        scatter: [scatterData],
        line: categoryData,
      });
    }
  }, [companies, selectedCategory, topPerformers, scoreDistribution, scoreCategories]);

  // Filtered companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(
      (company) =>
        company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [companies, searchTerm]);

  // Performance comparison helper
  const getScoreTrend = (currentScore: number | null, category: string) => {
    if (!currentScore) return null;
    const avgScore = stats.averageScores[category as keyof typeof stats.averageScores];
    if (currentScore > avgScore + 10) return "up";
    if (currentScore < avgScore - 10) return "down";
    return "stable";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching real-time company evaluation data...</p>
          <div className="mx-auto mt-6 w-64">
            <div className="animate-pulse space-y-3">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="h-2 w-3/4 rounded bg-gray-200"></div>
              <div className="h-2 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-red-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Dashboard Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                Real-Time Company Analytics
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Live data from {stats.totalCompanies} companies across 6 evaluation dimensions
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  Live Data Connected
                </span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span>{companies.length} companies loaded</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
              <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={() => window.open("/tables", "_self")}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                View Tables
              </Button>
            </div>
          </div>

          {/* Enhanced Category Selector */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Focus</h3>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                >
                  Overview
                </Button>
                <Button
                  variant={viewMode === "detailed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("detailed")}
                >
                  Detailed
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {scoreCategories.map((category) => {
                const avgScore =
                  stats.averageScores[category.key as keyof typeof stats.averageScores];
                const isSelected = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    onClick={() =>
                      setSelectedCategory(
                        category.key as
                          | "hydrogen"
                          | "industry"
                          | "manufacturing"
                          | "financial"
                          | "ownership"
                          | "ip",
                      )
                    }
                    className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-blue-900" : "text-gray-700"
                        }`}
                      >
                        {category.label.replace(" Score", "")}
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isSelected ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {avgScore.toFixed(1)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">Average Score</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-6xl">📊</div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">No Company Data Available</h2>
            <p className="mb-6 text-gray-600">
              Unable to load company evaluation data. Please check your connection and try again.
            </p>
            <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Data
            </Button>
          </div>
        ) : (
          <>
            {/* Enhanced Key Metrics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-blue-900">Total Companies</h3>
                    <div className="text-3xl font-bold text-blue-600">{stats.totalCompanies}</div>
                    <div className="mt-1 text-sm text-blue-700">In Database</div>
                  </div>
                  <div className="text-3xl text-blue-500">🏢</div>
                </div>
              </div>

              <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-green-900">
                      Avg {scoreCategories.find((cat) => cat.key === selectedCategory)?.label}
                    </h3>
                    <div className="text-3xl font-bold text-green-600">
                      {stats.averageScores[
                        selectedCategory as keyof typeof stats.averageScores
                      ].toFixed(1)}
                    </div>
                    <div className="mt-1 text-sm text-green-700">Out of 100</div>
                  </div>
                  <div className="text-2xl text-green-500">
                    {scoreCategories.find((cat) => cat.key === selectedCategory)?.icon}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-purple-900">Top Performer</h3>
                    <div className="truncate text-lg font-bold text-purple-600">
                      {topPerformers[0]?.englishName || topPerformers[0]?.companyName || "N/A"}
                    </div>
                    <div className="mt-1 text-sm text-purple-700">
                      Score: {topPerformers[0]?.scores[selectedCategory] || "N/A"}
                    </div>
                  </div>
                  <div className="text-3xl text-purple-500">🏆</div>
                </div>
              </div>

              <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-orange-900">High Performers</h3>
                    <div className="text-3xl font-bold text-orange-600">
                      {
                        companies.filter((company) => (company.scores[selectedCategory] || 0) >= 80)
                          .length
                      }
                    </div>
                    <div className="mt-1 text-sm text-orange-700">Score 80+</div>
                  </div>
                  <div className="text-3xl text-orange-500">⭐</div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Top Performers Bar Chart */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Top 10 Companies -{" "}
                  {scoreCategories.find((cat) => cat.key === selectedCategory)?.label}
                </h3>
                {chartData.bar && (
                  <BarChart
                    data={chartData.bar}
                    xAxisTitle="Companies"
                    yAxisTitle="Score"
                    height={300}
                  />
                )}
              </div>

              {/* Score Distribution Pie Chart */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Score Distribution -{" "}
                  {scoreCategories.find((cat) => cat.key === selectedCategory)?.label}
                </h3>
                {chartData.pie && <PieChart data={chartData.pie} height={300} />}
              </div>

              {/* Multi-dimensional Scatter Plot */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Company Score Correlation (Hydrogen vs Industry)
                </h3>
                <p className="mb-2 text-xs text-gray-500">
                  Bubble size = Finance Score, Color = Manufacturing Score
                </p>
                {chartData.scatter && (
                  <ScatterPlot
                    data={chartData.scatter}
                    xAxisTitle="Hydrogen Score"
                    yAxisTitle="Industry Score"
                    height={300}
                  />
                )}
              </div>

              {/* Multi-Category Line Chart */}
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Top 10 Companies - All Categories
                </h3>
                {chartData.line && (
                  <LineChart
                    data={chartData.line}
                    xAxisTitle="Companies"
                    yAxisTitle="Score"
                    height={300}
                  />
                )}
              </div>
            </div>

            {/* Company Table */}
            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Company Rankings</h3>
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Company
                      </th>
                      {scoreCategories.map((category) => (
                        <th
                          key={category.key}
                          className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          <div className="flex items-center gap-1">
                            <span>{category.icon}</span>
                            <span>{category.label.replace(" Score", "")}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCompanies.slice(0, 20).map((company) => (
                      <tr key={company.key} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {company.englishName || company.companyName}
                            </div>
                            {company.companyName !== company.englishName && company.englishName && (
                              <div className="text-sm text-gray-500">{company.companyName}</div>
                            )}
                            <div className="mt-1 text-xs text-gray-400">
                              Overall: {company.overallRating}
                            </div>
                          </div>
                        </td>
                        {scoreCategories.map((category) => {
                          const score = company.scores[category.key];
                          const trend = getScoreTrend(score, category.key);
                          return (
                            <td key={category.key} className="px-6 py-4 text-sm whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    !score
                                      ? "bg-gray-100 text-gray-500"
                                      : score >= 80
                                        ? "border border-green-200 bg-green-100 text-green-800"
                                        : score >= 60
                                          ? "border border-blue-200 bg-blue-100 text-blue-800"
                                          : score >= 40
                                            ? "border border-yellow-200 bg-yellow-100 text-yellow-800"
                                            : "border border-red-200 bg-red-100 text-red-800"
                                  }`}
                                >
                                  {score || "N/A"}
                                </span>
                                {trend && (
                                  <span className="text-xs">
                                    {trend === "up" && (
                                      <TrendingUp className="h-3 w-3 text-green-500" />
                                    )}
                                    {trend === "down" && (
                                      <TrendingDown className="h-3 w-3 text-red-500" />
                                    )}
                                    {trend === "stable" && (
                                      <Minus className="h-3 w-3 text-gray-500" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
