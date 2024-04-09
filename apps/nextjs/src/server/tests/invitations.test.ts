import { type InvitationStatus } from "@cacta/db";
import * as sendEmail from "@cacta/email/sendEmail";
import { TRPCError } from "@trpc/server";

import {
  invitationFactory,
  kpiFactory,
  organizationCampaignFactory,
  organizationFactory,
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

const mockedOrganizationCampaign = {
  ...organizationCampaignFactory(),
  organizationId: "clnozqepw0000zwwagrpd8wdv",
  organization: mockedOrganization,
};

beforeEach(() => {
  prismaMock.user.findUnique.mockResolvedValueOnce(mockedUser);
  prismaMock.organizationCampaign.findFirst.mockResolvedValueOnce(mockedOrganizationCampaign);
});

describe("Invitations tests", () => {
  describe("getUsers procedure", () => {
    it("Should return organization users list", async () => {
      const otherUsers = Array.from({ length: 5 }).map(() => ({
        ...userFactory(),
        id: "clkk1z92x0000gqrhvw0lusqj",
      }));

      const pendingInvitation = Array.from({ length: 5 }).map(() => ({
        ...invitationFactory(),
        organizationId: "clkk1z92x0000gqrhvw0lusqj",
        user: userFactory(),
      }));

      const pendingUsers = pendingInvitation.map((invitation) => invitation.user);

      prismaMock.user.findMany.mockResolvedValue(otherUsers);
      prismaMock.invitation.findMany.mockResolvedValue(pendingInvitation);

      const expectedResult = [
        {
          id: "clkk1z92x0000gqrhvw0lusqj",
          email: "john@doe.com",
          firstName: "John",
          lastName: "Doe",
          pendingVerification: false,
          profilePictureUrl: "imagen.jpg",
          pendingInvite: false,
        },
        ...otherUsers.map((user) => ({ ...user, pendingInvite: false })),
        ...pendingUsers.map((user) => ({ ...user, pendingInvite: true })),
      ];

      const data = await callerWithAuth.invitations.getUsers();

      expect(data).toStrictEqual(expectedResult);
    });
  });

  describe("removeUserFromOrganization procedure", () => {
    it("Should disconnect user from organization and revoke invitation", async () => {
      const mockedInvitation = {
        ...invitationFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
        userId: "user-id",
      };

      prismaMock.invitation.findFirst.mockResolvedValue(mockedInvitation);

      prismaMock.invitation.update.mockResolvedValue({
        ...mockedInvitation,
        invitationStatus: "Revoked",
      });

      prismaMock.organization.update.mockResolvedValue(mockedOrganization);

      await callerWithAuth.invitations.removeUserFromOrganization({ userId: "user-id" });

      expect(prismaMock.invitation.update).toHaveBeenCalledWith({
        where: { id: mockedInvitation.id },
        data: { invitationStatus: "Revoked" },
      });

      expect(prismaMock.organization.update).toHaveBeenCalledWith({
        where: { id: "clnozqepw0000zwwagrpd8wdv" },
        data: { users: { disconnect: { id: "user-id" } } },
      });
    });
  });

  describe("inviteUser procedure", () => {
    it("Should create and invite user when user doesn't exist", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const mockedKpi = kpiFactory();
      const mockedNewUser = { ...userFactory(), email: "test@mail.com", homePageKpis: [mockedKpi] };

      const mockedInvitation = {
        ...invitationFactory(),
        userId: mockedNewUser.id,
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      prismaMock.kpi.findMany.mockResolvedValue([mockedKpi]);
      prismaMock.user.create.mockResolvedValue(mockedNewUser);
      prismaMock.invitation.create.mockResolvedValue(mockedInvitation);
      jest.spyOn(sendEmail, "sendEmail").mockResolvedValue();

      await callerWithAuth.invitations.inviteUser({ email: "test@mail.com" });

      expect(prismaMock.user.create).toBeCalledTimes(1);

      expect(prismaMock.invitation.create).toHaveBeenCalledWith({
        data: {
          organizationId: "clnozqepw0000zwwagrpd8wdv",
          userId: mockedNewUser.id,
        },
      });
    });

    it("Should throw error if user has another pending invitation", async () => {
      const invitedUser = {
        ...userFactory(),
        email: "test@mail.com",
        organizations: [mockedOrganization],
      };

      const mockedInvitation = {
        ...invitationFactory(),
        userId: invitedUser.id,
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      prismaMock.user.findUnique.mockResolvedValue(invitedUser);
      prismaMock.invitation.findMany.mockResolvedValue([mockedInvitation]);

      await expect(
        callerWithAuth.invitations.inviteUser({ email: "test@mail.com" }),
      ).rejects.toThrow(TRPCError);
    });

    it("Should throw error if user is connected to this organization", async () => {
      const invitedUser = {
        ...userFactory(),
        email: "test@mail.com",
        organizations: [mockedOrganization],
      };

      const mockedInvitation = {
        ...invitationFactory(),
        userId: invitedUser.id,
        organizationId: "clnozqepw0000zwwagrpd8wdv",
        invitationStatus: "Accepted" as InvitationStatus,
      };

      prismaMock.user.findUnique.mockResolvedValue(invitedUser);
      prismaMock.invitation.findMany.mockResolvedValue([mockedInvitation]);

      await expect(
        callerWithAuth.invitations.inviteUser({ email: "test@mail.com" }),
      ).rejects.toThrow(TRPCError);
    });

    it("Should throw error if user is connected to other organization", async () => {
      const otherOrganization = organizationFactory();

      const invitedUser = {
        ...userFactory(),
        email: "test@mail.com",
        organizations: [otherOrganization],
      };

      const mockedInvitation = {
        ...invitationFactory(),
        userId: invitedUser.id,
        organizationId: otherOrganization.id,
        invitationStatus: "Accepted" as InvitationStatus,
      };

      prismaMock.user.findUnique.mockResolvedValue(invitedUser);
      prismaMock.invitation.findMany.mockResolvedValue([mockedInvitation]);

      await expect(
        callerWithAuth.invitations.inviteUser({ email: "test@mail.com" }),
      ).rejects.toThrow(TRPCError);
    });

    it("Should invite user when user exists but is not connected to any organization and does not have any pending invites", async () => {
      const invitedUser = {
        ...userFactory(),
        email: "test@mail.com",
        organizations: [],
      };

      const mockedInvitation = {
        ...invitationFactory(),
        userId: invitedUser.id,
        organizationId: "clnozqepw0000zwwagrpd8wdv",
      };

      prismaMock.user.findUnique.mockResolvedValue(invitedUser);
      prismaMock.invitation.findMany.mockResolvedValue([]);
      prismaMock.invitation.create.mockResolvedValue(mockedInvitation);
      jest.spyOn(sendEmail, "sendEmail").mockResolvedValue();

      await callerWithAuth.invitations.inviteUser({ email: "test@mail.com" });

      expect(prismaMock.invitation.create).toHaveBeenCalledWith({
        data: {
          organizationId: "clnozqepw0000zwwagrpd8wdv",
          userId: invitedUser.id,
        },
      });
    });
  });

  describe("acceptInvite procedure", () => {
    it("Should change invitation status from pending to accepted and connect user to organization", async () => {
      const mockedInvitation = {
        ...invitationFactory(),
        organizationId: "clnozqepw0000zwwagrpd8wdv",
        invitationId: "invitation-id",
        userId: "user-id",
      };

      prismaMock.invitation.findFirst.mockResolvedValue(mockedInvitation);

      prismaMock.invitation.update.mockResolvedValue({
        ...mockedInvitation,
        invitationStatus: "Accepted",
      });

      prismaMock.organization.update.mockResolvedValue(mockedOrganization);

      await callerWithAuth.invitations.acceptInvite({ invitationId: "invitation-id" });

      expect(prismaMock.invitation.update).toHaveBeenCalledWith({
        where: { id: mockedInvitation.id },
        data: { invitationStatus: "Accepted" },
      });

      expect(prismaMock.organization.update).toHaveBeenCalledWith({
        where: { id: "clnozqepw0000zwwagrpd8wdv" },
        data: { users: { connect: { id: "user-id" } } },
      });
    });

    it("Should throw an error is invitation is not valid", async () => {
      prismaMock.invitation.findFirst.mockResolvedValue(null);

      await expect(
        callerWithAuth.invitations.acceptInvite({ invitationId: "invitation-id" }),
      ).rejects.toThrow(TRPCError);
    });
  });
});
