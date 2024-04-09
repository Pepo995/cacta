import { useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
  type ScriptableContext,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { type ChartDataBarChart, type DataTypeBarChart } from "~/utils/chartTypes";
import { isSelected } from "~/utils/helperFunctions";
import { round } from "~/utils/mathHelpers";
import { type ModeType } from "~/utils/types";

export type ChartProps = {
  chartData: ChartDataBarChart;
  selectedProductIds?: string[];
  mode?: ModeType;
  barWidth?: number;
  labelsSize?: number;
  maxYValue?: number;
  unit?: string;
};

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const createLinearGradient = (
  context: ScriptableContext<"bar">,
  color1: string,
  color2: string,
) => {
  if (!context.chart.chartArea || !context.chart.scales.y) {
    return;
  }

  const ctx = context.chart.ctx;
  const index = context.dataIndex;

  const { value } = context.dataset.data[index] as unknown as DataTypeBarChart;

  const chartHeight = context.chart.chartArea.height;
  const top = context.chart.chartArea.top;

  const maxValue = context.chart.scales.y.max;
  const minValue = context.chart.scales.y.min;

  const negativeValues = (-minValue * chartHeight) / (maxValue - minValue);
  const height = (value * chartHeight) / (maxValue - minValue);

  const gradient = ctx.createLinearGradient(
    0,
    chartHeight - negativeValues - height + top,
    0,
    chartHeight - negativeValues + top,
  );

  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  return gradient;
};

const BarChart = ({
  chartData,
  selectedProductIds,
  mode,
  barWidth,
  labelsSize,
  maxYValue,
  unit,
}: ChartProps) => {
  Chart.defaults.datasets.bar.barThickness = barWidth ?? 45;

  const [duration, setDuration] = useState<number>();

  return (
    <Bar
      data={{
        datasets: chartData.datasets,
        labels: chartData.datasets[0]?.data.map((data) => data.label),
      }}
      options={{
        animation: {
          duration: duration,
          onComplete: () => !duration && setDuration(0),
        },
        parsing: { yAxisKey: "value", xAxisKey: "label" },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          bar: {
            backgroundColor: (context) => {
              if (context.datasetIndex === 0) {
                if (selectedProductIds?.length === 0 || !selectedProductIds) {
                  return createLinearGradient(context, "#EB5444", "#EA40A6");
                }

                const data = context.dataset.data[context.dataIndex] as unknown as DataTypeBarChart;

                if (data.id && isSelected(data.id, selectedProductIds)) {
                  return createLinearGradient(context, "#EB5444", "#EA40A6");
                }

                return "#DFE3E8";
              } else {
                return "#DFE3E8";
              }
            },
            borderWidth: (context) => {
              if (context.datasetIndex !== 0) {
                return 1;
              }
            },
            borderColor: (context) => {
              if (context.datasetIndex !== 0) {
                return "#919EAB";
              }
            },
            borderRadius: 8,
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: {
              padding: 10,
              color: "#919EAB",
              maxRotation: 0,
              autoSkip: false,
              font: {
                size: labelsSize,
                family: "Poppins",
              },
            },
          },
          y: {
            max: maxYValue,
            ticks: {
              font: {
                size: labelsSize,
                family: "Poppins",
              },
              stepSize: mode === "absolute" ? 15 : undefined,
              precision: 10,
              padding: 10,
              callback(tickValue) {
                return `${tickValue}${unit ?? ""}`;
              },
              color: "#919EAB",
            },
            grid: { drawTicks: false, color: "#919EAB33" },
            border: { display: false, dash: [3] },
          },
        },
        plugins: {
          datalabels: { display: false },
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: "nearest",
            displayColors: false,
            yAlign: "bottom",
            callbacks: {
              title: () => "",
              label(tooltipItem) {
                const datasets = tooltipItem.chart.data.datasets;
                const datasetIndex = tooltipItem.datasetIndex;
                const dataIndex = tooltipItem.dataIndex;

                if (datasets.length > 1 && datasetIndex === 1) {
                  const dataDataset0 = datasets[0]?.data[dataIndex] as unknown as DataTypeBarChart;

                  const dataDataset1 = datasets[1]?.data[dataIndex] as unknown as DataTypeBarChart;

                  return dataDataset0.value === dataDataset1.value ? "" : round(dataDataset1.value);
                }

                const data = tooltipItem.raw as DataTypeBarChart;
                return round(data.value);
              },
            },
          },
        },
      }}
    />
  );
};

export default BarChart;
