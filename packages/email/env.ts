import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SES_ACCESS_KEY: z.string(),
    SES_SECRET_ACCESS_KEY: z.string(),
    SES_EMAIL_REGION: z.string().optional(),

    USE_SES: z.enum(["true", "false"]),

    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.string().optional(),
    EMAIL_USERNAME: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),
    EMAIL_SENDER: z.string(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_BASE_URL: z.string(),
  },
  skipValidation: process.env.IS_CI === "true",
  runtimeEnv: process.env,
});
