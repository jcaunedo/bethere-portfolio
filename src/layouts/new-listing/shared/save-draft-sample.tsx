import type { Decorator } from "@storybook/react-vite";

import { Toaster } from "@/components/feedback/sonner";

/**
 * Stories only: stands in for the app saving a draft (a short request), and mounts the app's toast
 * host so "Save as draft" can confirm.
 */
const saveDraftSample = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

const withToaster: Decorator = (Story) => (
	<>
		<Story />
		<Toaster />
	</>
);

export { saveDraftSample, withToaster };
