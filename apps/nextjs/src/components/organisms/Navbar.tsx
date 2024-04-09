import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AiOutlineCheck } from "react-icons/ai";
import { BsGlobe2 } from "react-icons/bs";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { z } from "zod";

import { api } from "~/utils/api";
import { SETTINGS } from "~/utils/constants/routes";
import { getNameAcronym } from "~/utils/getNameAcronym";
import { dateToString } from "~/utils/helperFunctions";
import { type Formats } from "~/utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/molecules/Avatar";
import { env } from "~/env.mjs";
import { useAppContext } from "~/hooks/useAppContext";
import { cn } from "~/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenu";
import { Skeleton } from "../atoms/Skeleton";
import ControlledDropdown from "../molecules/ControlledDropdown";
import { Modal } from "../molecules/Modal";

const LANGUAGES = [
  { language: "en", name: "English" },
  { language: "es", name: "Español" },
];

const LanguageSelector = () => {
  const t = useTranslations();
  const locale = useLocale();

  const { pathname, asPath, push } = useRouter();

  const changeLanguage = async (locale: string) => {
    await push(pathname, asPath, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <BsGlobe2 className="text-gray/500" size={20} />
      </DropdownMenuTrigger>

      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel>
          <p>{t("text.language")}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="flex flex-col gap-1">
          {LANGUAGES.map((item) => (
            <DropdownMenuItem key={item.language} onClick={() => changeLanguage(item.language)}>
              <div className="flex items-center gap-1">
                <div className="h-4 w-4">
                  {item.language === locale && <AiOutlineCheck size={16} />}
                </div>

                <p className="text-sm">{item.name}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DownloadModal = () => {
  const t = useTranslations();

  const [openModal, setOpenModal] = useState(false);

  const { data: campaignsList, isLoading } = api.download.getCampaignsList.useQuery();

  const formatOptions: Formats[] = ["xlsx", "pdf"];

  const downloadSchema = z.object({
    organizationCampaignId: z.string({ required_error: t("errors.required") }),
    format: z.enum(["xlsx", "pdf"], { required_error: t("errors.required") }),
  });

  type DownloadFormData = z.infer<typeof downloadSchema>;

  const { control, handleSubmit, reset } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadSchema),
  });

  const downloadFile = (organizationCampaignEngineId: string, format: Formats) => {
    const url = `${env.NEXT_PUBLIC_ENGINE_ENDPOINT}/${format}?organizationCampaignId=${organizationCampaignEngineId}`;

    const link = document.createElement("a");
    link.href = url;
    link.download;
    link.click();
    link.remove();
  };

  const onSubmit = ({ organizationCampaignId, format }: DownloadFormData) => {
    const organizationCampaignEngineId = campaignsList?.find(
      (item) => item.id === organizationCampaignId,
    )?.engineId;

    organizationCampaignEngineId && downloadFile(organizationCampaignEngineId, format);

    setOpenModal(false);
  };

  return (
    <Modal
      triggerButton={
        <i>
          <FaCloudDownloadAlt className="text-gray/500 hover:cursor-pointer" size={25} />
        </i>
      }
      showCancelButton={false}
      confirmButtonText={t("downloadModal.button")}
      onConfirm={handleSubmit(onSubmit)}
      title={t("downloadModal.title")}
      size="xsmall"
      open={openModal}
      setOpen={setOpenModal}
      reset={reset}
    >
      <p className="py-4">{t("downloadModal.description")}</p>

      <div className="mt-4 flex justify-between gap-4 ">
        {isLoading ? (
          <>
            <Skeleton className="mb-7 h-10 w-full" />
            <Skeleton className="mb-7 h-10 w-full" />
          </>
        ) : (
          <>
            {campaignsList && (
              <ControlledDropdown
                control={control}
                valueKey="id"
                placeholder={t("downloadModal.selectCampaing")}
                name="organizationCampaignId"
                options={campaignsList.map((campaign) => ({
                  id: campaign.id,
                  name: `${dateToString(campaign.startDate, t)} - ${dateToString(
                    campaign.endDate,
                    t,
                  )}`,
                }))}
              />
            )}

            <ControlledDropdown
              control={control}
              valueKey="id"
              placeholder={t("downloadModal.selectFormat")}
              name="format"
              options={formatOptions.map((option) => ({ id: option, name: option }))}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

const DropDownUserMenu = () => {
  const session = useSession();
  const t = useTranslations();
  const user = session.data?.user;

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={session.data?.user.profilePictureUrl ?? undefined}
            className="object-cover"
          />
          <AvatarFallback>{getNameAcronym(fullName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col text-sm">
            <p>{fullName}</p>
            <p className="text-xs text-gray-500">{session.data?.user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => signOut()}>
            <p className="text-sm">{t("text.signOut")}</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar = () => {
  const { setShowSidebar } = useAppContext();
  const { showSidebar } = useAppContext();
  const { pathname } = useRouter();

  return (
    <nav
      className={cn(
        "fixed right-0 z-40 flex h-fit transform flex-row flex-wrap items-center justify-between bg-white p-4 transition-all duration-300 ease-in-out",
        showSidebar ? "w-[calc(100%_-_192px)]" : "w-[calc(100%_-_96px)]",
      )}
    >
      <div className="relative right-7 flex w-1/2 flex-row items-center gap-x-8">
        <button onClick={() => setShowSidebar(!showSidebar)}>
          <IoIosArrowDroprightCircle
            size={22}
            className={cn(
              "text-gray/400 transition-all duration-300",
              showSidebar && "-rotate-180",
            )}
          />
        </button>
      </div>

      <div className="flex flex-row items-center gap-x-5">
        <LanguageSelector />
        <DownloadModal />
        <Link href={SETTINGS}>
          <FaGear
            className={cn(
              "text-gray/500 hover:cursor-pointer",
              pathname === SETTINGS && "text-secondary/light",
            )}
            size={20}
          />
        </Link>

        <DropDownUserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
