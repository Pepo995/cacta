export type OrganizationsAndProducts = {
  organizations: {
    deletedAt: string | null;
    engineId: string;
    name: string;
    imageUrl: string;
    country: string;
    establishments: {
      deletedAt: string | null;
      engineId: string;
      name: string;
      area: number;
      latitude: number;
      longitude: number;
      soilType: string;
      soilPh: number;
      organicMaterial: number;
      nitrogen: number;
      phosphorus: number;
    }[];
  }[];
  products: {
    deletedAt: string | null;
    engineId: string;
    engineName: string;
    cpcName: string;
    cpcId: string;
  }[];
  inputs: {
    deletedAt: string | null;
    engineId: string;
    engineName: string;
  }[];
};

export type KpiData = { organizationCampaigns: OrganizationCampaign[] };

type OrganizationCampaign = {
  deletedAt: string | null;
  organizationCampaignEngineId: string;
  startDate: string;
  endDate: string | null;
  establishmentCampaigns: EstablishmentCampaign[];
  kpiBenchmarks: KpiBenchmark[];
  ecoScores: EcoScore[];
  projectId: string;
};

type EstablishmentCampaign = {
  establishmentEngineId: string;
  startDate: string;
  endDate: string | null;
  productCampaigns: ProductCampaign[];
};

type ProductCampaign = {
  startDate: string;
  productEngineId: string;
  endDate: string | null;
  harvestedAmount: number;
  area: number;
  productKpis: ProductKpi[];
};

type ProductKpi = {
  kpiKey: string;
  totalValue: number;
  scopes: Scopes | null;
  waterComposition: WaterComposition | null;
  electricitySources: ElectricitySource[] | null;
  activities: Activity[];
};

type Scopes = {
  scope1: number;
  scope2: number;
  scope3: number;
};

type WaterComposition = {
  greenFootprint: number;
  blueFootprint: number;
  requiredWater: number;
  rainfall: number;
  irrigation: number;
  lostRainfall: number;
  lostIrrigation: number;
  balance: number;
};

type ElectricitySource = {
  electricitySourceKey: string;
  value: number;
};

type Activity = {
  activity: string;
  totalValue: number;
  inputs: Input[];
};

type Input = {
  inputEngineId: string | number;
  totalValue: number;
  upstream: number;
  transportation: number;
  core: number;
  downstream: number;
};

type KpiBenchmark = {
  kpiKey: string;
  benchmark: number;
  productKpiBenchmarks: ProductKpiBenchmark[];
};

type ProductKpiBenchmark = {
  productEngineId: string;
  benchmark: number;
};

type EcoScore = {
  ecoScoreValue: number;
  ecoScoreGrade: string;
  productEngineId: string | null;
  kpiEcoScores: KpiEcoScore[];
};

type KpiEcoScore = {
  kpiKey: string;
  ecoScoreValue: number;
  ecoScoreGrade: string;
};
