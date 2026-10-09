import { PlusIcon } from "lucide-react";

import { EmptyState } from "@/components/feedback/empty-state";
import { PAGE_LABEL, PortalPageHeader, type PortalPage } from "./provider-portal";

/** Provider Portal pages that show an empty state (every Sidebar page except Home). */
type EmptyPortalPage = Exclude<PortalPage, "home">;

/** Each page's empty-state copy: what's missing, and what will appear here. */
const PORTAL_EMPTY_STATES: Record<EmptyPortalPage, { title: string; description: string }> = {
  messages: {
    title: "No messages yet",
    description: "Messages about your bookings and experiences will appear here.",
  },
  listings: {
    title: "No listings yet",
    // A listing can be an experience or a service, so the copy names neither.
    description: "Create your first listing so guests can discover and request it on Bethere.",
  },
  calendar: {
    title: "Nothing on your calendar yet",
    description: "Your upcoming bookings will appear here.",
  },
  transactions: {
    title: "No transactions yet",
    description: "Payments and payouts for your bookings will appear here.",
  },
  analytics: {
    title: "No analytics yet",
    description: "Once guests start booking your experiences, you'll see how they're performing here.",
  },
};

interface PortalEmptyPageProps {
  /** Which Sidebar page to show. */
  page: EmptyPortalPage;
  /** Listings only: starts the new-listing flow (an experience or a service) from the empty state's button. */
  onCreateListing?: () => void;
}

/**
 * A Provider Portal page with nothing to show yet (Messages, Listings, Calendar, Transactions,
 * Analytics): the page header and an `EmptyState` centered in the portal canvas (the
 * area beside the Sidebar), same as the empty Settings sections. Listings adds a "Create new
 * listing" button when `onCreateListing` is given.
 */
function PortalEmptyPage({ page, onCreateListing }: PortalEmptyPageProps) {
  const copy = PORTAL_EMPTY_STATES[page];
  const showCreate = page === "listings" && onCreateListing;

  return (
    <div className="flex flex-col">
      <PortalPageHeader title={PAGE_LABEL[page]} />
      {/* Centered in the portal canvas (`ProviderPortalLayout`'s <main>), not under the title. */}
      <EmptyState
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4"
        title={copy.title}
        description={copy.description}
        buttonLabel={showCreate ? "Create new listing" : undefined}
        buttonIcon={showCreate ? <PlusIcon /> : undefined}
        buttonProps={showCreate ? { onClick: onCreateListing } : undefined}
      />
    </div>
  );
}

export { PortalEmptyPage };
export type { EmptyPortalPage, PortalEmptyPageProps };
