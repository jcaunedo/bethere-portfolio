import * as React from "react";

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
 */
function TableCellUser({
  name,
  email,
  phone,
  avatarUrl,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}) {
  return (
    <div
      data-slot="table-cell-user"
      className={cn("flex min-w-0 items-center gap-2", className)}
      {...props}
    >
      <Avatar size="lg" className="shrink-0">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback colorSeed={name}>{initialsFromName(name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {email}
        </span>
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
