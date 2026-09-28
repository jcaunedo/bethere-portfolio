import * as React from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";

/**
 * "+ Add …" link used across New Listing steps. Figma `button` (link, 32px, no side padding):
 * 16px plus in a 4px-padded slot, 4px gap, sm/medium label in the link color. Hover/focus:
 * label + icon turn foreground (same treatment as the "Add yacht manually" CTA).
 * Layout-internal helper, not part of the package API.
 */
function AddLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<Button
			type="button"
			variant="link"
			size="md"
			className="group gap-1 self-start px-0 hover:no-underline"
			onClick={onClick}
		>
			<PlusIcon
				aria-hidden="true"
				className="mx-1 text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground"
			/>
			<span className="text-primary transition-colors group-hover:text-foreground group-focus-visible:text-foreground">
				{children}
			</span>
		</Button>
	);
}

export { AddLink };
