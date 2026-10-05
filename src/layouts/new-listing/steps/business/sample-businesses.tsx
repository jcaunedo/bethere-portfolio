import type { Business } from "./business";
import mapKeyBiscayne from "./images/map-key-biscayne.webp";
import mapBrickell from "./images/map-brickell.webp";

/** Businesses from the Figma "11. Verify Business" frames. */
const sampleBusinesses: Business[] = [
	{
		id: "key-biscayne-yacht-club",
		name: "Key Biscayne Yacht Club",
		address: "180 Harbor Dr, Key Biscayne, FL 33149",
		taxId: "12-3456789",
		map: <img src={mapKeyBiscayne} alt="Map of Key Biscayne Yacht Club" />,
	},
	{
		id: "brickell-bay-kitchen",
		name: "Brickell Bay Kitchen",
		address: "701 S Miami Ave, Miami, FL 33131",
		taxId: "12-98765",
		map: <img src={mapBrickell} alt="Map of Brickell Bay Kitchen" />,
	},
];

export { sampleBusinesses };
