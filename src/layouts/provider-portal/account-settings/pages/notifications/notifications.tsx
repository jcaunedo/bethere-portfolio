import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mail, MessageCircleMore } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { Typography } from "@/components/typography";
import { NotificationToggle } from "@/components/forms/notification-toggle";
import { slideVariants } from "@/lib/motion";

type ToggleRow = {
  id: string;
  label: string;
  checked: boolean;
  /** Overrides the row's default bell/bell-off icon, e.g. a channel glyph. */
  icon?: React.ReactNode;
};

type NotificationSection = {
  id: string;
  title: string;
  description: string;
  rows: ToggleRow[];
};

// Figma: Provider-Portal → "Notifications" frame (simplified — no per-row
// channel selector, see notifications-old.tsx for that version). The two
// delivery-channel rows (Email, Text message) sit above the first divider as
// their own independent toggles, not a single "Allow Notifications" master
// switch — this design has no master row. Each uses its channel's own icon
// (Mail / MessageCircleMore) rather than the default bell, matching Figma's
// `imgMail`/`imgMessageCircleMore` overrides on these two rows specifically.
const INITIAL_CHANNEL_ROWS: ToggleRow[] = [
  { id: "email", label: "Email", checked: true, icon: <Mail /> },
  { id: "sms", label: "Text message (SMS)", checked: false, icon: <MessageCircleMore /> },
];

