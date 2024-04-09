import { useEffect, useState } from "react";
import type { KpiCategory, KpiKey, Prisma } from "@cacta/db";

import { api } from "~/utils/api";
import type { MapEstablishment } from "~/components/molecules/Map";

type ProductData = {
  [key: string]: {
    name: Prisma.JsonValue;
    area: number;
  };
};

type Kpi = {
  id: string;
  name: Prisma.JsonValue;
  value: number;
  unit: string;
  key: KpiKey;
};

type FilteredProductsStructure = {
  kpiValues: Kpi[];
  scopes?: { scope1: number; scope2: number; scope3: number };
  area: number;
  latitude: number | null;
  longitude: number | null;
  soilType: string;
  soilPH: number | null;
  organicMaterial: number | null;
  nitrogen: number | null;
  phosphorous: number | null;
  products: { name: Prisma.JsonValue; area: number }[];
  totalHarvestedArea: number;
};

type UseSummaryByEstablishmentProps = {
  category: KpiCategory;
  selectedEstablishment?: MapEstablishment;
};

const useSummaryByEstablishment = ({
  category,
  selectedEstablishment,
}: UseSummaryByEstablishmentProps) => {
  const { isLoading: pageDataLoading, data: establishmentsCampaignByCategory } =
    api.monitor.summaryByEstablishment.useQuery({
      category,
    });

  const establishmentCampaigns = establishmentsCampaignByCategory?.map((establishmentCampaign) => {
    const products = establishmentCampaign.productCampaigns.map((productCampaign) => ({
      id: productCampaign.product.id,
      name: productCampaign.product.name,
      area: productCampaign.area,
    }));

    const kpis = establishmentCampaign.productCampaigns.flatMap((productCampaign) =>
      productCampaign.productKpis.map((productKpi) => ({
        kpiId: productKpi.kpi.id,
        name: productKpi.kpi.name,
        category: productKpi.kpi.category,
        unit: productKpi.kpi.unit,
        key: productKpi.kpi.key,
        scopes: productKpi.scopes
          ? [
              {
                scope1: productKpi.scopes.scope1,
                scope2: productKpi.scopes.scope2,
                scope3: productKpi.scopes.scope3,
              },
            ]
          : [],
        currentValue: productKpi.totalValue,
      })),
    );

    return {
      establishmentId: establishmentCampaign.establishmentId,
      establishment: {
        area: establishmentCampaign.establishment.area,
        name: establishmentCampaign.establishment.name,
        latitude: establishmentCampaign.establishment.latitude,
        longitude: establishmentCampaign.establishment.longitude,
        soilType: establishmentCampaign.establishment.soilType,
        soilPH: establishmentCampaign.establishment.soilPh,
        organicMaterial: establishmentCampaign.establishment.organicMaterial,
        nitrogen: establishmentCampaign.establishment.nitrogen,
        phosphorous: establishmentCampaign.establishment.phosphorus,
      },
      products,
      kpis,
    };
  });

  const toDMS = (coord: number | null, isLongitude: boolean) => {
    if (coord === null) {
      return "-";
    }

    const absolute = Math.abs(coord);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    let direction = "";

    if (isLongitude) {
      direction = coord >= 0 ? "E" : "W";
    } else {
      direction = coord >= 0 ? "N" : "S";
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const calculateKpis = (
    establishmentCampaignsByCategory: typeof establishmentCampaigns | undefined,
  ) => {
    const kpiValues: Kpi[] = [];

    (establishmentCampaignsByCategory ?? []).forEach(({ kpis }) => {
      kpis.forEach((kpi) => {
        const existingKpi = kpiValues.find((Kpi) => Kpi.id === kpi.kpiId);

        if (existingKpi) {
          existingKpi.value += kpi.currentValue;
        } else {
          kpiValues.push({
            id: kpi.kpiId,
            name: kpi.name,
            value: kpi.currentValue,
            unit: kpi.unit,
            key: kpi.key,
          });
        }
      });
    });

    return kpiValues;
  };

  const scopesIndex = ["scope1", "scope2", "scope3"] as const;

  const calculateScopes = (value: number | undefined) => {
    const selectedEstablishmentCampaings = selectedEstablishment
      ? establishmentCampaigns?.filter((item) => item.establishmentId === selectedEstablishment.id)
      : establishmentCampaigns;

    return scopesIndex.reduce(
      (result, scopeIndex) => {
        result[scopeIndex] = value
          ? (selectedEstablishmentCampaings ?? []).reduce(
              (kpisAccumulator, { kpis }) =>
                kpis.reduce(
                  (scopesAccumulator, kpi) =>
                    kpi.scopes[0]
                      ? scopesAccumulator + kpi.scopes[0][scopeIndex]
                      : scopesAccumulator,
                  0,
                ) + kpisAccumulator,
              0,
            )
          : 0;

        return result;
      },
      {} as { [key in (typeof scopesIndex)[number]]: number },
    );
  };

  const productData: ProductData = {};

  let campaignsToProcess = establishmentCampaigns;

  if (selectedEstablishment) {
    campaignsToProcess = establishmentCampaigns?.filter(
      (campaign) => campaign.establishmentId === selectedEstablishment?.id,
    );
  }

  campaignsToProcess?.forEach(({ products }) => {
    products.forEach((product) => {
      const currentProduct = productData[product.id];

      if (currentProduct) {
        currentProduct.area += product.area;
      } else {
        productData[product.id] = {
          name: product.name,
          area: product.area,
        };
      }
    });
  });

  const totalHarvestedArea = Object.values(productData).reduce(
    (total, product) => total + product.area,
    0,
  );

  const calculateInitialData = (): FilteredProductsStructure => {
    const kpiValues = calculateKpis(establishmentCampaigns);

    return {
      kpiValues,
      scopes: category === "ClimateChange" ? calculateScopes(kpiValues[0]?.value) : undefined,
      area: (establishmentCampaigns ?? []).reduce(
        (acc, { establishment }) => (establishment.area ? acc + establishment.area : acc),
        0,
      ),
      latitude: null,
      longitude: null,
      soilType: (establishmentCampaigns ?? [])
        .map(({ establishment }) => establishment.soilType)
        .filter((soilType, index, self) => self.indexOf(soilType) === index)
        .join(", "),
      soilPH: null,
      organicMaterial: null,
      nitrogen: null,
      phosphorous: null,
      products: Object.values(productData),
      totalHarvestedArea,
    };
  };

  const initialData = calculateInitialData();

  const [filteredData, setFilteredData] = useState<FilteredProductsStructure>();

  useEffect(() => {
    if (establishmentsCampaignByCategory && !filteredData) setFilteredData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentsCampaignByCategory]);

  useEffect(() => {
    if (selectedEstablishment) {
      const establishmentData = (establishmentCampaigns ?? []).find(
        ({ establishmentId }) => establishmentId === selectedEstablishment.id,
      );

      if (establishmentData) {
        const { products, establishment } = establishmentData;

        const establishmentsData: typeof establishmentCampaigns = [];
        establishmentsData.push(establishmentData);

        const kpiValues = calculateKpis(establishmentsData);

        setFilteredData({
          kpiValues,
          scopes: category === "ClimateChange" ? calculateScopes(kpiValues[0]?.value) : undefined,
          products: products,
          area: establishment.area,
          latitude: establishment.latitude,
          longitude: establishment.longitude,
          soilType: establishment.soilType,
          soilPH: establishment.soilPH,
          organicMaterial: establishment.organicMaterial,
          nitrogen: establishment.nitrogen,
          phosphorous: establishment.phosphorous,
          totalHarvestedArea,
        });
      }
    } else {
      setFilteredData(initialData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEstablishment]);

  // Check if there are ongoing campaigns in selected establishments
  const showOngoingCampaign = () => {
    if (selectedEstablishment) {
      const selectedCampaign = establishmentsCampaignByCategory?.find(
        (item) => item.establishmentId === selectedEstablishment.id,
      );

      const uncompletedProductCampaigns = selectedCampaign?.productCampaigns.find(
        (item) => !item.endDate,
      );

      return !!uncompletedProductCampaigns;
    }

    const productCampaigns = establishmentsCampaignByCategory?.flatMap(
      (item) => item.productCampaigns,
    );

    const uncompletedCampaigns = productCampaigns?.find((item) => !item.endDate);

    return !!uncompletedCampaigns;
  };

  // Check if all campaigns are uncompleted for selected establishments
  const noFinishedCampaigns = () => {
    if (selectedEstablishment) {
      const selectedCampaign = establishmentsCampaignByCategory?.find(
        (item) => item.establishmentId === selectedEstablishment.id,
      );

      const finishedCampaigns = selectedCampaign?.productCampaigns.find((item) => !!item.endDate);

      return !finishedCampaigns;
    }

    const productCampaigns = establishmentsCampaignByCategory?.flatMap(
      (item) => item.productCampaigns,
    );

    const finishedCampaigns = productCampaigns?.find((item) => !!item.endDate);

    return !finishedCampaigns;
  };

  return {
    filteredData,
    toDMS,
    pageDataLoading,
    establishmentsCampaign: establishmentCampaigns,
    showOngoingCampaign,
    noFinishedCampaigns,
  };
};

export default useSummaryByEstablishment;
