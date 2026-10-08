import * as React from "react";
import { ChevronLeftIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";

type SettingsHeaderProps = React.ComponentProps<"header"> & {
  /** Called when the header's button is activated (desktop X; mobile chevron or X). */
  onClose?: () => void;
  /** Accessible label for the X (desktop, and mobile with `mobileAction="close"`). */
  closeLabel?: string;
  /** Accessible label for the mobile back chevron. */
  backLabel?: string;
  /**
   * The mobile top bar's left button: a back chevron (default, a settings
   * sub-page going up a level) or an X (Figma `Account Settings Menu`, the
   * settings root, which closes settings).
   */
  mobileAction?: "back" | "close";
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
  /** @deprecated Figma removed the desktop "Done" button; the X on the left replaces it. Ignored. */
  doneLabel?: string;
};

/**
 * Persistent header for settings-style pages. Desktop (Figma `Header
 * Settings`): an X that closes settings, then the title. Mobile
 * (Figma `My Profile - Mobile`, below `md`): a back chevron + the title
 * centered, replacing the sidebar affordance. Meant to sit above whatever
 * settings sub-page/section content is rendered below it.
 */
function SettingsHeader({
  className,
  onClose,
  mobileAction = "back",
  closeLabel = "Close",
  backLabel = "Back",
  title,
  mobileTitle,
  doneLabel: _doneLabel,
  ...props
}: SettingsHeaderProps) {
  return (
    <header
      data-slot="settings-header"
      className={cn(
        // Desktop (Figma `Header Settings`): X + title, 16px apart, 32/24px padding.
        "relative flex w-full shrink-0 items-center justify-between px-4 py-3 md:justify-start md:gap-4 md:px-8 md:py-6",
        className,
      )}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-nav"
        onClick={onClose}
        aria-label={mobileAction === "close" ? closeLabel : backLabel}
        className="md:hidden"
      >
        {mobileAction === "close" ? (
          // Figma `Account Settings Menu`: x, 20px (icon-nav), color/icon/foreground.
          <XIcon className="text-icon-foreground" />
        ) : (
          <ChevronLeftIcon className="size-6 text-icon-muted" />
        )}
      </Button>
      <Typography
        as="span"
        size="lg"
        weight="semibold"
        className="absolute left-1/2 -translate-x-1/2 text-foreground md:hidden"
      >
        {mobileTitle ?? title}
      </Typography>
      {/* Desktop: an X that closes settings (same action and icon as the mobile settings menu's X),
          20px, color/icon/foreground, in a 36px ghost `icon-nav` button. A back arrow/chevron is kept
          for moving up a level inside settings (mobile sub-pages). */}
      <Button
        type="button"
        variant="ghost"
        size="icon-nav"
        onClick={onClose}
        aria-label={closeLabel}
        className="hidden md:inline-flex"
      >
        <XIcon className="text-icon-foreground" />
      </Button>
      {/* Figma: xl/semibold (20/30, 1% tracking). */}
      <Typography
        as="h1"
        size="xl"
        weight="semibold"
        // Figma's title row is 40px tall, so the header is 88px (24 + 40 + 24).
        className="hidden h-10 min-w-0 flex-1 items-center text-foreground md:flex"
      >
        {title}
      </Typography>
    </header>
  );
}

export { SettingsHeader };
export type { SettingsHeaderProps };
