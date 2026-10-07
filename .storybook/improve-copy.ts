import type { IncomingMessage } from "node:http";
import { loadEnv, type Plugin } from "vite";

import { handleImprove } from "../server/improve-copy.ts";

/**
 * Storybook dev-server transport for `POST /api/improve` (Claude copy rewrites for the New Listing
 * Review step). The logic and limits live in `server/improve-copy.ts`, shared with the Netlify
 * Function (`netlify/functions/improve.ts`) that serves the same route on the deployed Storybook.
 */

function readBody(req: IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		let body = "";
		req.setEncoding("utf8");
		req.on("data", (chunk: string) => {
			body += chunk;
			// Stop buffering early; the shared handler rejects anything this large.
			if (body.length > 25_000) req.destroy();
		});
		req.on("end", () => resolve(body));
		req.on("error", reject);
	});
}

function improveCopyPlugin(): Plugin {
	return {
		name: "bethere-improve-copy",
		configureServer(server) {
			// Expose ANTHROPIC_* from .env / .env.local to this server only (never to the client bundle).
			const env = loadEnv(server.config.mode, process.cwd(), "ANTHROPIC_");
			for (const [key, value] of Object.entries(env)) process.env[key] ??= value;

			server.middlewares.use("/api/improve", async (req, res) => {
				const result = await handleImprove(
					{
						method: req.method ?? "GET",
						origin: req.headers.origin ?? null,
						host: req.headers.host ?? "",
						body: req.method === "POST" ? await readBody(req) : "",
					},
					process.env,
					(message) => server.config.logger.error(message),
				);
				res.statusCode = result.status;
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify(result.body));
			});
		},
	};
}

export { improveCopyPlugin };
