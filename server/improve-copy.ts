import Anthropic from "@anthropic-ai/sdk";

/**
 * Improves New Listing copy (Review step title/description) with Claude — prototype only.
 *
 * One handler shared by both transports so they can't drift:
 * - `.storybook/improve-copy.ts` — Storybook dev-server route (`npm run storybook`).
 * - `netlify/functions/improve.ts` — Netlify Function for the deployed Storybook.
 * Both serve `POST /api/improve` with `{ field, text, maxLength?, listingType?, facts?, otherFields? }`
 * and answer `{ text }` or `{ error }`. Credentials come from the server environment
 * (`ANTHROPIC_API_KEY`, or an `ant auth login` profile locally) and never reach the browser.
 *
 * The deployed function is public, so requests are limited: same-origin browser calls only,
 * capped body and field sizes, and short outputs.
 */

type ImproveField = "title" | "description";

type ImproveRequest = {
	field: ImproveField;
	text: string;
	maxLength?: number;
	listingType?: string;
	/** One line per known listing fact, e.g. "Yacht: Little Atocha · Azimut 55 Fly (2021)". */
	facts?: string[];
	/** The listing's other copy fields, for consistency (e.g. the title when improving the description). */
	otherFields?: Partial<Record<ImproveField, string>>;
};

/** What a transport receives from its HTTP request. */
type ImproveInput = {
	method: string;
	/** The `Origin` header, if any. */
	origin: string | null;
	/** The host the request was sent to (`Host` header / request URL host). */
	host: string;
	/** Raw request body. */
	body: string;
};

type ImproveEnv = {
	ANTHROPIC_API_KEY?: string;
	ANTHROPIC_AUTH_TOKEN?: string;
	ANTHROPIC_MODEL?: string;
};

type ImproveResult = { status: number; body: { text: string } | { error: string } };

const DEFAULT_MODEL = "claude-opus-5-5";
// Models that take the server-side `fallbacks: "default"` form on the Claude API.
const DEFAULT_FALLBACK_MODELS = ["claude-opus-5-5", "claude-opus-5", "claude-fable-5-1", "claude-sonnet-5-5"];

// Request limits (the deployed endpoint is public).
const MAX_BODY_CHARS = 20_000;
const MAX_TEXT_CHARS: Record<ImproveField, number> = { title: 300, description: 2_000 };
const MAX_RESULT_CHARS: Record<ImproveField, number> = { title: 120, description: 1_000 };
const MAX_FACTS = 20;
const MAX_FACT_CHARS = 300;
const MAX_LISTING_TYPE_CHARS = 40;

const SYSTEM_PROMPT = `You edit guest-facing listing copy for BeThere, a curated marketplace of premium local experiences and services — yacht charters, tours, dining, wellness, nightlife.

Rewrite the provider's draft so it reads clear, warm and confident: premium, never hype. Keep every fact accurate. Use only facts that appear in the draft or the listing details; never invent amenities, prices, times, capacities or claims. Prefer concrete details over generic superlatives, and plain words over marketing clichés. No emoji, hashtags or exclamation marks.

A title is a single line under 80 characters with no final period: it names what guests do and where.
A description is plain prose in two to four sentences, written to the guest, within the character limit you're given.

Reply with only the rewritten text — no quotes, labels, options or commentary.`;

let client: Anthropic | undefined;

function fail(status: number, error: string): ImproveResult {
	return { status, body: { error } };
}

/** Parses and bounds the request; returns an error message when it's unusable. */
function parseRequest(raw: string): ImproveRequest | string {
	if (raw.length > MAX_BODY_CHARS) return "Request too large.";
	let value: unknown;
	try {
		value = JSON.parse(raw || "{}");
	} catch {
		return "Invalid JSON body.";
	}
	const input = value as Partial<ImproveRequest> | null;
	if (!input || (input.field !== "title" && input.field !== "description") || typeof input.text !== "string") {
		return "Expected { field, text }.";
	}
	const field = input.field;
	if (input.text.length > MAX_TEXT_CHARS[field]) return `The ${field} is too long to improve.`;

	const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);
	const maxLength =
		typeof input.maxLength === "number" && input.maxLength > 0
			? Math.min(Math.floor(input.maxLength), MAX_RESULT_CHARS[field])
			: MAX_RESULT_CHARS[field];

	return {
		field,
		text: input.text,
		maxLength,
		listingType: str(input.listingType, MAX_LISTING_TYPE_CHARS),
		facts: Array.isArray(input.facts)
			? input.facts.slice(0, MAX_FACTS).flatMap((fact) => str(fact, MAX_FACT_CHARS) ?? [])
			: [],
		otherFields: {
			title: str(input.otherFields?.title, MAX_TEXT_CHARS.title),
			description: str(input.otherFields?.description, MAX_TEXT_CHARS.description),
		},
	};
}

