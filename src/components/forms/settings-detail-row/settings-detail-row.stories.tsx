import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SettingsDetailRow } from "./settings-detail-row";
import { Input } from "@/components/forms/input";

const meta: Meta<typeof SettingsDetailRow> = {
  title: "Forms/SettingsDetailRow",
  component: SettingsDetailRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SettingsDetailRow>;

export const Empty: Story = {
  args: {
    title: "Name",
    emptyPlaceholder: "No name yet",
  },
};

export const HasValue: Story = {
  args: {
    title: "Name",
    value: "Johanna Wilson",
  },
};

function InteractiveRow() {
  const [editing, setEditing] = React.useState(false);
  const [firstName, setFirstName] = React.useState("Johanna");
  const [lastName, setLastName] = React.useState("Perez");

  return (
    <SettingsDetailRow
      title="Name"
      value={`${firstName} ${lastName}`}
      emptyPlaceholder="No name yet"
      editing={editing}
      editDescription="Use your real name so your teammates can recognize you."
      onEditStart={() => setEditing(true)}
      onCancel={() => setEditing(false)}
      onSave={() => setEditing(false)}
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            First name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Last name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
    </SettingsDetailRow>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveRow />,
};

function InteractiveAddRow() {
  const [editing, setEditing] = React.useState(false);
  const [nickname, setNickname] = React.useState("");

  return (
    <SettingsDetailRow
      title="Nickname"
      value={nickname}
      emptyPlaceholder="No nickname yet"
      addDescription="Pick a nickname your teammates can call you."
      editing={editing}
      onEditStart={() => setEditing(true)}
      onCancel={() => setEditing(false)}
      onSave={() => setEditing(false)}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Nickname
        </label>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
    </SettingsDetailRow>
  );
}

export const InteractiveAdd: Story = {
  render: () => <InteractiveAddRow />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col divide-y divide-border">
      <div className="py-4">
        <SettingsDetailRow title="Name" emptyPlaceholder="No name yet" />
      </div>
      <div className="py-4">
        <SettingsDetailRow title="Name" value="Johanna Wilson" />
      </div>
      <div className="py-4">
        <InteractiveRow />
      </div>
    </div>
  ),
};
