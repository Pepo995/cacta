import {
  type Activity,
  type EcoScoreGrade,
  type ElectricitySourceKey,
  type InvitationStatus,
  type KpiCategory,
  type KpiKey,
  type Reference,
  type SoilType,
} from "@cacta/db";
import { faker } from "@faker-js/faker";

export const userFactory = () => ({
  id: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  pendingVerification: false,
  hashedPassword: faker.internet.password(),
  organizations: [],
  profilePictureUrl: faker.internet.url(),
  homePageKpis: [],
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const organizationFactory = () => ({
  id: faker.string.uuid(),
  engineId: faker.string.uuid(),
  name: faker.company.name(),
  imageUrl: faker.internet.url(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  country: faker.location.countryCode(),
});

export const organizationCampaignFactory = (organizationId?: string, endDate?: Date) => ({
  id: faker.string.uuid(),
  engineId: faker.string.uuid(),
  organizationId: organizationId ?? faker.string.uuid(),
  startDate: faker.date.past(),
  endDate: endDate ?? null,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  projectId: faker.string.uuid(),
});

export const establishmentFactory = (organizationId?: string) => ({
  id: faker.string.uuid(),
  engineId: faker.string.uuid(),
  name: faker.company.name(),
  area: faker.number.float(),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  soilType: "Alfisol" as SoilType,
  soilPh: faker.number.float(),
  organicMaterial: faker.number.float(),
  nitrogen: faker.number.float(),
  phosphorus: faker.number.float(),
  organizationId: organizationId ?? faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const establishmentsCampaignFactory = (
  organizationCampaignId?: string,
  establishmentId?: string,
  endDate?: Date,
) => ({
  id: faker.string.uuid(),
  startDate: faker.date.past(),
  endDate: endDate ?? null,
  establishmentId: establishmentId ?? faker.string.uuid(),
  organizationCampaignId: organizationCampaignId ?? faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const kpiBenchmarkFactory = (productIds?: string[]) => ({
  id: faker.string.uuid(),
  kpiId: faker.string.uuid(),
  organizationCampaignId: faker.string.uuid(),
  benchmark: faker.number.float(),
  productKpiBenchmarks: (productIds ?? []).map((productId) => ({
    productId,
    benchmark: faker.number.float(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
  })),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const productKPIFactory = () => ({
  id: faker.string.uuid(),
  totalValue: faker.number.float(),
  upstream: faker.number.float(),
  core: faker.number.float(),
  transportation: faker.number.float(),
  downstream: faker.number.float(),
  kpiId: faker.string.uuid(),
  productCampaignId: faker.string.uuid(),
  scopesId: null,
  waterCompositionId: null,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const productFactory = () => ({
  id: faker.string.uuid(),
  engineId: faker.string.uuid(),
  name: { en: faker.lorem.word(), es: faker.lorem.word() },
  engineName: faker.lorem.word(),
  imageS3Key: faker.string.sample(),
  imageMimeType: faker.string.sample(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  cpcName: faker.lorem.word(),
  cpcId: faker.string.uuid(),
});

export const productCampaignFactory = () => ({
  id: faker.string.uuid(),
  startDate: faker.date.past(),
  endDate: faker.date.past(),
  harvestedAmount: faker.number.float(),
  area: faker.number.float(),
  establishmentCampaignId: faker.string.uuid(),
  productId: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const kpiFactory = () => ({
  id: faker.string.uuid(),
  name: { en: faker.lorem.word(), es: faker.lorem.word() },
  description: { en: faker.lorem.word(), es: faker.lorem.word() },
  imageUrl: faker.internet.url(),
  unit: faker.lorem.word(),
  category: "HumanHealth" as KpiCategory,
  key: "TotalCarbonFootprint" as KpiKey,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const activityProductKpiFactory = () => ({
  id: faker.string.uuid(),
  activity: "Soil" as Activity,
  totalValue: faker.number.float(),
  productKpiId: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const inputFactory = () => ({
  id: faker.string.uuid(),
  name: { en: faker.lorem.word(), es: faker.lorem.word() },
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const activityInputFactory = () => ({
  totalValue: faker.number.float(),
  upstream: faker.number.float(),
  core: faker.number.float(),
  transportation: faker.number.float(),
  downstream: faker.number.float(),
  activityId: faker.string.uuid(),
  inputId: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const initiativeFactory = (
  organizationCampaignId?: string | null,
  kpiId?: string,
  productId?: string,
  responsibleId?: string,
) => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  organizationCampaignId: organizationCampaignId ?? faker.string.uuid(),
  description: faker.string.sample(),
  reference: "Benchmark" as Reference,
  productId: productId ?? faker.string.uuid(),
  kpiId: kpiId ?? faker.string.uuid(),
  objective: faker.number.float(),
  startDate: faker.date.past(),
  endDate: faker.date.future(),
  responsibleId: responsibleId ?? faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const productKpiElectricitySourceFactory = () => ({
  id: faker.string.uuid(),
  productKpiId: faker.string.uuid(),
  electricitySourceId: faker.string.uuid(),
  value: faker.number.float(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const electricitySourceFactory = () => ({
  id: faker.string.uuid(),
  name: { en: faker.lorem.word(), es: faker.lorem.word() },
  renewable: faker.datatype.boolean(),
  key: "Water" as ElectricitySourceKey,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const waterCompositionFactory = () => ({
  id: faker.string.uuid(),
  greenFootprint: faker.number.float(),
  blueFootprint: faker.number.float(),
  requiredWater: faker.number.float(),
  rainfall: faker.number.float(),
  irrigation: faker.number.float(),
  lostRainfall: faker.number.float(),
  lostIrrigation: faker.number.float(),
  balance: faker.number.float(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const organizationCampaignScoreFactory = () => ({
  id: faker.string.uuid(),
  organizationCampaignId: faker.string.uuid(),
  ecoScoreGrade: "B" as EcoScoreGrade,
  ecoScoreValue: faker.number.float(),
  productId: null,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const kpiScoreFactory = () => ({
  id: faker.string.uuid(),
  organizationCampaignScoreId: faker.string.uuid(),
  ecoScoreGrade: "B" as EcoScoreGrade,
  ecoScoreValue: faker.number.float(),
  kpiId: faker.string.uuid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const invitationFactory = () => ({
  id: faker.string.uuid(),
  organizationId: faker.string.uuid(),
  userId: faker.string.uuid(),
  invitationStatus: "Pending" as InvitationStatus,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
});

export const organizationCampaignKpiBenchmarksFactory = (organizationCampaignId?: string) => ({
  id: faker.string.uuid(),
  benchmark: faker.number.float(),
  organizationCampaignId: organizationCampaignId ?? faker.string.uuid(),
  kpiId: faker.string.uuid(),
});

export const productKpiBenchmarksFactory = (
  organizationCampaignKpiBenchmarkId?: string,
  productId?: string,
) => ({
  id: faker.string.uuid(),
  benchmark: faker.number.float(),
  organizationCampaignKpiBenchmarkId: organizationCampaignKpiBenchmarkId ?? faker.string.uuid(),
  productId: productId ?? faker.string.uuid(),
});
