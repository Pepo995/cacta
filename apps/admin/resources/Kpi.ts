import { getModelByName } from "@adminjs/prisma";
import { prisma } from "@cacta/db";
import { type ResourceWithOptions } from "adminjs";

export default {
  resource: { model: getModelByName("Kpi"), client: prisma },
  options: {
    listProperties: ["name.es", "name.en", "unit", "category"],
    showProperties: ["name", "description", "unit", "category"],
    editProperties: ["name", "description", "unit", "category"],
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
      description: {
        type: "mixed",
      },
      "description.en": {
        type: "textarea",
        props: {
          rows: 5,
        },
      },
      "description.es": {
        type: "textarea",
        props: {
          rows: 5,
        },
      },
    },
  },
} satisfies ResourceWithOptions;
