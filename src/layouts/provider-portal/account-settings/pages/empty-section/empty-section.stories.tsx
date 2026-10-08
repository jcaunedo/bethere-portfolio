import type { Meta, StoryObj } from "@storybook/react-vite";

import { SettingsEmptySectionLayout } from "./empty-section";

const meta: Meta<typeof SettingsEmptySectionLayout> = {
  title: "Layouts/ProviderPortal/AccountSettings/EmptySection",
  component: SettingsEmptySectionLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof SettingsEmptySectionLayout>;

/** Billing has no page yet. */
export const Billing: Story = { args: { section: "billing" } };

/** Promo codes has no page yet. */
export const PromoCodes: Story = { args: { section: "promo-codes" } };

/** Security has no page yet. */
export const Security: Story = { args: { section: "security" } };
