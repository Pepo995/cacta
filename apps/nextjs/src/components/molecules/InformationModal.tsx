import React, {
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/atoms/Dialog";
import GradientText from "../atoms/GradientText";
import { ScrollArea } from "../atoms/ScrollArea";
import Separator from "../atoms/Separator";
import { Skeleton } from "../atoms/Skeleton";

type InformationModalProps = {
  triggerButton: ReactElement;
  title?: string;
  description?: string;
  children: ReactNode;
  withCloseButton?: boolean;
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

const HeaderShimmer = () => (
  <DialogHeader className="mb-5">
    <DialogTitle className="font-medium text-secondary">
      <Skeleton className="h-[40px] min-w-[150px] max-w-[275px]" />
    </DialogTitle>
  </DialogHeader>
);

export const InformationModal = ({
  triggerButton,
  title,
  description,
  children,
  withCloseButton = true,
  size,
  open,
  setOpen,
  loading,
}: InformationModalProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>{triggerButton}</DialogTrigger>

    <DialogContent withCloseButton={withCloseButton} className={modalVariants({ size })}>
      {!loading ? (
        <DialogHeader className="mb-5 px-4">
          <DialogTitle className="font-medium text-secondary">
            <GradientText className="leading-6">{title}</GradientText>
          </DialogTitle>

          {description && <DialogDescription className="text-xs">{description}</DialogDescription>}
        </DialogHeader>
      ) : (
        <HeaderShimmer />
      )}

      <Separator className="border-dashed border-gray/300" />

      <ScrollArea>
        <div className="h-fit max-h-[60vh] min-h-[100px] p-4">{children}</div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);
