import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcryptjs";
import z from "zod";

import { INVALID_PASSWORD } from "~/utils/constants/errors";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const SALT_ROUNDS = 12;

export const authRouter = createTRPCRouter({
  confirmAccount: protectedProcedure
    .input(z.object({ newPassword: z.string() }))
    .mutation(async ({ ctx, input: { newPassword } }) => {
      const userId = ctx.session.user.id;

      const hashedPassword = await hash(newPassword, SALT_ROUNDS);

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          hashedPassword,
          pendingVerification: false,
        },
      });
    }),

  resetPassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { currentPassword: previousPassword, newPassword } }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const comparePasswords = await compare(previousPassword, user.hashedPassword);

      if (!comparePasswords) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: INVALID_PASSWORD,
        });
      }

      const newHashedPassword = await hash(newPassword, SALT_ROUNDS);

      await ctx.prisma.user.update({
        where: { id: userId },
        data: {
          hashedPassword: newHashedPassword,
        },
      });
    }),
});
