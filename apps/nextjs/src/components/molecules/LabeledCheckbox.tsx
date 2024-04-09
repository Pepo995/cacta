import React, { forwardRef, type InputHTMLAttributes } from "react";

import ErrorMessage from "../atoms/ErrorMessage";

type LabeledCheckboxProps = {
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const LabeledCheckbox = forwardRef<HTMLInputElement, LabeledCheckboxProps>(
  ({ id, children, errorMessage, ...props }, ref) => (
    <>
      <div className="items-top flex space-x-4">
        <div>
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="mt-0.5 h-[18px] w-[18px] rounded-sm border-2 border-border accent-secondary focus-visible:outline-none"
            {...props}
          />
        </div>

        <div>
          <label htmlFor={id} className="text-justify font-normal">
            {children}
          </label>

          <ErrorMessage errorMessage={errorMessage} />
        </div>
      </div>
    </>
  ),
);

LabeledCheckbox.displayName = "LabeledCheckbox";

export default LabeledCheckbox;
