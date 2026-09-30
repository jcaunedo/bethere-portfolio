import boatRiver from "@/assets/images/boat-river.webp";
import floatingInWater from "@/assets/images/floating-in-water.webp";
import jetSki2 from "@/assets/images/jet-ski-2.webp";
import jumpFromBoat from "@/assets/images/jump-from-boat.webp";
import keyWest from "@/assets/images/key-west.webp";
import manateeUnderwater from "@/assets/images/manatee-underwater.webp";
import yatch from "@/assets/images/yatch.webp";
import type { Photo } from "./photos";

/** Figma sample photos (106:2718), in grid order — the first is the cover. */
const samplePhotos: Photo[] = [
	{ id: "jump-from-boat", src: jumpFromBoat, alt: "Guests jumping off the yacht into the sea" },
	{ id: "key-west", src: keyWest, alt: "Aerial view of a Key West island" },
	{ id: "jet-ski", src: jetSki2, alt: "Jet ski carving through turquoise water" },
	{ id: "floating", src: floatingInWater, alt: "Guest floating in the water by the yacht" },
	{ id: "manatee", src: manateeUnderwater, alt: "Manatee underwater" },
	{ id: "yacht", src: yatch, alt: "Speedboat at sunset" },
	{ id: "boat-river", src: boatRiver, alt: "Guests on deck with the city skyline behind" },
];

export { samplePhotos };
