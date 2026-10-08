import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { AccountSettingsLayout } from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { EmptyState } from "@/components/feedback/empty-state";
import { Typography } from "@/components/typography";
import { mediaAbove } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { slideVariants } from "@/lib/motion";

/** Settings sections that don't have a page yet. */
type EmptySettingsSection = "billing" | "promo-codes" | "security";

/** Each section's rail label (its page title), route, and empty-state copy. */
const EMPTY_SECTIONS: Record<
  EmptySettingsSection,
  { label: string; route: string; title: string; description: string }
> = {
  billing: {
    label: "Billing",
    route: "/settings/billing",
    title: "No billing details yet",
    description: "Your plan, payment method and invoices will appear here.",
  },
  "promo-codes": {
    label: "Promo codes",
    route: "/settings/promo-codes",
    title: "No promo codes yet",
    description: "Promo codes you create will appear here.",
  },
  security: {
    label: "Security",
    route: "/settings/security",
    title: "Security settings aren't available yet",
    description: "Soon you'll manage your password and sign-in security here.",
  },
};

interface SettingsEmptySectionLayoutProps {
  /** Which section to show. */
  section: EmptySettingsSection;
  /** Leaves Settings, e.g. back to the Provider Portal: the header's X above `md`, and the mobile settings menu's X. Omit it and the X opens the settings menu instead (the standalone Storybook reference has nowhere to go). */
  onClose?: () => void;
  /** Called with a settings section's route (e.g. "/settings/team-members") when it's picked in the rail or the mobile settings menu, so the app can switch pages. */
  onNavigate?: (navigateTo: string) => void;
}

/**
 * A Settings section with nothing to show yet — Billing, Promo codes and
 * Security, which have no designed page: the section's title and a centered
 * `EmptyState` saying what will appear here, inside the usual settings shell.
 * Replace with the real page once it's designed. Same mobile behaviour as the
 * other settings pages: the back arrow swaps in the settings menu.
 */
function SettingsEmptySectionLayout({ section, onClose, onNavigate }: SettingsEmptySectionLayoutProps) {
  const copy = EMPTY_SECTIONS[section];
  // Above `md` the header shows an X (closes settings, `onClose`); at `md` and below it shows a back arrow to the mobile settings menu.
  const isMdUp = useMediaQuery(mediaAbove("md"));
  const [mobileScreen, setMobileScreen] = React.useState<"section" | "menu">("section");
  // CLAUDE.md "Glide": back into the menu glides in from the left (-1); returning to the section from the right (1).
  const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

  function goToMenu() {
    setScreenDirection(-1);
    setMobileScreen("menu");
  }

  function goToSection() {
    setScreenDirection(1);
    setMobileScreen("section");
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
        onClose={onClose ?? goToSection}
        onNavigate={(navigateTo) => {
          if (navigateTo === copy.route) goToSection();
          else onNavigate?.(navigateTo);
        }}
      />
    </motion.div>
  );

  const sectionScreen = (
    <motion.div
      key="section"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsLayout
        activeItem={copy.label}
        onClose={isMdUp && onClose ? onClose : goToMenu}
        onNavigate={onNavigate}
      >
        <div className="flex flex-col items-start gap-6 pb-24">
          <Typography as="h1">{copy.label}</Typography>
          {/* Centered in the settings canvas (the area right of the rail), not under the title. */}
          <EmptyState
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4"
            title={copy.title}
            description={copy.description}
          />
        </div>
      </AccountSettingsLayout>
    </motion.div>
  );

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={screenDirection}>
        {mobileScreen === "menu" ? menuScreen : sectionScreen}
      </AnimatePresence>
    </div>
  );
}

export { SettingsEmptySectionLayout };
export type { EmptySettingsSection, SettingsEmptySectionLayoutProps };
