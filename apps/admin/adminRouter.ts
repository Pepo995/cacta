import AdminJSExpress from "@adminjs/express";
import { prisma } from "@cacta/db";
import { type AdminJS } from "adminjs";
import bcryptjs from "bcryptjs";
import Connect from "connect-pg-simple";
import session from "express-session";

import { env } from "./env.js";

export const buildAdminRouter = (admin: AdminJS) => {
  const ConnectSession = Connect(session);
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production",
    },
    tableName: "session",
    createTableIfMissing: true,
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      async authenticate(email, password) {
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (!admin) {
          return null;
        }

        const passwordMatches = await bcryptjs.compare(password, admin.hashedPassword);

        if (!passwordMatches) {
          return null;
        }

        return { id: admin.id, email: admin.email };
      },
      cookieName: "adminjs",
      cookiePassword: env.ADMIN_COOKIE_PASSWORD,
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: env.ADMIN_SESSION_SECRET,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: false,
      },
      name: "adminjs",
    },
  );

  return adminRouter;
};
