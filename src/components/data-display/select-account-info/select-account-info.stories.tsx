import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectAccountInfo } from "./select-account-info";

const meta: Meta<typeof SelectAccountInfo> = {
  title: "Data Display/SelectAccountInfo",
  component: SelectAccountInfo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SelectAccountInfo>;

const account = {
  name: "Lucy Smith",
  email: "lucysmith@email.com",
};

export const Default: Story = {
  args: account,
};

/** Hover the rendered row in Storybook to see the Figma "Hover" state (white card fill). */
export const Hover: Story = {
  args: account,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 bg-background p-4">
      <SelectAccountInfo {...account} />
      <SelectAccountInfo {...account} className="bg-card ring-4 ring-card" />
    </div>
  ),
};
