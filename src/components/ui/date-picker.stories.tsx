import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

function Demo(args: Partial<React.ComponentProps<typeof DatePicker>>) {
  const [date, setDate] = useState<Date>();
  return (
    <div className="w-64">
      <DatePicker value={date} onValueChange={setDate} {...args} />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const ExtraLarge: Story = { render: () => <Demo size="xl" /> };
export const Preselected: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date(2024, 4, 1));
    return (
      <div className="w-64">
        <DatePicker value={date} onValueChange={setDate} />
      </div>
    );
  },
};
export const Disabled: Story = { render: () => <Demo disabled /> };
