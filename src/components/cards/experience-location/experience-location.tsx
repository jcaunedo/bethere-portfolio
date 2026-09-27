import * as React from "react";
import { cva } from "class-variance-authority";
import { PencilIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { FormField } from "@/components/forms/field";
import { Input } from "@/components/forms/input";
import { Textarea } from "@/components/forms/textarea";
import { Typography } from "@/components/typography";

/** How long the Address field must sit still before the edit-mode map re-centers (ms). */
const MAP_ADDRESS_DEBOUNCE_MS = 600;

const experienceLocationVariants = cva(
	// Card shell. Figma: `experience-location` — input fill, border, radius/input, shadow-xs, 16px padding.
	"flex w-full flex-col rounded-input border border-border bg-input-fill p-4 shadow-xs",
	{
		variants: {
			state: {
				// Figma Property 1=Default — read-only summary.
				default: "gap-[10px]",
				// Figma Property 1=Edit — inline form.
				edit: "gap-4",
			},
		},
		defaultVariants: {
			state: "default",
		},
	},
);

type ExperienceLocationValue = {
	/** Meeting point name (Figma: `meeting-point`). */
	name: string;
	/** Street address; also drives the map pin. */
	address: string;
	/** Secondary location detail, e.g. a dock/slip (Figma: `additional-info`). */
	additionalInfo?: string;
	/** Arrival directions shown under the map. */
	instructions?: string;
};

type ExperienceLocationProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
	/** Controlled location. Omit to let the card own its value (seeded by `defaultValue`). */
	value?: ExperienceLocationValue;
	defaultValue?: ExperienceLocationValue;
	/** Start in the Edit state. */
	defaultEditing?: boolean;
	/** Called with the edited values when "Save" is pressed. */
	onSave?: (value: ExperienceLocationValue) => void;
	/** Called when "Cancel" discards the edits. */
	onCancel?: () => void;
	/** Label for the `additionalInfo` field — the Figma copy is yacht-specific. */
	additionalInfoLabel?: string;
};

const emptyValue: ExperienceLocationValue = { name: "", address: "", additionalInfo: "", instructions: "" };

/**
 * Meeting-point card for an experience: name, address and a live Google Map, with an
 * inline Edit state. Translated from bethere.ds `experience-location` (Property 1=Default/Edit).
 */
