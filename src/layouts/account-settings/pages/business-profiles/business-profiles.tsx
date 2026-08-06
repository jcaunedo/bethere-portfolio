import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlusIcon } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/account-settings/account-settings-menu";
import { Button } from "@/components/buttons/button";
import { Typography } from "@/components/typography";
import { CardBusiness } from "@/components/cards/card-business";
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
  onAddBusiness,
  onSelectBusiness,
}: {
  /** Called when "Add business" is activated — hooks into the (future) Create Business flow. */
  onAddBusiness?: () => void;
  /** Called with a business's `id` when its card is clicked — hooks into the (future) business detail page. */
  onSelectBusiness?: (id: string) => void;
}) {
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
        onClose={goToBusinessProfiles}
        onNavigate={(navigateTo) => {
          // Only "Business profiles" has a built destination screen in this
          // reference layout — every other row is presentational until its
          // own sub-page exists.
          if (navigateTo === "/settings/business-profiles") {
            goToBusinessProfiles();
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
      <AccountSettingsLayout activeItem="Business profiles" onClose={goToMenu}>
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

          <Button variant="default" size="lg" onClick={onAddBusiness}>
            <PlusIcon />
            Add business
          </Button>

          <div className="flex w-full flex-col gap-3">
            {EXAMPLE_BUSINESSES.map((business) => (
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
        </div>
      </AccountSettingsLayout>
    </motion.div>
  );

  return (
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
  );
}

export { BusinessProfilesLayout };
