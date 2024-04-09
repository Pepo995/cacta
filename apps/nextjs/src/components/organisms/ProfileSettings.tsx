import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import { fileToBase64, imageUrlToFile } from "~/utils/fileHelpers";
import { Card } from "~/components/atoms/Card";
import { toast } from "~/hooks/useToast";
import { Button } from "../atoms/Button";
import GradientText from "../atoms/GradientText";
import TextInput from "../atoms/TextInput";
import ImageUploader from "../molecules/ImageUploader";
import TextInputWithError from "../molecules/TextInputWithError";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileSettings = () => {
  const t = useTranslations();

  const { data: sessionData, update } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [userFile, setUserFile] = useState<File>();

  const userSettingsSchema = z.object({
    profilePictureUrl: z
      .object({
        name: z.string(),
        data: z.string(),
      })
      .nullable()
      .optional(),
    firstName: z.string().min(1, t("errors.required")).nullable(),
    lastName: z.string().min(1, t("errors.required")).nullable(),
    email: z.string().email(),
  });

  type UpdateProfileProps = z.infer<typeof userSettingsSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileProps>({
    mode: "onSubmit",
    resolver: zodResolver(userSettingsSchema),
  });

  useEffect(() => {
    if (sessionData?.user.profilePictureUrl) {
      const execute = async (imageUrl: string) => {
        const file = await imageUrlToFile(imageUrl);
        setUserFile(file);
      };

      void execute(sessionData?.user.profilePictureUrl);
    }
  }, [sessionData?.user.profilePictureUrl]);

  useEffect(() => {
    if (sessionData?.user) {
      reset({
        firstName: sessionData.user.firstName,
        lastName: sessionData.user.lastName,
        email: sessionData.user.email,
      });
    }
  }, [sessionData, reset]);

  const { mutate: updateProfile, isLoading } = api.settings.editProfile.useMutation({
    async onSuccess(data) {
      toast({
        variant: "default",
        title: t("settings.personalInformation.confirmedUpdate"),
      });

      return await update({
        ...sessionData?.user,
        name: data.firstName,
        lastName: data.lastName,
        profilePictureUrl: data.profilePictureUrl,
      });
    },
    onError() {
      return toast({
        variant: "destructive",
        title: t("settings.personalInformation.errorUpdatingProfile"),
      });
    },
  });

  const handleProfileSubmit = async (values: UpdateProfileProps) => {
    updateProfile({
      ...values,
      profilePictureUrl: userFile
        ? { name: userFile.name, data: await fileToBase64(userFile) }
        : null,
    });

    reset();
    setIsEditing(false);
  };

  return (
    <div className="mt-4 flex flex-col gap-3">
      <Card className="w-full p-4 py-3">
        <GradientText>{t("settings.personalInformation.title")}</GradientText>

        <div className="mt-4 flex h-fit flex-col items-center justify-between lg:flex-row lg:gap-x-8 lg:px-16">
          <ImageUploader file={userFile} setFile={setUserFile} isEditing={isEditing} />

          <div className="w-full lg:w-[75%]">
            <form>
              <div className="mb-2 grid w-full grid-cols-2 gap-x-4">
                <TextInputWithError
                  type="text"
                  withLabelText={t("settings.personalInformation.firstName")}
                  variant="gray"
                  {...register("firstName")}
                  disabled={!isEditing}
                  error={errors.firstName?.message}
                />

                <TextInputWithError
                  type="text"
                  withLabelText={t("settings.personalInformation.lastName")}
                  variant="gray"
                  {...register("lastName")}
                  disabled={!isEditing}
                  error={errors.lastName?.message}
                />

                <TextInput
                  type="text"
                  withLabelText={t("settings.personalInformation.email")}
                  variant="gray"
                  disabled
                  {...register("email")}
                />
              </div>
            </form>

            {isEditing ? (
              <div className="flex w-full justify-between">
                <ChangePasswordModal />

                <div className="flex w-full justify-end gap-4">
                  <Button variant="outline" className="h-10" onClick={() => setIsEditing(false)}>
                    {t("text.cancel")}
                  </Button>

                  <Button
                    type="submit"
                    className="h-10 w-[150px]"
                    loading={isLoading}
                    onClick={() => handleSubmit(handleProfileSubmit)()}
                  >
                    {t("settings.personalInformation.saveChanges")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full justify-end">
                <Button
                  className="h-10 w-[150px]"
                  onClick={() => setIsEditing(true)}
                  loading={isLoading}
                >
                  {t("settings.personalInformation.editInformation")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;
