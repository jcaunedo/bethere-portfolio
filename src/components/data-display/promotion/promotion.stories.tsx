import type { Meta, StoryObj } from "@storybook/react-vite";
import { Promotion } from "./promotion";

const meta: Meta<typeof Promotion> = {
  title: "Data Display/Promotion",
  component: Promotion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Promotion>;

const promo = {
  title: "Refer us and win",
  description: "Lorem ipsum",
};

export const Default: Story = {
  args: promo,
};

/** Hover the rendered card in Storybook to see the Figma "Hover" state (subtle gray wash). */
export const Hover: Story = {
  args: promo,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-6 bg-background p-4">
      <Promotion {...promo} />
      <Promotion {...promo} className="bg-state-hover" />
    </div>
  ),
};
