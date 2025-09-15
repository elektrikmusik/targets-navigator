import React from "react";
import { Card } from "../ui/card";
import Plot from "react-plotly.js";

interface RegionalCoverageCardProps {
  region: string;
  total: number;
  priority: number;
  icon: string;
}

const RegionalCoverageCard: React.FC<RegionalCoverageCardProps> = ({
  region,
  total,
  priority,
  icon,
}) => {
  // Dynamic text size based on region name length
  const getTextSize = (regionName: string) => {
    const length = regionName.length;
    if (length <= 8) return "text-lg"; // Short names like "ASIA", "EUROPE"
    if (length <= 15) return "text-base"; // Medium names like "AMERICAS"
    if (length <= 25) return "text-sm"; // Long names like "MIDDLE EAST NORTH AFRICA"
    return "text-xs"; // Very long names
  };

  // Calculate rotation so orange section starts at 12:00 and gray section ends at 12:00
  const getRotation = () => {
    // Orange section starts at 12:00 (0 degrees) and extends clockwise
    // Gray section then completes the circle, ending at 12:00
    // No rotation needed - orange starts at top, gray ends at top
    return 0;
  };

  return (
    <Card className="regional-card">
      {/* Top Section - Map Icon, Region Name, and Companies Count */}
      <div className="mb-4 flex items-start space-x-3">
        <div className="text-4xl">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3
            className={`${getTextSize(region)} text-purple mb-1 truncate font-bold`}
            title={region}
          >
            {region}
          </h3>
          <p className="text-purple text-sm">{total} companies analysed</p>
        </div>
      </div>

      {/* Divider Line */}
      <div className="regional-divider bg-purple"></div>

      {/* Bottom Section - Priority Targets and Doughnut Chart */}
      <div className="flex items-center space-x-4">
        {/* Priority Targets Text */}
        <div className="flex-1">
          <p className="text-orange text-sm font-medium">{priority} priority targets</p>
          <div className="regional-priority-line bg-orange"></div>
        </div>

        {/* Doughnut Chart */}
        <div className="relative h-24 w-24 flex-shrink-0">
          <Plot
            data={[
              {
                values: [priority, total - priority],
                labels: ["Priority", "Total"],
                type: "pie",
                hole: 0.6,
                marker: {
                  colors: ["#e87722", "#59315f"],
                  line: {
                    width: 0,
                  },
                },
                textinfo: "none",
                hoverinfo: "none",
                showlegend: false,
                rotation: getRotation(),
              },
            ]}
            layout={{
              width: 96,
              height: 96,
              margin: { l: 0, r: 0, t: 0, b: 0 },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
              font: { size: 12 },
            }}
            config={{
              displayModeBar: false,
              staticPlot: true,
            }}
          />
          {/* Center text overlay */}
          <div className="chart-center-overlay">
            <span className="text-orange text-xl font-bold">{priority}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RegionalCoverageCard;
