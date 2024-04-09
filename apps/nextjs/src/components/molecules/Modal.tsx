import React, {
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";

import { Button } from "~/components/atoms/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/atoms/Dialog";
import GradientText from "../atoms/GradientText";
import Separator from "../atoms/Separator";

type ModalProps = {
  triggerButton: ReactElement;
  triggerModalClose?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onConfirm?: () => string | void | boolean | Promise<void>;
  onCancel?: () => string | void;
  customFooter?: ReactNode;
  withCloseButton?: boolean;
  hasError?: boolean;
  reset?: () => void;
  loading?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} & VariantProps<typeof modalVariants>;

const modalVariants = cva("flex flex-col", {
  variants: {
    size: {
      big: "w-[calc(100%_-_300px)]",
      small: "lg:w-[calc(100%_-_650px)] w-[calc(100%_-_200px)]",
      xsmall: "w-[calc(100%_-_200px)] max-w-[495px]",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

const Modal = ({
  triggerButton,
  title,
  description,
  confirmButtonText,
  cancelButtonText,
  showCancelButton = true,
  onConfirm,
  onCancel,
  children,
  customFooter,
  withCloseButton = true,
  hasError = false,
  reset,
  size,
  loading,
  open,
  setOpen,
}: ModalProps) => {
  const t = useTranslations();

  const onOpenChange = (open: boolean) => {
    reset?.();
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent withCloseButton={withCloseButton} className={modalVariants({ size })}>
        <DialogHeader className="mb-5">
          <DialogTitle className="font-medium text-secondary">
            <GradientText className="h-5">{title}</GradientText>
          </DialogTitle>
          {description && <DialogDescription className="text-xs">{description}</DialogDescription>}
        </DialogHeader>

        <Separator className="border-dashed border-gray/300" />

        <div className="flex-grow px-6 py-3">{children}</div>

        <Separator className="border-dashed border-gray/300" />

        <DialogFooter className="mt-3 h-fit justify-end px-6">
          {customFooter && customFooter}

          {showCancelButton && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                onCancel && onCancel();
                setOpen(false);
              }}
            >
              {cancelButtonText ?? t("text.cancel")}
            </Button>
          )}

          {onConfirm && (
            <Button
              loading={loading}
              size="lg"
              onClick={async () => await onConfirm()}
              disabled={hasError || loading}
            >
              {confirmButtonText ?? t("text.confirm")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { Modal };
