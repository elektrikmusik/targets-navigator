import { useState } from "react";
import { CompanyBubbleChart } from "./CompanyBubbleChart";
import { CompanyOverview } from "@/lib/supabase";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CHART_DIMENSIONS, CHART_RANGES } from "@/constants/dimensions";

interface CompanyBubbleChartExampleProps {
  data: CompanyOverview[];
  loading?: boolean;
}

export const CompanyBubbleChartExample = ({
  data,
  loading = false,
}: CompanyBubbleChartExampleProps) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyOverview | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [filterTiers, setFilterTiers] = useState<string[]>([]);

  const handleBubbleClick = (company: CompanyOverview) => {
    setSelectedCompany(company);
    console.log("Company clicked:", company);
  };

  const handleBubbleHover = (company: CompanyOverview) => {
    // You could show a tooltip or update state here
    console.log("Company hovered:", company);
  };

  const availableTiers = Array.from(new Set(data.map((d) => d.Tier).filter(Boolean))) as string[];

  const toggleTierFilter = (tier: string) => {
    setFilterTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier],
    );
  };

  const clearFilters = () => {
    setFilterTiers([]);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Company Strategic Analysis</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowLegend(!showLegend)}>
              {showLegend ? "Hide" : "Show"} Legend
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
              {showGrid ? "Hide" : "Show"} Grid
            </Button>
          </div>
        </div>

        {/* Tier Filter */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by Tier:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
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
                onClick={() => toggleTierFilter(tier)}
                className="text-xs"
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-96">
          <CompanyBubbleChart
            data={data}
            title="Company Portfolio Analysis"
            xAxisTitle="Strategic Fit"
            yAxisTitle="Ability to Execute"
            height={CHART_DIMENSIONS.getChartRatio(0.4)(window.innerHeight)}
            showLegend={showLegend}
            showGrid={showGrid}
            filterTiers={filterTiers.length > 0 ? filterTiers : undefined}
            onBubbleClick={handleBubbleClick}
            onBubbleHover={handleBubbleHover}
            xAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
            yAxisRange={[CHART_RANGES.score.min, CHART_RANGES.score.max]}
          />
        </div>
      </div>

      {selectedCompany && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-medium text-blue-900">
            Selected Company: {selectedCompany.englishName || selectedCompany.companyName}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <span className="font-medium text-blue-700">Strategic Fit:</span>
              <span className="ml-2 text-blue-600">
                {selectedCompany.strategicFit?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Ability to Execute:</span>
              <span className="ml-2 text-blue-600">
                {selectedCompany.abilityToExecute?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Overall Score:</span>
              <span className="ml-2 text-blue-600">
                {selectedCompany.overallScore?.toFixed(1) || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Tier:</span>
              <span className="ml-2">
                <Badge variant="outline" className="text-xs">
                  {selectedCompany.Tier || "Unknown"}
                </Badge>
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-blue-200 pt-3">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div>
                <span className="font-medium text-blue-700">Country:</span>
                <span className="ml-2 text-blue-600">{selectedCompany.country || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Primary Market:</span>
                <span className="ml-2 text-blue-600">{selectedCompany.primaryMarket || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-blue-700">Annual Revenue:</span>
                <span className="ml-2 text-blue-600">
                  {selectedCompany.annual_revenue
                    ? `$${selectedCompany.annual_revenue.toFixed(1)}B`
                    : "N/A"}
                </span>
              </div>
            </div>
            {selectedCompany.website && (
              <div className="mt-2">
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Visit Company Website →
                </a>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setSelectedCompany(null)}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="mb-2 text-lg font-medium text-gray-900">Chart Features</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>
            • <strong>X-axis:</strong> Strategic Fit (0-10 scale)
          </li>
          <li>
            • <strong>Y-axis:</strong> Ability to Execute (0-10 scale)
          </li>
          <li>
            • <strong>Bubble Size:</strong> Overall Score (0-10 scale)
          </li>
          <li>
            • <strong>Colors:</strong> Categorized by company tier
          </li>
          <li>
            • <strong>Interactive:</strong> Click and hover for company details
          </li>
          <li>
            • <strong>Filtering:</strong> Filter by company tiers
          </li>
          <li>
            • <strong>Responsive:</strong> Adapts to container size
          </li>
          <li>
            • <strong>Data Source:</strong> Integrated with existing company table data
          </li>
        </ul>
      </div>
    </div>
  );
};
