import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRightIcon,
  CircleUserIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  SunMoonIcon,
} from "lucide-react";

import type { SidebarAccountMenuItem } from "@/components/navigation/sidebar";
import { Toaster } from "@/components/feedback/sonner";
import { AccountSettingsProvider } from "./account-settings/account-settings";
import { BusinessProfileLayout } from "./account-settings/pages/business-profile/business-profile";
import { BusinessProfilesLayout } from "./account-settings/pages/business-profiles/business-profiles";
import { SettingsEmptySectionLayout } from "./account-settings/pages/empty-section/empty-section";
import { IntegrationsLayout } from "./account-settings/pages/integrations/integrations";
import { MyProfileLayout } from "./account-settings/pages/my-profile/my-profile";
import { NotificationsLayout } from "./account-settings/pages/notifications/notifications";
import { TeamMembersLayout } from "./account-settings/pages/team-members/team-members";
import { HomePage } from "./home/home";
import { fadeVariants, takeoverVariants, useMotionPreference } from "@/lib/motion";
import { PROTOTYPE_STORIES, openStory } from "@/layouts/shared/prototype-links";
import { PortalEmptyPage } from "./empty-page";
import { NewListingFlow } from "./new-listing/new-listing-flow";
import { ProviderPortalLayout, pageForRoute, type PortalPage } from "./provider-portal";

const account = { name: "Lucy Smith", email: "lucysmith@email.com" };

const accountMenuItems: SidebarAccountMenuItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/settings/profile" },
  { icon: SettingsIcon, label: "Account settings", navigateTo: "/settings/business-profiles" },
  { icon: SunMoonIcon, label: "Theme", shortcut: "Auto" },
  { icon: LanguagesIcon, label: "Language", shortcut: "English" },
  {
    icon: LogOutIcon,
    label: "Log out",
    variant: "destructive",
    separator: true,
    // Prototype: logging out returns to the sign-in screen.
    onClick: () => openStory(PROTOTYPE_STORIES.signIn),
  },
];

/**
 * How many businesses the prototype's account has. "single" (the default, the most common case):
 * Settings → Business profiles opens that business's details directly. "multiple": it opens the
 * list of businesses first, and each business's details link back to it.
 */
type BusinessScenario = "single" | "multiple";

/** One page's content. */
function PortalPageContent({ page, onCreateListing }: { page: PortalPage; onCreateListing: () => void }) {
  return page === "home" ? <HomePage firstName="Lucy" /> : <PortalEmptyPage page={page} onCreateListing={onCreateListing} />;
}

/** Settings routes: each built page, plus the sections with no page yet (Billing, Promo codes, Security), which show their empty state. */
type SettingsRoute =
  | "/settings/profile"
  | "/settings/business-profiles"
  | "/settings/business-profile"
  | "/settings/team-members"
  | "/settings/notifications"
  | "/settings/integrations"
  | (string & {});

/**
 * Account Settings, opened from the account menu: renders the built page for the current section and
 * switches page when a section is picked in the rail (or the mobile settings menu). The X closes it.
 */
function AccountSettings({
  initialRoute,
  businessScenario,
  onClose,
}: {
  initialRoute: SettingsRoute;
  businessScenario: BusinessScenario;
  onClose: () => void;
}) {
  const [route, setRoute] = React.useState<SettingsRoute>(initialRoute);
  const nav = { onClose, onNavigate: setRoute };

  switch (route) {
    case "/settings/profile":
      return <MyProfileLayout {...nav} />;
    case "/settings/business-profiles":
      // One business: straight to its details (no list, no "Back to businesses").
      return businessScenario === "single" ? (
        <BusinessProfileLayout {...nav} />
      ) : (
        <BusinessProfilesLayout {...nav} onSelectBusiness={() => setRoute("/settings/business-profile")} />
      );
    case "/settings/business-profile":
      return <BusinessProfileLayout {...nav} onBack={() => setRoute("/settings/business-profiles")} />;
    case "/settings/team-members":
      return <TeamMembersLayout {...nav} />;
    case "/settings/notifications":
      return <NotificationsLayout {...nav} />;
    case "/settings/integrations":
      return <IntegrationsLayout {...nav} />;
    case "/settings/billing":
      return <SettingsEmptySectionLayout section="billing" {...nav} />;
    case "/settings/promo-codes":
      return <SettingsEmptySectionLayout section="promo-codes" {...nav} />;
    case "/settings/security":
      return <SettingsEmptySectionLayout section="security" {...nav} />;
    default:
      return <MyProfileLayout {...nav} />;
  }
}

