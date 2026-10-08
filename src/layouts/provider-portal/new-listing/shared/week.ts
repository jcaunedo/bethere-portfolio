/**
 * Week in display order, shared by the steps that deal in days (Availability picks them, Pricing
 * adjusts rates for them): short labels for day tiles, full names for rows like time windows.
 */
const week = [
	{ value: "mon", short: "Mon", label: "Monday" },
	{ value: "tue", short: "Tue", label: "Tuesday" },
	{ value: "wed", short: "Wed", label: "Wednesday" },
	{ value: "thu", short: "Thu", label: "Thursday" },
	{ value: "fri", short: "Fri", label: "Friday" },
	{ value: "sat", short: "Sat", label: "Saturday" },
	{ value: "sun", short: "Sun", label: "Sunday" },
];

/** Figma sample: the days the listing runs (Availability's default selection). */
const sampleListingDays = ["tue", "thu", "sat", "sun"];

/** `days` (values, any order) as `{ value, label }` day-tile options, in week order. */
const dayTileOptions = (days: string[]) =>
	week.filter((day) => days.includes(day.value)).map((day) => ({ value: day.value, label: day.short }));

export { dayTileOptions, sampleListingDays, week };
