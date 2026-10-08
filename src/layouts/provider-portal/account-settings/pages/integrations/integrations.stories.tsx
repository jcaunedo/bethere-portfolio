import type { Meta, StoryObj } from "@storybook/react-vite";

import { IntegrationsLayout } from "./integrations";

const meta: Meta<typeof IntegrationsLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/Integrations",
  component: IntegrationsLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof IntegrationsLayout>;

export const Default: Story = {
  args: {
    onEditCalendars: () => alert("Edit calendars"),
  },
};

/** Nothing to connect yet: the empty state. */
export const Empty: Story = {
  args: { availableIntegrations: [] },
};
