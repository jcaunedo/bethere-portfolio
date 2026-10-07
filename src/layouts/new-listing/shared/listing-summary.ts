import {
	BlocksIcon,
	CalendarClockIcon,
	CircleUserIcon,
	DollarSignIcon,
	FileTextIcon,
	ImagesIcon,
	ListChecksIcon,
	MapPinIcon,
	ShipIcon,
	TimerIcon,
} from "lucide-react";

import type * as React from "react";

import type { TimeSlotAccordionValue } from "@/components/forms/time-slot-accordion";
import { sampleAttributes, type AttributesAnswers } from "../steps/attributes/attributes";
import { sampleWindows } from "../steps/availability/availability";
import { sampleDocuments, type DocumentSection, type ListingDocument } from "../steps/documents/documents";
import { durationOptions, sampleExpectations, type ExpectationsAnswers } from "../steps/expectations/expectations";
import type { Match } from "../steps/matches/matches";
import { sampleMatches } from "../steps/matches/sample-matches";
import { MIN_PHOTOS, type Photo } from "../steps/photos/photos";
import { samplePhotos } from "../steps/photos/sample-photos";
import {
	ageOptions,
	cancellationOptions,
	samplePolicies,
	weatherOptions,
	type PoliciesAnswers,
} from "../steps/policies/policies";
import { samplePricing, type PricingAnswers } from "../steps/pricing/pricing";
import type { ReviewSummaryItem } from "../steps/review/review";
import { sampleListingDays, week } from "./week";

/**
 * Everything the New Listing steps collected — what the flow keeps and Review summarizes.
 * Layout-internal, not part of the package API.
 */
type ListingAnswers = {
	/** Matches: the picked result, or `null` when the listing was added manually. */
	match: Match | null;
	attributes: AttributesAnswers;
	expectations: ExpectationsAnswers;
	/** Availability: the days the listing runs. */
	days: string[];
	/** Availability: each day's time windows. */
	windows: TimeSlotAccordionValue;
	pricing: PricingAnswers;
	photos: Photo[];
	policies: PoliciesAnswers;
	documents: Record<DocumentSection, ListingDocument[]>;
};

/** Each step's sample answers (its defaults) — what a flow starts from. */
const sampleListingAnswers: ListingAnswers = {
	match: sampleMatches[0],
	attributes: sampleAttributes,
	expectations: sampleExpectations,
	days: sampleListingDays,
	windows: sampleWindows,
	pricing: samplePricing,
	photos: samplePhotos,
	policies: samplePolicies,
	documents: sampleDocuments,
};

