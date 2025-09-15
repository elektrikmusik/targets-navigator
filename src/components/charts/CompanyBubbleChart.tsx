import Plot from "react-plotly.js";
import { useMemo } from "react";
import { CompanyOverview } from "@/lib/supabase";

export interface CompanyBubbleChartProps {
  /** Array of company data for the bubble chart */
  data: CompanyOverview[];
  /** Chart title */
  title?: string;
  /** X-axis title */
  xAxisTitle?: string;
  /** Y-axis title */
  yAxisTitle?: string;
  /** Chart height in pixels */
  height?: number;
  /** Chart width in pixels */
  width?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Color scheme for tiers */
  colorScheme?: Record<string, string>;
  /** Minimum bubble size */
  minBubbleSize?: number;
  /** Maximum bubble size */
  maxBubbleSize?: number;
  /** Enable hover interactions */
  enableHover?: boolean;
  /** Custom hover template */
  hoverTemplate?: string;
  /** Callback when a bubble is clicked */
  onBubbleClick?: (company: CompanyOverview, event: React.MouseEvent) => void;
  /** Callback when a bubble is hovered */
  onBubbleHover?: (company: CompanyOverview, event: React.MouseEvent) => void;
  /** Show grid lines */
  showGrid?: boolean;
  /** Axis range for X-axis [min, max] */
  xAxisRange?: [number, number];
  /** Axis range for Y-axis [min, max] */
  yAxisRange?: [number, number];
  /** Filter by specific tiers */
  filterTiers?: string[];
}

const DEFAULT_TIER_COLORS: Record<string, string> = {
  Partner: "#8B5CF6", // Purple
  "Tier 1": "#10B981", // Green
  "Tier 2": "#3B82F6", // Blue
  "Tier 3": "#F59E0B", // Yellow
  "Tier 4": "#EF4444", // Red
  Unknown: "#6B7280", // Gray
};

