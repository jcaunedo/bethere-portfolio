import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountSettingsProvider } from "@/layouts/provider-portal/account-settings/account-settings";
import { BusinessProfileLayout } from "./business-profile";

const meta: Meta<typeof BusinessProfileLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/BusinessProfile",
  component: BusinessProfileLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof BusinessProfileLayout>;

/** A single business (the most common case): Settings → Business profiles opens straight here, with no "Back to businesses". */
export const Default: Story = {};

/** One of several businesses, opened from the Business profiles list: "Back to businesses" returns to it. */
export const FromBusinessList: Story = {
  args: { onBack: () => console.log("[BusinessProfile story] back to businesses") },
  // Several businesses, so the rail reads "Business profiles".
  decorators: [
    (Story) => (
      <AccountSettingsProvider businessCount={3}>
        <Story />
      </AccountSettingsProvider>
    ),
  ],
};
