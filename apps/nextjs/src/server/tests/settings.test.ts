import { type KpiCategory } from "@cacta/db";
import { jest } from "@jest/globals";
import { type TRPCError } from "@trpc/server";

import * as deleteFromBucket from "../utils/deleteFromImageBucket";
import * as uploadToBucket from "../utils/uploadToImageBucket";
import {
  kpiBenchmarkFactory,
  kpiFactory,
  organizationCampaignFactory,
  organizationFactory,
  userFactory,
} from "./factories";
import { callerWithAuth, prismaMock } from "./jestConfig/jest.setup";

describe("Settings router tests", () => {
  describe("Edit profile", () => {
    it("Should successfully update user profile", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        organizations: [mockedOrganization],
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const image = {
        name: "test-image.jpg",
        data: "base64-encoded-data",
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      jest.spyOn(uploadToBucket, "uploadToImageBucket").mockResolvedValue(image.name);
      jest.spyOn(deleteFromBucket, "deleteFromImageBucket").mockResolvedValue();

      prismaMock.user.update.mockResolvedValue({
        ...mockedUser,
        firstName: "UpdatedFirstName",
        lastName: "UpdatedLastName",
        profilePictureUrl: image.name,
      });

      const updatedProfile = await callerWithAuth.settings.editProfile({
        profilePictureUrl: image,
        firstName: "UpdatedFirstName",
        lastName: "UpdatedLastName",
      });

      expect(updatedProfile.firstName).toBe("UpdatedFirstName");
      expect(updatedProfile.lastName).toBe("UpdatedLastName");
      expect(updatedProfile.profilePictureUrl).toBe(image.name);
    });
  });

  describe("kpis query", () => {
    it("Should get user's home page kpis and kpis list", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedKpi1 = { ...kpiFactory(), category: "HumanHealth" as KpiCategory };
      const mockedKpi2 = { ...kpiFactory(), category: "HumanHealth" as KpiCategory };

      const mockedKpiBenchmark1 = {
        ...kpiBenchmarkFactory(),
        kpiId: mockedKpi1.id,
        organizationCampaign: mockedOrganizationCampaign.id,
      };

      const mockedKpiBenchmark2 = {
        ...kpiBenchmarkFactory(),
        kpiId: mockedKpi2.id,
        organizationCampaign: mockedOrganizationCampaign.id,
      };

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        homePageKpis: [mockedKpi1, mockedKpi2],
        organizations: [mockedOrganization],
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.kpi.findMany.mockResolvedValue([mockedKpi1, mockedKpi2]);
      prismaMock.organizationCampaignKpiBenchmark.findMany.mockResolvedValue([
        mockedKpiBenchmark1,
        mockedKpiBenchmark2,
      ]);

      const expectedKpisByCategory = [
        { categoryKey: "ClimateChange", kpis: [] },
        { categoryKey: "EcosystemQuality", kpis: [] },
        {
          categoryKey: "HumanHealth" as KpiCategory,
          kpis: [
            { ...mockedKpi1, enabled: true },
            { ...mockedKpi2, enabled: true },
          ],
        },
        { categoryKey: "ResourcesExhaustion", kpis: [] },
      ];

      const data = await callerWithAuth.settings.kpis();

      expect(data.kpisByCategory).toStrictEqual(expectedKpisByCategory);
      expect(data.userKpis).toStrictEqual(mockedUser.homePageKpis);
    });

    it("Should throw error if user doesn't exist", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        organizations: [mockedOrganization],
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await callerWithAuth.settings.kpis().catch((error: TRPCError) => {
        expect(error.code).toBe("NOT_FOUND");
      });
    });
  });

  describe("removeKpi mutation", () => {
    it("Should disconnect a kpi from user's homePageKpis", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedKpi = kpiFactory();

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        homePageKpis: [],
        organizations: [mockedOrganization],
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.user.update.mockResolvedValue(mockedUser);

      await callerWithAuth.settings.removeKpi({ kpiId: mockedKpi.id });

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: { homePageKpis: { disconnect: { id: mockedKpi.id } } },
      });
    });
  });

  describe("addKpi mutation", () => {
    it("Should connect a kpi to user's homePageKpis", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedKpi = kpiFactory();

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        homePageKpis: [mockedKpi],
        organizations: [mockedOrganization],
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.user.update.mockResolvedValue(mockedUser);

      await callerWithAuth.settings.addKpi({ kpiId: mockedKpi.id });

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: { homePageKpis: { connect: { id: mockedKpi.id } } },
      });
    });
  });

  describe("reset mutation", () => {
    it("Should connect all kpi to user's homePageKpis", async () => {
      const mockedOrganization = {
        ...organizationFactory(),
        id: "clnozqepw0000zwwagrpd8wdv",
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      const kpis = Array.from({ length: 3 }).map(() => kpiFactory());

      const mockedUser = {
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
        homePageKpis: kpis,
        organizations: [mockedOrganization],
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);
      prismaMock.organizationCampaign.findFirst.mockResolvedValue(mockedOrganizationCampaign);
      prismaMock.kpi.findMany.mockResolvedValue(kpis);
      prismaMock.user.update.mockResolvedValue(mockedUser);

      await callerWithAuth.settings.reset();

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: mockedUser.id },
        data: { homePageKpis: { connect: kpis.map((kpi) => ({ id: kpi.id })) } },
      });
    });
  });
});
