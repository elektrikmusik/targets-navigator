import Plot from "react-plotly.js";

interface BarChartProps {
  data: Array<{
    x: string[];
    y: number[];
    name?: string;
    type?: "bar";
    marker?: {
      color?: string | string[];
    };
  }>;
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  height?: number;
  width?: number;
  orientation?: "v" | "h";
}

export const BarChart = ({
  data,
  title = "Bar Chart",
  xAxisTitle = "Categories",
  yAxisTitle = "Values",
  height = 400,
  width,
  orientation = "v",
}: BarChartProps) => {
  return (
    <Plot
      data={data.map((trace) => ({
        ...trace,
        type: "bar",
        orientation: orientation,
      }))}
      layout={{
        title: { text: title },
        xaxis: {
          title: { text: xAxisTitle },
        },
        yaxis: {
          title: { text: yAxisTitle },
        },
        height: height,
        width: width,
        autosize: true,
        barmode: "group",
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