export const CompanyBubbleChart = ({
  data,
  title = "Company Strategic Analysis",
  xAxisTitle = "Strategic Fit",
  yAxisTitle = "Ability to Execute",
  height = 500,
  width,
  showLegend = true,
  colorScheme = DEFAULT_TIER_COLORS,
  minBubbleSize = 8,
  maxBubbleSize = 50,
  enableHover = true,
  hoverTemplate,
  onBubbleClick,
  onBubbleHover,
  showGrid = true,
  xAxisRange,
  yAxisRange,
  filterTiers,
}: CompanyBubbleChartProps) => {
  // Debug logging removed to prevent infinite re-renders

  // Process data and create traces
  const { traces } = useMemo(() => {
    if (!data || data.length === 0) {
      return { traces: [] };
    }

    // Filter data by tiers if specified
    const filteredData = filterTiers
      ? data.filter((company) => company.Tier && filterTiers.includes(company.Tier))
      : data;

    // Filter out companies without required data
    const validData = filteredData.filter(
      (company) =>
        company.strategicFit !== null &&
        company.abilityToExecute !== null &&
        company.overallScore !== null,
    );

    if (validData.length === 0) {
      return { traces: [] };
    }

    // Get unique tiers
    const uniqueTiers = Array.from(
      new Set(validData.map((d) => d.Tier || "Unknown").filter(Boolean)),
    );

    // Calculate data ranges for scaling
    const overallScoreValues = validData.map((d) => d.overallScore!);
    const minOverallScore = Math.min(...overallScoreValues);
    const maxOverallScore = Math.max(...overallScoreValues);

    // Scale bubble sizes
    const scaleBubbleSize = (score: number) => {
      const normalized = (score - minOverallScore) / (maxOverallScore - minOverallScore);
      return minBubbleSize + normalized * (maxBubbleSize - minBubbleSize);
    };

    // Create traces for each tier
    const traces = uniqueTiers.map((tier) => {
      const tierData = validData.filter((d) => (d.Tier || "Unknown") === tier);
      return {
        x: tierData.map((d) => d.strategicFit!),
        y: tierData.map((d) => d.abilityToExecute!),
        mode: "markers" as const,
        type: "scatter" as const,
        name: tier,
        text: tierData.map((d) => d.englishName || d.companyName || "Unknown Company"),
        textposition: "top center" as const,
        textfont: {
          size: 10,
          color: "#374151",
        },
        marker: {
          size: tierData.map((d) => scaleBubbleSize(d.overallScore!)),
          color: colorScheme[tier] || colorScheme["Unknown"] || "#6B7280",
          opacity: 0.5,
          line: {
            color: "#ffffff",
            width: 2,
          },
          sizemode: "diameter" as const,
          sizeref: 1,
        },
        hovertemplate:
          hoverTemplate ||
          "<b>%{text}</b><br>" +
            `Tier: ${tier}<br>` +
            `${xAxisTitle}: %{x}<br>` +
            `${yAxisTitle}: %{y}<br>` +
            "Overall Score: %{marker.size}<br>" +
            "<extra></extra>",
        customdata: tierData,
      };
    });

    // Debug logging removed to prevent infinite re-renders
    return { traces };
  }, [
    data,
    colorScheme,
    minBubbleSize,
    maxBubbleSize,
    xAxisTitle,
    yAxisTitle,
    hoverTemplate,
    filterTiers,
  ]);

  // Handle click events
  const handleClick = (event: Plotly.PlotMouseEvent) => {
    if (onBubbleClick && event.points && event.points.length > 0) {
      const point = event.points[0];
      if (point.customdata && Array.isArray(point.customdata)) {
        const company = point.customdata[point.pointIndex] as CompanyOverview;
        onBubbleClick(company, event as unknown as React.MouseEvent);
      }
    }
  };

  // Handle hover events
  const handleHover = (event: Plotly.PlotMouseEvent) => {
    if (onBubbleHover && event.points && event.points.length > 0) {
      const point = event.points[0];
      if (point.customdata && Array.isArray(point.customdata)) {
        const company = point.customdata[point.pointIndex] as CompanyOverview;
        onBubbleHover(company, event as unknown as React.MouseEvent);
      }
    }
  };

  // Debug: Check if we have traces
  if (traces.length === 0) {
    // No traces to render, returning empty div
    return (
      <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
        <div className="text-center">
          <div className="mb-2 text-gray-500">No data to display</div>
          <div className="text-sm text-gray-400">Check data format and filters</div>
        </div>
      </div>
    );
  }

  // Rendering Plotly with traces

  return (
    <div className="h-full w-full">
      <Plot
        data={traces as unknown as Plotly.Data[]}
        layout={{
          title: {
            text: title,
            font: {
              size: 18,
              color: "#1F2937",
            },
            x: 0.5,
            xanchor: "center",
          },
          xaxis: {
            title: {
              text: xAxisTitle,
              font: {
                size: 14,
                color: "#374151",
              },
            },
            showgrid: showGrid,
            gridcolor: "#E5E7EB",
            zeroline: false,
            range: xAxisRange,
            tickfont: {
              size: 12,
              color: "#6B7280",
            },
          },
          yaxis: {
            title: {
              text: yAxisTitle,
              font: {
                size: 14,
                color: "#374151",
              },
            },
            showgrid: showGrid,
            gridcolor: "#E5E7EB",
            zeroline: false,
            range: yAxisRange,
            tickfont: {
              size: 12,
              color: "#6B7280",
            },
          },
          showlegend: showLegend,
          legend: {
            orientation: "v",
            x: 1.02,
            y: 1,
            xanchor: "left",
            yanchor: "top",
            font: {
              size: 12,
              color: "#374151",
            },
          },
          margin: {
            l: 60,
            r: showLegend ? 120 : 60,
            t: 60,
            b: 60,
          },
          height: height,
          width: width,
          autosize: true,
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
          hovermode: enableHover ? "closest" : false,
        }}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: [
            "pan2d",
            "lasso2d",
            "select2d",
            "autoScale2d",
            "resetScale2d",
            "toggleSpikelines",
            "hoverClosestCartesian",
            "hoverCompareCartesian",
          ],
          responsive: true,
        }}
        className="plotly-chart"
        onClick={handleClick}
        onHover={handleHover}
      />
    </div>
  );
};
