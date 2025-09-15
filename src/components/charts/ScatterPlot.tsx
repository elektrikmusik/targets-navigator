import Plot from "react-plotly.js";

interface ScatterPlotProps {
  data: Array<{
    x: number[];
    y: number[];
    mode?: "markers" | "lines" | "lines+markers";
    name?: string;
    marker?: {
      size?: number | number[];
      color?: string | string[] | number[];
      colorscale?: string;
      showscale?: boolean;
    };
  }>;
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  height?: number;
  width?: number;
}

export const ScatterPlot = ({
  data,
  title = "Scatter Plot",
  xAxisTitle = "X Axis",
  yAxisTitle = "Y Axis",
  height = 400,
  width,
}: ScatterPlotProps) => {
  return (
    <Plot
      data={data.map((trace) => ({
        ...trace,
        type: "scatter",
        mode: trace.mode || "markers",
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
