import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    ADMIN_COOKIE_PASSWORD: z.string(),
    ADMIN_SESSION_SECRET: z.string(),
    DATABASE_URL: z.string(),
    JWT_SECRET_KEY: z.string(),
    IMAGE_BUCKET_AWS_REGION: z.string(),
    IMAGE_BUCKET_NAME: z.string(),
    IMAGE_BUCKET_ACCESS_KEY_ID: z.string(),
    IMAGE_BUCKET_SECRET_ACCESS_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL: z.string().url(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: process.env,
});
