import Plot from "react-plotly.js";

interface PieChartProps {
  data: {
    values: number[];
    labels: string[];
    colors?: string[];
  };
  title?: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
}

export const PieChart = ({
  data,
  title = "Pie Chart",
  height = 400,
  width,
  showLegend = true,
}: PieChartProps) => {
  return (
    <Plot
      data={[
        {
          values: data.values,
          labels: data.labels,
          type: "pie",
          marker: {
            colors: data.colors,
          },
          textinfo: "label+percent",
          textposition: "outside",
          automargin: true,
        },
      ]}
      layout={{
        title: { text: title },
        height: height,
        width: width,
        autosize: true,
        showlegend: showLegend,
        margin: {
          l: 20,
          r: 20,
          t: 60,
          b: 20,
        },
      }}
      config={{
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ["pan2d", "lasso2d"],
      }}
      className="plotly-chart"
    />
  );
};
