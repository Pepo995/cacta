import * as React from "react";
import { type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils";

const textareaVariants = cva(
  "flex min-h-[80px] h-full w-full rounded-md  bg-white px-3 text-sm ring-offset-background placeholder:text-gray/800 placeholder:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary disabled:cursor-not-allowed disabled:opacity-50 resize-none focus-visible:text-secondary",
  {
    variants: {
      variant: {
        default: "bg-white",
        gray: "bg-gray/200",
        secondaryBorder: "border border-secondary bg-gray/200 text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TextareaProps
  extends InputHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  withLabelText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, withLabelText, variant, ...props }, ref) => (
    <div className="group relative h-full">
      {withLabelText && (
        <label
          className={cn(
            "absolute left-3 top-2 z-10 text-sm not-italic text-gray/600 group-focus-within:text-secondary",
            className,
          )}
        >
          {withLabelText}
        </label>
      )}

      <textarea
        className={cn(
          textareaVariants({ variant }),
          withLabelText ? "pt-8" : "pt-2",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
