import { handleImprove } from "../../server/improve-copy.ts";

/**
 * Netlify Function transport for `POST /api/improve` on the deployed Storybook (Claude copy
 * rewrites for the New Listing Review step). The logic and limits live in `server/improve-copy.ts`,
 * shared with the Storybook dev-server route. Needs `ANTHROPIC_API_KEY` (and optionally
 * `ANTHROPIC_MODEL`) in the site's Netlify environment variables.
 */
export default async function improve(req: Request): Promise<Response> {
	const result = await handleImprove(
		{
			method: req.method,
			origin: req.headers.get("origin"),
			host: new URL(req.url).host,
			body: req.method === "POST" ? await req.text() : "",
		},
		process.env,
		(message) => console.error(message),
	);
	return Response.json(result.body, { status: result.status });
}

// Serve the function at the same path the prototype calls in local dev.
export const config = { path: "/api/improve" };
