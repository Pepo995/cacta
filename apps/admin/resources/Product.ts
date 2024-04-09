import { getModelByName } from "@adminjs/prisma";
import uploadFeature from "@adminjs/upload";
import { prisma } from "@cacta/db";
import { type ResourceWithOptions } from "adminjs";

import { componentLoader } from "../components.bundler.js";
import { env } from "../env.js";

export default {
  resource: { model: getModelByName("Product"), client: prisma },
  options: {
    listProperties: ["name.es", "name.en", "image"],
    showProperties: ["name", "image"],
    editProperties: ["name", "image"],
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
  features: [
    uploadFeature({
      componentLoader,
      provider: {
        aws: {
          bucket: env.IMAGE_BUCKET_NAME,
          region: env.IMAGE_BUCKET_AWS_REGION,
          accessKeyId: env.IMAGE_BUCKET_ACCESS_KEY_ID,
          secretAccessKey: env.IMAGE_BUCKET_SECRET_ACCESS_KEY,
          expires: 0,
          endpoint: process.env.IS_OFFLINE === "true" ? "http://localhost:9000" : undefined,
        },
      },
      properties: {
        key: "imageS3Key",
        mimeType: "imageMimeType",
        file: "image",
      },
      uploadPath: (record, filename) => `products/${record.id()}_${filename}`,
    }),
  ],
} satisfies ResourceWithOptions;
