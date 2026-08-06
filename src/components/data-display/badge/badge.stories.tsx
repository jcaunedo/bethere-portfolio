import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const colors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "purple",
  "violet",
  "pink",
  "orange",
  "amber",
] as const;

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: colors,
    },
    size: {
      control: "select",
      options: ["sm", "lg"],
    },
    showX: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Badge",
  },
};

export const Dismissible: Story = {
  args: {
    color: "red",
    showX: true,
    children: "Badge",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} color={color} size="lg">
            Badge
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} color={color} size="sm">
            Badge
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <Badge key={color} color={color} size="lg" showX>
            Badge
          </Badge>
        ))}
      </div>
    </div>
  ),
};
