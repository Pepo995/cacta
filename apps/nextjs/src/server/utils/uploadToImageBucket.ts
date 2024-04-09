import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env.mjs";
import { getS3Client } from "./getS3client";

type Files = {
  name: string;
  data: string;
};

const VALID_EXTENSIONS = z.enum(["jpg", "jpeg", "png", "gif"]);

const EXTENSION_TO_MIME = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
} as const;

export const uploadToImageBucket = async (file: Files) => {
  const unparsedExtension = file.name.split(".").pop();

  const result = VALID_EXTENSIONS.safeParse(unparsedExtension);

  if (!result.success) throw new TRPCError({ code: "UNPROCESSABLE_CONTENT" });

  const extension = result.data;

  const s3key = `${createId()}.${extension}`;

  const putCommand = new PutObjectCommand({
    Bucket: env.IMAGE_BUCKET_NAME,
    Key: s3key,
    ContentType: EXTENSION_TO_MIME[extension],
    Body: Buffer.from(file.data.replace(/data:image\/\w+;base64,/, ""), "base64"),
  });

  const client = getS3Client();
  await client.send(putCommand);

  const imageUrl = `${env.NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL}/${s3key}`;

  return imageUrl;
};
