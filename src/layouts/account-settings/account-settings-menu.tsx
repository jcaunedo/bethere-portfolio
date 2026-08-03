import * as React from "react";

import { SettingsHeader } from "@/components/navigation/settings-header";
import { NavigationListItem } from "@/components/navigation/navigation-list-item";
import { settingsMenuItems } from "@/layouts/account-settings/account-settings";

interface AccountSettingsMenuLayoutProps {
  /** Called when the header's back action is activated. */
  onClose?: () => void;
  /** Called with a settings menu item's `navigateTo` route when tapped. */
  onNavigate?: (navigateTo: string) => void;
}

/**
 * Mobile "Account Settings" menu (Figma Provider-Portal → `Account Settings
 * Menu`). The screen a mobile user lands on after tapping the settings
 * back arrow from a sub-page (e.g. `MyProfileLayout`) — the mobile
 * equivalent of the desktop `SidebarSettings` rail, which
 * `AccountSettingsLayout` hides below `md`. Renders the same
 * `settingsMenuItems` list as `SidebarSettings`, one `NavigationListItem`
 * row per section.
 */
function AccountSettingsMenuLayout({
  onClose,
  onNavigate,
}: AccountSettingsMenuLayoutProps) {
  return (
    <div className="flex h-screen flex-col items-start overflow-hidden bg-card">
      <SettingsHeader
        className="shrink-0"
        onClose={onClose}
        mobileTitle="Account Settings"
      />
      <div className="flex w-full flex-1 flex-col overflow-y-auto px-4 pt-6">
        {settingsMenuItems.map((item) => (
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
        ))}
      </div>
    </div>
  );
}

export { AccountSettingsMenuLayout };
export type { AccountSettingsMenuLayoutProps };
