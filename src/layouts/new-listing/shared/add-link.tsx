import * as React from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/buttons/button";

/**
 * "+ Add …" link used across New Listing steps. Figma `button` (link, 32px): 16px plus in a
 * 4px-padded slot, 4px gap. Colors and hover/focus come from Button's `link` variant.
 * Layout-internal helper, not part of the package API.
 */
function AddLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<Button
			type="button"
			variant="link"
			size="md"
			className="gap-1 self-start"
			onClick={onClick}
		>
			<PlusIcon aria-hidden="true" className="mx-1" />
			{children}
		</Button>
	);
}

export { AddLink };
