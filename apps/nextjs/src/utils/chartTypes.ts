export type DataTypeBarChart = {
  value: number;
  id?: string;
  label: string | string[];
};

export type ChartDataBarChart = {
  datasets: {
    data: DataTypeBarChart[];
  }[];
};

export type DataTypeDoughnutChart = { value: string; id: string };

export type ChartDataDoughnutChart = {
  labels: string[];
  datasets: {
    data: DataTypeDoughnutChart[];
  }[];
};

export type ChartDataPolarChart = {
  datasets: {
    data: number[];
  }[];
};
