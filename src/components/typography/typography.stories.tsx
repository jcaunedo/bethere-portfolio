import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./typography";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1", "h2", "h3", "h4",
        "p", "lead", "large", "small", "muted",
        "blockquote", "code",
      ],
    },
    as: {
      control: "text",
      description: "Override the rendered HTML element",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Heading4: Story = {
  args: {
    variant: "h4",
    children: "The quick brown fox jumps over the lazy dog",
  },
};

export const Paragraph: Story = {
  args: {
    variant: "p",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children: "A leading paragraph that stands out from the rest.",
  },
};

export const Large: Story = {
  args: {
    variant: "large",
    children: "Large text for emphasis.",
  },
};

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
    children: "npm install @bethere/ucl",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="p">
        This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography variant="lead">This is a lead paragraph.</Typography>
      <Typography variant="large">Large text</Typography>
      <Typography variant="small">Small text</Typography>
      <Typography variant="muted">Muted text</Typography>
      <Typography variant="blockquote">A blockquote.</Typography>
      <Typography variant="code">inline code</Typography>
    </div>
  ),
};
