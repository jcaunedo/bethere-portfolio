import type { ReviewImproveRequest } from "../steps/review/review";

/**
 * Review's `onImprove` for the prototype: asks `POST /api/improve` to rewrite the field with Claude —
 * served by the Storybook dev server locally and by a Netlify Function when deployed (both run
 * `server/improve-copy.ts`). The API key stays on the server.
 * Layout-internal helper, not part of the package API.
 */
async function improveWithClaude(request: ReviewImproveRequest): Promise<string> {
	let response: Response;
	try {
		response = await fetch("/api/improve", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request),
		});
	} catch {
		throw new Error("Couldn't reach the AI service. Check that Storybook is running.");
	}

	const data = (await response.json().catch(() => null)) as { text?: unknown; error?: unknown } | null;
	if (response.ok && typeof data?.text === "string") return data.text;
	if (typeof data?.error === "string") throw new Error(data.error);
	throw new Error(
		"The AI service isn't available here. Locally, restart `npm run storybook`; on Netlify, check that the improve function deployed.",
	);
}

export { improveWithClaude };
