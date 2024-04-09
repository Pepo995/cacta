import { prisma } from "@cacta/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "~/server/auth";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const userId = ctx.session.user.id;

  const userOrganizations = await ctx.prisma.user.findUnique({
    where: { id: userId },
    select: { organizations: true },
  });

  if (!userOrganizations) throw new TRPCError({ code: "UNAUTHORIZED" });

  const organizationId = userOrganizations.organizations[0]?.id;

  if (!organizationId) throw new TRPCError({ code: "UNAUTHORIZED" });

  const organizationCampaign = await ctx.prisma.organizationCampaign.findFirst({
    where: {
      organizationId: organizationId,
    },
    orderBy: { startDate: "desc" },
    include: { organization: true },
  });

  if (!organizationCampaign) throw new TRPCError({ code: "NOT_FOUND" });

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user, organizationId, organizationCampaign },
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
