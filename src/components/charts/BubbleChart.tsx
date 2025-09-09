import Plot from "react-plotly.js";
import { useMemo } from "react";

export interface BubbleDataPoint {
  /** Company or item name */
  name: string;
  /** Strategic Fit score (X-axis) - typically 0-100 */
  strategicFit: number;
  /** Ability to Execute score (Y-axis) - typically 0-100 */
  abilityToExecute: number;
  /** Overall Score (bubble size) - typically 0-100 */
  overallScore: number;
  /** Optional category for color coding */
  category?: string;
  /** Optional additional metadata */
  metadata?: Record<string, unknown>;
}

export interface BubbleChartProps {
  /** Array of data points for the bubble chart */
  data: BubbleDataPoint[];
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
  /** Color scheme for categories */
  colorScheme?: string[];
  /** Minimum bubble size */
  minBubbleSize?: number;
  /** Maximum bubble size */
  maxBubbleSize?: number;
  /** Enable hover interactions */
  enableHover?: boolean;
  /** Custom hover template */
  hoverTemplate?: string;
  /** Callback when a bubble is clicked */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBubbleClick?: (dataPoint: BubbleDataPoint, event: any) => void;
  /** Callback when a bubble is hovered */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onBubbleHover?: (dataPoint: BubbleDataPoint, event: any) => void;
  /** Show grid lines */
  showGrid?: boolean;
  /** Axis range for X-axis [min, max] */
  xAxisRange?: [number, number];
  /** Axis range for Y-axis [min, max] */
  yAxisRange?: [number, number];
}

const DEFAULT_COLOR_SCHEME = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6366F1", // Indigo
];

export const BubbleChart = ({
  data,
  title = "Strategic Analysis Bubble Chart",
  xAxisTitle = "Strategic Fit",
  yAxisTitle = "Ability to Execute",
  height = 500,
  width,
  showLegend = true,
  colorScheme = DEFAULT_COLOR_SCHEME,
  minBubbleSize = 5,
  maxBubbleSize = 50,
  enableHover = true,
  hoverTemplate,
  onBubbleClick,
  onBubbleHover,
  showGrid = true,
  xAxisRange,
  yAxisRange,
}: BubbleChartProps) => {
  // Process data and create traces
  const { traces } = useMemo(() => {
    if (!data || data.length === 0) {
      return { traces: [] };
    }

    // Get unique categories
    const uniqueCategories = Array.from(new Set(data.map((d) => d.category).filter(Boolean)));

    // Calculate data ranges for scaling
    const overallScoreValues = data.map((d) => d.overallScore);
    const minOverallScore = Math.min(...overallScoreValues);
    const maxOverallScore = Math.max(...overallScoreValues);

    // Scale bubble sizes
    const scaleBubbleSize = (score: number) => {
      const normalized = (score - minOverallScore) / (maxOverallScore - minOverallScore);
      return minBubbleSize + normalized * (maxBubbleSize - minBubbleSize);
    };

    // Create traces for each category
    const traces =
      uniqueCategories.length > 0
        ? uniqueCategories.map((category, index) => {
            const categoryData = data.filter((d) => d.category === category);
            return {
              x: categoryData.map((d) => d.strategicFit),
              y: categoryData.map((d) => d.abilityToExecute),
              mode: "markers" as const,
              type: "scatter" as const,
              name: category,
              text: categoryData.map((d) => d.name),
              textposition: "top center" as const,
              textfont: {
                size: 10,
                color: "#374151",
              },
              marker: {
                size: categoryData.map((d) => scaleBubbleSize(d.overallScore)),
                color: colorScheme[index % colorScheme.length],
                opacity: 0.7,
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
                  `${xAxisTitle}: %{x}<br>` +
                  `${yAxisTitle}: %{y}<br>` +
                  "Overall Score: %{marker.size}<br>" +
                  "<extra></extra>",
              customdata: categoryData,
            };
          })
        : [
            {
              x: data.map((d) => d.strategicFit),
              y: data.map((d) => d.abilityToExecute),
              mode: "markers" as const,
              type: "scatter" as const,
              name: "Data Points",
              text: data.map((d) => d.name),
              textposition: "top center" as const,
              textfont: {
                size: 10,
                color: "#374151",
              },
              marker: {
                size: data.map((d) => scaleBubbleSize(d.overallScore)),
                color: colorScheme[0],
                opacity: 0.7,
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
                  `${xAxisTitle}: %{x}<br>` +
                  `${yAxisTitle}: %{y}<br>` +
                  "Overall Score: %{marker.size}<br>" +
                  "<extra></extra>",
              customdata: data,
            },
          ];

    return { traces };
  }, [data, colorScheme, minBubbleSize, maxBubbleSize, xAxisTitle, yAxisTitle, hoverTemplate]);

  // Handle click events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = (event: any) => {
    if (onBubbleClick && event.points && event.points.length > 0) {
      const point = event.points[0];
      const dataPoint = point.customdata[point.pointIndex];
      onBubbleClick(dataPoint, event);
    }
  };

  // Handle hover events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleHover = (event: any) => {
    if (onBubbleHover && event.points && event.points.length > 0) {
      const point = event.points[0];
      const dataPoint = point.customdata[point.pointIndex];
      onBubbleHover(dataPoint, event);
    }
  };

  return (
    <div className="h-full w-full">
      <Plot
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={traces as any}
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
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
        onHover={handleHover}
      />
    </div>
  );
};
