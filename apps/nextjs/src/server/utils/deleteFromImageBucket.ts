import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { env } from "~/env.mjs";
import { getS3Client } from "./getS3client";

export const deleteFromImageBucket = async (imageUrl: string) => {
  const client = getS3Client();

  const parts = imageUrl.split("/");
  const s3key = parts[parts.length - 1];

  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.IMAGE_BUCKET_NAME,
    Key: s3key,
  });

  await client.send(deleteCommand);
};
