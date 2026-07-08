import * as React from "react";

import { cn } from "@/lib/utils";
import {
  SocialLoginButton,
  GoogleIcon,
  MicrosoftIcon,
  AppleIcon,
} from "./social-login-button";

type SocialLoginOptionsProps = React.ComponentProps<"div"> & {
  /** Called with the clicked provider. */
  onProviderClick?: (provider: "google" | "microsoft" | "apple") => void;
};

/**
 * Row of Google / Microsoft / Apple social sign-in buttons.
 * Figma origin: bethere.ds social-login-options.
 */
function SocialLoginOptions({
  className,
  onProviderClick,
  ...props
}: SocialLoginOptionsProps) {
  return (
    <div
      data-slot="social-login-options"
      className={cn("flex w-full items-start gap-3", className)}
      {...props}
    >
      <SocialLoginButton
        className="flex-1"
        icon={<GoogleIcon />}
        label="Google"
        onClick={() => onProviderClick?.("google")}
      />
      <SocialLoginButton
        className="flex-1"
        icon={<MicrosoftIcon />}
        label="Microsoft"
        onClick={() => onProviderClick?.("microsoft")}
      />
      <SocialLoginButton
        className="flex-1"
        icon={<AppleIcon />}
        label="Apple"
        onClick={() => onProviderClick?.("apple")}
      />
    </div>
  );
}

export { SocialLoginOptions };
export type { SocialLoginOptionsProps };
