import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { EmptyState } from "@/components/feedback/empty-state";
import { Typography } from "@/components/typography";
import { AddIndicator } from "@/components/primitives/add-indicator";
import {
  IntegrationCard,
  type IntegrationCardDetail,
} from "@/components/cards/integration-card";
import { mediaAbove } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { slideVariants } from "@/lib/motion";
import googleCalendarLogo from "./images/google-calendar.png";
import slackLogo from "./images/slack.png";
import stripeLogo from "./images/stripe.png";

const NYLAS_CONNECT_URL = "https://www.nylas.com/";

type IntegrationId = "add-calendar" | "google-calendar" | "slack" | "stripe";

type Integration = {
  id: IntegrationId;
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  details?: IntegrationCardDetail[];
};

// Figma: Provider-Portal "Integrations" frame. "Add Calendar" is a prompt
// row (Property 1=Default) rather than a specific provider, so it's excluded
// from the generic Connect/Disconnect toggle below and always launches the
// Nylas connect flow instead. Google Calendar starts connected to show both
// the default (Slack) and connected (Google Calendar) row treatments in the
// same reference page.
const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "add-calendar",
    icon: <AddIndicator icon={<Calendar aria-hidden="true" />} />,
    title: "Calendar",
    description: "Connect Google or Outlook to sync bookings and availability.",
    connected: false,
  },
  {
    id: "google-calendar",
    icon: <img src={googleCalendarLogo} alt="" />,
    title: "Google Calendar",
    description:
      "Keep your Bethere bookings and availability in sync with Google Calendar.",
    connected: true,
    details: [
      { label: "Connected as", value: "lucysmith@gmail.com" },
      {
        label: "Calendars",
        value: "Bookings, Personal",
        editLabel: "Edit",
      },
    ],
  },
  {
    id: "slack",
    icon: <img src={slackLogo} alt="" />,
    title: "Slack",
    description:
      "Get notified in Slack about new bookings, changes, cancellations, and other important Bethere activity.",
    connected: false,
  },
  {
    id: "stripe",
    icon: <img src={stripeLogo} alt="" />,
    title: "Stripe",
    description:
      "Connect Stripe to accept payments and manage payouts for your bookings.",
    connected: false,
  },
];

/**
 * Provider Portal "Integrations" settings page (Figma: Provider-Portal →
 * "Integrations" frame). Renders inside `AccountSettingsLayout`'s content
 * column — a heading + description and a stack of integration rows, each
 * togglable between a "Connect" default state and a "Connected" state with
 * connection details, mirroring the Google Calendar row's two Figma variants.
 */
function IntegrationsLayout({
  availableIntegrations,
  onEditCalendars,
  onClose,
  onNavigate,
}: {
  /**
   * Called when Google Calendar's "Edit" link (next to its "Calendars" row)
   * is activated — hooks into the (future) calendar picker flow. Figma
   * shows the link but not the picker it opens, so this is a stub, same
   * pattern as `BusinessProfilesLayout`'s `onAddBusiness`.
   */
  onEditCalendars?: () => void;
  /** Leaves Account Settings, e.g. back to the Provider Portal: the header's X above `md`, and the mobile settings menu's X. Omit it and the X opens the settings menu instead (the standalone Storybook reference has nowhere to go). */
  onClose?: () => void;
  /** Called with a settings section's route (e.g. "/settings/team-members") when it's picked in the rail or the mobile settings menu, so the app can switch pages. */
  onNavigate?: (navigateTo: string) => void;
  /**
   * Which of the example integrations are offered, by id. Defaults to all of them; pass `[]` for
   * the empty state (nothing to connect yet).
   */
  availableIntegrations?: IntegrationId[];
} = {}) {
  // Above `md` the header shows an X (closes settings, `onClose`); at `md` and below it shows a back arrow to the mobile settings menu.
  const isMdUp = useMediaQuery(mediaAbove("md"));
  const [integrations, setIntegrations] = React.useState(() =>
    availableIntegrations
      ? INITIAL_INTEGRATIONS.filter((integration) => availableIntegrations.includes(integration.id))
      : INITIAL_INTEGRATIONS,
  );

  function toggleConnection(id: IntegrationId) {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration,
      ),
    );
  }

  // "Add Calendar" isn't a specific provider row — its "Connect" button always
  // kicks off the Nylas connect flow instead of flipping local state.
  function connectViaNylas() {
    window.open(NYLAS_CONNECT_URL, "_blank", "noopener,noreferrer");
  }

  // Mobile-only: the header's back arrow (AccountSettingsLayout's onClose) has
  // nowhere to route to in this standalone Storybook reference layout, so
  // it swaps in the mobile "Account Settings" menu in place of this screen
  // instead — same pattern as BusinessProfilesLayout/MyProfileLayout.
  const [mobileScreen, setMobileScreen] = React.useState<
    "integrations" | "menu"
  >("integrations");
  const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

  function goToMenu() {
    setScreenDirection(-1);
    setMobileScreen("menu");
  }

  function goToIntegrations() {
    setScreenDirection(1);
    setMobileScreen("integrations");
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
        onClose={onClose ?? goToIntegrations}
        onNavigate={(navigateTo) => {
          // Only "Integrations" has a built destination screen in this
          // reference layout — every other row is presentational until its
          // own sub-page exists.
          if (navigateTo === "/settings/integrations") {
            goToIntegrations();
          } else {
            onNavigate?.(navigateTo);
          }
        }}
      />
    </motion.div>
  );

  const integrationsScreen = (
    <motion.div
      key="integrations"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsLayout
        activeItem="Integrations"
        onClose={isMdUp && onClose ? onClose : goToMenu}
        onNavigate={onNavigate}
      >
        <div className="flex flex-col items-start gap-6 pb-24">
          <div className="flex w-full flex-col gap-0">
            <Typography as="h1" size="2xl" weight="semibold">
              Integrations
            </Typography>
            <Typography size="base">
              Extend the functionality of Bethere by integrating with your
              existing tools.
            </Typography>
          </div>

          {integrations.length === 0 ? (
            // Centered in the settings canvas (the area right of the rail), not under the title.
            <EmptyState
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4"
              title="No integrations available yet"
              description="Tools you can connect to Bethere, like calendars, will appear here."
            />
          ) : (
            <div className="flex w-full flex-col gap-4">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  icon={integration.icon}
                  title={integration.title}
                  description={integration.description}
                  connected={integration.connected}
                  details={integration.details?.map((detail) =>
                    detail.editLabel
                      ? { ...detail, onEditClick: onEditCalendars }
                      : detail,
                  )}
                  onConnect={
                    integration.id === "add-calendar"
                      ? connectViaNylas
                      : () => toggleConnection(integration.id)
                  }
                  onDisconnect={() => toggleConnection(integration.id)}
                />
              ))}
            </div>
          )}
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
        {mobileScreen === "menu" ? menuScreen : integrationsScreen}
      </AnimatePresence>
    </div>
  );
}

export { IntegrationsLayout };
