import { useState, type ReactElement } from "react";
import { type Reference } from "@cacta/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { api, type RouterOutputs } from "~/utils/api";
import { INVALID_BENCHMARK, INVALID_LAST_CAMPAIGN } from "~/utils/constants/errors";
import { translateField } from "~/utils/getTranslation";
import { toast } from "~/hooks/useToast";
import ControlledDropdown from "../molecules/ControlledDropdown";
import DatePicker from "../molecules/DatePicker";
import { Modal } from "../molecules/Modal";
import TextareaWithError from "../molecules/TextareaWithError";
import TextInputWithError from "../molecules/TextInputWithError";

export type ModalData = RouterOutputs["initiative"]["getInitiativesModalData"];

type NoteModalProps = {
  title: string;
  triggerButton: ReactElement;
  initiativeId?: string;
  modalDescription?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  defaultValues?: {
    id: string;
    name: string;
    kpiId: string;
    productId?: string;
    description?: string;
    "dates.startDate": Date;
    "dates.endDate": Date;
    "objectiveForm.reference": Reference;
    "objectiveForm.objective": string;
    responsibleId: string;
  };
  modalData?: ModalData;
};

const InitiativeModal = ({
  title,
  triggerButton,
  modalDescription,
  confirmButtonText,
  cancelButtonText,
  defaultValues,
  modalData,
}: NoteModalProps) => {
  const t = useTranslations();

  const locale = useLocale();

  const utils = api.useContext();

  const [openModal, setOpenModal] = useState(false);

  const { mutate: updateInitiative, isLoading: updateInitiativeLoading } =
    api.initiative.updateInitiative.useMutation({
      async onSuccess() {
        await utils.initiative.getInitiatives.invalidate();
        setOpenModal(false);

        return toast({
          variant: "default",
          title: t("analyze.initiativeManagement.confirmedUpdate"),
        });
      },
      onError(error) {
        if (error.message === INVALID_LAST_CAMPAIGN) {
          methods.setError("objectiveForm.reference", {
            type: "manual",
            message: t("errors.incorrectReference"),
          });
        } else if (error.message === INVALID_BENCHMARK) {
          methods.setError("objectiveForm.reference", {
            type: "manual",
            message: t("errors.incorrectBenchmark"),
          });
        } else {
          toast({
            variant: "destructive",
            title: t("analyze.initiativeManagement.errorUpdatingInitiative"),
          });
        }
      },
    });

  const getKPIUnit = (kpiId: string) => modalData?.kpis.find((kpi) => kpi.id === kpiId)?.unit ?? "";

  const { mutate: createInitiative, isLoading: createInitiativeLoading } =
    api.initiative.createInitiative.useMutation({
      async onSuccess() {
        await utils.initiative.getInitiatives.invalidate();
        setOpenModal(false);

        methods.reset();

        return toast({
          variant: "default",
          title: t("analyze.initiativeManagement.successMessage"),
        });
      },
      onError(error) {
        if (error.message === INVALID_LAST_CAMPAIGN) {
          methods.setError("objectiveForm.reference", {
            type: "manual",
            message: t("errors.incorrectReference"),
          });
        } else if (error.message === INVALID_BENCHMARK) {
          methods.setError("objectiveForm.reference", {
            type: "manual",
            message: t("errors.incorrectBenchmark"),
          });
        } else {
          toast({
            variant: "destructive",
            title: t("analyze.initiativeManagement.errorMessage"),
          });
        }
      },
    });

  const initiativeSchema = z.object({
    name: z
      .string()
      .min(1, t("analyze.initiativeManagement.required.name"))
      .max(50, t("analyze.initiativeManagement.required.max", { max: "50" })),
    kpiId: z.string({
      required_error: t("analyze.initiativeManagement.required.kpi"),
    }),
    productId: z.string({
      required_error: t("analyze.initiativeManagement.required.product"),
    }),
    description: z.string().optional(),
    objectiveForm: z
      .object({
        reference: z.string({
          required_error: t("analyze.initiativeManagement.required.reference"),
        }),

        objective: z.string({
          required_error: t("analyze.initiativeManagement.required.objective"),
        }),
      })
      .refine(
        (value) => {
          const objectiveValue = parseFloat(value.objective);
          if (isNaN(objectiveValue)) {
            return false;
          }

          if (value.reference === "Benchmark" || value.reference === "LastCampaign") {
            return objectiveValue >= 0 && objectiveValue <= 100;
          }

          return true;
        },
        {
          message: t("analyze.initiativeManagement.required.invalidPercentageFormat"),
          path: ["objective"],
        },
      ),
    dates: z
      .object({
        startDate: z.date({
          required_error: t("analyze.initiativeManagement.required.startDate"),
        }),
        endDate: z.date({
          required_error: t("analyze.initiativeManagement.required.endDate"),
        }),
      })
      .refine(({ startDate, endDate }) => endDate >= startDate, {
        message: t("analyze.initiativeManagement.required.validDates"),
        path: ["endDate"],
      }),
    responsibleId: z.string({
      required_error: t("analyze.initiativeManagement.required.responsible"),
    }),
  });

  const objectiveLabel = () => {
    const reference = methods.watch("objectiveForm.reference");
    if (reference === "Custom")
      return t("analyze.initiativeManagement.tableTitles.objectiveIfCustom", {
        unit: getKPIUnit(methods.watch("kpiId")),
      });

    if (reference === "LastCampaign" || reference === "Benchmark")
      return t("analyze.initiativeManagement.tableTitles.objectiveIfNotCustom");

    return t("analyze.initiativeManagement.tableTitles.objective");
  };

  type CreateInitiativeProps = z.infer<typeof initiativeSchema>;

  const methods = useForm<CreateInitiativeProps>({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(initiativeSchema),
  });

  const referenceIndex = ["LastCampaign", "Benchmark", "Custom"] as const;

  const handleInitiativeSubmit = (values: CreateInitiativeProps) => {
    if (defaultValues?.id) {
      updateInitiative({
        ...values,
        initiativeId: defaultValues.id,
        reference: values.objectiveForm.reference as Reference,
        description: values.description ?? null,
        startDate: values.dates.startDate,
        endDate: values.dates.endDate,
        objective: parseFloat(values.objectiveForm.objective),
      });
    } else {
      createInitiative({
        ...values,
        reference: values.objectiveForm.reference as Reference,
        description: values.description ?? null,
        startDate: values.dates.startDate,
        endDate: values.dates.endDate,
        objective: parseFloat(values.objectiveForm.objective),
      });
    }
  };

  return (
    <Modal
      confirmButtonText={confirmButtonText}
      cancelButtonText={cancelButtonText}
      withCloseButton
      triggerButton={triggerButton}
      onConfirm={() => methods.handleSubmit(handleInitiativeSubmit)()}
      onCancel={() => methods.reset()}
      title={title}
      description={modalDescription}
      hasError={Object.keys(methods.formState.errors).length > 0}
      loading={updateInitiativeLoading || createInitiativeLoading}
      open={openModal}
      setOpen={setOpenModal}
    >
      <FormProvider {...methods}>
        <form className="flex flex-col gap-y-1">
          <div className="grid grid-cols-2 gap-x-2">
            <div>
              <TextInputWithError
                variant="gray"
                type="text"
                withLabelText={t("analyze.initiativeManagement.tableTitles.name")}
                error={methods.formState.errors.name?.message}
                {...methods.register("name")}
              />

              <ControlledDropdown
                control={methods.control}
                variant="gray"
                size="big"
                valueKey="id"
                placeholder={t("analyze.initiativeManagement.tableTitles.product")}
                name="productId"
                options={
                  modalData?.products?.map(({ id, name }) => ({
                    id,
                    name: translateField(name, locale),
                  })) ?? []
                }
              />

              <div className="grid grid-cols-2 gap-x-2">
                <Controller
                  name="dates.startDate"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <DatePicker
                      error={error}
                      date={value as Date | undefined}
                      setDate={onChange}
                      title={t("analyze.initiativeManagement.tableTitles.startDate")}
                      className="h-[61px]"
                      closeOnClick
                    />
                  )}
                />

                <Controller
                  name="dates.endDate"
                  render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <DatePicker
                      error={error}
                      date={value as Date | undefined}
                      setDate={onChange}
                      title={t("analyze.initiativeManagement.tableTitles.endDate")}
                      className="h-[61px]"
                      closeOnClick
                    />
                  )}
                />
              </div>

              <ControlledDropdown
                control={methods.control}
                variant="gray"
                size="big"
                valueKey="id"
                placeholder={t("analyze.initiativeManagement.tableTitles.responsible")}
                name="responsibleId"
                options={
                  modalData?.orgUsers?.map(({ firstName, lastName, id, email }) => ({
                    id,
                    name: firstName ? (firstName ?? "") + " " + (lastName ?? "") : email,
                  })) ?? []
                }
              />
            </div>

            <TextareaWithError
              variant="gray"
              withLabelText={t("analyze.initiativeManagement.tableTitles.description")}
              {...methods.register("description")}
            />
          </div>

          <div className="grid grid-cols-3 gap-x-2">
            <ControlledDropdown
              control={methods.control}
              placeholder={t("analyze.initiativeManagement.tableTitles.kpi")}
              variant="gray"
              size="big"
              name="kpiId"
              valueKey="id"
              options={
                modalData?.kpis?.map(({ name, id }) => ({
                  id,
                  name: translateField(name, locale),
                })) ?? []
              }
            />

            <ControlledDropdown
              control={methods.control}
              placeholder={t("analyze.initiativeManagement.tableTitles.reference")}
              disabled={!methods.watch("kpiId")}
              variant="gray"
              size="big"
              name="objectiveForm.reference"
              valueKey="id"
              options={
                referenceIndex.map((value) => ({
                  id: value,
                  name: t(`reference.${value}`),
                })) ?? []
              }
            />

            <TextInputWithError
              className="w-full resize-none"
              disabled={!methods.watch("objectiveForm.reference")}
              variant="gray"
              type="text"
              withLabelText={objectiveLabel()}
              error={methods.formState.errors.objectiveForm?.objective?.message}
              {...methods.register("objectiveForm.objective")}
            />
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default InitiativeModal;
