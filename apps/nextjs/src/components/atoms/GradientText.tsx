import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const variants = cva(
  "bg-gradient-secondary bg-clip-text text-transparent inline-block",
  {
    variants: {
      variant: {
        secondary: "bg-gradient-secondary",
        success: "bg-gradient-success",
        error: "bg-gradient-error",
      },
      weight: {
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
    },
    defaultVariants: {
      variant: "secondary",
      weight: "bold",
    },
  },
);

type GradientTextProps = {
  className?: string;
  children: ReactNode;
} & VariantProps<typeof variants>;

const GradientText = ({
  className,
  children,
  variant,
  weight,
}: GradientTextProps) => (
  <p className={cn(variants({ variant, weight }), className)}>{children}</p>
);

export default GradientText;
