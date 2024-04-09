import React from "react";
import { type Activity } from "@cacta/db";
import { ArcElement, Chart, RadialLinearScale, type ScriptableContext } from "chart.js";
import ChartDataLabels, { type Context } from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

import { type ChartDataDoughnutChart, type DataTypeDoughnutChart } from "~/utils/chartTypes";
import { isSelected } from "~/utils/helperFunctions";
import { round } from "~/utils/mathHelpers";

type ChartProps = {
  chartData: ChartDataDoughnutChart;
  selectedActivities: Activity[];
};

Chart.register(RadialLinearScale, ArcElement, ChartDataLabels);

export const createLinearGradient = (
  context: ScriptableContext<"doughnut" | "bar"> | Context,
  color1: string,
  color2: string,
) => {
  if (!context.chart.chartArea) {
    return;
  }

  const ctx = context.chart.ctx;

  const top = context.chart.chartArea.top;
  const bottom = context.chart.chartArea.bottom;
  const left = context.chart.chartArea.left;
  const right = context.chart.chartArea.right;

  const gradient = ctx.createLinearGradient(top, left, bottom, right);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  return gradient;
};

const DoughnutChart = ({ chartData, selectedActivities }: ChartProps) => (
  <Doughnut
    data={chartData}
    options={{
      parsing: { key: "value" },
      maintainAspectRatio: false,
      layout: { padding: { top: 30, bottom: 30, right: 145, left: 145 } },
      cutout: "60%",
      events: [],
      elements: {
        arc: {
          backgroundColor: function (context) {
            const data = context.dataset.data[
              context.dataIndex
            ] as unknown as DataTypeDoughnutChart;

            if (!isSelected(data.id, selectedActivities) && selectedActivities.length > 0)
              return "#DFE3E8";

            if (context.dataIndex === 0) {
              return createLinearGradient(context, "#FFAB00", "#B76E00");
            } else if (context.dataIndex === 1) {
              return createLinearGradient(context, "#b76e0099", "#ffab0099");
            } else {
              return createLinearGradient(context, "#ffab003d", "#b76e003d");
            }
          },
          hoverBorderColor: "#ffffff",
          borderWidth: 2,
        },
      },
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
        datalabels: {
          padding: {
            top: 4,
            bottom: 2,
          },
          anchor: "end",
          align: "end",
          offset: 10,
          font: {
            family: "Poppins",
          },
          display: (context) => {
            const dataIndex = context.dataIndex;
            const data = context.dataset.data as unknown as DataTypeDoughnutChart[];
            const activity = data[dataIndex]?.id ?? "";

            if (isSelected(activity, selectedActivities)) return true;

            return "auto";
          },

          borderRadius: 4,
          color: (context) => {
            const dataIndex = context.dataIndex;
            const data = context.dataset.data as unknown as DataTypeDoughnutChart[];
            const activity = data[dataIndex]?.id ?? "";

            if (!isSelected(activity, selectedActivities) && selectedActivities.length > 0)
              return "#DFE3E8ba";

            if (context.dataIndex === 0 || context.dataIndex === 1) {
              return "white";
            }
            return "black";
          },
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(-10, -10, 20, 50);

            const dataIndex = context.dataIndex;
            const data = context.dataset.data as unknown as DataTypeDoughnutChart[];
            const activity = data[dataIndex]?.id ?? "";

            if (!isSelected(activity, selectedActivities) && selectedActivities.length > 0)
              return "#DFE3E850";

            if (dataIndex === 0) {
              gradient.addColorStop(0, "#FFAB00");
              gradient.addColorStop(1, "#B76E00");
              return gradient;
            } else if (dataIndex === 1) {
              gradient.addColorStop(0, "#ffab0099");
              gradient.addColorStop(1, "#b76e0099");
              return gradient;
            } else {
              gradient.addColorStop(0, "#ffab003d");
              gradient.addColorStop(1, "#b76e003d");
              return gradient;
            }
          },
          formatter: function (value, context) {
            const dataValue = value as DataTypeDoughnutChart;

            return `${context?.chart?.data?.labels?.[context.dataIndex] as string}: ${round(
              parseFloat(dataValue.value),
              1,
              true,
            )}%`;
          },
        },
      },
    }}
  />
);

export default DoughnutChart;
