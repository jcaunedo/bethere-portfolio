import type { Meta, StoryObj } from "@storybook/react-vite";
import { Building2, User } from "lucide-react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop"
        alt="Jane Doe"
      />
      <AvatarFallback colorSeed="jane-doe">JD</AvatarFallback>
    </Avatar>
  ),
};

export const Initials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
    </Avatar>
  ),
};

/**
 * `colorSeed` hashes to a deterministic hue across the full 0-360° wheel; the
 * same seed always renders the same color. These six names are chosen to
 * land roughly 60° apart (red, orange, yellow-green, green, blue, magenta)
 * to demonstrate the spread — most real seeds will land at arbitrary hues,
 * but the underlying hash is uniform over a large population (verified by
 * simulation, not cherry-picked to always look this even).
 */
export const InitialsColorVariety: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {[
        "Layla Haddad",
        "Jordan Lee",
        "Carla Diaz",
        "Bob Smith",
        "Isabel Tan",
        "Karim Nassar",
      ].map((name) => (
        <Avatar key={name}>
          <AvatarFallback colorSeed={name}>
            {name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const Icon: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  ),
};

/** Placeholder for a person with no identity yet, e.g. a team member invited by email. */
export const Empty: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarFallback tone="empty">
        <User />
      </AvatarFallback>
    </Avatar>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop"
          alt="Jane Doe"
        />
        <AvatarFallback colorSeed="jane-doe">JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <Building2 />
        </AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop"
            alt="Jane Doe"
          />
          <AvatarFallback colorSeed="jane-doe">JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback tone="empty">
            <User />
          </AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </div>
      <div className="flex items-center gap-4">
        <Avatar size="sm">
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
        </Avatar>
      </div>
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop"
            alt="Jane Doe"
          />
          <AvatarFallback colorSeed="jane-doe">JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback colorSeed="alice-brown">AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>
            <Building2 />
          </AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
};
