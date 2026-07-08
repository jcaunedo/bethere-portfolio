import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Figma: bethere.ds → button-social-login (Property 1=default/hover). A card-styled
// button for social-auth entry points (e.g. "Continue with Google") — icon stacked
// above a label, not a standard Button variant.
const socialLoginButtonVariants = cva(
  "inline-flex flex-col items-center justify-center gap-2 rounded-input bg-card px-4 py-4 text-sm text-foreground tracking-[0.28px] transition-colors outline-none " +
    "hover:bg-state-hover " +
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-10",
);

type SocialLoginButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof socialLoginButtonVariants> & {
    /** Provider mark, e.g. `<GoogleIcon />`. No default — pass the provider's logo. */
    icon: React.ReactNode;
    /** Provider label, e.g. "Google". */
    label: string;
  };

/** Social sign-in entry button (icon + label). Figma origin: bethere.ds button-social-login. */
function SocialLoginButton({
  className,
  icon,
  label,
  ...props
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      data-slot="social-login-button"
      className={cn(socialLoginButtonVariants({ className }))}
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Google "G" mark used with {@link SocialLoginButton}. Figma origin: avatar-logos → Google@2x. */
function GoogleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M39.2 20.45c0-1.41-.13-2.77-.36-4.09H20v7.74h10.76c-.47 2.5-1.87 4.62-3.98 6.04v5.02h6.45c3.78-3.48 5.96-8.6 5.96-14.7Z"
        fill="#4285F4"
      />
      <path
        d="M20 40c5.4 0 9.92-1.79 13.23-4.84l-6.45-5.02c-1.79 1.2-4.08 1.91-6.78 1.91-5.21 0-9.62-3.52-11.2-8.25H2.14v5.18C5.43 35.64 12.16 40 20 40Z"
        fill="#34A853"
      />
      <path
        d="M8.8 23.8a12.04 12.04 0 0 1 0-7.6v-5.18H2.14a20 20 0 0 0 0 17.96l6.66-5.18Z"
        fill="#FBBC05"
      />
      <path
        d="M20 7.95c2.94 0 5.58 1.01 7.65 2.99l5.74-5.74C29.91 1.9 25.39 0 20 0 12.16 0 5.43 4.36 2.14 10.73l6.66 5.18C10.38 11.47 14.79 7.95 20 7.95Z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Microsoft four-square mark used with {@link SocialLoginButton}. Figma origin: avatar-logos → Microsoft. */
function MicrosoftIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="4" width="16" height="16" fill="#F25022" />
      <rect x="20" y="4" width="16" height="16" fill="#7FBA00" />
      <rect x="4" y="20" width="16" height="16" fill="#00A4EF" />
      <rect x="20" y="20" width="16" height="16" fill="#FFB900" />
    </svg>
  );
}

/** Apple mark used with {@link SocialLoginButton}. Figma origin: avatar-logos → Apple@2x. Inherits `text-icon` (gray, not brand black) to match the Figma asset. */
function AppleIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-icon" {...props}>
      <path
        d="M27.13 21.24c-.04-4.15 3.39-6.14 3.54-6.24-1.93-2.82-4.94-3.21-6.01-3.25-2.56-.27-5 1.5-6.3 1.5-1.3 0-3.3-1.47-5.42-1.43-2.79.04-5.37 1.62-6.8 4.12-2.9 5.02-.74 12.46 2.08 16.53 1.38 1.99 3.02 4.22 5.18 4.14 2.08-.08 2.86-1.34 5.37-1.34 2.5 0 3.21 1.34 5.4 1.3 2.24-.04 3.65-2.02 5-4.02 1.58-2.3 2.22-4.53 2.25-4.64-.05-.02-4.3-1.65-4.34-6.55l.05-.02Z"
        fill="currentColor"
      />
      <path
        d="M23.31 9.13c1.13-1.37 1.9-3.26 1.69-5.13-1.63.07-3.6 1.09-4.77 2.46-1.05 1.21-1.97 3.14-1.72 4.98 1.8.14 3.65-.92 4.8-2.31Z"
        fill="currentColor"
      />
    </svg>
  );
}

export {
  SocialLoginButton,
  socialLoginButtonVariants,
  GoogleIcon,
  MicrosoftIcon,
  AppleIcon,
};
export type { SocialLoginButtonProps };
