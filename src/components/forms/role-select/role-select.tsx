import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/forms/select";

/** A team member role (Figma: bethere.ds `role-options`). */
type TeamRole = "staff" | "admin" | "broker";

const ROLE_OPTIONS: {
  value: TeamRole;
  label: string;
  description: string;
}[] = [
  {
    value: "staff",
    label: "Staff",
    description:
      "Limited access to assigned experiences and operational tasks.",
  },
  {
    value: "admin",
    label: "Admin",
    description:
      "Full access to manage the business profile, team, documents, and experiences.",
  },
  {
    value: "broker",
    label: "Broker",
    description: "Access to manage leads, client bookings, and guest coordination.",
  },
];

type RoleSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "value" | "onValueChange" | "defaultValue"
> & {
  value?: TeamRole;
  defaultValue?: TeamRole;
  onValueChange?: (value: TeamRole) => void;
  placeholder?: string;
  triggerClassName?: string;
};

/**
 * Team member role picker (Figma: bethere.ds `role-options`) — Staff/Admin/
 * Broker, each with a description of what that role can access. Used by the
 * "Invite member" flow (Provider Portal → Team members) to assign a new
 * team member's role. Built on the shared `Select`/`SelectItem` primitives;
 * `SelectItem`'s `description` prop renders the two-line "Select Item 2
 * Lines" layout for each option.
 */
function RoleSelect({
  placeholder = "Select a role",
  triggerClassName,
  onValueChange,
  ...props
}: RoleSelectProps) {
  return (
    <Select
      onValueChange={onValueChange as (value: string) => void}
      {...props}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-[304px] min-w-[304px]">
        {ROLE_OPTIONS.map((role) => (
          <SelectItem
            key={role.value}
            value={role.value}
            description={role.description}
          >
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { RoleSelect, ROLE_OPTIONS };
export type { RoleSelectProps, TeamRole };
