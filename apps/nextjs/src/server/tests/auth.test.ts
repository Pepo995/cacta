import { faker } from "@faker-js/faker";
import { type TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";

import { kpiFactory, organizationCampaignFactory, organizationFactory } from "./factories";
import { callerWithAuth, prismaMock, userId } from "./jestConfig/jest.setup";

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

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  organization: mockedOrganization,
};

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});

describe("Auth router tests", () => {
  describe("confirmAccount mutation", () => {
    it("Should confirm the account and change the password", async () => {
      const mockedKpi = kpiFactory();
      prismaMock.kpi.findMany.mockResolvedValue([mockedKpi]);

      prismaMock.user.update.mockResolvedValue({
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        pendingVerification: false,
        hashedPassword: faker.internet.password(),
        profilePictureUrl: null,
        createdAt: new Date(1, 1, 2000),
        updatedAt: new Date(1, 1, 2000),
      });

      await callerWithAuth.auth.confirmAccount({
        newPassword: faker.internet.password(),
      });

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("Procedure to reset password", () => {
    const password = faker.internet.password();

    it("Should reset the user's password", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockedUser,
        id: userId,
        hashedPassword: await hash(password, 12),
      });

      await callerWithAuth.auth.resetPassword({
        currentPassword: password,
        newPassword: faker.internet.password(),
      });

      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });

    it("Should throw an error if the user isn't found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await callerWithAuth.auth
        .resetPassword({
          currentPassword: password,
          newPassword: faker.internet.password(),
        })
        .catch((error: TRPCError) => {
          expect(error.code).toBe("NOT_FOUND");
        });
    });

    it("Should throw an error if the current password is incorrect", async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockedUser,
        id: userId,
        hashedPassword: await hash(password, 12),
      });

      prismaMock.user.findUnique.mockResolvedValue(mockedUser);

      await callerWithAuth.auth
        .resetPassword({
          currentPassword: faker.internet.password(),
          newPassword: faker.internet.password(),
        })
        .catch((error: TRPCError) => {
          expect(error.code).toBe("BAD_REQUEST");
        });
    });
  });
});
