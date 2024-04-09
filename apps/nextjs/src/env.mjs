import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),

    USE_SES: z.enum(["true", "false"]),
    EMAIL_SENDER: z.string(),

    EMAIL_HOST: z.string().optional(),
    EMAIL_USERNAME: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),
    EMAIL_PORT: z.string().optional(),

    SES_ACCESS_KEY: z.string(),
    SES_SECRET_ACCESS_KEY: z.string(),
    SES_EMAIL_REGION: z.string(),

    IMAGE_BUCKET_AWS_REGION: z.string(),
    IMAGE_BUCKET_NAME: z.string(),
    IMAGE_BUCKET_ACCESS_KEY_ID: z.string(),
    IMAGE_BUCKET_SECRET_ACCESS_KEY: z.string(),

    JWT_SECRET_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL: z.string().url(),
    NEXT_PUBLIC_MAPS_API_KEY: z.string(),
    NEXT_PUBLIC_ENGINE_ENDPOINT: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    IMAGE_BUCKET_AWS_REGION: process.env.IMAGE_BUCKET_AWS_REGION,
    IMAGE_BUCKET_NAME: process.env.IMAGE_BUCKET_NAME,
    IMAGE_BUCKET_ACCESS_KEY_ID: process.env.IMAGE_BUCKET_ACCESS_KEY_ID,
    IMAGE_BUCKET_SECRET_ACCESS_KEY: process.env.IMAGE_BUCKET_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_SENDER: process.env.EMAIL_SENDER,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_PORT: process.env.EMAIL_PORT,
    USE_SES: process.env.USE_SES,
    SES_ACCESS_KEY: process.env.SES_ACCESS_KEY,
    SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY,
    SES_EMAIL_REGION: process.env.SES_EMAIL_REGION,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_MAPS_API_KEY: process.env.NEXT_PUBLIC_MAPS_API_KEY,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NEXT_PUBLIC_ENGINE_ENDPOINT: process.env.NEXT_PUBLIC_ENGINE_ENDPOINT,
  },
  skipValidation: process.env.IS_CI === "true",
});
