import React, { useState, type Dispatch, type SetStateAction } from "react";
import { type KpiCategory } from "@cacta/db";
import { ArcElement, Chart, RadialLinearScale, type Plugin } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTranslations } from "next-intl";
import { PolarArea } from "react-chartjs-2";

import { type ChartDataPolarChart } from "~/utils/chartTypes";
import { indexToCategoryMap } from "~/hooks/usePolarChart";
import { cn } from "~/utils";

Chart.register(RadialLinearScale, ArcElement, ChartDataLabels);

export type PolarAreaChartProps = {
  chartData: ChartDataPolarChart;
  setSelectedCategory: Dispatch<SetStateAction<KpiCategory | undefined>>;
  logoUrl: string;
};

export const centerImageSize = 20;
const chartSize = 200;

const createRadialGradient = (chart: Chart, color1: string, color2: string, color3: string) => {
  const centerX = chart.chartArea.width / 2;
  const centerY = chart.chartArea.height / 2;
  const r = (chart.width / 2) * ((100 + centerImageSize) / chartSize);

  const ctx = chart.ctx;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);

  gradient.addColorStop(centerImageSize / (100 + centerImageSize), color1);
  gradient.addColorStop((50 + centerImageSize) / (100 + centerImageSize), color2);
  gradient.addColorStop(1, color3);

  return gradient;
};

