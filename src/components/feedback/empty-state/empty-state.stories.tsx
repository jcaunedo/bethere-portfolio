import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuildingIcon, PlusIcon, SearchIcon } from "lucide-react";

import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-80 w-full items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

/** Title and description only — e.g. a section with nothing to show yet. */
export const Default: Story = {
  args: {
    title: "No promo codes yet",
    description: "Promo codes you create will appear here.",
  },
};

/** With a button for the next step. */
export const WithAction: Story = {
  args: {
    title: "No business profiles yet",
    description: "Add your business to start creating experiences and verify its details and documents.",
    buttonLabel: "Add business",
    buttonIcon: <PlusIcon />,
  },
};

/** With an icon above the title. */
export const WithIcon: Story = {
  args: {
    icon: <BuildingIcon className="size-8 text-icon-muted" />,
    title: "No business profiles yet",
    description: "Add your business to start creating experiences and verify its details and documents.",
  },
};

/** A search with no matches. */
export const NoResults: Story = {
  args: {
    icon: <SearchIcon className="size-8 text-icon-muted" />,
    title: 'No matches for "kat"',
    description: "Check the spelling, or search by another name or email.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-16">
      <EmptyState {...Default.args!} />
      <EmptyState {...WithAction.args!} />
      <EmptyState {...WithIcon.args!} />
      <EmptyState {...NoResults.args!} />
    </div>
  ),
};
