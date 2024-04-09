import { Database, Resource } from "@adminjs/prisma";
import AdminJS, { type AdminJSOptions } from "adminjs";
import express from "express";

import { buildAdminRouter } from "./adminRouter.js";
import Kpi from "./resources/Kpi.js";
import Organization from "./resources/Organization.js";
import Product from "./resources/Product.js";
import es from "./translations/es.json" assert { type: "json" };
import User from "./resources/User.js";
import { componentLoader } from './components.bundler.js';
import AdminUser from "./resources/AdminUser.js";
import Inputs from "./resources/Inputs.js";

const PORT = 8000;

const start = async () => {
  const adminOptions: AdminJSOptions = {
    locale: {
      language: "es",
      availableLanguages: ["es"],
      translations: { es },
    },
    branding: {
      companyName: "Cacta Admin",
    },
    resources: [AdminUser, User, Kpi, Product, Organization, Inputs],
    rootPath: "/platform-admin",
    loginPath: "/platform-admin/login",
    logoutPath: "/platform-admin/logout",
    componentLoader,
  };

  const admin = new AdminJS(adminOptions);
  process.env.NODE_ENV !== "production" && admin.watch();

  const app = express();
  const adminRouter = buildAdminRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

AdminJS.registerAdapter({ Database, Resource });
start();
