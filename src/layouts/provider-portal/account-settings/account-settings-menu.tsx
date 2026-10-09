import * as React from "react";

import { SettingsHeader } from "@/components/navigation/settings-header";
import { NavigationListItem } from "@/components/navigation/navigation-list-item";
import {
  BusinessCountContext,
  createSettingsMenuGroups,
} from "@/layouts/provider-portal/account-settings/account-settings";
import { SidebarDivider, type SidebarNavItem } from "@/components/navigation/sidebar";
import type { SidebarSettingsGroup } from "@/components/navigation/sidebar-settings";

interface AccountSettingsMenuLayoutProps {
  /**
   * Settings sections, grouped (divider between groups). Defaults to the rail's groups
   * (`createSettingsMenuGroups`, with the business count from `AccountSettingsProvider`). Pass the same groups given to
   * `AccountSettingsLayout` so the mobile menu and the desktop rail can't
   * diverge.
   */
  groups?: SidebarSettingsGroup[];
  /** A single, ungrouped list of sections instead of `groups`. */
  items?: SidebarNavItem[];
  /** Called when the header's close (X) action is activated. */
  onClose?: () => void;
  /** Called with a settings menu item's `navigateTo` route when tapped. */
  onNavigate?: (navigateTo: string) => void;
}

/**
 * Mobile "Account Settings" menu (Figma Provider-Portal → `Account Settings
 * Menu`, 570:3326). The settings root on mobile — the equivalent of the
 * desktop `SidebarSettings` rail, which `AccountSettingsLayout` hides at `md`
 * and below: an X to close settings, then one `NavigationListItem` row per
 * section, in the same "Profile" / "Account" groups as the rail — no
 * visible group titles, just a divider between groups.
 */
function AccountSettingsMenuLayout({
  groups,
  items,
  onClose,
  onNavigate,
}: AccountSettingsMenuLayoutProps) {
  const businessCount = React.useContext(BusinessCountContext);
  const menuGroups = items ? undefined : (groups ?? createSettingsMenuGroups({ businessCount }));

  const renderItem = (item: SidebarNavItem) => (
    <NavigationListItem
      key={item.label}
      icon={item.icon}
      label={item.label}
      onClick={() => {
        // Same dispatch precedence as SidebarSettings: onClick wins
        // over navigateTo when an item defines both.
        if (item.onClick) item.onClick();
        else if (item.navigateTo) onNavigate?.(item.navigateTo);
      }}
    />
  );

  return (
    <div className="flex h-screen flex-col items-start overflow-hidden bg-card">
      {/* Figma: 24px side padding for the header and the list. */}
      <SettingsHeader
        className="shrink-0 px-6"
        onClose={onClose}
        mobileAction="close"
        title="Settings"
      />
      {/* Figma: 24px between the header and the list; rows and the divider row 12px apart. */}
      <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-6 pt-3 pb-6">
        {menuGroups
          ? menuGroups.map((group, index) => (
              <React.Fragment key={group.label}>
                {/* Figma: a 24px row with the line centered. */}
                {index > 0 ? <SidebarDivider className="my-[11.5px]" /> : null}
                <div
                  role="group"
                  aria-label={group.label}
                  className="flex w-full flex-col gap-3"
                >
                  {group.items.map(renderItem)}
                </div>
              </React.Fragment>
            ))
          : items?.map(renderItem)}
      </div>
    </div>
  );
}

export { AccountSettingsMenuLayout };
export type { AccountSettingsMenuLayoutProps };
