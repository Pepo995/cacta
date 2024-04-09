import { analyzeRouter } from "./routers/analyze";
import { authRouter } from "./routers/auth";
import { downloadRouter } from "./routers/download";
import { homePageRouter } from "./routers/homePage";
import { initiativeRouter } from "./routers/initiative";
import { invitationsRouter } from "./routers/invitations";
import { monitorRouter } from "./routers/monitor";
import { reportRouter } from "./routers/report";
import { settingsRouter } from "./routers/settings";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  homePage: homePageRouter,
  monitor: monitorRouter,
  analyze: analyzeRouter,
  report: reportRouter,
  initiative: initiativeRouter,
  download: downloadRouter,
  settings: settingsRouter,
  invitations: invitationsRouter,
});

export type AppRouter = typeof appRouter;
