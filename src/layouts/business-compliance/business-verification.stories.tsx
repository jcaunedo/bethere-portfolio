import type { Meta, StoryObj } from "@storybook/react-vite";
import { BusinessVerification } from "./business-verification";

const meta: Meta<typeof BusinessVerification> = {
  title: "Layouts/BusinessVerification",
  component: BusinessVerification,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof BusinessVerification>;

export const Default: Story = {};
