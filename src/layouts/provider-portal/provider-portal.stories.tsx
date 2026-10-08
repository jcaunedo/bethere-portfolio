import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { CircleUserIcon, GlobeIcon, LogOutIcon, SettingsIcon, SunMoonIcon } from "lucide-react";

import type { SidebarAccountMenuItem } from "@/components/navigation/sidebar";
import { HomePage } from "./home/home";
import { PlaceholderPage } from "./placeholder-page";
import { PAGE_LABEL, ProviderPortalLayout, pageForRoute, type PortalPage } from "./provider-portal";

const account = { name: "Lucy Smith", email: "lucysmith@email.com" };

const accountMenuItems: SidebarAccountMenuItem[] = [
  { icon: CircleUserIcon, label: "My profile", navigateTo: "/profile" },
  { icon: SunMoonIcon, label: "Theme", shortcut: "Auto" },
  { icon: GlobeIcon, label: "Language", shortcut: "English" },
  { icon: SettingsIcon, label: "Account settings", navigateTo: "/settings" },
  { icon: LogOutIcon, label: "Log Out", variant: "destructive", separator: true },
];

/** One page's content. */
function PortalPageContent({ page }: { page: PortalPage }) {
  return page === "home" ? <HomePage firstName="Lucy" /> : <PlaceholderPage title={PAGE_LABEL[page]} />;
}

/** The whole portal: click the Sidebar to switch pages. */
function ProviderPortal({ initialPage = "home" }: { initialPage?: PortalPage }) {
  const [page, setPage] = React.useState<PortalPage>(initialPage);
  return (
    <ProviderPortalLayout
      page={initialPage}
      account={account}
      accountMenuItems={accountMenuItems}
      onNavigate={(route) => {
        const next = pageForRoute(route);
        if (next) setPage(next);
      }}
    >
      <PortalPageContent page={page} />
    </ProviderPortalLayout>
  );
}

const meta: Meta<typeof ProviderPortal> = {
  title: "Layouts/ProviderPortal/Portal",
  component: ProviderPortal,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ProviderPortal>;

/**
 * Figma "Dashboard (Home)" (886:10115): the collapsed Sidebar and the welcome header. Click any
 * Sidebar item to switch pages; pages without a design yet show a placeholder.
 */
export const Default: Story = {};

/** Starting on Listings (a placeholder until it's built from Figma 38:747). */
export const Listings: Story = { args: { initialPage: "listings" } };
