import { organizationCampaignFactory, organizationFactory } from "./factories";
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

const startDateCampaign1 = new Date(2022, 1, 1);
const startDateCampaign2 = new Date(2023, 1, 1);

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  startDate: startDateCampaign2,
};

const mockedOrganizationCampaign2 = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  startDate: startDateCampaign1,
  endDate: startDateCampaign2,
};

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});

describe("Download router tests", () => {
  describe("getCampaignsList procedure", () => {
    it("Should return all organizationCampaigns of current user's organization", async () => {
      const mockedOrganizationCampaigns = [mockedOrganizationCampaign, mockedOrganizationCampaign2];

      prismaMock.organizationCampaign.findMany.mockResolvedValue(mockedOrganizationCampaigns);

      const data = await callerWithAuth.download.getCampaignsList();

      expect(data).toStrictEqual(mockedOrganizationCampaigns);
    });
  });
});
