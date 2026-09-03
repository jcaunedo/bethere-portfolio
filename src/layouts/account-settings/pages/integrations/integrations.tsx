import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { AccountSettingsLayout } from "@/layouts/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/account-settings/account-settings-menu";
import { Typography } from "@/components/typography";
import {
  IntegrationCard,
  type IntegrationCardDetail,
} from "@/components/cards/integration-card";
import { slideVariants } from "@/lib/motion";
import googleCalendarLogo from "./images/google-calendar.png";
import slackLogo from "./images/slack.png";

type IntegrationId = "google-calendar" | "slack";

type Integration = {
  id: IntegrationId;
  icon: React.ReactNode;
  title: string;
  description: string;
  connected: boolean;
  details?: IntegrationCardDetail[];
};

// Figma: Provider-Portal "Integrations" frame. Google Calendar starts
// connected to show both the default (Slack) and connected (Google
// Calendar) row treatments in the same reference page.
const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "google-calendar",
    icon: <img src={googleCalendarLogo} alt="" />,
    title: "Google Calendar",
    description:
      "Keep your Bethere bookings and availability in sync with Google Calendar.",
    connected: true,
    details: [
      { label: "Connected as", value: "lucysmith@gmail.com" },
      { label: "Calendar", value: "Bookings" },
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
];

/**
 * Provider Portal "Integrations" settings page (Figma: Provider-Portal →
 * "Integrations" frame). Renders inside `AccountSettingsLayout`'s content
 * column — a heading + description and a stack of integration rows, each
 * togglable between a "Connect" default state and a "Connected" state with
 * connection details, mirroring the Google Calendar row's two Figma variants.
 */
function IntegrationsLayout() {
  const [integrations, setIntegrations] = React.useState(INITIAL_INTEGRATIONS);

  function toggleConnection(id: IntegrationId) {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration,
      ),
    );
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
        onClose={goToIntegrations}
        onNavigate={(navigateTo) => {
          // Only "Integrations" has a built destination screen in this
          // reference layout — every other row is presentational until its
          // own sub-page exists.
          if (navigateTo === "/settings/integrations") {
            goToIntegrations();
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
      <AccountSettingsLayout activeItem="Integrations" onClose={goToMenu}>
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

          <div className="flex w-full flex-col gap-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                icon={integration.icon}
                title={integration.title}
                description={integration.description}
                connected={integration.connected}
                details={integration.details}
                onConnect={() => toggleConnection(integration.id)}
                onDisconnect={() => toggleConnection(integration.id)}
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
        {mobileScreen === "menu" ? menuScreen : integrationsScreen}
      </AnimatePresence>
    </div>
  );
}

export { IntegrationsLayout };
