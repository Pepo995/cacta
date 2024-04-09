import { SES } from "@aws-sdk/client-ses";
import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

import { env } from "./env";

const SESTransport = () => {
  const ses = new SES({
    credentials: {
      accessKeyId: env.SES_ACCESS_KEY,
      secretAccessKey: env.SES_SECRET_ACCESS_KEY,
    },
    region: env.SES_EMAIL_REGION ?? "us-east-2",
  });

  return nodemailer.createTransport({
    SES: { aws, ses },
  });
};

const developmentTransport = () =>
  nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: parseInt(env.EMAIL_PORT ?? "1025"),
    auth: {
      user: env.EMAIL_USERNAME,
      pass: env.EMAIL_PASSWORD,
    },
  });

export const getTransport = () => {
  return env.USE_SES === "true" ? SESTransport() : developmentTransport();
};
