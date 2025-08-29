import Plot from "react-plotly.js";

interface LineChartProps {
  data: Array<{
    x: (string | number | Date)[];
    y: number[];
    name?: string;
    type?: "scatter";
    mode?: "lines" | "markers" | "lines+markers";
    line?: {
      color?: string;
      width?: number;
    };
  }>;
  title?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
  height?: number;
  width?: number;
}

export const LineChart = ({
  data,
  title = "Line Chart",
  xAxisTitle = "X Axis",
  yAxisTitle = "Y Axis",
  height = 400,
  width,
}: LineChartProps) => {
  return (
    <Plot
      data={data.map((trace) => ({
        ...trace,
        type: "scatter",
        mode: trace.mode || "lines",
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
      style={{ width: "100%", height: "100%" }}
    />
  );
};
