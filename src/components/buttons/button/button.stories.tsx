import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronRight, Mail } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "destructive-solid",
        "secondary",
        "outline",
        "ghost",
        "link",
        "link-neutral",
      ],
    },
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "icon-xs",
        "icon-sm",
        "icon",
        "icon-lg",
        "icon-xl",
      ],
    },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete",
  },
};

export const DestructiveSolid: Story = {
  args: {
    variant: "destructive-solid",
    children: "Delete",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

/** Figma Style=Link, Tone=Brand. Hover swaps the label to foreground. */
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

/** Figma Style=Link, Tone=Neutral. Hover swaps the label to brand. */
export const LinkNeutral: Story = {
  args: {
    variant: "link-neutral",
    children: "Link",
  },
};

/** Figma Style=Link, State=Disabled: both tones use color/foreground/subtle. */
export const LinkDisabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="link" disabled>
        Link
      </Button>
      <Button variant="link-neutral" disabled>
        Link
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Mail /> Login with Email
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: "outline",
    size: "icon",
    children: <ChevronRight />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: "Please wait",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive-solid">Destructive-Solid</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="link-neutral">Link Neutral</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button size="icon-xs">
          <ChevronRight />
        </Button>
        <Button size="icon-sm">
          <ChevronRight />
        </Button>
        <Button size="icon">
          <ChevronRight />
        </Button>
        <Button size="icon-lg">
          <ChevronRight />
        </Button>
        <Button size="icon-xl">
          <ChevronRight />
        </Button>
      </div>
    </div>
  ),
};
