import * as React from "react";
import {
  BellIcon,
  BlocksIcon,
  BuildingIcon,
  CircleUserIcon,
  CreditCardIcon,
  ShieldIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";

import { SettingsHeader } from "@/components/navigation/settings-header";
import { SidebarSettings } from "@/components/navigation/sidebar-settings";
import type { SidebarNavItem } from "@/components/navigation/sidebar";

/** `SidebarSettings`' fixed rail width (Figma `Sidebar Settings`, 296px). */
const SIDEBAR_WIDTH = 296;

/**
 * The 8 Provider Portal settings sections (Figma `Sidebar Settings` /
 * `Account Settings Menu`). Exported so other layouts — e.g.
 * `AccountSettingsMenuLayout`, the mobile screen reached from the settings
 * back arrow — render the same list instead of maintaining a second copy.
 */
const settingsMenuItems: SidebarNavItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/settings/profile" },
  { icon: BuildingIcon, label: "Business profiles", navigateTo: "/settings/business-profiles" },
  { icon: UsersIcon, label: "Team members", navigateTo: "/settings/team-members" },
  { icon: CreditCardIcon, label: "Billing", navigateTo: "/settings/billing" },
  { icon: BellIcon, label: "Notifications", navigateTo: "/settings/notifications" },
  { icon: TagsIcon, label: "Promo codes", navigateTo: "/settings/promo-codes" },
  { icon: ShieldIcon, label: "Security", navigateTo: "/settings/security" },
  { icon: BlocksIcon, label: "Integrations", navigateTo: "/settings/integrations" },
];

interface AccountSettingsLayoutProps {
  /** Page content rendered in the Content area, to the right of the menu. */
  children?: React.ReactNode;
  /** Which settings menu item is active. Defaults to the first item. */
  activeItem?: string;
  /** Called when the header's close button is activated. */
  onClose?: () => void;
  /** Called with a settings menu item's `navigateTo` route when clicked. */
  onNavigate?: (navigateTo: string) => void;
}

/**
 * Provider Portal "Account Settings" shell. Figma origin: Provider-Portal →
 * "Settings Layout" frame. Header + a settings sub-nav rail on the left,
 * with the Content area (right) rendering whichever page under
 * `src/layouts/account-settings/pages/` the consumer passes as `children`
 * (e.g. `MyProfileLayout`).
 */
function AccountSettingsLayout({
  children,
  activeItem,
  onClose,
  onNavigate,
}: AccountSettingsLayoutProps) {
  const mobileTitle = activeItem ?? settingsMenuItems[0]?.label;

  return (
    <div className="flex h-screen flex-col items-start overflow-hidden bg-card">
      <SettingsHeader
        className="shrink-0"
        onClose={onClose}
        mobileTitle={mobileTitle}
      />
      <div className="flex w-full flex-1 items-start overflow-y-auto">
        <SidebarSettings
          items={settingsMenuItems}
          defaultActiveItem={activeItem}
          onNavigate={onNavigate}
          className="sticky top-0 hidden shrink-0 self-start md:flex"
          style={{ width: SIDEBAR_WIDTH }}
        />
        <div
          data-slot="settings-layout-content"
          className="flex min-w-0 flex-1 justify-center"
        >
          {/*
            justify-center alone centers the column within the space left of
            the sidebar only, landing right-of-viewport-center. Mirroring
            half the sidebar's width as an invisible spacer on the right
            pulls it partway toward true full-page center — a deliberate
            middle ground between that right-leaning default and a spacer
            matching the sidebar's full width (which centers dead-on).
            Below `md` the sidebar is hidden and the spacer collapses to 0,
            so the column simply fills the viewport width.
          */}
          <div
            data-slot="settings-layout-column"
            className="w-full max-w-[720px] px-4 pt-6 md:pt-0"
          >
            {children}
          </div>
        </div>
        <div
          aria-hidden
          className="hidden min-w-0 shrink md:block"
          style={{ width: SIDEBAR_WIDTH / 2 }}
        />
      </div>
    </div>
  );
}

export { AccountSettingsLayout, settingsMenuItems };
export type { AccountSettingsLayoutProps };
