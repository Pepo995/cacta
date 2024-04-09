import { getModelByName } from "@adminjs/prisma";
import { prisma } from "@cacta/db";
import { type ResourceWithOptions } from "adminjs";

export default {
  resource: { model: getModelByName("Organization"), client: prisma },
  options: {
    actions: {
      delete: {
        isAccessible: false,
      },
      edit: {
        isAccessible: false,
      },
    },
    listProperties: ["id", "name", "createdAt", "updatedAt"],
    navigation: null,
  },
} satisfies ResourceWithOptions;
