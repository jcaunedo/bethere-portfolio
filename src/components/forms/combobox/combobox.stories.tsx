import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox } from "./combobox";

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "svelte", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro", disabled: true },
];

const meta: Meta<typeof Combobox> = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

function Demo(
  args: Partial<React.ComponentProps<typeof Combobox>> & {
    initialValue?: string;
  },
) {
  const { initialValue, ...rest } = args;
  const [value, setValue] = useState<string | undefined>(initialValue);
  return (
    <div className="w-64">
      <Combobox
        options={frameworks}
        value={value}
        onValueChange={setValue}
        {...rest}
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const ExtraLarge: Story = { render: () => <Demo size="xl" /> };
export const Disabled: Story = { render: () => <Demo disabled /> };
export const ReadOnly: Story = {
  render: () => <Demo readOnly initialValue="next" />,
};
export const Clearable: Story = {
  render: () => <Demo showClear initialValue="next" />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-3">
      <Demo />
      <Demo initialValue="next" />
      <Demo size="xl" />
      <Demo disabled />
      <Demo readOnly initialValue="next" />
      <Demo showClear initialValue="next" />
    </div>
  ),
};
