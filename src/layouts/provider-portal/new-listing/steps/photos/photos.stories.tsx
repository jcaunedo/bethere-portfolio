import type { Meta, StoryObj } from "@storybook/react-vite";
import { saveDraftSample, withToaster } from "../../shared/save-draft-sample";
import { PhotosStep } from "./photos";
import { samplePhotos } from "./sample-photos";

const meta: Meta<typeof PhotosStep> = {
	title: "Layouts/ProviderPortal/NewListing/Photos",
	component: PhotosStep,
	// "Save as draft" saves (simulated) and confirms with a toast.
	args: { onSaveDraft: saveDraftSample },
	decorators: [withToaster],
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
};
export default meta;
type Story = StoryObj<typeof PhotosStep>;

/** No photos yet: the drop zone with "Skip for now" (Figma 103:2266). Continue appears with the first photo and unlocks at 5. */
export const Default: Story = {};

/** Photos added (Figma 106:2718): drag to reorder, × on hover, "+" opens the file picker. */
export const WithPhotos: Story = {
	args: { defaultPhotos: samplePhotos },
};

/** Under the minimum: Continue is locked, so "Skip for now" sits under it (no Figma source yet). */
export const UnderMinimum: Story = {
	args: { defaultPhotos: samplePhotos.slice(0, 3) },
};

/** Service listing: the title names a service instead of an experience. */
export const Service: Story = {
	args: { listingType: "service" },
};

/** A photo still uploading (Figma 178:7388). */
export const Uploading: Story = {
	args: {
		defaultPhotos: [...samplePhotos, { id: "uploading", alt: "New photo", uploading: true }],
		// Stays loading, so the state can be inspected.
		onUpload: () => new Promise<string>(() => {}),
	},
};