function ExperienceLocation({
	className,
	value,
	defaultValue = emptyValue,
	defaultEditing = false,
	onSave,
	onCancel,
	additionalInfoLabel = "Dock / Slip",
	...props
}: ExperienceLocationProps) {
	const id = React.useId();
	const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
	const location = value ?? uncontrolled;
	const [editing, setEditing] = React.useState(defaultEditing);
	const [draft, setDraft] = React.useState(location);
	const editRef = React.useRef<HTMLButtonElement>(null);
	// Return focus to the pencil after leaving Edit (the focused Save/Cancel unmounts).
	const refocusEdit = React.useRef(false);

	React.useEffect(() => {
		if (!editing && refocusEdit.current) editRef.current?.focus();
		refocusEdit.current = false;
	}, [editing]);

	const startEditing = () => {
		setDraft(location);
		setEditing(true);
	};

	const stopEditing = () => {
		refocusEdit.current = true;
		setEditing(false);
	};

	const save = () => {
		setUncontrolled(draft);
		onSave?.(draft);
		stopEditing();
	};

	const cancel = () => {
		onCancel?.();
		stopEditing();
	};

	const setField = (field: keyof ExperienceLocationValue) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setDraft((current) => ({ ...current, [field]: event.target.value }));

	// While editing, the map follows the Address field once typing pauses.
	const mapAddress = useDebouncedValue(
		editing ? draft.address : location.address,
		editing ? MAP_ADDRESS_DEBOUNCE_MS : 0,
	);

	return (
		<div
			data-slot="experience-location"
			data-state={editing ? "edit" : "default"}
			className={cn(experienceLocationVariants({ state: editing ? "edit" : "default", className }))}
			{...props}
		>
			{editing ? (
				// Not a <form>: the card often sits inside a page form, and nested forms are invalid —
				// its Save/Enter would submit the page. Enter in a single-line field saves the card
				// instead (and is kept from reaching the outer form); Escape cancels.
				<div
					role="group"
					aria-labelledby={`${id}-title`}
					className="contents"
					onKeyDown={(event) => {
						if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
							event.preventDefault();
							save();
						} else if (event.key === "Escape") {
							cancel();
						}
					}}
				>
					<div className="flex items-start gap-[10px]">
						<Typography id={`${id}-title`} size="base" weight="semibold" className="min-w-0 flex-1 truncate">
							Edit location
						</Typography>
						<div className="flex shrink-0 items-start gap-2">
							<Button type="button" variant="outline" size="md" onClick={cancel}>
								Cancel
							</Button>
							<Button type="button" size="md" onClick={save}>
								Save
							</Button>
						</div>
					</div>

					<FormField htmlFor={`${id}-name`} label="Meeting point" className="gap-2">
						<Input
							id={`${id}-name`}
							autoFocus
							placeholder="Enter location name"
							value={draft.name}
							onChange={setField("name")}
						/>
					</FormField>
					<FormField htmlFor={`${id}-address`} label="Address" className="gap-2">
						<Input id={`${id}-address`} value={draft.address} onChange={setField("address")} />
					</FormField>
					<FormField htmlFor={`${id}-info`} label={additionalInfoLabel} className="gap-2">
						<Input id={`${id}-info`} value={draft.additionalInfo ?? ""} onChange={setField("additionalInfo")} />
					</FormField>
					<LocationMap address={mapAddress} />
					<FormField htmlFor={`${id}-instructions`} label="Instructions" className="gap-2">
						<Textarea
							id={`${id}-instructions`}
							value={draft.instructions ?? ""}
							onChange={setField("instructions")}
						/>
					</FormField>
				</div>
			) : (
				<>
					<div className="flex items-start gap-[10px]">
						<div className="flex min-w-0 flex-1 flex-col gap-0.5">
							<Typography size="base" weight="semibold" className="truncate">
								{location.name}
							</Typography>
							<Typography size="base" className="truncate">
								{location.address}
							</Typography>
							{location.additionalInfo ? (
								<Typography size="sm" className="truncate text-muted-foreground">
									{location.additionalInfo}
								</Typography>
							) : null}
						</div>
						{/* Figma: 32px ghost icon button, 16px pencil in color/icon/foreground. */}
						<Button
							ref={editRef}
							type="button"
							variant="ghost"
							size="icon"
							aria-label="Edit location"
							className="text-icon-foreground"
							onClick={startEditing}
						>
							<PencilIcon />
						</Button>
					</div>

					<LocationMap address={location.address} />

					{location.instructions ? (
						<div className="flex flex-col gap-1">
							<Typography size="sm" weight="medium">
								Instructions
							</Typography>
							<Typography size="sm" className="text-muted-foreground">
								{location.instructions}
							</Typography>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}

/**
 * 224px-tall Google Map pinned on `address` (keyless embed). Google's own "Open in Maps"
 * control links out to the full map. Renders nothing without an address.
 */
function LocationMap({ address }: { address: string }) {
	const query = encodeURIComponent(address.trim());
	if (!query) return null;

	return (
		<div data-slot="experience-location-map" className="h-56 w-full overflow-hidden rounded-lg">
			<iframe
				title={`Map of ${address}`}
				src={`https://maps.google.com/maps?q=${query}&z=15&output=embed`}
				loading="lazy"
				referrerPolicy="no-referrer-when-downgrade"
				className="size-full border-0"
			/>
		</div>
	);
}

/** `value`, delayed until it has stopped changing for `delay` ms (`0` passes it straight through). */
function useDebouncedValue<T>(value: T, delay: number) {
	const [debounced, setDebounced] = React.useState(value);
	React.useEffect(() => {
		if (delay === 0) {
			setDebounced(value);
			return;
		}
		const timer = window.setTimeout(() => setDebounced(value), delay);
		return () => window.clearTimeout(timer);
	}, [value, delay]);
	return delay === 0 ? value : debounced;
}

export { ExperienceLocation, experienceLocationVariants };
export type { ExperienceLocationProps, ExperienceLocationValue };
