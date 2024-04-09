import { S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";

export const getS3Client = () => {
  let client: S3Client;
  if (process.env.IS_OFFLINE) {
    client = new S3Client({
      endpoint: "http://localhost:9000",
      region: "us-east-1",
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.IMAGE_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: env.IMAGE_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  } else {
    client = new S3Client({
      region: env.IMAGE_BUCKET_AWS_REGION || "us-east-1",
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.IMAGE_BUCKET_ACCESS_KEY_ID,
        secretAccessKey: env.IMAGE_BUCKET_SECRET_ACCESS_KEY,
      },
    });
  }

  return client;
};
