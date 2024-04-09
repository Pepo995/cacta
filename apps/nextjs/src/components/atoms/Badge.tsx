import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring leading-4 focus:ring-offset-2 text-white border-transparent",
  {
    variants: {
      variant: {
        default: "bg-gray/800",
        secondary: "bg-secondary",
        success: "bg-success",
        warning: "bg-warning text-gray/800",
        error: "bg-error",
        inactive: "bg-gray_32",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
