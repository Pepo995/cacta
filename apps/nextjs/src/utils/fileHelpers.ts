import { env } from "~/env.mjs";

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const imageUrlToFile = async (imageUrl: string) => {
  const response = await fetch(imageUrl, { cache: "no-cache" });
  const blob = await response.blob();
  const file = new File([blob], imageUrl);

  return file;
};

export const imageUrlFromKey = (key: string | null) => {
  if (!key) return null;

  return `${env.NEXT_PUBLIC_IMAGE_BUCKET_BASE_URL}/${key}`;
};