/** "a", "a and b", "a, b, and c". */
function listJoin(items: string[]) {
	if (items.length <= 2) return items.join(" and ");
	return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const signedPercent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;
/** Custom per-duration rates set in a pricing section's overrides. */
const customRates = (overrides: Record<string, number | undefined>) =>
	Object.values(overrides).filter((value) => value !== undefined).length;
const money = (amount: number) => `$${Math.round(amount).toLocaleString("en-US")}`;

/** "16:00" → "4:00 PM". */
function time12h(value: string) {
	const [h, m] = value.split(":").map(Number);
	const suffix = h < 12 ? "AM" : "PM";
	return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Hours in a duration label ("2 hr" → 2, "1.5 hr" → 1.5); `null` for "Full Day" and the like. */
function hoursIn(label: string) {
	const match = /(\d+(?:\.\d+)?)\s*hr/i.exec(label);
	return match ? Number(match[1]) : null;
}

const icon = (component: React.ComponentType<React.SVGProps<SVGSVGElement>>) => ({ type: "icon" as const, icon: component });

function yachtItem({ match, attributes }: ListingAnswers): ReviewSummaryItem {
	const name = attributes.name.trim();
	const value = [name, match?.name].filter(Boolean).join(" · ") || "No yacht details yet";
	const specs = [
		attributes.length != null ? `${attributes.length} ft` : null,
		attributes.guests != null ? plural(attributes.guests, "guest") : null,
		attributes.cabins != null ? plural(attributes.cabins, "cabin") : null,
		attributes.bathrooms != null ? plural(attributes.bathrooms, "bathroom") : null,
	].filter((part): part is string => part != null);
	const required =
		!name || [attributes.length, attributes.cabins, attributes.bathrooms, attributes.guests].some((n) => n == null);
	return {
		section: "yacht",
		label: "Yacht",
		value,
		detail: specs.join(" · ") || undefined,
		required,
		media: icon(ShipIcon),
	};
}

function durationItem({ expectations }: ListingAnswers): ReviewSummaryItem {
	// Preset durations in their tile order, then any custom ones as added.
	const rank = (label: string) => {
		const index = durationOptions.indexOf(label);
		return index === -1 ? durationOptions.length : index;
	};
	const durations = [...expectations.durations].sort((a, b) => rank(a) - rank(b));
	return {
		section: "duration",
		label: "Duration",
		value: durations.length ? listJoin(durations) : "No durations yet",
		required: durations.length === 0,
		media: icon(TimerIcon),
	};
}

function locationItem({ expectations }: ListingAnswers): ReviewSummaryItem {
	const { name, address, additionalInfo } = expectations.location;
	const detail = [address, additionalInfo].filter(Boolean).join(" · ");
	return {
		section: "location",
		label: "Location",
		value: name.trim() || "No boarding location yet",
		detail: detail || undefined,
		required: !name.trim() || !address.trim(),
		media: icon(MapPinIcon),
	};
}

function availabilityItem({ days, windows }: ListingAnswers): ReviewSummaryItem {
	const selected = week.filter((day) => days.includes(day.value));
	const slots = selected.flatMap((day) => (windows[day.value] ?? []).filter((slot) => slot.start && slot.end));
	// Same rule as Availability's "Required" rows: a selected day with no complete time window.
	const daysMissingSlots = selected.filter(
		(day) => !(windows[day.value] ?? []).some((slot) => slot.start && slot.end),
	);
	const earliest = slots.map((slot) => slot.start).sort()[0];
	const latest = slots.map((slot) => slot.end).sort().at(-1);
	return {
		section: "availability",
		label: "Availability",
		value: selected.length ? selected.map((day) => day.short).join(", ") : "No days yet",
		detail:
			selected.length === 0
				? undefined
				: daysMissingSlots.length
					? `Add time slots for ${listJoin(daysMissingSlots.map((day) => day.short))}`
					: slots.length && earliest && latest
						? `${plural(slots.length, "time slot")} from ${time12h(earliest)} the earliest to ${time12h(latest)} the latest`
						: "No time slots yet",
		required: selected.length === 0 || daysMissingSlots.length > 0,
		media: icon(CalendarClockIcon),
	};
}

/** Charter rates' "Set different rates by day", when on: "Sat, Sun +20%, 1 custom rate". */
function byDayDetail({ pricing, days }: ListingAnswers) {
	// Same rule as the Pricing step: by-day rates only apply with more than one listing day.
	if (!pricing.byDay || days.length < 2) return undefined;
	// Only days the listing still runs (Availability may have changed since they were picked).
	const picked = week.filter((day) => pricing.adjustedDays.includes(day.value) && days.includes(day.value));
	if (picked.length === 0) return undefined;
	const custom = pricing.durations.filter((row) => row.included && row.adjustedOverride !== undefined).length;
	const rate = pricing.dayPercent !== 0 ? signedPercent(pricing.dayPercent) : "at base rates";
	return `${picked.map((day) => day.short).join(", ")} ${rate}${custom ? `, ${plural(custom, "custom rate")}` : ""}`;
}

/**
 * A set of duration rates as a pricing card's lines: "Starting at $200/hr" (lowest hourly rate,
 * or lowest price when no duration is in hours) and "Packages from $400 – $1,600".
 */
function rateLines(rates: Array<{ label: string; price: number }>) {
	const hourly = rates.flatMap((row) => {
		const hours = hoursIn(row.label);
		return hours ? [row.price / hours] : [];
	});
	const prices = rates.map((row) => row.price);
	const low = Math.min(...prices);
	const high = Math.max(...prices);
	return {
		value: hourly.length
			? `Starting at ${money(Math.min(...hourly))}/hr`
			: prices.length
				? `Starting at ${money(low)}`
				: "No rates yet",
		packages: prices.length
			? low === high
				? `Packages at ${money(low)}`
				: `Packages from ${money(low)} – ${money(high)}`
			: undefined,
	};
}

/** Included durations with a base rate. */
const baseRates = ({ pricing }: ListingAnswers) =>
	pricing.durations.filter((row) => row.included && row.base != null) as Array<
		PricingAnswers["durations"][number] & { base: number }
	>;

/** Pricing step, "Charter rates" section: base rates per duration, plus any by-day rates. */
function pricingItem(answers: ListingAnswers): ReviewSummaryItem {
	const rates = baseRates(answers);
	const { value, packages } = rateLines(rates.map((row) => ({ label: row.label, price: row.base })));
	return {
		section: "pricing",
		label: "Pricing",
		value,
		detail: [packages, byDayDetail(answers)].filter(Boolean).join(" · ") || undefined,
		required: rates.length === 0,
		media: icon(DollarSignIcon),
	};
}

/**
 * A pricing adjustment's badge, as on the Pricing step's season cards: its % ("+15%"), or "Custom"
 * when only custom rates differ; none at base rates.
 */
function adjustmentBadge(percent: number, overrides: Record<string, number | undefined>) {
	if (percent !== 0) return signedPercent(percent);
	return customRates(overrides) ? "Custom" : undefined;
}

/**
 * A pricing adjustment (holiday or a season) as a "{name} pricing" card: its rates — a custom rate
 * where set, else the base rate with its % — as "Starting at …" / "Packages from …", like the base
 * Pricing card, and its adjustment badge. None when it isn't set (no % and no custom rate): its
 * prices would just repeat the base Pricing card.
 */
function adjustedPricingItems(
	answers: ListingAnswers,
	name: string,
	percent: number,
	overrides: Record<string, number | undefined>,
): ReviewSummaryItem[] {
	const badge = adjustmentBadge(percent, overrides);
	if (!badge) return [];
	const { value, packages } = rateLines(
		baseRates(answers).map((row) => ({
			label: row.label,
			price: overrides[row.id] ?? Math.round(row.base * (1 + percent / 100)),
		})),
	);
	return [
		{
			section: "pricing",
			label: `${name} pricing`,
			value,
			detail: packages,
			badge,
			media: icon(DollarSignIcon),
		},
	];
}

/** Pricing step, "Holiday pricing" section: the holiday rates — only when switched on and set. */
function holidayItems(answers: ListingAnswers): ReviewSummaryItem[] {
	const { pricing } = answers;
	if (!pricing.holidayOn) return [];
	return adjustedPricingItems(answers, "Holiday", pricing.holidayPercent, pricing.holidayOverrides);
}

/**
 * Pricing step, "Seasonal pricing" section: one "{season} pricing" card per named, set season, in
 * the same format as Holiday pricing — only when switched on.
 */
function seasonalItems(answers: ListingAnswers): ReviewSummaryItem[] {
	const { pricing } = answers;
	if (!pricing.seasonalOn) return [];
	return pricing.seasons
		.filter((season) => season.name.trim())
		.flatMap((season) => adjustedPricingItems(answers, season.name.trim(), season.percent, season.overrides));
}

/** Pricing step, "Add-on services" section. */
function addOnsItem({ pricing }: ListingAnswers): ReviewSummaryItem {
	const services = pricing.addOnsOn
		? pricing.services.filter((row) => row.included && row.label.trim()).map((row) => row.label.trim())
		: [];
	return {
		section: "addons",
		label: "Add-on Services",
		value: services.length ? `${services.length} available` : "Not offered",
		detail: services.length ? services.join(" · ") : undefined,
		media: icon(BlocksIcon),
	};
}

function photosItem({ photos }: ListingAnswers): ReviewSummaryItem {
	const ready = photos.filter((photo) => photo.src && !photo.uploading);
	const cover = ready[0]?.src;
	return {
		section: "photos",
		label: "Photos",
		value: ready.length ? plural(ready.length, "photo") : "No photos yet",
		// Photos' own minimum — "Skip for now" there leaves the listing a draft.
		detail: ready.length < MIN_PHOTOS ? `Add at least ${MIN_PHOTOS} to publish` : undefined,
		required: ready.length < MIN_PHOTOS,
		media: cover ? { type: "image", src: cover } : icon(ImagesIcon),
	};
}

const WEATHER_PHRASE: Record<string, string> = {
	reschedule: "Reschedule for weather",
	refund: "Refund for weather",
	"host-review": "Host reviews weather cases",
};

function policiesItem({ policies }: ListingAnswers): ReviewSummaryItem {
	// Rules: the four single-choice policies, plus each "allowed" and safety pick.
	const rules = 4 + policies.allowed.length + policies.safety.length;
	const label = (options: { value: string; label: string }[], value: string) =>
		options.find((option) => option.value === value)?.label ?? value;
	const detail = [
		`${label(cancellationOptions, policies.cancellation)} cancellation`,
		label(ageOptions, policies.age),
		WEATHER_PHRASE[policies.weather] ?? label(weatherOptions, policies.weather),
	].join(" · ");
	return {
		section: "policies",
		label: "Policies",
		value: plural(rules, "rule"),
		detail,
		// "Custom" cancellation needs its terms written.
		required: policies.cancellation === "custom" && !policies.customTerms.trim(),
		media: icon(ListChecksIcon),
	};
}

/** One card per captain license: the captain and the license type ("USCG Master Captain"). */
function captainItems({ documents }: ListingAnswers): ReviewSummaryItem[] {
	if (documents.captain.length === 0) {
		return [{ section: "captain", label: "Captain", value: "No captain yet", required: true, media: icon(CircleUserIcon) }];
	}
	return documents.captain.map((document) => ({
		section: "captain",
		label: "Captain",
		value: document.captain?.name ?? document.title,
		detail: document.description.split(" · ")[0].replace(/\s+License$/i, "") || undefined,
		media: icon(CircleUserIcon),
	}));
}

const DOCUMENT_TYPE: Record<DocumentSection, string> = {
	insurance: "Commercial insurance",
	captain: "Captain license",
	vessel: "Vessel registration",
};

function documentsItem({ documents }: ListingAnswers): ReviewSummaryItem {
	const sections = (Object.keys(DOCUMENT_TYPE) as DocumentSection[]).filter((key) => documents[key].length > 0);
	const total = sections.reduce((sum, key) => sum + documents[key].length, 0);
	return {
		section: "documents",
		label: "Documents",
		value: total ? plural(total, "document") : "No documents yet",
		// Required documents needs one of each type.
		required: sections.length < Object.keys(DOCUMENT_TYPE).length,
		detail: sections.length
			? sections
					.map((key) => (documents[key].length > 1 ? `${documents[key].length} ${DOCUMENT_TYPE[key]}` : DOCUMENT_TYPE[key]))
					.join(" · ")
			: undefined,
		media: icon(FileTextIcon),
	};
}

/**
 * Review's summary cards, built from what the steps collected. Every step's card is always present —
 * "No photos yet", "Not offered"… when nothing was chosen — so its pencil still leads to the step.
 * Exception: Holiday and each season get a card only when that pricing is set (switched on, with a
 * % or a custom rate); otherwise base rates apply and the Pricing card already covers them.
 * A card is `required` when its step is missing something the listing needs to publish (Review
 * then disables Publish). Order between steps doesn't matter here (Review sorts cards into wizard
 * order); within a step, cards keep the order below.
 */
function buildReviewSummary(answers: ListingAnswers): ReviewSummaryItem[] {
	return [
		yachtItem(answers),
		durationItem(answers),
		locationItem(answers),
		availabilityItem(answers),
		// The Pricing step's sections, in its order; all share its pencil.
		pricingItem(answers),
		...holidayItems(answers),
		...seasonalItems(answers),
		addOnsItem(answers),
		photosItem(answers),
		policiesItem(answers),
		...captainItems(answers),
		documentsItem(answers),
	];
}

export { buildReviewSummary, sampleListingAnswers };
export type { ListingAnswers };
