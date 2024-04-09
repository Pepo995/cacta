import Image from "next/image";
import { useTranslations } from "next-intl";

import { round } from "~/utils/mathHelpers";
import { cn } from "~/utils";
import { Card } from "../atoms/Card";
import GradientText from "../atoms/GradientText";

type ProductCardProps = {
  id: string;
  name: string;
  amount: number | null;
  imageUrl: string | null;
  disabled?: boolean;
  selected?: boolean;
  onClick: (id: string) => void;
};

const ProductCard = ({
  id,
  name,
  amount,
  imageUrl,
  disabled,
  selected,
  onClick,
}: ProductCardProps) => {
  const t = useTranslations();

  return (
    <Card
      onClick={() => !disabled && onClick(id)}
      className={cn(
        "w-[175px] border p-4 hover:cursor-pointer",
        selected ? "border-secondary" : "border-transparent",
        disabled && "hover:cursor-not-allowed",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {selected ? (
          <GradientText className="truncate font-semibold">{name}</GradientText>
        ) : (
          <p className="truncate font-semibold text-gray/600">{name}</p>
        )}

        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center overflow-hidden rounded-full p-[5px]",
            selected ? "bg-secondary/lighter" : "bg-gray/300",
          )}
        >
          <Image
            src={imageUrl ?? "/images/fallback-product-image.svg"}
            alt={name}
            width={0}
            height={0}
            sizes="100%"
            className="w-full"
          />
        </div>
      </div>

      <p
        className={cn(
          "mt-2 font-bold",
          !selected && "text-gray/500",
          !amount && "mt-3.5 text-sm font-normal text-gray/600",
        )}
      >
        {amount ? `${round(amount)} ton` : t("monitor.summaryByProduct.ongoingCampaign")}
      </p>
    </Card>
  );
};

export default ProductCard;
