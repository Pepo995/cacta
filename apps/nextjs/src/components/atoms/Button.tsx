import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "~/utils";

const buttonVariants = cva(
  "flex items-center justify-center rounded-md font-bold font-secondary transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background leading-5 text-white hover:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-gray/800",
        outline: "border border-gray_24 text-foreground",
        secondary: "bg-secondary",
        "secondary-outline":
          "border border-secondary/light text-secondary/light font-semibold",
        "secondary-gradient": "bg-gradient-secondary font-semibold ",
        success: "bg-success ",
        warning: "bg-warning text-gray/800",
        error: "bg-error",
        inactive: "bg-gray_32 hover:opacity-100",
        "inactive-outline":
          "border border-gray/500 text-gray/500 font-semibold hover:opacity-100",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "px-3 h-9 text-sm",
        sm: "h-7 px-2 text-[13px]",
        lg: "px-4 h-12 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          props.children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
