import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { Bell, BellOff, Mail, MessageCircleMore } from "lucide-react";

import { AccountSettingsLayout } from "@/layouts/provider-portal/account-settings/account-settings";
import { AccountSettingsMenuLayout } from "@/layouts/provider-portal/account-settings/account-settings-menu";
import { Typography } from "@/components/typography";
import {
  NotificationSwitcher,
  type NotificationChannel,
} from "@/components/forms/notification-switcher";
import { Switch } from "@/components/forms/switch";
import { WhatsappIcon } from "@/components/icons/whatsapp-icon";
import { slideVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CHANNEL_LEGEND: {
  channel: NotificationChannel;
  label: string;
  icon: React.ReactNode;
}[] = [
  { channel: "email", label: "Email", icon: <Mail /> },
  { channel: "sms", label: "SMS", icon: <MessageCircleMore /> },
  { channel: "whatsapp", label: "WhatsApp", icon: <WhatsappIcon /> },
];

type NotificationRow = {
  id: string;
  label: string;
  checked: boolean;
  activeChannels: NotificationChannel[];
};

type NotificationSection = {
  id: string;
  title: string;
  description: string;
  rows: NotificationRow[];
};

// Figma: Provider-Portal → "Notifications" frame. The "Allow Notifications"
// master row has no section title/description of its own — just the row —
// so it's tracked separately from the sections below it.
//
// Every row starts off (checked: false, no active channels) — this is a
// reference layout with no persisted user preferences, so it defaults to
// the safe "nothing enabled yet" state rather than Figma's example data.
const INITIAL_MASTER_ROW: NotificationRow = {
  id: "allow-notifications",
  label: "Allow Notifications",
  checked: false,
  activeChannels: [],
};

const INITIAL_NOTIFICATION_SECTIONS: NotificationSection[] = [
  {
    id: "bookings",
    title: "Bookings",
    description:
      "Get notified about new reservations, upcoming activity, cancellations, and schedule changes across all your listings.",
    rows: [
      { id: "new-booking-received", label: "New booking received", checked: false, activeChannels: [] },
      { id: "upcoming-booking-reminder", label: "Upcoming booking reminder", checked: false, activeChannels: [] },
      { id: "availability-conflict-detected", label: "Availability conflict detected", checked: false, activeChannels: [] },
      { id: "booking-cancelled-by-guest", label: "Booking cancelled by guest", checked: false, activeChannels: [] },
      { id: "booking-cancelled-by-staff-member", label: "Booking cancelled by staff member", checked: false, activeChannels: [] },
      { id: "booking-modified-rescheduled", label: "Booking rescheduled", checked: false, activeChannels: [] },
      { id: "guest-no-show", label: "Guest no-show", checked: false, activeChannels: [] },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description:
      "Stay on top of incoming payments, payouts to your bank account, and any refunds processed to guests.",
    rows: [
      { id: "payment-received", label: "Payment received", checked: false, activeChannels: [] },
      { id: "payout-processed", label: "Payout processed", checked: false, activeChannels: [] },
      { id: "payment-failed", label: "Payment failed", checked: false, activeChannels: [] },
      { id: "refund-issued", label: "Refund issued", checked: false, activeChannels: [] },
    ],
  },
  {
    id: "listings",
    title: "Listings",
    description:
      "Receive updates when your listings are reviewed, approved, rejected, or flagged by the Bethere team.",
    rows: [
      { id: "listing-approved-rejected", label: "Listing approved / rejected", checked: false, activeChannels: [] },
      { id: "listing-flagged-or-taken-down", label: "Listing flagged or taken down", checked: false, activeChannels: [] },
      { id: "team-member-added-a-listing", label: "Team member added a listing", checked: false, activeChannels: [] },
      { id: "team-member-modified-a-listing", label: "Team member modified a listing", checked: false, activeChannels: [] },
    ],
  },
  {
    id: "guest-messages",
    title: "Guest messages",
    description: "Be notified when a guest sends you a message so you can respond promptly.",
    rows: [
      { id: "new-message-from-a-guest", label: "New message from a guest", checked: false, activeChannels: [] },
      {
        id: "unanswered-message-reminder",
        label: "Unanswered message reminder, follow-up if no response after 1 hour",
        checked: false,
        activeChannels: [],
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    description: "Get alerted when a guest leaves a review on one of your listings.",
    rows: [
      { id: "new-review-received", label: "New review received", checked: false, activeChannels: [] },
      { id: "guest-replied-to-your-review-response", label: "Guest replied to your review response", checked: false, activeChannels: [] },
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
        checked: false,
        activeChannels: [],
      },
    ],
  },
  {
    id: "team",
    title: "Team",
    description: "Stay informed about team member activity and changes to your account.",
    rows: [
      { id: "new-team-member-created", label: "New team member created", checked: false, activeChannels: [] },
      { id: "team-member-profile-modified", label: "Team member profile modified", checked: false, activeChannels: [] },
    ],
  },
];

/**
 * Superseded by the simplified `NotificationsLayout` (see
 * `../notifications/notifications.tsx`) — kept as reference for the older,
 * full per-row channel-selector design (Figma: Provider-Portal →
 * "Notifications" frame, original version). Renders inside
 * `AccountSettingsLayout`'s content column — a master "Allow Notifications"
 * row (with Email/SMS/WhatsApp column labels above it), then a divided stack
 * of sections, each a title + description followed by its own
 * `NotificationSwitcher` rows.
 */
function NotificationsLayoutOld() {
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

  const [masterRow, setMasterRow] = React.useState(INITIAL_MASTER_ROW);
  const [sections, setSections] = React.useState(INITIAL_NOTIFICATION_SECTIONS);

  function updateMasterRow(patch: Partial<NotificationRow>) {
    setMasterRow((prev) => ({ ...prev, ...patch }));
  }

  function handleMasterCheckedChange(nextChecked: boolean) {
    updateMasterRow({ checked: nextChecked });
  }

  // The legend below the master row is a read-only summary, not an
  // independent control — a channel shows as active there whenever at
  // least one row anywhere below is both checked (on) and has that channel
  // active, derived fresh from `sections` rather than tracked as its own
  // state. A row's `activeChannels` alone isn't enough: an off row keeps
  // its channels remembered for when it's re-enabled, so it must be
  // excluded here or the legend would stay lit for a channel nothing is
  // actually delivering to right now.
  const activeChannelsBelow = React.useMemo(() => {
    const active = new Set<NotificationChannel>();
    for (const section of sections) {
      for (const row of section.rows) {
        if (!row.checked) continue;
        for (const channel of row.activeChannels) {
          active.add(channel);
        }
      }
    }
    return active;
  }, [sections]);

  function updateRow(
    sectionId: string,
    rowId: string,
    patch: Partial<NotificationRow>,
  ) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              rows: section.rows.map((row) =>
                row.id !== rowId ? row : { ...row, ...patch },
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

          {/*
            Bespoke row instead of <NotificationSwitcher> — this row needs
            each channel control to carry its own label underneath (see
            CHANNEL_LEGEND below), which NotificationSwitcher's plain
            channel-button row doesn't support. Mirrors that component's
            classes/behavior for everything else (bell icon, label, switch,
            click rules) so it reads as the same row type.
          */}
          <div className="flex w-full items-center gap-4 rounded-full pr-2 pb-8">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full p-[10px]",
                masterRow.checked
                  ? "bg-primary-subtle text-icon-primary"
                  : "bg-background text-icon-muted",
              )}
            >
              {masterRow.checked ? <Bell /> : <BellOff />}
            </div>
            <p
              className={cn(
                "flex-1 text-base leading-6 font-medium",
                masterRow.checked ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {masterRow.label}
            </p>
            <div className="flex h-10 shrink-0 items-center gap-[30px] px-24">
              {CHANNEL_LEGEND.map(({ channel, label, icon }) => {
                const isActive =
                  activeChannelsBelow.has(channel) && masterRow.checked;
                return (
                  <div
                    key={channel}
                    className="relative flex size-10 shrink-0 items-center justify-center"
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-full transition-colors [&_svg]:size-5",
                        isActive
                          ? "bg-primary-subtle text-icon-primary"
                          : "bg-background text-icon-subtle",
                      )}
                    >
                      {icon}
                    </div>
                    <Typography
                      size="sm"
                      className={cn(
                        "absolute top-full mt-2 w-max",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </Typography>
                  </div>
                );
              })}
            </div>
            <Switch
              className="shrink-0"
              checked={masterRow.checked}
              onCheckedChange={handleMasterCheckedChange}
            />
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
                    <NotificationSwitcher
                      key={row.id}
                      label={row.label}
                      checked={row.checked}
                      onCheckedChange={(checked) =>
                        updateRow(section.id, row.id, { checked })
                      }
                      activeChannels={row.activeChannels}
                      onActiveChannelsChange={(activeChannels) =>
                        updateRow(section.id, row.id, { activeChannels })
                      }
                      locked={!masterRow.checked}
                      onLockedInteraction={() =>
                        handleMasterCheckedChange(true)
                      }
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

export { NotificationsLayoutOld };
