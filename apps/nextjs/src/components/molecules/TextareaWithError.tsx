import { forwardRef } from "react";

import ErrorMessage from "../atoms/ErrorMessage";
import { Textarea, type TextareaProps } from "../atoms/Textarea";

type TextAreaWithErrorProps = TextareaProps & {
  error?: string;
};

const TextareaWithError = forwardRef<
  HTMLTextAreaElement,
  TextAreaWithErrorProps
>(({ className, error, ...props }, ref) => (
  <div className={className}>
    <div className="flex h-full flex-col">
      <div className="flex-grow">
        <Textarea ref={ref} {...props} />
      </div>

      <ErrorMessage errorMessage={error} />
    </div>
  </div>
));

TextareaWithError.displayName = "TextareaWithError";

export default TextareaWithError;
