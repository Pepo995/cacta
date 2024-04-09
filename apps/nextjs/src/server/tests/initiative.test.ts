import { type Reference } from "@cacta/db";
import { expect } from "@jest/globals";
import { TRPCError } from "@trpc/server";

import {
  initiativeFactory,
  kpiFactory,
  organizationCampaignFactory,
  organizationCampaignKpiBenchmarksFactory,
  organizationFactory,
  productFactory,
  productKpiBenchmarksFactory,
  userFactory,
} from "./factories";
import { callerWithAuth, prismaMock } from "./jestConfig/jest.setup";

const mockedOrganization = {
  ...organizationFactory(),
  id: "clnozqepw0000zwwagrpd8wdv",
};

const mockedUser = {
  id: "clkk1z92x0000gqrhvw0lusqj",
  hashedPassword: "password",
  email: "john@doe.com",
  firstName: "John",
  lastName: "Doe",
  pendingVerification: false,
  profilePictureUrl: "imagen.jpg",
  organizations: [mockedOrganization],
  createdAt: new Date(1, 1, 2000),
  updatedAt: new Date(1, 1, 2000),
};

const mockedKpi = kpiFactory();

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  organization: mockedOrganization,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockInput = {
  name: "Test Initiative",
  productId: "test-product-id",
  description: "Test Description",
  kpiId: mockedKpi.id,
  objective: 100,
  startDate: new Date(),
  endDate: new Date(),
  reference: "Custom" as Reference,
  responsibleId: "test-responsible-id",
};

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});
describe("Initiatives in analyze router tests", () => {
  describe("createInitiative method", () => {
    it("Should create an initiative and return its id", async () => {
      const mockedproductKpiBenchmarksFactory = productKpiBenchmarksFactory();

      const mockorganizationCampaignKpiBenchmarksFactory = {
        ...organizationCampaignKpiBenchmarksFactory(),
        kpiId: mockedKpi.id,
        mockedproductKpiBenchmarksFactory,
      };

      const mockedOrganizationCampaign = {
        ...organizationCampaignFactory(),
        mockorganizationCampaignKpiBenchmarksFactory,
      };
      prismaMock.organizationCampaign.findMany.mockResolvedValue([mockedOrganizationCampaign]);

      const mockedInitiative = {
        ...initiativeFactory(),
      };
      prismaMock.initiative.create.mockResolvedValue(mockedInitiative);

      const result = await callerWithAuth.initiative.createInitiative(mockInput);

      expect(result.id).toEqual(mockedInitiative.id);
      expect(prismaMock.initiative.create).toHaveBeenCalledWith({
        data: {
          ...mockInput,
          organizationCampaignId: mockedOrganizationCampaign.id,
        },
        select: { id: true },
      });
    });

    it("Should throw error if no organization campaign is found", async () => {
      prismaMock.organizationCampaign.findMany.mockResolvedValue([]);

      await expect(callerWithAuth.initiative.createInitiative(mockInput)).rejects.toThrow(
        TRPCError,
      );
    });

    it("Should throw error for 'LastCampaign' reference with insufficient campaigns", async () => {
      const mockInputToTest = { ...mockInput, reference: "LastCampaign" as Reference };
      prismaMock.organizationCampaign.findMany.mockResolvedValue([organizationCampaignFactory()]);

      await expect(callerWithAuth.initiative.createInitiative(mockInputToTest)).rejects.toThrow(
        TRPCError,
      );
    });

    it("Should handle error when organization campaign is not found", async () => {
      prismaMock.organizationCampaign.findMany.mockResolvedValue([]);
      await expect(callerWithAuth.initiative.createInitiative(mockInput)).rejects.toThrow(
        TRPCError,
      );
    });
  });

  describe("getInitiatives method", () => {
    const mockedInitiative = {
      ...initiativeFactory(),
      kpi: kpiFactory(),
      product: productFactory(),
      user: userFactory(),
      organizationCampaign: {
        ...organizationCampaignFactory(),
        organizationCampaignKpiBenchmarks: [
          {
            ...organizationCampaignKpiBenchmarksFactory(),
            productKpiBenchmarks: [productKpiBenchmarksFactory()],
          },
        ],
      },
    };

    it("Should return initiatives and total count", async () => {
      prismaMock.initiative.findMany.mockResolvedValue([mockedInitiative]);

      prismaMock.initiative.count.mockResolvedValue(1);

      const input = {
        type: "actual" as "actual" | "past",
        locale: "en",
      };

      const result = await callerWithAuth.initiative.getInitiatives(input);
      expect(result.initiatives).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("Should handle empty result", async () => {
      const mockEmptyInput = {
        type: "actual" as "actual" | "past",
        locale: "en",
      };

      prismaMock.initiative.findMany.mockResolvedValue([]);
      prismaMock.initiative.count.mockResolvedValue(0);

      const result = await callerWithAuth.initiative.getInitiatives(mockEmptyInput);

      expect(result.initiatives).toEqual([]);
      expect(result.total).toEqual(0);
    });

    it("Should return only current initiatives", async () => {
      const currentDate = new Date();
      const mockInput = {
        type: "actual" as "actual" | "past",
        locale: "en",
      };

      const currentInitiative = {
        ...mockedInitiative,
        reference: "LastCampaign" as Reference,
        endDate: new Date(
          currentDate.getFullYear() + 1,
          currentDate.getMonth(),
          currentDate.getDate(),
        ),
      };

      prismaMock.initiative.findMany.mockResolvedValue([currentInitiative]);
      prismaMock.initiative.count.mockResolvedValue(1);

      const result = await callerWithAuth.initiative.getInitiatives(mockInput);
      expect(result.initiatives).toHaveLength(1);
      expect(result.initiatives[0]?.endDate.getTime()).toBeGreaterThan(currentDate.getTime());
    });

    it("Should return initiatives matching the search query", async () => {
      const mockInput = {
        type: "actual" as "actual" | "past",
        locale: "en",
        searchQuery: "MatchingName",
      };

      const idsMatchingKpi: string[] = [];
      const idsMatchingProduct: string[] = [];

      prismaMock.$queryRaw.mockResolvedValue(idsMatchingKpi);
      prismaMock.$queryRaw.mockResolvedValue(idsMatchingProduct);

      idsMatchingKpi.push("kpi1");
      idsMatchingProduct.push("product1");

      const matchingInitiative = {
        ...mockedInitiative,
        name: "MatchingName Initiative",
        kpiId: "kpi1",
        productId: "product1",
      };

      prismaMock.initiative.findMany.mockResolvedValue([matchingInitiative]);
      prismaMock.initiative.count.mockResolvedValue(1);

      const result = await callerWithAuth.initiative.getInitiatives(mockInput);
      expect(result.initiatives).toHaveLength(1);
      expect(result.initiatives[0]?.name).toContain("MatchingName");
    });

    it("Should return initiatives sorted by name in ascending order", async () => {
      const mockInput = {
        type: "actual" as "actual" | "past",
        locale: "en",
        sorting: { sortBy: "name", sortOrder: "asc" as "asc" | "desc" },
      };

      const initiative1 = { ...mockedInitiative, name: "A Initiative" };
      const initiative2 = { ...mockedInitiative, name: "B Initiative" };

      prismaMock.initiative.findMany.mockResolvedValue([initiative1, initiative2]);
      prismaMock.initiative.count.mockResolvedValue(2);

      const result = await callerWithAuth.initiative.getInitiatives(mockInput);
      expect(result.initiatives).toHaveLength(2);
      expect(result.initiatives[0]?.name).toBe("A Initiative");
      expect(result.initiatives[1]?.name).toBe("B Initiative");
    });

    it("Should return initiatives within a specified date range", async () => {
      const mockInput = {
        type: "actual" as "actual" | "past",
        locale: "en",
        dateRange: { from: new Date(2022, 0, 1), to: new Date(2022, 11, 31) },
      };

      const withinRangeInitiative = {
        ...mockedInitiative,
        startDate: new Date(2022, 5, 15),
        endDate: new Date(2022, 10, 10),
      };

      prismaMock.initiative.findMany.mockResolvedValue([withinRangeInitiative]);
      prismaMock.initiative.count.mockResolvedValue(1);

      const result = await callerWithAuth.initiative.getInitiatives(mockInput);
      expect(result.initiatives).toHaveLength(1);
      expect(result.initiatives[0]?.startDate.getTime()).toBeGreaterThanOrEqual(
        mockInput.dateRange.from.getTime(),
      );
      expect(result.initiatives[0]?.endDate.getTime()).toBeLessThanOrEqual(
        mockInput.dateRange.to.getTime(),
      );
    });

    it("Should handle specific search filter correctly", async () => {
      const searchQuery = "specific search";
      prismaMock.initiative.findMany.mockResolvedValue([mockedInitiative]);
      prismaMock.initiative.count.mockResolvedValue(1);

      const idsMatchingKpi: string[] = [];
      const idsMatchingProduct: string[] = [];

      prismaMock.$queryRaw.mockResolvedValue(idsMatchingKpi);
      prismaMock.$queryRaw.mockResolvedValue(idsMatchingProduct);

      const result = await callerWithAuth.initiative.getInitiatives({
        ...mockInput,
        searchQuery,
        type: "actual",
        locale: "",
      });
      expect(result.initiatives).toHaveLength(1);
    });

    it("Should return past initiatives correctly", async () => {
      prismaMock.initiative.findMany.mockResolvedValue([mockedInitiative]);
      prismaMock.initiative.count.mockResolvedValue(1);

      const result = await callerWithAuth.initiative.getInitiatives({
        ...mockInput,
        type: "past",
        locale: "",
      });
      expect(result.initiatives).toHaveLength(1);
    });

    it("Should return an empty array for a non-matching search query", async () => {
      const nonMatchingQuery = "NonMatchingQuery";
      prismaMock.initiative.findMany.mockResolvedValue([]);
      prismaMock.initiative.count.mockResolvedValue(0);

      const idsMatchingKpi: string[] = [];
      const idsMatchingProduct: string[] = [];

      prismaMock.$queryRaw.mockResolvedValue(idsMatchingKpi);
      prismaMock.$queryRaw.mockResolvedValue(idsMatchingProduct);

      const result = await callerWithAuth.initiative.getInitiatives({
        ...mockInput,
        searchQuery: nonMatchingQuery,
        type: "actual",
        locale: "",
      });
      expect(result.initiatives).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("Should handle pagination correctly", async () => {
      prismaMock.initiative.findMany.mockResolvedValue([mockedInitiative]);
      prismaMock.initiative.count.mockResolvedValue(10);

      const result = await callerWithAuth.initiative.getInitiatives({
        ...mockInput,
        pageIndex: 0,
        pageSize: 5,
        type: "actual",
        locale: "",
      });
      expect(result.initiatives).toHaveLength(1);
      expect(result.total).toBe(10);
    });
  });

  describe("getInitiativesModalData method", () => {
    it("Should return products, kpis, and orgUsers successfully", async () => {
      const mockProducts = [productFactory()];
      const mockKpis = [kpiFactory()];
      const mockOrgUsers = [userFactory()];

      prismaMock.product.findMany.mockResolvedValue(mockProducts);
      prismaMock.kpi.findMany.mockResolvedValue(mockKpis);
      prismaMock.user.findMany.mockResolvedValue(mockOrgUsers);

      const result = await callerWithAuth.initiative.getInitiativesModalData();
      expect(result).toEqual({
        products: mockProducts,
        kpis: mockKpis,
        orgUsers: mockOrgUsers,
      });
    });

    it("Should handle empty data", async () => {
      prismaMock.product.findMany.mockResolvedValue([]);
      prismaMock.kpi.findMany.mockResolvedValue([]);
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await callerWithAuth.initiative.getInitiativesModalData();
      expect(result).toEqual({
        products: [],
        kpis: [],
        orgUsers: [],
      });
    });

    it("Should handle errors", async () => {
      const error = new Error("Database error");
      prismaMock.product.findMany.mockRejectedValue(error);
      prismaMock.kpi.findMany.mockRejectedValue(error);
      prismaMock.user.findMany.mockRejectedValue(error);

      await expect(callerWithAuth.initiative.getInitiativesModalData()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("deleteInitiative method", () => {
    const initiativeIdToDelete = "test-initiative-id";

    it("Should delete an existing initiative successfully", async () => {
      prismaMock.initiative.delete.mockResolvedValue(initiativeFactory());

      await expect(
        callerWithAuth.initiative.deleteInitiative({ initiativeId: initiativeIdToDelete }),
      ).resolves.not.toThrow();
    });

    it("Should throw error when trying to delete a non-existing initiative", async () => {
      prismaMock.initiative.delete.mockRejectedValue(new TRPCError({ code: "NOT_FOUND" }));

      await expect(
        callerWithAuth.initiative.deleteInitiative({ initiativeId: initiativeIdToDelete }),
      ).rejects.toThrow(TRPCError);
    });

    it("Should handle database errors", async () => {
      const databaseError = new Error("Database error");
      prismaMock.initiative.delete.mockRejectedValue(databaseError);

      await expect(
        callerWithAuth.initiative.deleteInitiative({ initiativeId: "test-initiative-id" }),
      ).rejects.toEqual(expect.objectContaining({ message: "Database error" }));
    });

    it("Should throw an error if the initiative to be deleted is not found", async () => {
      const initiativeIdToDelete = "non-existent-initiative-id";

      prismaMock.initiative.delete.mockRejectedValue(
        new TRPCError({
          code: "NOT_FOUND",
          message: "Initiative not found or couldn't be deleted.",
        }),
      );

      await expect(
        callerWithAuth.initiative.deleteInitiative({ initiativeId: initiativeIdToDelete }),
      ).rejects.toThrow(
        new TRPCError({
          code: "NOT_FOUND",
          message: "Initiative not found or couldn't be deleted.",
        }),
      );
    });
  });

  describe("updateInitiative method", () => {
    const mockUpdateInput1 = {
      initiativeId: "initiative-id",
      name: "Updated Initiative Name",
      description: "Updated description",
      reference: "Custom" as Reference,
    };

    it("Should update an existing initiative successfully", async () => {
      prismaMock.organizationCampaign.findMany.mockResolvedValue([organizationCampaignFactory()]);
      prismaMock.initiative.update.mockResolvedValue({
        ...initiativeFactory(),
        ...mockUpdateInput1,
      });

      const result = await callerWithAuth.initiative.updateInitiative(mockUpdateInput1);

      expect(prismaMock.initiative.update).toHaveBeenCalledWith({
        where: { id: mockUpdateInput1.initiativeId },
        data: expect.objectContaining({
          name: mockUpdateInput1.name,
          description: mockUpdateInput1.description,
        }),
      });
      expect(result).toEqual(
        expect.objectContaining({
          name: mockUpdateInput1.name,
          description: mockUpdateInput1.description,
        }),
      );
    });

    it("Should throw error when the product is not in current organization campaigns", async () => {
      prismaMock.organizationCampaign.findMany.mockResolvedValue([]);

      await expect(
        callerWithAuth.initiative.updateInitiative(mockUpdateInput1),
      ).rejects.toThrowError(
        new TRPCError({
          code: "NOT_FOUND",
          message:
            "No valid organization campaign was found for the given product in this organization.",
        }),
      );
    });
  });
});
