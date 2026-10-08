import * as React from "react";

import { mediaAbove } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

/**
 * The page shell's sidebar state, shared by every layout (DESIGN.md "Page shell responsiveness").
 * Pass the result to `Sidebar`'s `collapsed` / `onCollapsedChange` and to
 * `layoutCanvasPaddingClassName`.
 *
 * Starts at `defaultCollapsed`. At `lg` (1024px) and below the sidebar auto-collapses, including on
 * initial load at a narrow width, not only when resizing into that range. Crossing back above `lg`
 * restores whatever state the sidebar was in *before* the auto-collapse, but only if the current
 * collapse was the automatic one: if the user collapsed it themselves while already at or below
 * `lg`, that choice sticks after crossing back above `lg`. `wasAutoCollapsedRef` tells the two
 * apart, so the restore only ever undoes this hook's own action. Any manual toggle (collapse or
 * expand) clears the flag, promoting the current state to user-owned.
 */
function useLayoutSidebar(defaultCollapsed = false) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(defaultCollapsed);
  const isLgUp = useMediaQuery(mediaAbove("lg"));
  const wasAutoCollapsedRef = React.useRef(false);
  const preCollapseStateRef = React.useRef(false);

  React.useEffect(() => {
    if (!isLgUp) {
      setSidebarCollapsed((current) => {
        if (!current) {
          preCollapseStateRef.current = current;
          wasAutoCollapsedRef.current = true;
        }
        return true;
      });
    } else if (wasAutoCollapsedRef.current) {
      setSidebarCollapsed(preCollapseStateRef.current);
      wasAutoCollapsedRef.current = false;
    }
  }, [isLgUp]);

  const handleSidebarCollapsedChange = React.useCallback((collapsed: boolean) => {
    wasAutoCollapsedRef.current = false;
    setSidebarCollapsed(collapsed);
  }, []);

  return { sidebarCollapsed, handleSidebarCollapsedChange };
}

export { useLayoutSidebar };