const INITIAL_NOTIFICATION_SECTIONS: NotificationSection[] = [
  {
    id: "bookings",
    title: "Bookings",
    description:
      "Get notified about new reservations, upcoming activity, cancellations, and schedule changes across all your listings.",
    rows: [
      { id: "new-booking-received", label: "New booking received", checked: true },
      { id: "upcoming-booking-reminder", label: "Upcoming booking reminder", checked: true },
      { id: "availability-conflict-detected", label: "Availability conflict detected", checked: true },
      { id: "booking-cancelled-by-guest", label: "Booking cancelled by guest", checked: true },
      { id: "booking-cancelled-by-staff-member", label: "Booking cancelled by staff member", checked: false },
      { id: "booking-modified-rescheduled", label: "Booking modified/rescheduled", checked: false },
      { id: "guest-no-show", label: "Guest no-show", checked: true },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description:
      "Stay on top of incoming payments, payouts to your bank account, and any refunds processed to guests.",
    rows: [
      { id: "payment-received", label: "Payment received", checked: false },
      { id: "payout-processed", label: "Payout processed", checked: false },
      { id: "payment-failed", label: "Payment failed", checked: true },
      { id: "refund-issued", label: "Refund issued", checked: true },
    ],
  },
  {
    id: "listings",
    title: "Listings",
    description:
      "Receive updates when your listings are reviewed, approved, rejected, or flagged by the BeThere team.",
    rows: [
      { id: "listing-approved-rejected", label: "Listing approved / rejected", checked: true },
      { id: "listing-flagged-or-taken-down", label: "Listing flagged or taken down", checked: false },
      { id: "team-member-added-a-listing", label: "Team member added a listing", checked: false },
      { id: "team-member-modified-a-listing", label: "Team member modified a listing", checked: false },
    ],
  },
  {
    id: "guest-messages",
    title: "Guest messages",
    description: "Be notified when a guest sends you a message so you can respond promptly.",
    rows: [
      { id: "new-message-from-a-guest", label: "New message from a guest", checked: true },
      {
        id: "unanswered-message-reminder",
        label: "Unanswered message reminder, follow-up if no response after 1 hour",
        checked: false,
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    description: "Get alerted when a guest leaves a review on one of your listings.",
    rows: [
      { id: "new-review-received", label: "New review received", checked: true },
      { id: "guest-replied-to-your-review-response", label: "Guest replied to your review response", checked: true },
    ],
  },
  {
    id: "compliance-documentation",
    title: "Compliance documentation",
    description:
      "Stay ahead of expiring documents and incomplete profile requirements that could affect your listing visibility.",
    rows: [
      {
        id: "required-document-expiring-soon",
        label: "Required document expiring soon (license, insurance, etc.)",
        checked: true,
      },
    ],
  },
  {
    id: "team",
    title: "Team",
    description: "Stay informed about team member activity and changes to your account.",
    rows: [
      { id: "new-team-member-created", label: "New team member created", checked: true },
      { id: "team-member-profile-modified", label: "Team member profile modified", checked: true },
    ],
  },
];

/**
 * Provider Portal "Notifications" settings page — simplified version (Figma:
 * Provider-Portal → "Notifications" frame). Renders inside
 * `AccountSettingsLayout`'s content column: two delivery-channel rows
 * (Email / SMS), then a divided stack of sections, each a title +
 * description followed by its own plain on/off `NotificationToggle` rows —
 * no per-row channel selector (see `NotificationsLayoutOld` in
 * `../notifications-old/notifications-old.tsx` for that fuller version).
 */
function NotificationsLayout() {
  // Mobile-only: the header's back arrow (AccountSettingsLayout's onClose) has
  // nowhere to route to in this standalone Storybook reference layout, so it
  // swaps in the mobile "Account Settings" menu in place of this screen
  // instead — same pattern as the other account-settings pages.
  const [mobileScreen, setMobileScreen] = React.useState<
    "notifications" | "menu"
  >("notifications");
  // CLAUDE.md "Glide": direction should match the navigation, not just
  // alternate — tapping back (into the menu) glides Account Settings in from
  // the left (-1); going forward (back to this page) glides Notifications in
  // from the right (1).
  const [screenDirection, setScreenDirection] = React.useState<1 | -1>(1);

  const [channelRows, setChannelRows] = React.useState(INITIAL_CHANNEL_ROWS);
  const [sections, setSections] = React.useState(INITIAL_NOTIFICATION_SECTIONS);

  // With every delivery channel off, nothing below can actually be delivered
  // — so every section row displays (and behaves) as off without losing its
  // own checked state, which reappears the instant a channel is turned back
  // on. Mirrors `NotificationSwitcher`'s master-switch `locked` pattern, but
  // driven by the channel rows collectively instead of one master toggle.
  const allChannelsOff = channelRows.every((row) => !row.checked);

  function updateChannelRow(rowId: string, checked: boolean) {
    setChannelRows((prev) =>
      prev.map((row) => (row.id !== rowId ? row : { ...row, checked })),
    );
  }

  // A locked row click re-enables delivery by turning the first channel
  // (Email) back on, same "defaults to the first channel" convention
  // `NotificationSwitcher` uses when re-enabling from fully off.
  function handleLockedInteraction() {
    setChannelRows((prev) =>
      prev.map((row, index) => (index === 0 ? { ...row, checked: true } : row)),
    );
  }

  function updateRow(sectionId: string, rowId: string, checked: boolean) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              rows: section.rows.map((row) =>
                row.id !== rowId ? row : { ...row, checked },
              ),
            },
      ),
    );
  }

  function goToMenu() {
    setScreenDirection(-1);
    setMobileScreen("menu");
  }

  function goToNotifications() {
    setScreenDirection(1);
    setMobileScreen("notifications");
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
        onClose={goToNotifications}
        onNavigate={(navigateTo) => {
          // Only "Notifications" has a built destination screen in this
          // reference layout — every other row is presentational until its
          // own sub-page exists.
          if (navigateTo === "/settings/notifications") {
            goToNotifications();
          }
        }}
      />
    </motion.div>
  );

  const notificationsScreen = (
    <motion.div
      key="notifications"
      custom={screenDirection}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 h-screen"
    >
      <AccountSettingsLayout activeItem="Notifications" onClose={goToMenu}>
        <div className="flex flex-col gap-8 pb-24">
          <div className="flex w-full flex-col gap-2">
            <Typography as="h1" size="2xl" weight="semibold">
              Notifications
            </Typography>
            <Typography size="base">
              Choose which Bethere notifications you receive and how they're
              delivered.
            </Typography>
          </div>

          <div className="flex w-full flex-col gap-5">
            {channelRows.map((row) => (
              <NotificationToggle
                key={row.id}
                label={row.label}
                checked={row.checked}
                icon={row.icon}
                onCheckedChange={(checked) => updateChannelRow(row.id, checked)}
              />
            ))}
          </div>

          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <div className="h-px w-full bg-border" />
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                  <Typography size="lg" weight="semibold">
                    {section.title}
                  </Typography>
                  <Typography size="sm" className="text-muted-foreground">
                    {section.description}
                  </Typography>
                </div>
                <div className="flex flex-col gap-5">
                  {section.rows.map((row) => (
                    <NotificationToggle
                      key={row.id}
                      label={row.label}
                      checked={row.checked}
                      onCheckedChange={(checked) =>
                        updateRow(section.id, row.id, checked)
                      }
                      locked={allChannelsOff}
                      onLockedInteraction={handleLockedInteraction}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
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
        {mobileScreen === "menu" ? menuScreen : notificationsScreen}
      </AnimatePresence>
    </div>
  );
}

export { NotificationsLayout };
