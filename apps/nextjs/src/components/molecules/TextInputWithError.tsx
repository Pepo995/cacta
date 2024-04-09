import { forwardRef } from "react";

import ErrorMessage from "../atoms/ErrorMessage";
import TextInput, { type TextInputProps } from "../atoms/TextInput";

type TextInputWithErrorProps = TextInputProps & {
  name: string;
  error?: string;
};

const TextInputWithError = forwardRef<
  HTMLInputElement,
  TextInputWithErrorProps
>(({ className, error, ...props }, ref) => (
  <div className={className}>
    <TextInput ref={ref} {...props} className="h-full" />
    <ErrorMessage errorMessage={error} />
  </div>
));

TextInputWithError.displayName = "TextInputWithError";

export default TextInputWithError;
