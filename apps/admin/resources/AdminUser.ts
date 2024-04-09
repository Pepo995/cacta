import passwordsFeature from "@adminjs/passwords";
import { getModelByName } from "@adminjs/prisma";
import { prisma } from "@cacta/db";
import { type ResourceWithOptions } from "adminjs";
import bcrypt from "bcryptjs";

import { componentLoader } from "./../components.bundler.js";

export default {
  resource: { model: getModelByName("AdminUser"), client: prisma },
  options: {
    navigation: null,
    properties: { hashedPassword: { isVisible: false } },
  },
  features: [
    passwordsFeature({
      componentLoader,
      properties: {
        encryptedPassword: "hashedPassword",
        password: "newPassword",
      },
      hash: (password: string) => bcrypt.hash(password, 12),
    }),
  ],
} satisfies ResourceWithOptions;
