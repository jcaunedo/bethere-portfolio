import * as React from "react";
import { ChevronLeftIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Logo } from "@/components/data-display/logo";
import { Typography } from "@/components/typography";

type SettingsHeaderProps = React.ComponentProps<"header"> & {
  /** Called when the close button (desktop) or back button (mobile) is activated. */
  onClose?: () => void;
  /** Accessible label for the close button. */
  closeLabel?: string;
  /**
   * Active settings section name shown as the mobile top bar's centered
   * title (Figma `My Profile - Mobile` → "My Profile"), replacing the logo
   * below `md`. Desktop keeps the logo regardless.
   */
  mobileTitle?: string;
};

/**
 * Persistent header for settings-style pages. Desktop (Figma `Header
 * Settings`): BeThere logo on the left, a close action on the right. Mobile
 * (Figma `My Profile - Mobile`, below `md`): a back chevron + the active
 * section's name centered, replacing the sidebar affordance. Meant to sit
 * above whatever settings sub-page/section content is rendered below it.
 */
function SettingsHeader({
  className,
  onClose,
  closeLabel = "Close",
  mobileTitle,
  ...props
}: SettingsHeaderProps) {
  return (
    <header
      data-slot="settings-header"
      className={cn(
        "relative flex w-full shrink-0 items-center justify-between px-4 py-3 md:px-8 md:pt-6 md:pb-8",
        className,
      )}
      {...props}
    >
      <Logo className="hidden h-7 md:block" />
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={onClose}
        aria-label={closeLabel}
        className="md:hidden"
      >
        <ChevronLeftIcon className="size-6 text-icon-muted" />
      </Button>
      {mobileTitle ? (
        <Typography
          as="span"
          size="lg"
          weight="semibold"
          className="absolute left-1/2 -translate-x-1/2 text-foreground md:hidden"
        >
          {mobileTitle}
        </Typography>
      ) : null}
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={onClose}
        aria-label={closeLabel}
        className="hidden md:inline-flex"
      >
        <XIcon className="size-6 text-icon-muted" />
      </Button>
    </header>
  );
}

export { SettingsHeader };
export type { SettingsHeaderProps };
