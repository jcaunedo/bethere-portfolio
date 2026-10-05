import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { typographyVariants } from "@/components/typography";
import { Checkbox } from "@/components/forms/checkbox";
import { RadioGroupItem } from "@/components/forms/radio-group";

const businessChoiceCardVariants = cva(
	// Shared surface: color/input/fill, radius/input, shadow-xs. Figma's color/border/border
	// stroke is inside (no layout space), so it is an inset ring, not a border.
	"w-full rounded-input bg-input-fill text-left shadow-xs inset-ring inset-ring-border",
	{
		variants: {
			variant: {
				// Figma Variants=single: info, full-width map, then a confirmation checkbox — not selectable.
				single: "flex flex-col justify-center gap-3 px-6 py-4",
				// Figma Variants=multiple-default/multiple-selected: radio + info + map thumbnail.
				// Selection is shown by the radio only (the surface is identical in Figma).
				// No Figma hover/focus/disabled source: follows ChoiceCard.
				multiple:
					"flex h-[136px] items-center gap-5 py-4 pr-4 pl-6 transition-shadow hover:shadow-card has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-input-ring-outside has-[button:disabled]:pointer-events-none has-[button:disabled]:opacity-50",
			},
		},
		defaultVariants: {
			variant: "single",
		},
	},
);

type BusinessChoiceCardContent = {
	/** Business name (Figma: `business-name`). */
	name: React.ReactNode;
	/** Business address (Figma: `address`). */
	address: React.ReactNode;
	/** Tax ID value, rendered after an "EIN / Tax ID:" label. */
	taxId?: React.ReactNode;
	/** Map preview (an `<img>`, static map, or embed). Sized and clipped by the card. */
	map: React.ReactNode;
};

type BusinessChoiceCardSingleProps = Omit<React.ComponentProps<"div">, "children"> &
	BusinessChoiceCardContent & {
		variant?: "single";
		/** Controlled state of the "Yes, this is the business for this listing" checkbox. */
		confirmed?: boolean;
		/** Initial checkbox state when uncontrolled. */
		defaultConfirmed?: boolean;
		/** Fires when the checkbox is ticked or cleared. */
		onConfirmedChange?: (confirmed: boolean) => void;
		/** Checkbox label (default: "Yes, this is the business for this listing"). */
		confirmLabel?: React.ReactNode;
	};

type BusinessChoiceCardMultipleProps = Omit<React.ComponentProps<"label">, "children"> &
	BusinessChoiceCardContent & {
		variant: "multiple";
		/** Radio value; selected state comes from the surrounding `RadioGroup`. */
		value: string;
		disabled?: boolean;
	};

type BusinessChoiceCardProps = BusinessChoiceCardSingleProps | BusinessChoiceCardMultipleProps;

function BusinessChoiceCardInfo({
	name,
	address,
	taxId,
	className,
}: Omit<BusinessChoiceCardContent, "map"> & { className?: string }) {
	return (
		<div className={cn("flex min-w-0 flex-col justify-center gap-2", className)}>
			<div className="flex flex-col gap-[2px] text-foreground">
				<p className={cn(typographyVariants({ size: "lg", weight: "semibold" }), "truncate")}>{name}</p>
				<p className={cn(typographyVariants({ size: "base" }), "truncate")}>{address}</p>
			</div>
			{taxId != null ? (
				<p className={cn(typographyVariants({ size: "sm" }), "h-6 truncate text-muted-foreground")}>
					EIN / Tax ID: {taxId}
				</p>
			) : null}
		</div>
	);
}

/**
 * Business summary card with a map preview: name, address, tax ID. `variant="single"`
 * is a display card the provider confirms with a checkbox; `variant="multiple"` is a radio
 * option and must render inside a `RadioGroup`. Translated from bethere.ds `business-choice-card`.
 */
function BusinessChoiceCard(props: BusinessChoiceCardProps) {
	const generatedId = React.useId();

	if (props.variant === "multiple") {
		const { className, name, address, taxId, map, value, disabled, id, variant, ...rest } = props;
		const radioId = id ?? generatedId;
		return (
			<label
				htmlFor={radioId}
				data-slot="business-choice-card"
				data-variant={variant}
				className={cn(businessChoiceCardVariants({ variant, className }))}
				{...rest}
			>
				{/* The card draws the focus ring, so the radio's own ring is suppressed. */}
				<RadioGroupItem id={radioId} value={value} disabled={disabled} size="lg" className="focus-visible:ring-0" />
				<div className="grid min-w-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-5">
					<BusinessChoiceCardInfo name={name} address={address} taxId={taxId} />
					{/* Figma: 104px map thumbnail, radius/input (12px). */}
					<div className="h-[104px] overflow-hidden rounded-input *:size-full *:object-cover">{map}</div>
				</div>
			</label>
		);
	}

	const {
		className,
		name,
		address,
		taxId,
		map,
		variant = "single",
		confirmed,
		defaultConfirmed,
		onConfirmedChange,
		confirmLabel = "Yes, this is the business for this listing",
		...rest
	} = props;
	return (
		<div
			data-slot="business-choice-card"
			data-variant={variant}
			className={cn(businessChoiceCardVariants({ variant, className }))}
			{...rest}
		>
			<BusinessChoiceCardInfo name={name} address={address} taxId={taxId} />
			{/* Figma: 224px map, radius/badge (8px). */}
			<div className="h-[224px] w-full overflow-hidden rounded-lg *:size-full *:object-cover">{map}</div>
			{/* Figma: bethere.ds `Checkbox` (Property 1=Default) with its label; this instance's row
			    padding is 8px vertical (the Checkbox default is 2px). */}
			<Checkbox
				className="py-2"
				label={confirmLabel}
				checked={confirmed}
				defaultChecked={defaultConfirmed}
				onCheckedChange={(checked) => onConfirmedChange?.(checked === true)}
			/>
		</div>
	);
}

export { BusinessChoiceCard, businessChoiceCardVariants };
export type { BusinessChoiceCardProps };
