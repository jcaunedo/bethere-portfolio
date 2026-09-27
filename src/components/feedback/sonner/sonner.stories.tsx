import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Button } from "@/components/buttons/button";
import { Toaster, toast } from "./sonner";

const meta: Meta<typeof Toaster> = {
	title: "Feedback/Sonner",
	component: Toaster,
	tags: ["autodocs"],
	// Preview on the app surface these sit on — Figma color/background/accent/background (#f9f8f5) = --background.
	parameters: {
		layout: "padded",
		backgrounds: { options: { app: { name: "App background", value: "var(--background)" } } },
	},
	globals: { backgrounds: { value: "app" } },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

/** Click a button to raise that Figma variant. */
export const Default: Story = {
	render: (args) => (
		<>
			<Toaster {...args} />
			<div className="flex flex-wrap gap-2">
				<Button variant="outline" onClick={() => toast.error("You have 1 required item")}>
					Error
				</Button>
				<Button variant="outline" onClick={() => toast.info("Info")}>
					Info
				</Button>
				<Button variant="outline" onClick={() => toast.success("Success")}>
					Success
				</Button>
				<Button variant="outline" onClick={() => toast.warning("Warning")}>
					Warning
				</Button>
				<Button
					variant="outline"
					onClick={() => toast.success("Listing saved", { description: "Guests can now book it." })}
				>
					With description
				</Button>
			</div>
		</>
	),
};

/** All four Figma variants at once, pinned (no auto-dismiss), expanded. */
export const AllVariants: Story = {
	args: { expand: true, position: "top-center" },
	render: (args) => <AllToasts {...args} />,
};

function AllToasts(args: React.ComponentProps<typeof Toaster>) {
	React.useEffect(() => {
		// Deferred a tick: toasts raised in the same mount pass as <Toaster> land before it
		// subscribes and are dropped.
		const timer = window.setTimeout(() => {
			const options = { duration: Infinity };
			toast.error("You have 1 required item", options);
			toast.info("Info", options);
			toast.success("Success", options);
			toast.warning("Warning", options);
		}, 0);
		return () => {
			window.clearTimeout(timer);
			toast.dismiss();
		};
	}, []);
	return <Toaster {...args} />;
}