/**
 * The whole portal: click the Sidebar to switch pages. From the account menu, "My profile" opens
 * Settings on My profile and "Account settings" opens it on Business profiles, full-screen over the
 * portal; its rail switches between the settings pages, and the X comes back to where you were.
 * The account has one business by default; the prototype link "Multiple businesses" (below Log out)
 * switches to several and opens the list of businesses.
 */
function ProviderPortal({ initialPage = "home" }: { initialPage?: PortalPage }) {
  const [page, setPage] = React.useState<PortalPage>(initialPage);
  const [settingsRoute, setSettingsRoute] = React.useState<SettingsRoute | null>(null);
  const [businessScenario, setBusinessScenario] = React.useState<BusinessScenario>("single");
  // The New Listing flow, opened from Listings' "Create new listing"; its X closes it again.
  const [creatingListing, setCreatingListing] = React.useState(false);
  const { prefersReducedMotion } = useMotionPreference();

  // Prototype-only links, below Log out after a divider: each jumps to a specific scenario that
  // isn't the default, so it can be shown on demand. Not part of the product's account menu.
  const prototypeLinks: SidebarAccountMenuItem[] = [
    {
      icon: ArrowUpRightIcon,
      label: "Multiple businesses",
      separator: true,
      onClick: () => {
        setBusinessScenario("multiple");
        setSettingsRoute("/settings/business-profiles");
      },
    },
  ];

  return (
    <>
      <ProviderPortalLayout
        page={initialPage}
        account={account}
        accountMenuItems={[...accountMenuItems, ...prototypeLinks]}
        onNavigate={(route) => {
          if (route.startsWith("/settings/")) return setSettingsRoute(route);
          const next = pageForRoute(route);
          if (next) setPage(next);
        }}
      >
        <PortalPageContent page={page} onCreateListing={() => setCreatingListing(true)} />
      </ProviderPortalLayout>
      {/* Full-screen over the portal like Settings, so the flow's X returns to Listings as it was.
          It enters with the Takeover motion (fade + 24px rise) and leaves on a quicker fade. */}
      <AnimatePresence>
        {creatingListing ? (
          <motion.div
            key="new-listing"
            variants={prefersReducedMotion ? fadeVariants : takeoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 overflow-y-auto bg-background"
          >
            <NewListingFlow onClose={() => setCreatingListing(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/* Over the portal rather than replacing it, so closing settings returns to the same page and
          Sidebar state. Same Takeover motion as the New Listing flow: fade + 24px rise in, quicker
          fade out (fade only under reduced motion). */}
      <AnimatePresence>
        {settingsRoute ? (
          <motion.div
            key="settings"
            variants={prefersReducedMotion ? fadeVariants : takeoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-40 bg-card"
          >
            {/* The rail reads "Business profile" with one business, "Business profiles" with several. */}
            <AccountSettingsProvider businessCount={businessScenario === "single" ? 1 : 3}>
              <AccountSettings
                initialRoute={settingsRoute}
                businessScenario={businessScenario}
                onClose={() => setSettingsRoute(null)}
              />
            </AccountSettingsProvider>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

const meta: Meta<typeof ProviderPortal> = {
  title: "Layouts/ProviderPortal/Portal",
  component: ProviderPortal,
  parameters: { layout: "fullscreen" },
  // Pages (e.g. Team members) report success with toasts; an app mounts `<Toaster />` once at its root.
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ProviderPortal>;

/**
 * Figma "Dashboard (Home)" (886:10115): the collapsed Sidebar and the welcome header. Click any
 * Sidebar item to switch pages; pages with nothing to show yet show their empty state, centered in
 * the canvas.
 */
export const Default: Story = {};

/** Starting on Listings: its empty state, whose "Create new listing" opens the New Listing flow (X returns here). */
export const Listings: Story = { args: { initialPage: "listings" } };
