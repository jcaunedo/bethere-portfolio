import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CircleUserIcon,
  GlobeIcon,
  LogOutIcon,
  SettingsIcon,
  SunMoonIcon,
} from "lucide-react";

import { SelectAccountInfo } from "@/components/data-display/select-account-info";
import {
  AccountMenu,
  AccountMenuContent,
  AccountMenuItem,
  AccountMenuSeparator,
  AccountMenuTrigger,
} from "./account-menu";

const meta: Meta<typeof AccountMenu> = {
  title: "Overlays/AccountMenu",
  component: AccountMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccountMenu>;

export const Default: Story = {
  render: () => (
    <AccountMenu>
      <AccountMenuTrigger className="cursor-pointer text-sm text-foreground underline">
        Open menu
      </AccountMenuTrigger>
      <AccountMenuContent>
        <AccountMenuItem showIcon icon={<CircleUserIcon />}>
          My profile
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<SunMoonIcon />} shortcut="Auto">
          Theme
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<GlobeIcon />} shortcut="English">
          Language
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<SettingsIcon />}>
          Account settings
        </AccountMenuItem>
        <AccountMenuSeparator />
        <AccountMenuItem showIcon icon={<LogOutIcon />} variant="destructive">
          Log Out
        </AccountMenuItem>
      </AccountMenuContent>
    </AccountMenu>
  ),
};

export const Disabled: Story = {
  render: () => (
    <AccountMenu>
      <AccountMenuTrigger className="cursor-pointer text-sm text-foreground underline">
        Open menu
      </AccountMenuTrigger>
      <AccountMenuContent>
        <AccountMenuItem showIcon icon={<CircleUserIcon />} disabled>
          My profile (disabled)
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<SettingsIcon />}>
          Account settings
        </AccountMenuItem>
      </AccountMenuContent>
    </AccountMenu>
  ),
};

export const ItemSlots: Story = {
  render: () => (
    <AccountMenu>
      <AccountMenuTrigger className="cursor-pointer text-sm text-foreground underline">
        Open menu
      </AccountMenuTrigger>
      <AccountMenuContent>
        <AccountMenuItem showIcon icon={<CircleUserIcon />}>
          With icon
        </AccountMenuItem>
        <AccountMenuItem showCheckbox>With checkbox</AccountMenuItem>
        <AccountMenuItem showCircleColor circleColor="#f26740">
          With circle color
        </AccountMenuItem>
        <AccountMenuItem shortcut="⇧⌘S">With shortcut</AccountMenuItem>
        <AccountMenuItem showChevron>With chevron</AccountMenuItem>
        <AccountMenuItem variant="destructive" showIcon icon={<LogOutIcon />}>
          Destructive
        </AccountMenuItem>
        <AccountMenuItem disabled>Disabled</AccountMenuItem>
      </AccountMenuContent>
    </AccountMenu>
  ),
};

/** Figma "Account Menu": SelectAccountInfo as the real trigger. */
export const WithSelectAccountInfoTrigger: Story = {
  render: () => (
    <AccountMenu>
      <AccountMenuTrigger asChild>
        <SelectAccountInfo
          name="Lucy Smith"
          email="lucysmith@email.com"
          className="w-70"
        />
      </AccountMenuTrigger>
      <AccountMenuContent align="start">
        <AccountMenuItem showIcon icon={<CircleUserIcon />}>
          My profile
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<SunMoonIcon />} shortcut="Auto">
          Theme
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<GlobeIcon />} shortcut="English">
          Language
        </AccountMenuItem>
        <AccountMenuItem showIcon icon={<SettingsIcon />}>
          Account settings
        </AccountMenuItem>
        <AccountMenuSeparator />
        <AccountMenuItem showIcon icon={<LogOutIcon />} variant="destructive">
          Log Out
        </AccountMenuItem>
      </AccountMenuContent>
    </AccountMenu>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Default</span>
        <AccountMenu>
          <AccountMenuTrigger className="cursor-pointer text-sm text-foreground underline">
            Open menu
          </AccountMenuTrigger>
          <AccountMenuContent>
            <AccountMenuItem showIcon icon={<CircleUserIcon />}>
              My profile
            </AccountMenuItem>
            <AccountMenuItem showIcon icon={<SettingsIcon />}>
              Account settings
            </AccountMenuItem>
            <AccountMenuSeparator />
            <AccountMenuItem showIcon icon={<LogOutIcon />} variant="destructive">
              Log Out
            </AccountMenuItem>
          </AccountMenuContent>
        </AccountMenu>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Item slots</span>
        <AccountMenu>
          <AccountMenuTrigger className="cursor-pointer text-sm text-foreground underline">
            Open menu
          </AccountMenuTrigger>
          <AccountMenuContent>
            <AccountMenuItem showIcon icon={<CircleUserIcon />}>
              With icon
            </AccountMenuItem>
            <AccountMenuItem showCheckbox>With checkbox</AccountMenuItem>
            <AccountMenuItem showCircleColor circleColor="#f26740">
              With circle color
            </AccountMenuItem>
            <AccountMenuItem shortcut="⇧⌘S">With shortcut</AccountMenuItem>
            <AccountMenuItem showChevron>With chevron</AccountMenuItem>
            <AccountMenuItem disabled>Disabled</AccountMenuItem>
          </AccountMenuContent>
        </AccountMenu>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Account menu</span>
        <AccountMenu>
          <AccountMenuTrigger asChild>
            <SelectAccountInfo
              name="Lucy Smith"
              email="lucysmith@email.com"
              className="w-70"
            />
          </AccountMenuTrigger>
          <AccountMenuContent align="start">
            <AccountMenuItem showIcon icon={<CircleUserIcon />}>
              My profile
            </AccountMenuItem>
            <AccountMenuItem showIcon icon={<SettingsIcon />}>
              Account settings
            </AccountMenuItem>
            <AccountMenuSeparator />
            <AccountMenuItem showIcon icon={<LogOutIcon />} variant="destructive">
              Log Out
            </AccountMenuItem>
          </AccountMenuContent>
        </AccountMenu>
      </div>
    </div>
  ),
};
