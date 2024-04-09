import { type KpiCategory } from "@cacta/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { deleteFromImageBucket } from "~/server/utils/deleteFromImageBucket";
import { uploadToImageBucket } from "~/server/utils/uploadToImageBucket";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const settingsRouter = createTRPCRouter({
  editProfile: protectedProcedure
    .input(
      z.object({
        profilePictureUrl: z
          .object({
            name: z.string(),
            data: z.string(),
          })
          .nullable()
          .optional(),
        firstName: z.string().optional().nullable(),
        lastName: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input: { profilePictureUrl, firstName, lastName } }) => {
      const userId = ctx.session.user.id;

      let profilePicture = profilePictureUrl?.name;

      const areEqual = profilePictureUrl?.name === ctx.session.user.profilePictureUrl;

      if (profilePictureUrl && !areEqual) {
        profilePicture = await uploadToImageBucket(profilePictureUrl);
      }

      if (ctx.session.user.profilePictureUrl && (!areEqual || !profilePictureUrl)) {
        await deleteFromImageBucket(ctx.session.user.profilePictureUrl);
      }

      return await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          profilePictureUrl: profilePicture ?? null,
        },
        include: {
          organizations: true,
        },
      });
    }),

  kpis: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
      select: { homePageKpis: true },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const kpis = await ctx.prisma.kpi.findMany();

    const kpiCategories: KpiCategory[] = [
      "ClimateChange",
      "EcosystemQuality",
      "HumanHealth",
      "ResourcesExhaustion",
    ];

    const enabledKpis = (
      await ctx.prisma.organizationCampaignKpiBenchmark.findMany({
        where: { organizationCampaignId: ctx.session.organizationCampaign.id },
        select: { kpiId: true },
      })
    ).map((item) => item.kpiId);

    const kpisByCategory = kpiCategories.map((category) => ({
      categoryKey: category,
      kpis: kpis
        .filter((kpi) => kpi.category === category)
        .map((kpi) => ({ ...kpi, enabled: enabledKpis.includes(kpi.id) })),
    }));

    return { userKpis: user.homePageKpis, kpisByCategory };
  }),

  removeKpi: protectedProcedure
    .input(
      z.object({
        kpiId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { homePageKpis: { disconnect: { id: input.kpiId } } },
      });
    }),

  addKpi: protectedProcedure
    .input(
      z.object({
        kpiId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.prisma.user.update({
        where: { id: userId },
        data: { homePageKpis: { connect: { id: input.kpiId } } },
      });
    }),

  reset: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const kpis = await ctx.prisma.kpi.findMany();

    await ctx.prisma.user.update({
      where: { id: userId },
      data: { homePageKpis: { connect: kpis.map((kpi) => ({ id: kpi.id })) } },
    });
  }),
});