const angleLines: Plugin<"polarArea"> = {
  id: "angleLines",
  afterDatasetDraw: (chart) => {
    const { ctx } = chart;

    const angleLinesPerQuadrant = chart.data.datasets.map((dataset) => dataset.data.length / 4);

    const getAngles = (amountOfLines: number, startFrom: number) => {
      const step = 90 / amountOfLines;
      const result = [];

      for (let i = 1; i <= amountOfLines; i++) {
        result.push((step * i + startFrom) * (Math.PI / 180));
      }

      return result;
    };

    const angles = [Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];

    angleLinesPerQuadrant.map((item, index) => {
      const quadrantAngles = getAngles(item, (index + 1) * 90);
      angles.push(...quadrantAngles);
    });

    const centerX = chart.chartArea.width / 2;
    const centerY = chart.chartArea.height / 2;

    const radius = ((chart.width / 2) * (100 + centerImageSize)) / chartSize;

    angles.map((angle) => {
      const moveToX = centerX - radius * Math.cos(angle);
      const moveToY = centerY - radius * Math.sin(angle);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(moveToX, moveToY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.closePath();
    });

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#fff";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#c4cdd5";
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
};

const thresholdLines = (text: string): Plugin<"polarArea"> => ({
  id: "thresholdLines",
  afterDatasetDraw: (chart) => {
    const { ctx } = chart;

    const centerX = chart.chartArea.width / 2;
    const centerY = chart.chartArea.height / 2;

    const lineRadius = ((chart.width / 2) * (50 + centerImageSize)) / chartSize;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#8e33ff";
    ctx.setLineDash([5, 5]);
    ctx.arc(centerX, centerY, lineRadius, 0, 2 * Math.PI, false);

    ctx.stroke();

    ctx.font = "10pt Poppins";
    ctx.textAlign = "center";
    ctx.fillStyle = "#8e33ff";

    Array.from(text).map((item, index) => {
      const angle = (index - 15) * 4.5;
      ctx.save();

      ctx.translate(
        centerX + (lineRadius + 5) * Math.cos((angle - 90) * (Math.PI / 180)),
        centerY + (lineRadius + 5) * Math.sin((angle - 90) * (Math.PI / 180)),
      );

      ctx.rotate(angle * (Math.PI / 180));
      ctx.fillText(item, 0, 0);
      ctx.restore();
    });

    ctx.closePath();
    ctx.restore();
  },
});

const centerImage = (
  image: HTMLImageElement,
  fallbackImage: HTMLImageElement,
): Plugin<"polarArea"> => ({
  id: "centerImage",
  afterDatasetDraw: (chart) => {
    const { ctx } = chart;
    const centerX = chart.chartArea.width / 2;
    const centerY = chart.chartArea.height / 2;
    const circleRadius = ((chart.width / 2) * centerImageSize) / chartSize;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.clip();

    const imageProperties = (image: HTMLImageElement) => {
      const minDimension = Math.min(image.width, image.height);
      const maxDimension = Math.max(image.width, image.height);

      const imageMaxDimension =
        circleRadius * 2 - (minDimension !== maxDimension ? (15 * maxDimension) / minDimension : 0);

      let imageWidth, imageHeight;

      if (image.width > image.height) {
        imageWidth = imageMaxDimension;
        imageHeight = (image.height * imageMaxDimension) / image.width;
      } else {
        imageHeight = imageMaxDimension;
        imageWidth = (image.width * imageMaxDimension) / image.height;
      }

      const dx = centerX - imageWidth / 2;
      const dy = centerY - imageHeight / 2;

      return { dx, dy, imageWidth, imageHeight };
    };

    try {
      const { dx, dy, imageWidth, imageHeight } = imageProperties(image);
      ctx.drawImage(image, dx, dy, imageWidth, imageHeight);
    } catch (error) {
      const { dx, dy, imageWidth, imageHeight } = imageProperties(fallbackImage);
      ctx.drawImage(fallbackImage, dx, dy, imageWidth, imageHeight);
    }

    ctx.closePath();
    ctx.restore();
  },
});

const PolarAreaChart = ({ chartData, setSelectedCategory, logoUrl }: PolarAreaChartProps) => {
  const t = useTranslations();

  const [hoveredData, setHoveredData] = useState<KpiCategory>();

  const logo = new Image();
  logo.src = logoUrl.length > 0 ? logoUrl : "/icons/logoBlackLetters.svg";

  const fallbackLogo = new Image();
  fallbackLogo.src = "/icons/logoBlackLetters.svg";

  return (
    <div
      style={{ cursor: hoveredData ? "pointer" : "default" }}
      className="relative flex h-full max-h-[900px] w-full max-w-[900px] items-center justify-center overflow-hidden xl:w-[70%]"
    >
      {indexToCategoryMap.map((category) => (
        <p
          key={category}
          className={cn(
            "absolute whitespace-pre-line font-bold",
            hoveredData === category ? "text-secondary" : hoveredData && "text-gray/400",
            category === "ClimateChange" && "left-0 top-40 lg:top-10",
            category === "EcosystemQuality" && "right-0 top-40 text-right lg:top-10",
            category === "HumanHealth" && "bottom-40 right-0 text-right lg:bottom-5",
            category === "ResourcesExhaustion" && "bottom-40 left-0 lg:bottom-5",
          )}
        >
          {t(`polarChart.categories.${category}`)}
        </p>
      ))}

      <div className="flex aspect-square w-full items-center justify-center lg:h-[115%] lg:w-[unset]">
        <PolarArea
          key={logoUrl ? "logoLoaded" : "logoNotLoaded"}
          data={chartData}
          options={{
            animation: {
              animateRotate: false,
              animateScale: false,
            },

            onClick(_event, elements) {
              const hoverDatasetIndex = elements[0]?.datasetIndex;

              if (hoverDatasetIndex !== undefined) {
                setSelectedCategory(indexToCategoryMap[hoverDatasetIndex]);
              }
            },

            onHover: (_event, elements, chart) => {
              const datasets = chart.config.data.datasets;
              const hoverDatasetIndex = elements[0]?.datasetIndex;

              const nothingChangedSinceLastHover =
                (hoveredData === undefined && hoverDatasetIndex === undefined) ||
                (hoverDatasetIndex !== undefined &&
                  hoveredData === indexToCategoryMap[hoverDatasetIndex]);

              if (nothingChangedSinceLastHover) return;

              if (elements.length > 0 && hoverDatasetIndex !== undefined) {
                setHoveredData(indexToCategoryMap[hoverDatasetIndex]);

                datasets.forEach((dataset, index) => {
                  if (hoverDatasetIndex === index) {
                    dataset.backgroundColor = createRadialGradient(
                      chart,
                      "#14AE5C",
                      "#ffcd29",
                      "#FF5630",
                    );
                  } else {
                    dataset.backgroundColor = createRadialGradient(
                      chart,
                      "#14ae5c81",
                      "#ffcd2981",
                      "#FF563081",
                    );
                  }
                });
              } else {
                setHoveredData(undefined);

                datasets.forEach(
                  (dataset) =>
                    (dataset.backgroundColor = createRadialGradient(
                      chart,
                      "#14AE5C",
                      "#ffcd29",
                      "#FF5630",
                    )),
                );
              }

              chart.update("none");
            },

            elements: {
              arc: {
                backgroundColor: (context) =>
                  createRadialGradient(context.chart, "#14AE5C", "#ffcd29", "#FF5630"),
                hoverBorderColor: "transparent",
                borderColor: "transparent",
              },
            },

            plugins: {
              tooltip: {
                enabled: false,
              },
              datalabels: {
                textAlign: "center",
                color: (context) => {
                  if (hoveredData) {
                    const hoveredDatasetIndex = indexToCategoryMap.indexOf(hoveredData);
                    const color =
                      context.datasetIndex === hoveredDatasetIndex ? "#8e33ff" : "#c4cdd5";
                    return color;
                  }

                  return "#454f5b";
                },
                anchor: "end",
                align: "end",
                clip: true,
                font: {
                  family: "Poppins",
                  size: 12,
                },
                offset: (context) => {
                  let value = context.dataset.data[context.dataIndex];
                  if (typeof value !== "number") {
                    value = 0;
                  }

                  return (
                    ((100 + centerImageSize - value) * (context.chart.width / 2)) / chartSize + 10
                  );
                },
                formatter: (_value, context) =>
                  context.dataset?.label?.[context.dataIndex]?.split(/[\s-]+/),
              },
            },
            scales: {
              r: {
                ticks: { display: false },
                grid: { display: false },
                max: chartSize,
              },
            },
          }}
          plugins={[
            angleLines,
            thresholdLines(t("polarChart.benchmark")),
            centerImage(logo, fallbackLogo),
          ]}
        />
      </div>
    </div>
  );
};

export default PolarAreaChart;
