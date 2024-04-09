import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { reportRouter } from "./report";

export const downloadRouter = createTRPCRouter({
  downloadScorecardPdf: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        organizationCampaignId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { id: ctx.session.organizationId },
      });
      const caller = reportRouter.createCaller(ctx);
      const activityInputs = await caller.getActivityInputsByProduct({
        productId: input.productId,
        organizationCampaignId: input.organizationCampaignId,
      });

      return { organization, activityInputs };
    }),

  getCampaignsList: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.organizationCampaign.findMany({
        where: {
          organizationId: ctx.session.organizationId,
        },
        orderBy: { startDate: "desc" },
      }),
  ),

  downloadOrganizationData: protectedProcedure
    .input(
      z.object({
        format: z.enum(["csv", "pdf"]),
        organizationCampaignId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.session.organizationId;

      const organizationCampaignEngineId = await ctx.prisma.organizationCampaign.findUnique({
        where: { id: input.organizationCampaignId },
        select: { engineId: true },
      });

      if (input.format === "csv") {
        // TODO: Use organizationCampaignEngineId and organizationId to get csv from endpoint
      }

      if (input.format === "pdf") {
        // TODO: Use organizationCampaignEngineId and organizationId to get pdf from endpoint
      }

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }),
});
