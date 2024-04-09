import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";
import { prisma } from "@cacta/db";

import { appRouter } from "../../api/root";
import { createInnerTRPCContext } from "../../api/trpc";

jest.mock("@cacta/db", () => ({
  __esModule: true,
  prisma: mockDeep<typeof prisma>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<typeof prisma>;

export const userId = "clkk1z92x0000gqrhvw0lusqj";
export const organizationId = "clnozqepw0000zwwagrpd8wdv";

const authorizedContext = createInnerTRPCContext({
  session: {
    user: {
      id: userId,
      email: "john@doe.com",
      firstName: "John",
      lastName: "Doe",
      pendingVerification: false,
      profilePictureUrl: "imagen.jpg",
    },
  },
});

const unauthorizedContext = createInnerTRPCContext({
  session: null,
});

export const callerWithAuth = appRouter.createCaller(authorizedContext);
export const callerWithoutAuth = appRouter.createCaller(unauthorizedContext);
