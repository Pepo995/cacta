import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import { INVALID_PASSWORD } from "~/utils/constants/errors";
import { toast } from "~/hooks/useToast";
import { Button } from "../atoms/Button";
import { Modal } from "../molecules/Modal";
import TextInputWithError from "../molecules/TextInputWithError";

const ChangePasswordModal = () => {
  const t = useTranslations();

  const [openModal, setOpenModal] = useState(false);

  const { mutate: updatePassword, isLoading } = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      reset();
      setOpenModal(false);

      return toast({
        variant: "default",
        title: t("settings.changePassword.success"),
      });
    },
    onError: (error) => {
      if (error.message === INVALID_PASSWORD) {
        setError("currentPassword", {
          type: "manual",
          message: t("errors.incorrectPassword"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("errors.somethingWentWrong"),
        });
      }
    },
  });

  const changePasswordSchema = () =>
    z
      .object({
        currentPassword: z
          .string()
          .min(1, t("errors.required"))
          .min(8, t("errors.min", { min: "8", name: t("settings.changePassword.password") })),
        newPassword: z
          .string()
          .min(1, t("errors.required"))
          .min(8, t("errors.min", { min: "8", name: t("settings.changePassword.password") })),
        confirmPassword: z
          .string()
          .min(1, t("errors.required"))
          .min(
            8,
            t("errors.min", {
              min: "8",
              name: t("settings.changePassword.confirmPassword"),
            }),
          ),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: t("errors.passwordMatchError"),
        path: ["confirmPassword"],
      });

  type ChangePasswordData = z.infer<ReturnType<typeof changePasswordSchema>>;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordData>({
    mode: "onSubmit",
    resolver: zodResolver(changePasswordSchema()),
  });

  const handlePasswordSubmit = ({ currentPassword, newPassword }: ChangePasswordData) => {
    updatePassword({
      currentPassword,
      newPassword,
    });
  };

  return (
    <Modal
      confirmButtonText={t("settings.changePassword.submit")}
      cancelButtonText={t("text.cancel")}
      withCloseButton
      size="small"
      triggerButton={
        <Button variant="outline" className="h-10 w-[200px]">
          {t("settings.personalInformation.changePassword")}
        </Button>
      }
      onConfirm={() => handleSubmit(handlePasswordSubmit)()}
      onCancel={() => reset()}
      title={t("settings.changePassword.submit")}
      hasError={Object.keys(errors).length > 0}
      loading={isLoading}
      open={openModal}
      setOpen={setOpenModal}
    >
      <div className="mt-4 flex flex-col gap-6 px-6">
        <p className="font-semibold">{t("settings.changePassword.subtitle")}</p>
        <form className="flex flex-col gap-y-1">
          <TextInputWithError
            type="password"
            withLabelText={t("settings.changePassword.currentPassword")}
            variant="gray"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />

          <TextInputWithError
            type="password"
            withLabelText={t("auth.confirmAccount.password")}
            variant="gray"
            autoComplete="new-password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />

          <TextInputWithError
            type="password"
            withLabelText={t("auth.confirmAccount.confirmPassword")}
            variant="gray"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
