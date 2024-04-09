import React, { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { HiOutlineCamera, HiXMark } from "react-icons/hi2";

import ErrorMessage from "../atoms/ErrorMessage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../atoms/Tooltip";

type ImageUploaderProps = {
  file?: File;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  isEditing?: boolean;
};

const VALID_EXTENSIONS = ["jpeg", "jpg", "png", "gif"];

const ImageUploader = ({ setFile, file, isEditing = true }: ImageUploaderProps) => {
  const t = useTranslations();

  const [animate, setAnimate] = useState<boolean>();
  const [error, setError] = useState<string>();

  const getSizeInMb = (fileSize: number) => parseFloat((fileSize / (1024 * 1024)).toFixed(2));

  const getFileExtension = (fileName: string) => fileName.split(".").pop()?.toLowerCase() || "";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!VALID_EXTENSIONS.includes(getFileExtension(file.name)) || getSizeInMb(file.size) > 3.1) {
        let errorMessage = "";

        if (!VALID_EXTENSIONS.includes(getFileExtension(file.name))) {
          errorMessage = t("errors.invalidFormat", {
            formats: "jpeg, jpg, png, gif",
          });
        }

        if (getSizeInMb(file.size) > 3.1) {
          if (errorMessage) {
            errorMessage += "\n";
          }
          errorMessage += t("errors.invalidSize", { size: "3.1 MB" });
        }

        setError(errorMessage);
        return;
      }

      setFile(file);
      setError(undefined);
    }
  };

  return (
    <div className="flex h-full flex-col items-center">
      <div
        className={`relative flex h-[110px] w-[110px] items-center justify-center rounded-full border border-dashed border-gray/400 transition-all ${
          animate ? "scale-[1.08]" : "scale-100"
        }`}
      >
        {isEditing && (
          <input
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            className="absolute h-full w-full cursor-pointer rounded-full opacity-0"
            onChange={handleFileUpload}
            onDragEnter={() => setAnimate(true)}
            onDragLeave={() => setAnimate(false)}
            onDrop={() => setAnimate(false)}
            key={file ? "definedFile" : "undefinedFile"}
          />
        )}

        {!file ? (
          <div className="bg-black_5 flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full text-gray/400">
            <HiOutlineCamera size={25} className="" />
            <p className="text-mid_grey mt-1 text-xs">{t("uploadImage.uploadPhoto")}</p>
          </div>
        ) : (
          <>
            <Image
              width={0}
              height={0}
              className="h-[calc(100%_-_15px)] w-[calc(100%_-_15px)] rounded-full object-cover"
              alt={t("uploadImage.imageAlt")}
              src={URL.createObjectURL(file)}
            />
            {isEditing && (
              <HiXMark
                size={25}
                className="border-black_5 absolute right-3 top-3 cursor-pointer rounded-full border bg-white p-[3px]"
                onClick={() => setFile(undefined)}
              />
            )}
          </>
        )}
      </div>

      <p className="text-light_grey mb-2 mt-5 text-center text-xs text-gray/400">
        {t("uploadImage.allowedFormats")} <br /> {t("uploadImage.maxSize")}
      </p>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-h-10 overflow-y-auto lg:max-w-[180px]">
              <ErrorMessage className="text-center" errorMessage={error} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">{error}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;
