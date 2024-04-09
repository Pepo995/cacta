import { getModelByName } from "@adminjs/prisma";
import { prisma } from "@cacta/db";
import { type ResourceWithOptions } from "adminjs";

export default {
  resource: { model: getModelByName("Input"), client: prisma },
  options: {
    listProperties: ["name.es", "name.en"],
    showProperties: ["name"],
    editProperties: ["name"],
    navigation: null,
    properties: {
      name: {
        type: "mixed",
      },
      "name.en": {
        type: "string",
      },
      "name.es": {
        type: "string",
      },
    },
  },
} satisfies ResourceWithOptions;
