import * as React from "react";
import { ChevronLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

type SettingsHeaderProps = React.ComponentProps<"header"> & {
  /** Called when the Done button (desktop) or back button (mobile) is activated. */
  onClose?: () => void;
  /** Accessible label for the mobile back button. */
  closeLabel?: string;
  /**
   * Settings page title. Shown on desktop (Figma `Header Settings`) as the
   * left-aligned heading; on mobile (Figma `My Profile - Mobile`, below
   * `md`) as the centered top-bar title next to the back chevron, unless
   * `mobileTitle` overrides it.
   */
  title: string;
  /**
   * Overrides `title` for the mobile top bar only (Figma `My Profile -
   * Mobile`) — e.g. the active settings section name, when it should differ
   * from the static desktop page title.
   */
  mobileTitle?: string;
  /** Label for the desktop "Done" button (Figma `Header Settings` → `Done Button`). */
  doneLabel?: string;
};

/**
 * Persistent header for settings-style pages. Desktop (Figma `Header
 * Settings`): page title on the left, a "Done" button on the right. Mobile
 * (Figma `My Profile - Mobile`, below `md`): a back chevron + the title
 * centered, replacing the sidebar affordance. Meant to sit above whatever
 * settings sub-page/section content is rendered below it.
 */
function SettingsHeader({
  className,
  onClose,
  closeLabel = "Back",
  title,
  mobileTitle,
  doneLabel = "Done",
  ...props
}: SettingsHeaderProps) {
  return (
    <header
      data-slot="settings-header"
      className={cn(
        "relative flex w-full shrink-0 items-center justify-between px-4 py-3 md:px-8 md:py-6",
        className,
      )}
      {...props}
    >
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
      <Typography
        as="span"
        size="lg"
        weight="semibold"
        className="absolute left-1/2 -translate-x-1/2 text-foreground md:hidden"
      >
        {mobileTitle ?? title}
      </Typography>
      <Typography
        as="h1"
        size="2xl"
        weight="semibold"
        className="hidden text-foreground md:block"
      >
        {title}
      </Typography>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onClose}
        className="hidden md:inline-flex"
      >
        {doneLabel}
      </Button>
    </header>
  );
}

export { SettingsHeader };
export type { SettingsHeaderProps };
