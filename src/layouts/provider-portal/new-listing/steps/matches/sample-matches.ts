/** Prototype-only sample results for stories (Figma copy + the MatchCard sample photos). */
// Prototype sample photos, shared with MatchCard's stories (one copy of each file).
import yacht1 from "@/components/cards/match-card/images/yacht-1.webp";
import yacht2 from "@/components/cards/match-card/images/yacht-2.webp";
import yacht3 from "@/components/cards/match-card/images/yacht-3.webp";
import type { Match } from "./matches";

export const sampleMatches: Match[] = [
	{
		id: "azimut-55-fly-2021",
		name: "Azimut 55 Fly (2021)",
		image: yacht1,
		details: ["55 ft", "13 guests", "3 cabins", "2 bathrooms"],
		badge: "Best match",
	},
	{
		id: "azimut-55-flybridge-2021",
		name: "Azimut 55 Flybridge (2021)",
		image: yacht2,
		details: ["55 ft", "13 guests", "3 cabins", "2 bathrooms"],
	},
	{
		id: "azimut-53-fly-2021",
		name: "Azimut 53 Fly (2021)",
		image: yacht3,
		details: ["53 ft", "12 guests", "3 cabins", "1 bathroom"],
	},
];
