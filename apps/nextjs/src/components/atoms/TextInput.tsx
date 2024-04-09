import React, {
  forwardRef,
  type HTMLInputTypeAttribute,
  type InputHTMLAttributes,
  type ReactElement,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const textInputVariants = cva(
  "flex h-14 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray/800 placeholder:text-sm focus-visible:text-secondary",
  {
    variants: {
      variant: {
        default: "bg-white",
        gray: "bg-gray/200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const labelVariants = cva(
  "absolute left-3 top-2 z-10 text-sm not-italic group-focus-within:text-secondary",
  {
    variants: {
      labelVariant: {
        default: "text-gray/600",
        black: "text-primary-foreground",
      },
    },
    defaultVariants: {
      labelVariant: "default",
    },
  },
);

export interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof textInputVariants>,
    VariantProps<typeof labelVariants> {
  type: HTMLInputTypeAttribute;
  icon?: ReactElement;
  withLabelText?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { className, variant, labelVariant, type, icon, withLabelText, ...props },
    ref,
  ) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}

        <div className="group">
          {withLabelText && (
            <label className={cn(labelVariants({ labelVariant }))}>
              {withLabelText}
            </label>
          )}

          <input
            type={type}
            className={cn(
              textInputVariants({ variant }),
              icon && "pl-10",
              withLabelText && "h-[66px] pt-8",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
