import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

function Demo({ size }: { size?: "lg" | "xl" }) {
  return (
    <Select>
      <SelectTrigger size={size} className="w-64">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectSeparator />
          <SelectItem value="grapes" disabled>
            Grapes (out of stock)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Large: Story = { render: () => <Demo size="lg" /> };
export const ExtraLarge: Story = { render: () => <Demo size="xl" /> };

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

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Demo size="lg" />
      <Demo size="xl" />
    </div>
  ),
};
