import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
	title: "Navigation/Tabs",
	component: Tabs,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="overview" className="w-96">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">Overview content</TabsContent>
			<TabsContent value="activity">Activity content</TabsContent>
			<TabsContent value="settings">Settings content</TabsContent>
		</Tabs>
	),
};

/** `Size=md · 32` (Figma) — the compact 14px-text tab row. */
export const Small: Story = {
	render: () => (
		<Tabs defaultValue="overview" className="w-96">
			<TabsList>
				<TabsTrigger value="overview" size="md">
					Overview
				</TabsTrigger>
				<TabsTrigger value="activity" size="md">
					Activity
				</TabsTrigger>
				<TabsTrigger value="settings" size="md">
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">Overview content</TabsContent>
			<TabsContent value="activity">Activity content</TabsContent>
			<TabsContent value="settings">Settings content</TabsContent>
		</Tabs>
	),
};

export const Disabled: Story = {
	render: () => (
		<Tabs defaultValue="overview" className="w-96">
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="activity" disabled>
					Activity
				</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>
			<TabsContent value="overview">Overview content</TabsContent>
			<TabsContent value="activity">Activity content</TabsContent>
			<TabsContent value="settings">Settings content</TabsContent>
		</Tabs>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-8">
			<Tabs defaultValue="overview" className="w-96">
				<TabsList>
					<TabsTrigger value="overview" size="lg">
						Overview
					</TabsTrigger>
					<TabsTrigger value="activity" size="lg">
						Activity
					</TabsTrigger>
					<TabsTrigger value="settings" size="lg">
						Settings
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<Tabs defaultValue="overview" className="w-96">
				<TabsList>
					<TabsTrigger value="overview" size="md">
						Overview
					</TabsTrigger>
					<TabsTrigger value="activity" size="md">
						Activity
					</TabsTrigger>
					<TabsTrigger value="settings" size="md">
						Settings
					</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	),
};
