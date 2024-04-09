import { useState } from "react";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import { api } from "~/utils/api";
import { toast } from "~/hooks/useToast";
import { Button } from "../atoms/Button";
import { Modal } from "../molecules/Modal";

const DeleteInitiativeModal = ({ initiativeId }: { initiativeId: string }) => {
  const t = useTranslations();

  const [openModal, setOpenModal] = useState(false);

  const utils = api.useContext();

  const { mutate: deleteInitiativeMutation } = api.initiative.deleteInitiative.useMutation({
    async onSuccess() {
      await utils.initiative.getInitiatives.invalidate();
      return toast({
        variant: "default",
        title: t("analyze.initiativeManagement.confirmedDelete"),
      });
    },
    onError() {
      return toast({
        variant: "destructive",
        title: t("analyze.initiativeManagement.errorDeletingInitiative"),
      });
    },
  });

  const deleteInitiative = (initiativeId: string) => deleteInitiativeMutation({ initiativeId });

  return (
    <Modal
      onConfirm={() => {
        deleteInitiative(initiativeId);
        return false;
      }}
      size="small"
      title={t("analyze.initiativeManagement.deleteInitiative")}
      triggerButton={
        <Button variant="ghost">
          <Trash className="text-slate-500" width={18} />
        </Button>
      }
      open={openModal}
      setOpen={setOpenModal}
    >
      <p>{t("analyze.initiativeManagement.deleteConfirmation")}</p>
    </Modal>
  );
};

export default DeleteInitiativeModal;
