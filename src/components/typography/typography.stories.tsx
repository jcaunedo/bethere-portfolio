import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
      ],
    },
    weight: {
      control: "select",
      options: ["regular", "medium", "semibold", "bold", "black"],
    },
    as: {
      control: "text",
      description: "Override the rendered HTML element (e.g. h1, span)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Display: Story = {
  args: {
    size: "5xl",
    weight: "bold",
    as: "h1",
    children: "Display heading",
  },
};

/**
 * Heading definitions (Figma bethere.ds text-style descriptions): `as` alone sets the size and
 * weight. h1 = 2xl semibold (also page and modal titles), h2 = xl semibold, h3 = lg semibold.
 */
export const Headings: Story = {
  render: () => (
    <div className="space-y-3">
      <Typography as="h1">h1 — Page title</Typography>
      <Typography as="h2">h2 — Section heading</Typography>
      <Typography as="h3">h3 — Subsection heading</Typography>
    </div>
  ),
};

export const Body: Story = {
  args: {
    size: "base",
    weight: "regular",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

export const Caption: Story = {
  args: {
    size: "xs",
    weight: "medium",
    children: "Caption / fine print",
  },
};

const SIZES = [
  "7xl",
  "6xl",
  "5xl",
  "4xl",
  "3xl",
  "2xl",
  "xl",
  "lg",
  "base",
  "sm",
  "xs",
] as const;

export const Small: Story = {
  args: {
    variant: "small",
    children: "Small text for fine print.",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "This is muted helper text.",
  },
};

export const Blockquote: Story = {
  args: {
    variant: "blockquote",
    children: "After all, everyone enjoys a good quote.",
  },
};

export const InlineCode: Story = {
  args: {
    variant: "code",
    children: "npm install @bethere-group/ucl",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2">
      {SIZES.map((size) => (
        <Typography key={size} size={size} weight="medium">
          {size} — Almost before we knew it, we had left the ground
        </Typography>
      ))}
    </div>
  ),
};

const WEIGHTS = ["regular", "medium", "semibold", "bold", "black"] as const;

export const Weights: Story = {
  render: () => (
    <div className="space-y-2">
      {WEIGHTS.map((weight) => (
        <Typography key={weight} size="2xl" weight={weight}>
          {weight}
        </Typography>
      ))}
    </div>
  ),
};
