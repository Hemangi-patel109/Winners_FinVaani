
import * as React from "react"
import { cn } from "@/lib/utils"

export function FinvaaniIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("lucide lucide-indian-rupee", className)}
        {...props}
    >
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="m9 13 8 8" />
        <path d="M9 13h4" />
        <path d="M18 13c-2.5 0-2.5-2.5-2.5-5" />
        <path d="M12 8V3" />
    </svg>
  );
}
