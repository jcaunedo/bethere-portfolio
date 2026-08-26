import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/data-display/avatar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

function Demo({
  triggerSize,
  readOnly,
  defaultValue,
}: {
  triggerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  readOnly?: boolean;
  defaultValue?: string;
}) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger size={triggerSize} readOnly={readOnly} className="w-64">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Large: Story = { render: () => <Demo triggerSize="lg" /> };
export const ExtraLarge: Story = { render: () => <Demo triggerSize="xl" /> };

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ReadOnly: Story = {
  render: () => <Demo readOnly defaultValue="apple" />,
};

export const ManyItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {[
            "Apple",
            "Banana",
            "Blueberry",
            "Cherry",
            "Date",
            "Elderberry",
            "Fig",
            "Grape",
            "Honeydew",
            "Kiwi",
            "Lemon",
            "Mango",
          ].map((fruit) => (
            <SelectItem key={fruit} value={fruit.toLowerCase()}>
              {fruit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Demo triggerSize="lg" />
      <Demo triggerSize="xl" />
      <Demo readOnly defaultValue="apple" />
    </div>
  ),
};

/** Figma `Select Item 2 Lines` — a title plus a muted description line. */
export const TwoLines: Story = {
  render: () => (
    <Select defaultValue="owner">
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owner" description="Full access to all settings and billing.">
          Owner
        </SelectItem>
        <SelectItem value="admin" description="Can manage team members and content.">
          Admin
        </SelectItem>
        <SelectItem value="staff" description="Can view and edit assigned work only.">
          Staff
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

type AvatarPerson = {
  value: string;
  name: string;
  initials: string;
  image?: string;
};

const AVATAR_PEOPLE: AvatarPerson[] = [
  { value: "ab", name: "Alex Brooks", initials: "AB" },
  {
    value: "jw",
    name: "Jenny Wilson",
    initials: "JW",
    image: "https://i.pravatar.cc/72?img=47",
  },
];

function PersonAvatar({ person }: { person: AvatarPerson }) {
  return (
    <Avatar size="sm">
      {person.image ? <AvatarImage src={person.image} alt="" /> : null}
      <AvatarFallback colorSeed={person.value}>{person.initials}</AvatarFallback>
    </Avatar>
  );
}

/**
 * Figma `Type=Dropdown, showAvatar` — the trigger shows the selected
 * person's avatar, and each list item shows its own so the picker reads the
 * same way open or closed.
 */
export const WithAvatar: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("ab");
    const selected = AVATAR_PEOPLE.find((person) => person.value === value);
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger
          className="w-64"
          avatar={selected ? <PersonAvatar person={selected} /> : undefined}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Choose user</SelectLabel>
            {AVATAR_PEOPLE.map((person) => (
              <SelectItem
                key={person.value}
                value={person.value}
                avatar={<PersonAvatar person={person} />}
              >
                {person.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

export const ItemSlots: Story = {
  render: () => (
    <Select defaultValue="orange">
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple" showIcon>
            Apple
          </SelectItem>
          <SelectItem value="banana" showCircleColor circleColor="#f26740">
            Banana
          </SelectItem>
          <SelectItem value="cherry" shortcut="⇧⌘S">
            Cherry
          </SelectItem>
          <SelectItem value="orange">Orange (checked — default color)</SelectItem>
          <SelectItem value="grape" checkColor="primary">
            Grape (checkColor=&quot;primary&quot;)
          </SelectItem>
          <SelectItem value="mango" showChevron>
            Mango
          </SelectItem>
          <SelectItem value="tier-active" tier={1} tierState="active">
            Tier 1 · Active
          </SelectItem>
          <SelectItem value="tier-collapsed" tier={1} tierState="collapsed">
            Tier 1 · Collapsed
          </SelectItem>
          <SelectItem value="tier-expanded" tier={1} tierState="expanded">
            Tier 1 · Expanded
          </SelectItem>
          <SelectItem value="kiwi" disabled>
            Kiwi (disabled)
          </SelectItem>
          <SelectLabel>Title Small</SelectLabel>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