function buildPrompt(request: ImproveRequest) {
	const listingType = request.listingType || "experience";
	const lines = [`Improve this ${listingType} listing's ${request.field}.`, `Character limit: ${request.maxLength}.`];
	if (request.facts?.length) lines.push("", "Listing details:", ...request.facts.map((fact) => `- ${fact}`));
	for (const [field, value] of Object.entries(request.otherFields ?? {})) {
		if (field !== request.field && value?.trim()) lines.push("", `Current ${field}:`, value.trim());
	}
	lines.push("", `Draft ${request.field}:`, request.text.trim() || "(empty — write one from the listing details)");
	return lines.join("\n");
}

/** The model's reply as plain text: text blocks joined, wrapping quotes dropped, cut to the limit. */
function cleanReply(content: Anthropic.Beta.BetaContentBlock[], maxLength?: number) {
	const text = content
		.filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
		.map((block) => block.text)
		.join("")
		.trim()
		.replace(/^["“](.*)["”]$/s, "$1")
		.trim();
	return maxLength ? text.slice(0, maxLength).trimEnd() : text;
}

function errorMessage(error: unknown, env: ImproveEnv) {
	if (error instanceof Anthropic.AuthenticationError) {
		return "Claude rejected the credentials. Check ANTHROPIC_API_KEY.";
	}
	if (error instanceof Anthropic.RateLimitError) return "Claude is rate-limited right now. Try again in a moment.";
	if (error instanceof Anthropic.APIConnectionError) return "Couldn't reach Claude. Check your connection.";
	if (error instanceof Anthropic.APIError) return `Claude returned an error (${error.status ?? "unknown"}).`;
	// With no credentials the client throws a plain Error before sending anything; an `ant auth login`
	// profile can still supply them locally, so only point at the env var when neither is set.
	if (!env.ANTHROPIC_API_KEY && !env.ANTHROPIC_AUTH_TOKEN) {
		return "No Anthropic credentials found. Set ANTHROPIC_API_KEY (.env.local locally, Netlify environment variables when deployed).";
	}
	return "Couldn't reach Claude.";
}

/** Same-origin browser requests only: the `Origin` header must name the host that was called. */
function isSameOrigin(origin: string | null, host: string) {
	if (!origin) return false;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}

async function handleImprove(input: ImproveInput, env: ImproveEnv, log?: (message: string) => void): Promise<ImproveResult> {
	if (input.method !== "POST") return fail(405, "Use POST.");
	if (!isSameOrigin(input.origin, input.host)) return fail(403, "Requests must come from the prototype itself.");

	const request = parseRequest(input.body);
	if (typeof request === "string") return fail(400, request);

	const model = env.ANTHROPIC_MODEL || DEFAULT_MODEL;
	try {
		client ??= new Anthropic();
		const response = await client.beta.messages.create({
			model,
			// A rewrite of at most ~1,000 characters; the cap also bounds spend per call.
			max_tokens: 2000,
			// Short rewrite behind a button: low effort keeps it quick.
			output_config: { effort: "low" },
			// On a policy decline, the API re-runs the request on a fallback model.
			...(DEFAULT_FALLBACK_MODELS.includes(model)
				? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
				: {}),
			system: SYSTEM_PROMPT,
			messages: [{ role: "user", content: buildPrompt(request) }],
		});

		if (response.stop_reason === "refusal") return fail(422, "Claude declined to rewrite this text.");
		const text = cleanReply(response.content, request.maxLength);
		if (!text) return fail(502, "Claude returned no text.");
		return { status: 200, body: { text } };
	} catch (error) {
		log?.(`[improve-copy] ${error instanceof Error ? error.message : String(error)}`);
		return fail(502, errorMessage(error, env));
	}
}

export { handleImprove };
export type { ImproveEnv, ImproveInput, ImproveRequest, ImproveResult };
