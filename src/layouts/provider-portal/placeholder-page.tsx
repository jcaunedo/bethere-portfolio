import { Typography } from "@/components/typography";
import { PortalPageHeader } from "./provider-portal";

/**
 * Stand-in for a Provider Portal page that isn't designed yet (Inbox, Calendar, Transactions,
 * Documents, Analytics — and Listings until it's built from its Figma frame): the page header with
 * its name, so the Sidebar can navigate to it. No Figma source for the line below the header.
 */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <PortalPageHeader title={title} />
      <Typography size="sm" className="text-muted-foreground">
        This page isn't designed yet.
      </Typography>
    </div>
  );
}

export { PlaceholderPage };
