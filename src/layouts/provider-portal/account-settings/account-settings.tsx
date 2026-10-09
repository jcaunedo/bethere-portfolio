import * as React from "react";
import {
  BellIcon,
  BlocksIcon,
  BuildingIcon,
  CircleUserIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react";
import { TagsIcon } from "@/components/icons/tags-icon";
import { TagsSolidIcon } from "@/components/icons/tags-solid-icon";
import { BlocksSolidIcon } from "@/components/icons/blocks-solid-icon";

import { SettingsHeader } from "@/components/navigation/settings-header";
import { ConfirmDialog } from "@/components/overlays/confirm-dialog";
import { BuildingSolidIcon } from "@/components/icons/building-solid-icon";
import { CircleUserSolidIcon } from "@/components/icons/circle-user-solid-icon";
import { UsersSolidIcon } from "@/components/icons/users-solid-icon";
import { ReceiptIcon } from "@/components/icons/receipt-icon";
import { ReceiptSolidIcon } from "@/components/icons/receipt-solid-icon";
import { SidebarSettings } from "@/components/navigation/sidebar-settings";
import type { SidebarNavItem } from "@/components/navigation/sidebar";
import type { SidebarSettingsGroup } from "@/components/navigation/sidebar-settings";

/** `SidebarSettings`' fixed rail width (Figma `Sidebar Settings`, 296px). */
const SIDEBAR_WIDTH = 296;

/**
 * The businesses row's label: "Business profile" for an account with a single
 * business (the default, and the most common case), "Business profiles" for
 * several. Business pages pass the same label as `activeItem`, so the rail's
 * highlight always matches the row.
 */
function businessProfilesLabel(businessCount = 1) {
  return businessCount === 1 ? "Business profile" : "Business profiles";
}

/**
 * How many businesses the signed-in account has, for every settings rail and
 * mobile settings menu rendered inside it (the businesses row's label follows
 * it). Defaults to 1. Set it once with `AccountSettingsProvider` around the
 * settings pages instead of passing it to each page.
 */
const BusinessCountContext = React.createContext(1);

/** Provides the account's business count to every settings page inside it. */
function AccountSettingsProvider({
  businessCount,
  children,
}: {
  /** How many businesses the account has. 1 shows "Business profile"; more show "Business profiles". */
  businessCount: number;
  children?: React.ReactNode;
}) {
  return <BusinessCountContext.Provider value={businessCount}>{children}</BusinessCountContext.Provider>;
}

/** The current businesses row label (`businessProfilesLabel` of the provided business count). */
function useBusinessProfilesLabel() {
  return businessProfilesLabel(React.useContext(BusinessCountContext));
}

/**
 * The 8 Provider Portal settings sections, grouped as in Figma `Sidebar
 * Settings`: "Profile" holds personal settings (they affect only the signed-in
 * user); "Account" holds the business account's settings — its business
 * profiles, team, billing, promo codes and integrations — which affect the
 * whole team (product-specs/account-menu.md). `businessCount` picks the
 * businesses row's label (`businessProfilesLabel`). Apps that own their own
 * routing should pass their own groups — these `navigateTo` values are the
 * reference routes, not a contract.
 */
function createSettingsMenuGroups({ businessCount = 1 }: { businessCount?: number } = {}): SidebarSettingsGroup[] {
  return [
    {
      label: "Profile",
      items: [
        { icon: CircleUserIcon, activeIcon: CircleUserSolidIcon, label: "My profile", navigateTo: "/settings/profile" },
        { icon: BellIcon, label: "Notifications", navigateTo: "/settings/notifications" },
        { icon: ShieldIcon, label: "Security", navigateTo: "/settings/security" },
      ],
    },
    {
      label: "Account",
      items: [
        {
          icon: BuildingIcon,
          activeIcon: BuildingSolidIcon,
          label: businessProfilesLabel(businessCount),
          navigateTo: "/settings/business-profiles",
        },
        { icon: UsersIcon, activeIcon: UsersSolidIcon, label: "Team members", navigateTo: "/settings/team-members" },
        { icon: ReceiptIcon, activeIcon: ReceiptSolidIcon, label: "Billing", navigateTo: "/settings/billing" },
        { icon: TagsIcon, activeIcon: TagsSolidIcon, label: "Promo codes", navigateTo: "/settings/promo-codes" },
        { icon: BlocksIcon, activeIcon: BlocksSolidIcon, label: "Integrations", navigateTo: "/settings/integrations" },
      ],
    },
  ];
}

/** The default rail groups, for an account with a single business. */
const settingsMenuGroups: SidebarSettingsGroup[] = createSettingsMenuGroups();

/**
 * The same 8 sections as one list, in rail order — the default for the mobile
 * settings menu (`AccountSettingsMenuLayout`) and for looking a route up.
 */
const settingsMenuItems: SidebarNavItem[] = settingsMenuGroups.flatMap((group) => group.items);

interface AccountSettingsLayoutProps {
  /** Page content rendered in the Content area, to the right of the menu. */
  children?: React.ReactNode;
  /**
   * Settings sections to render in the rail, grouped with a divider between groups. Defaults to
   * `settingsMenuGroups`. Each item carries a `navigateTo` (forwarded to
   * `onNavigate`) or its own `onClick`, so the consuming app owns routing and
   * any per-item action.
   */
  groups?: SidebarSettingsGroup[];
  /** A single, ungrouped list of sections instead of `groups`. */
  items?: SidebarNavItem[];
  /**
   * Which settings menu item is active, by label. Drives the rail's highlight
   * as a *controlled* value — pass the section matching the current route and
   * the highlight can never drift from it. Omit to let the rail track its own
   * clicks (defaulting to the first item).
   */
  activeItem?: string;
  /**
   * Called when the header's X (desktop) or back chevron (mobile) is activated — close settings
   * and go back to wherever the user was. Esc does the same when nothing is pending (no unsaved
   * changes, no open edit row, no open dialog or menu).
   */
  onClose?: () => void;
  /**
   * The page has edits that haven't been saved. While true, the header's
   * close button and the rail ask for confirmation ("Discard unsaved changes?") before
   * leaving, so the edits aren't lost silently.
   */
  hasUnsavedChanges?: boolean;
  /** Called with a settings menu item's `navigateTo` route when clicked. */
  onNavigate?: (navigateTo: string) => void;
}

/**
 * Provider Portal "Settings" shell (titled "Account Settings" until Oct 08, 2026). Figma origin: Provider-Portal →
 * "Settings Layout" frame. Header + a settings sub-nav rail on the left,
 * with the Content area (right) rendering whichever page under
 * `src/layouts/account-settings/pages/` the consumer passes as `children`
 * (e.g. `MyProfileLayout`).
 */
function AccountSettingsLayout({
  children,
  groups,
  items,
  activeItem,
  onClose,
  onNavigate,
  hasUnsavedChanges = false,
}: AccountSettingsLayoutProps) {
  // The navigation waiting on the unsaved-changes confirmation, if any.
  const [pendingLeave, setPendingLeave] = React.useState<(() => void) | null>(null);
  const leave = (go: () => void) => {
    if (hasUnsavedChanges) setPendingLeave(() => go);
    else go();
  };

  // Esc closes settings, same as the header's X, when nothing is pending. Listened for on
  // `window` so it runs after everything else that handles Escape, and skipped when:
  // - something already handled it (`defaultPrevented`): a page cancelling an open edit row, or a
  //   dialog/menu/popover closing (Radix marks Escape handled when it dismisses);
  // - focus is in a text field, where Escape belongs to the field;
  // - there are unsaved changes (the X would ask first; Esc just stays).
  const onCloseRef = React.useRef(onClose);
  onCloseRef.current = onClose;
  React.useEffect(() => {
    if (hasUnsavedChanges || pendingLeave) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      onCloseRef.current?.();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, pendingLeave]);
  // An explicit flat `items` list replaces the default groups.
  const businessCount = React.useContext(BusinessCountContext);
  const railGroups = items ? undefined : (groups ?? createSettingsMenuGroups({ businessCount }));
  const mobileTitle =
    activeItem ?? (railGroups ? railGroups[0]?.items[0]?.label : items?.[0]?.label);

  return (
    <div className="flex h-screen flex-col items-start overflow-hidden bg-card">
      <SettingsHeader
        className="shrink-0"
        onClose={onClose ? () => leave(onClose) : undefined}
        title="Settings"
        mobileTitle={mobileTitle}
      />
      <div className="flex w-full flex-1 items-start overflow-y-auto">
        <SidebarSettings
          groups={railGroups}
          items={items}
          activeItem={activeItem}
          onNavigate={onNavigate ? (route) => leave(() => onNavigate(route)) : undefined}
          className="sticky top-0 hidden shrink-0 self-start md:flex"
          style={{ width: SIDEBAR_WIDTH }}
        />
        <div
          data-slot="settings-layout-content"
          // The canvas (Figma "Canvas"): always the full visible height (`self-stretch`) and the
          // positioning box for content centered in it, e.g. a page's empty state.
          className="relative flex min-w-0 flex-1 justify-center self-stretch"
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
            className="w-full max-w-[880px] px-4 pt-6 md:pt-0"
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
      <ConfirmDialog
        open={pendingLeave !== null}
        onOpenChange={(open) => {
          if (!open) setPendingLeave(null);
        }}
        title="Discard unsaved changes?"
        description="You have changes that haven't been saved. If you leave now, they'll be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onConfirm={() => {
          const go = pendingLeave;
          setPendingLeave(null);
          go?.();
        }}
      />
    </div>
  );
}

export {
  AccountSettingsLayout,
  AccountSettingsProvider,
  BusinessCountContext,
  businessProfilesLabel,
  createSettingsMenuGroups,
  settingsMenuGroups,
  settingsMenuItems,
  useBusinessProfilesLabel,
};
export type { AccountSettingsLayoutProps };
