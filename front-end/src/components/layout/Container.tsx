import { cn } from "@/lib/utils"; // shadcn's helper
import type { ComponentProps } from "react";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-20", className)} {...props} />;
}
