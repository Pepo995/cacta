import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "~/utils/api";
import { toast } from "~/hooks/useToast";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";
import { ScrollArea, ScrollBar } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";
import { Skeleton } from "../atoms/Skeleton";
import { InformationModal } from "./InformationModal";
import { Modal } from "./Modal";
import TextInputWithError from "./TextInputWithError";

const INVITATION_ERRORS = z.enum([
  "pendingInvitation",
  "userInOtherOrganization",
  "userInThisOrganization",
]);

const DeleteUserModal = ({ userId }: { userId: string }) => {
  const t = useTranslations();
  const utils = api.useContext();

  const [open, setOpen] = useState(false);

  const { mutate: deleteUser } = api.invitations.removeUserFromOrganization.useMutation({
    async onSuccess() {
      await utils.invitations.getUsers.invalidate();
      toast({
        title: t("usersList.deleteUserModal.success"),
      });
    },
    onError() {
      toast({
        title: t("usersList.deleteUserModal.error"),
      });
    },
  });

  return (
    <Modal
      triggerButton={
        <button className="text-sm text-gray/500">{t("usersList.removeAccess")}</button>
      }
      open={open}
      setOpen={setOpen}
      title={t("usersList.deleteUserModal.title")}
      onConfirm={() => deleteUser({ userId })}
      size="xsmall"
    >
      <p className="my-5">{t("usersList.deleteUserModal.description")}</p>
    </Modal>
  );
};

const UsersList = ({ userId }: { userId: string }) => {
  const t = useTranslations();
  const utils = api.useContext();

  const [openModal, setOpenModal] = useState(false);

  const { data: users, isLoading: usersLoading } = api.invitations.getUsers.useQuery();

  const { mutate: inviteUser, isLoading } = api.invitations.inviteUser.useMutation({
    onError(error) {
      const result = INVITATION_ERRORS.safeParse(error.message);

      if (result.success) {
        return toast({ variant: "destructive", title: t(`usersList.inviteError.${result.data}`) });
      }

      toast({ variant: "destructive", title: t("usersList.inviteError.genericError") });
    },
    async onSuccess() {
      await utils.invitations.getUsers.invalidate();
      toast({ variant: "default", title: t("usersList.inviteSuccess") });
      setOpenModal(false);
      reset();
    },
  });

  const inviteSchema = z.object({
    email: z.string().min(1, t("errors.required")).email(t("errors.invalid")),
  });

  type InviteFormData = z.infer<typeof inviteSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = ({ email }: InviteFormData) => {
    inviteUser({ email });
  };

  return (
    <Card className="flex h-full flex-col gap-2 p-4">
      <GradientText>{t("usersList.title")}</GradientText>

      <div className="h-[calc(100%_-_80px)] rounded-md bg-gray/200 py-2 pl-4 pr-2">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2">
            {!usersLoading
              ? users?.map((user) => (
                  <div key={user.id} className="flex items-center gap-1 whitespace-nowrap text-sm">
                    {user.firstName && `${user.firstName} ${user.lastName ?? ""}`}
                    <span className="text-xs text-gray/500"> {user.email}</span>
                  </div>
                ))
              : Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton className="h-5 w-full bg-white" key={index} />
                ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <InformationModal
        title={t("usersList.invite")}
        open={openModal}
        setOpen={setOpenModal}
        triggerButton={<Button className="w-full">{t("usersList.editAccesses")}</Button>}
      >
        <div className="mb-7 mt-3 flex flex-col gap-4">
          <div>
            <p className="text-sm">{t("usersList.inviteDescription")}</p>
          </div>

          <form className="flex w-full items-center gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-1">
              <TextInputWithError
                error={errors.email?.message}
                {...register("email")}
                type="email"
                className="h-10 rounded-md border border-gray_24 placeholder:text-cancel"
              />
            </div>

            <Button type="submit" className="h-10" loading={isLoading}>
              {t("usersList.send")}
            </Button>
          </form>
        </div>

        <Separator className="-mx-4 border-dashed border-gray/300" />

        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm font-semibold">{t("usersList.accesses")}</p>

          <div className="h-[calc(100vh-500px)] rounded-md bg-gray/200 py-2 pl-4 pr-2">
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 whitespace-nowrap text-sm">
                      {user.firstName && `${user.firstName} ${user.lastName ?? ""}`}
                      <span className="text-xs text-gray/500"> {user.email}</span>

                      {user.pendingInvite && (
                        <Badge variant={"inactive"} className="px-2 py-0 text-gray/500">
                          {t("usersList.status.pending")}
                        </Badge>
                      )}
                    </div>

                    {user.id !== userId && <DeleteUserModal userId={user.id} />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </InformationModal>
    </Card>
  );
};

export default UsersList;
