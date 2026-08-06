import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdCardIcon } from "lucide-react";
import { AvatarFiles } from "./avatar-files";

const meta: Meta<typeof AvatarFiles> = {
	title: "Data Display/AvatarFiles",
	component: AvatarFiles,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AvatarFiles>;

export const Default: Story = {};

/** A custom `icon` (e.g. `RowDocuments`' "Owner identity verification" row uses an id-card icon). */
export const CustomIcon: Story = {
	args: {
		icon: IdCardIcon,
	},
};
