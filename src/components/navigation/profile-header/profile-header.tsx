import * as React from "react";
import { PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/data-display/avatar";
import { Badge } from "@/components/data-display/badge";
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
 * `Profile Header`, Desktop / Mobile): avatar with an edit overlay, name, role
 * badge (`Badge`, gray) and email.
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
      // Figma `Profile Header`: Mobile stacks avatar, name/email and the role badge, centered, 16px
      // apart; Desktop puts the avatar beside the text, 24px apart.
      className={cn(
        "flex flex-col items-center gap-4 text-center md:flex-row md:gap-6 md:text-left",
        className,
      )}
      {...props}
    >
      <div className="relative shrink-0">
        {/* 72px on mobile (Avatar `xl`) vs. 64px on desktop. `!` is required to beat Avatar's own
            `data-[size=xl]:size-18` rule, which is more specific than an unscoped override. */}
        <Avatar size="xl" className="md:!size-16">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          {/* Figma initials: semibold, 24px at 72px and 21.33px at 64px (Avatar `xl` sets bold
              24px through a group selector, hence `!`). */}
          <AvatarFallback tone="business" className="!font-semibold md:!text-[21.33px]">
            {avatarFallback ?? initials}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          data-slot="profile-header-edit-avatar"
          onClick={onEditAvatar}
          aria-label={editAvatarLabel}
          // Figma Edit Button: 20px circle with a 10px pencil (a 24px button scaled to 0.833, so its
          // 0.833px shadow is the `shadow-xs` token scaled — kept as the token).
          className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full bg-white shadow-xs hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <PencilIcon className="size-2.5 text-foreground" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5 md:items-start">
        <div className="flex items-center gap-3">
          {/* Figma: 2xl/semibold (24/32) on both variants. */}
          <Typography as="span" size="2xl" weight="semibold" className="text-foreground">
            {name}
          </Typography>
          {/* Desktop: role badge inline next to the name. */}
          <Badge data-slot="profile-header-role-badge" className="hidden md:inline-flex">
            {role}
          </Badge>
        </div>
        <Typography as="span" size="sm" className="text-muted-foreground md:text-base">
          {email}
        </Typography>
      </div>
      {/* Mobile: the role badge moves to the end of the stack, 16px below the email. */}
      <Badge data-slot="profile-header-role-badge-mobile" className="md:hidden">
        {role}
      </Badge>
    </div>
  );
}

export { ProfileHeader };
export type { ProfileHeaderProps };
