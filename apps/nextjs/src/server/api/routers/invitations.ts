import {
  InvitationToCactaAndOrganization,
  InvitationToOrganization,
  sendEmail,
} from "@cacta/email";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { SALT_ROUNDS } from "./auth";

export const invitationsRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const otherUsers = await ctx.prisma.user.findMany({
      where: {
        organizations: { some: { id: ctx.session.organizationId } },
        id: { not: ctx.session.user.id },
      },
    });

    const pendingInvitations = await ctx.prisma.invitation.findMany({
      where: { organizationId: ctx.session.organizationId, invitationStatus: "Pending" },
      include: { user: true },
    });

    const confirmedUsers = [ctx.session.user, ...otherUsers];
    const pendingUsers = pendingInvitations.map((invitation) => invitation.user);

    const allUsers = [
      ...confirmedUsers.map((user) => ({ ...user, pendingInvite: false })),
      ...pendingUsers.map((user) => ({ ...user, pendingInvite: true })),
    ];

    return allUsers;
  }),

  removeUserFromOrganization: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userInvitation = await ctx.prisma.invitation.findFirst({
        where: {
          userId: input.userId,
          organizationId: ctx.session.organizationId,
          invitationStatus: { not: "Revoked" },
        },
      });

      if (userInvitation) {
        await ctx.prisma.invitation.update({
          where: { id: userInvitation.id },
          data: { invitationStatus: "Revoked" },
        });
      }

      await ctx.prisma.organization.update({
        where: { id: ctx.session.organizationId },
        data: { users: { disconnect: { id: input.userId } } },
      });
    }),

  inviteUser: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
        include: { organizations: true },
      });

      // Invited user doesn't exist
      if (!user) {
        const password = createId();
        const hashedPassword = await hash(password, SALT_ROUNDS);

        const kpis = await ctx.prisma.kpi.findMany();

        const newUser = await ctx.prisma.user.create({
          data: {
            hashedPassword,
            email: input.email,
            homePageKpis: { connect: kpis.map((kpi) => ({ id: kpi.id })) },
          },
        });

        const invitation = await ctx.prisma.invitation.create({
          data: {
            organizationId: ctx.session.organizationId,
            userId: newUser.id,
          },
        });

        const token = jwt.sign({ invitationId: invitation.id }, env.JWT_SECRET_KEY);

        return await sendEmail({
          to: input.email,
          subject: "Bienvenido/a a Cacta!",
          Email: InvitationToCactaAndOrganization,
          emailProps: {
            organizationName: ctx.session.organizationCampaign.organization.name,
            password,
            userName: ctx.session.user.firstName ?? ctx.session.user.email,
            token,
          },
        });
      }

      // Invited user exists
      // Find invitations to organization linked to this user
      const userInvitations = await ctx.prisma.invitation.findMany({
        where: {
          userId: user.id,
        },
      });

      // User has a pending invitation to any organization
      if (userInvitations.length > 0) {
        if (userInvitations.some((invitation) => invitation.invitationStatus === "Pending")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "pendingInvitation",
          });
        }
      }

      // User is connected to an organization
      if (user.organizations.length > 0) {
        if (user.organizations[0]?.id === ctx.session.organizationId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "userInThisOrganization",
          });
        } else {
          throw new TRPCError({
            code: "CONFLICT",
            message: "userInOtherOrganization",
          });
        }
      }

      // User is not connected to any organizations
      const invitation = await ctx.prisma.invitation.create({
        data: {
          organizationId: ctx.session.organizationId,
          userId: user.id,
        },
      });

      const tokenUser = { invitationId: invitation.id };
      const token = jwt.sign(tokenUser, env.JWT_SECRET_KEY);

      await sendEmail({
        to: input.email,
        subject: "Has sido invitado a una organización en Cacta",
        Email: InvitationToOrganization,
        emailProps: {
          organizationName: ctx.session.organizationCampaign.organization.name,
          userName: ctx.session.user.firstName ?? ctx.session.user.email,
          invitedUserName: user.firstName ?? user.email,
          token,
        },
      });
    }),

  acceptInvite: publicProcedure
    .input(
      z.object({
        invitationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.prisma.invitation.findFirst({
        where: {
          id: input.invitationId,
        },
      });

      if (
        !invitation ||
        invitation?.invitationStatus === "Revoked" ||
        invitation?.invitationStatus === "Accepted"
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "invalidInvitation",
        });
      }

      await ctx.prisma.invitation.update({
        where: { id: invitation.id },
        data: { invitationStatus: "Accepted" },
      });

      await ctx.prisma.organization.update({
        where: { id: invitation.organizationId },
        data: {
          users: { connect: { id: invitation.userId } },
        },
      });
    }),
});
