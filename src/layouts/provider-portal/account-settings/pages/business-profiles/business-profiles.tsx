import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

import {
  AccountSettingsLayout,
  AccountSettingsProvider,
  businessProfilesLabel,
} from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { Button } from "@/components/buttons/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { Typography } from "@/components/typography";
import { CardBusiness } from "@/components/cards/card-business";
import { mediaAbove } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { slideVariants } from "@/lib/motion";

type BusinessProfile = {
  id: string;
  name: string;
  address: string;
  owner: string;
  badgeLabel: string;
  badgeColor: React.ComponentProps<typeof CardBusiness>["badgeColor"];
};

// Figma: card-business instances on the "Businesses" frame (Provider-Portal).
// One example per status the Badge/CardBusiness pairing supports.
const EXAMPLE_BUSINESSES: BusinessProfile[] = [
  {
    id: "key-biscayne-yacht-club",
    name: "Key Biscayne Yacht Club",
    address: "180 Harbor Dr, Key Biscayne, FL 33149",
    owner: "John Smith",
    badgeLabel: "Approved",
    badgeColor: "green",
  },
  {
    id: "brickell-bay-cafe",
    name: "Brickell Bay Cafe",
    address: "180 Harbor Dr, Key Biscayne, FL 33149",
    owner: "John Smith",
    badgeLabel: "Pending approval",
    badgeColor: "yellow",
  },
  {
    id: "yacht-rental-miami",
    name: "Yacht Rental Miami",
    address: "180 Harbor Dr, Key Biscayne, FL 33149",
    owner: "John Smith",
    badgeLabel: "Draft",
    badgeColor: "gray",
  },
];

/**
 * Provider Portal "Business profiles" settings page (Figma: Provider-Portal
 * → "Businesses" frame). Renders inside `AccountSettingsLayout`'s content
 * column — a heading + description, an "Add business" action, and a stack
 * of `CardBusiness` rows, one per business the account owns. Each row is
 * clickable (`onSelectBusiness`), intended to navigate to that business's
 * detail page once one exists.
 */
function BusinessProfilesLayout({
  businesses = EXAMPLE_BUSINESSES,
  onAddBusiness,
  onSelectBusiness,
  onClose,
  onNavigate,
}: {
  /** The account's businesses, one card each. Defaults to three examples. */
  businesses?: BusinessProfile[];
  /** Called when "Add business" is activated — hooks into the (future) Create Business flow. */
  onAddBusiness?: () => void;
  /** Called with a business's `id` when its card is clicked — hooks into the (future) business detail page. */
  onSelectBusiness?: (id: string) => void;
  /** Leaves Account Settings, e.g. back to the Provider Portal: the header's X above `md`, and the mobile settings menu's X. Omit it and the X opens the settings menu instead (the standalone Storybook reference has nowhere to go). */
  onClose?: () => void;
  /** Called with a settings section's route (e.g. "/settings/team-members") when it's picked in the rail or the mobile settings menu, so the app can switch pages. */
  onNavigate?: (navigateTo: string) => void;
}) {
  // Above `md` the header shows an X (closes settings, `onClose`); at `md` and below it shows a back arrow to the mobile settings menu.
  const isMdUp = useMediaQuery(mediaAbove("md"));
  // Mobile-only: the header's back arrow (AccountSettingsLayout's onClose) has
  // nowhere to route to in this standalone Storybook reference layout, so
  // it swaps in the mobile "Account Settings" menu in place of this screen
  // instead — same pattern as MyProfileLayout.
  const [mobileScreen, setMobileScreen] = React.useState<
    "business-profiles" | "menu"
  >("business-profiles");
  // CLAUDE.md "Glide": direction should match the navigation, not just
  // alternate — tapping back (into the menu) glides Account Settings in
  // from the left (-1); going forward (back to this page) glides Business
  // profiles in from the right (1).
  const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

  function goToMenu() {
    setScreenDirection(-1);
    setMobileScreen("menu");
  }

  function goToBusinessProfiles() {
    setScreenDirection(1);
    setMobileScreen("business-profiles");
  }

  const menuScreen = (
    <motion.div
      key="menu"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsMenuLayout
        onClose={onClose ?? goToBusinessProfiles}
        onNavigate={(navigateTo) => {
          // Only "Business profiles" has a built destination screen in this
          // reference layout — every other row is presentational until its
          // own sub-page exists.
          if (navigateTo === "/settings/business-profiles") {
            goToBusinessProfiles();
          } else {
            onNavigate?.(navigateTo);
          }
        }}
      />
    </motion.div>
  );

  const businessProfilesScreen = (
    <motion.div
      key="business-profiles"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsLayout
        activeItem={businessProfilesLabel(businesses.length)}
        onClose={isMdUp && onClose ? onClose : goToMenu}
        onNavigate={onNavigate}
      >
        <div className="flex flex-col items-start gap-6 pb-24">
          <div className="flex w-full flex-col gap-2">
            <Typography as="h1" size="2xl" weight="semibold">
              Business profiles
            </Typography>
            <Typography size="base">
              Each experience you offer belongs to a business. Add and manage
              your businesses here, along with their tax details and required
              documents.
            </Typography>
          </div>

          {businesses.length === 0 ? (
            // No businesses yet: the empty state carries the one "Add business" action
            // (instead of the button above an empty list), centered in the settings canvas.
            <EmptyState
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4"
              title="No business profiles yet"
              description="Add your business to start creating experiences and verify its details and documents."
              buttonLabel="Add business"
              buttonIcon={<PlusIcon />}
              buttonProps={{ onClick: onAddBusiness }}
            />
          ) : (
            <>
              <Button variant="default" size="lg" onClick={onAddBusiness}>
                <PlusIcon />
                Add business
              </Button>

              <div className="flex w-full flex-col gap-3">
                {businesses.map((business) => (
                  <CardBusiness
                    key={business.id}
                    name={business.name}
                    address={business.address}
                    owner={business.owner}
                    badgeLabel={business.badgeLabel}
                    badgeColor={business.badgeColor}
                    onClick={() => onSelectBusiness?.(business.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </AccountSettingsLayout>
    </motion.div>
  );

  return (
    // The rail and mobile menu label the businesses row by this page's own business count.
    <AccountSettingsProvider businessCount={businesses.length}>
      <div className="relative h-screen overflow-hidden">
        {/* `custom` on AnimatePresence itself (not just the child) is what
            actually reaches the *exiting* element's `exit` variant function —
            a child's own `custom` prop stops updating once it's removed from
            the tree, so the exit animation would otherwise run with whatever
            direction was current on the child's last live render instead of
            the direction that triggered this specific transition. */}
        <AnimatePresence initial={false} custom={screenDirection}>
          {mobileScreen === "menu" ? menuScreen : businessProfilesScreen}
        </AnimatePresence>
      </div>
    </AccountSettingsProvider>
  );
}

export { BusinessProfilesLayout };
export type { BusinessProfile };
