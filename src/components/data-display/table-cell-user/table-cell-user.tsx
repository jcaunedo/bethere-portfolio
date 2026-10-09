import * as React from "react";
import { UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/data-display/avatar";

/** "Lucy Smith" → "LS"; falls back to the first two characters if there's no space. */
function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Avatar + name/email(/phone) cell content for a person column inside
 * `Table`/`DataTable`. Figma: bethere.ds `row` (`Property 1=Avatar`).
 * `phone` is optional — omit it for the original two-line layout; when
 * present it renders as a third line, same style as email (Figma:
 * Provider-Portal Team members, updated to add a phone number line below
 * email). Plug into a `ColumnDef`'s `cell` renderer — it renders content
 * only, not a `<td>` wrapper, so `TableCell`'s own padding still applies.
 *
 * `name` is optional, for a person the product knows of but has no name
 * for yet — a pending team invitation is an email address and nothing
 * else until it's accepted. Without a name the email takes the primary
 * line and the avatar falls back to the empty placeholder (Figma `Empty`:
 * dashed outline + person icon), since there are no initials to derive and
 * a colored initials tile would imply an identity that doesn't exist yet.
 */
function TableCellUser({
  name,
  email,
  phone,
  avatarUrl,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}) {
  const hasName = name !== undefined && name.trim() !== "";
  return (
    <div
      data-slot="table-cell-user"
      // Avatar → text gap is spacing/3 (12px) per Figma `row-team-members`.
      className={cn("flex min-w-0 items-center gap-3", className)}
      {...props}
    >
      <Avatar size="lg" className="shrink-0">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        {hasName ? (
          <AvatarFallback colorSeed={name}>
            {initialsFromName(name!)}
          </AvatarFallback>
        ) : (
          <AvatarFallback tone="empty">
            <UserIcon />
          </AvatarFallback>
        )}
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {hasName ? name : email}
        </span>
        {hasName ? (
          <span className="block truncate text-xs text-muted-foreground">
            {email}
          </span>
        ) : null}
        {phone ? (
          <span className="block truncate text-xs text-muted-foreground">
            {phone}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export { TableCellUser, type TableCellUserProps };

type TableCellUserProps = React.ComponentProps<typeof TableCellUser>;
