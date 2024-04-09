import React from "react";

import { cn } from "~/utils";

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-0 border-b border-muted", className)} />
);

export default Separator;
