import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      // Figma: Property 1
      variant: {
        warning: "bg-warning-subtle text-warning-800 [&>svg]:text-warning",
        destructive: "bg-destructive-subtle text-destructive-500 [&>svg]:text-destructive",
        info: "bg-info-subtle text-info-600 [&>svg]:text-info-500",
        success: "bg-success-subtle text-success-700 [&>svg]:text-success",
      },
    },
    defaultVariants: { variant: "warning" },
  },
);

/** Icon per tone, matching the Figma design. */
const alertIcons = {
  warning: TriangleAlertIcon,
  destructive: CircleAlertIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
} as const;

/** A callout for user attention, in one of four semantic tones. Origin: Figma "Alert". */
function Alert({
  className,
  variant = "warning",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const Icon = alertIcons[variant ?? "warning"];
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        {children}
      </div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("line-clamp-1 min-h-4 font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("grid justify-items-start gap-1 text-sm", "[&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
