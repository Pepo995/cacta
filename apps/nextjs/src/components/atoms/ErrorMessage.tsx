import { cn } from "~/utils";

type ErrorMessageProps = {
  errorMessage?: string;
  className?: string;
};

const ErrorMessage = ({ errorMessage, className }: ErrorMessageProps) => (
  <p className={cn("mb-2 mt-1 h-4 truncate text-xs text-error", className)}>{errorMessage}</p>
);

export default ErrorMessage;
