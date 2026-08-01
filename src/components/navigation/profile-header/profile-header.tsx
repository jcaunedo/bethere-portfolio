import * as React from "react";
import { PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/data-display/avatar";
import { Typography } from "@/components/typography";

type ProfileHeaderProps = React.ComponentProps<"div"> & {
  /** Full display name. */
  name: string;
  /** Account email, shown below the name. */
  email: string;
  /** Role label rendered in the pill next to the name (Figma `Badge (Role)`), e.g. "Owner". */
  role: string;
  /** Avatar photo URL. Falls back to `avatarFallback`/initials from `name` when omitted. */
  avatarSrc?: string;
  /** Explicit avatar initials/fallback content. Defaults to the first two letters of `name`. */
  avatarFallback?: React.ReactNode;
  /** Called when the avatar edit button is activated. */
  onEditAvatar?: () => void;
  /** Accessible label for the avatar edit button. */
  editAvatarLabel?: string;
};

/**
 * Profile summary header for the Settings "My Profile" section (Figma
 * `Profile Header`): large avatar with an edit overlay, name + role badge,
 * and email.
 */
function ProfileHeader({
  className,
  name,
  email,
  role,
  avatarSrc,
  avatarFallback,
  onEditAvatar,
  editAvatarLabel = "Edit avatar",
  ...props
}: ProfileHeaderProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      data-slot="profile-header"
      className={cn(
        "flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-6 md:text-left",
        className,
      )}
      {...props}
    >
      <div className="relative shrink-0">
        {/* 88px on mobile vs. 72px (`xl`) on desktop — Figma's mobile
            Profile Header variant has no existing Avatar size token, so the
            larger size is a one-off override scoped to this component.
            `!size-22` is required to beat Avatar's own `data-[size=xl]:size-18`
            rule, which shares specificity with an unscoped override. */}
        <Avatar size="xl" className="!size-22 md:!size-18">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback tone="business">
            {avatarFallback ?? initials}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          data-slot="profile-header-edit-avatar"
          onClick={onEditAvatar}
          aria-label={editAvatarLabel}
          className="absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full bg-white shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <PencilIcon className="size-3 text-foreground" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5 md:items-start">
        <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3">
          <Typography
            as="span"
            size="2xl"
            weight="semibold"
            className="text-foreground md:text-3xl md:tracking-[0.3px]"
          >
            {name}
          </Typography>
          {/* Desktop: badge inline next to the name. Mobile: hidden here,
              re-rendered after the email below instead (Figma's mobile
              variant moves it to the end of the stack). */}
          <span
            data-slot="profile-header-role-badge"
            className="hidden h-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 px-2.5 py-0.5 md:flex"
          >
            <Typography as="span" size="sm" className="text-neutral-800">
              {role}
            </Typography>
          </span>
        </div>
        <Typography as="span" size="sm" className="text-muted-foreground md:text-base">
          {email}
        </Typography>
        <span
          data-slot="profile-header-role-badge-mobile"
          className="mt-2 flex h-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 px-2.5 py-0.5 md:hidden"
        >
          <Typography as="span" size="sm" className="text-neutral-800">
            {role}
          </Typography>
        </span>
      </div>
    </div>
  );
}

export { ProfileHeader };
export type { ProfileHeaderProps };
