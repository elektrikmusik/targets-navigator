import React from "react";
import { Card } from "../ui/card";
import Plot from "react-plotly.js";

interface TerritoryData {
  name: string;
  total: number;
  priority: number;
  flag: string;
}

interface BusinessTerritoriesCoverageProps {
  data: TerritoryData[];
}

const BusinessTerritoriesCoverage: React.FC<BusinessTerritoriesCoverageProps> = ({ data }) => {
  // Sort data by priority in descending order
  const sortedData = [...data].sort((a, b) => b.priority - a.priority);

  // Prepare data for stacked bar chart
  // Note: In Plotly stacked bars, first item is bottom, second item is top
  const chartData = [
    {
      x: sortedData.map((territory) => territory.name),
      y: sortedData.map((territory) => territory.total - territory.priority),
      name: "Non-Priority",
      type: "bar" as const,
      marker: { color: "#59315F" },
      text: "",
      textposition: "none" as const,
      hovertemplate: "<b>%{x}</b><br>Non-Priority: %{y}<br><extra></extra>",
    },
    {
      x: sortedData.map((territory) => territory.name),
      y: sortedData.map((territory) => territory.priority),
      name: "Priority",
      type: "bar" as const,
      marker: { color: "#e87722" },
      text: sortedData.map((territory) => territory.priority.toString()),
      textposition: "inside" as const,
      hovertemplate: "<b>%{x}</b><br>Priority: %{y}<br><extra></extra>",
    },
  ];

  const layout = {
    xaxis: {
      showgrid: false,
      tickfont: { size: 16 },
      showline: false,
      zeroline: false,
    },
    yaxis: {
      showgrid: false,
      showline: false,
      zeroline: false,
      showticklabels: false,
      title: { text: "" },
    },
    barmode: "stack" as const,
    showlegend: true,
    legend: {
      orientation: "v" as const,
      x: 1.02,
      xanchor: "left" as const,
      y: 0.5,
      yanchor: "middle" as const,
      font: { size: 12 },
    },
    margin: { t: 20, r: 120, b: 20, l: 60 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    font: { family: "Inter, system-ui, sans-serif" },
    annotations: sortedData.map((territory) => ({
      x: territory.name,
      y: territory.total + 5,
      text: `<span style="font-size: 16px;">${territory.flag}</span> ${territory.total}`,
      showarrow: false,
      font: { size: 12, color: "#374151" },
      bgcolor: "white",
      bordercolor: "#e5e7eb",
      borderwidth: 1,
      borderpad: 4,
      yref: "y" as const,
      yshift: 10,
      xanchor: "center" as const,
      yanchor: "bottom" as const,
    })),
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
  };

  return (
    <Card className="bg-white p-6 shadow-lg">
      <div className="space-y-6">
        {/* Stacked Bar Chart */}
        <div className="h-96 w-full">
          <Plot data={chartData} layout={layout} config={config} className="plotly-chart" />
        </div>
      </div>
    </Card>
  );
};

export default BusinessTerritoriesCoverage;
