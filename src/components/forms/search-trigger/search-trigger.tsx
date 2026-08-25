import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { motionDuration } from "@/lib/motion";

type SearchTriggerProps = Omit<React.ComponentProps<typeof Input>, "size" | "type"> & {
  /** Accessible label for the collapsed icon button. */
  "aria-label"?: string;
  /**
   * Shared control height — `lg` (36px, default) or `xl` (40px). Figma
   * only defines these two sizes for the Search input type.
   */
  size?: "lg" | "xl";
  /** Render a clear (×) button when there is a value; called on click. */
  onClear?: () => void;
  className?: string;
};

// The collapsed icon button centers its 16px icon inside a 36px (lg) or
// 40px (xl) square — (36-16)/2 = 10, (40-16)/2 = 12. The expanded field
// pins its icon at the same offset so the magnifier doesn't shift when the
// field expands/collapses; SearchInput's own fixed `left-3` (12px) doesn't
// line up with the lg square's 10px, which is why this doesn't reuse it.
const ICON_OFFSET = { lg: 10, xl: 12 } as const;

/**
 * Collapsible search field (Figma: bethere.ds `Input` / `Type=Search`) — a
 * plain icon button by default, expanding into a text field on click.
 * Collapses back to the icon once blurred while empty; stays expanded
 * while it has a value. Uncontrolled `value`/`onChange` still flow
 * through. The icon↔field swap is a plain fade (`motionDuration.deliberate`);
 * both states are pinned to the same top-left corner and the magnifier icon
 * is positioned identically in each, so nothing shifts on click.
 */
function SearchTrigger({
  size = "lg",
  className,
  value,
  onChange,
  onClear,
  "aria-label": ariaLabel = "Search",
  ...props
}: SearchTriggerProps) {
  const [expanded, setExpanded] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hasValue = value != null && value !== "";
  // Deferred blur handling needs the *current* hasValue, not the one
  // closed over when onBlur fires — e.g. clicking "Clear search" updates
  // `value` (via onClear) and blurs the <input> in the same click, but the
  // native blur event dispatches before React commits that state update,
  // so a value read directly in the handler would still see the pre-clear
  // (truthy) value. This ref always holds the latest value instead.
  const hasValueRef = React.useRef(hasValue);
  hasValueRef.current = hasValue;

  function expand() {
    setExpanded(true);
  }

  // Autofocus once the input has actually mounted — a layout effect runs
  // synchronously right after React commits the DOM change (unlike a
  // plain useEffect or requestAnimationFrame, which can fire before
  // AnimatePresence/Motion has finished swapping the element in).
  React.useLayoutEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Fires when focus leaves the whole search area (input + clear button),
  // not when it merely moves between them — e.g. clicking "Clear search"
  // blurs the <input> but shouldn't collapse the field while the user is
  // still interacting with it, only once focus actually leaves. Deferred a
  // tick so both the state update above and the browser's next focus
  // target have settled before checking.
  function handleContainerBlur() {
    window.setTimeout(() => {
      if (
        !hasValueRef.current &&
        !containerRef.current?.contains(document.activeElement)
      ) {
        setExpanded(false);
      }
    }, 0);
  }

  const showClear = onClear && hasValue;
  const iconOffset = ICON_OFFSET[size];

  return (
    <div
      className={cn(
        "relative inline-flex",
        size === "xl" ? "size-10" : "size-9",
        (expanded || hasValue) && (size === "xl" ? "w-60" : "w-56"),
      )}
      ref={containerRef}
      onBlur={handleContainerBlur}
    >
      <AnimatePresence initial={false}>
        {!expanded && !hasValue ? (
          <motion.div
            key="collapsed"
            // Both states are pinned to the same top-left corner (rather
            // than sitting in normal flow) so the crossfade swaps in place
            // instead of the incoming element pushing in beside the
            // outgoing one before it finishes fading out.
            className="absolute top-0 left-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: motionDuration.deliberate } }}
            exit={{ opacity: 0 }}
          >
            <Button
              type="button"
              variant="outline"
              size={size === "xl" ? "icon-xl" : "icon-lg"}
              aria-label={ariaLabel}
              className={className}
              onClick={expand}
            >
              <SearchIcon />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="absolute top-0 left-0 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: motionDuration.deliberate } }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                style={{ left: iconOffset }}
              />
              <Input
                ref={inputRef}
                type="search"
                size={size}
                value={value}
                onChange={onChange}
                className={cn(
                  "[&::-webkit-search-cancel-button]:appearance-none",
                  showClear ? "pr-9" : "pr-3",
                  className,
                )}
                // icon offset + icon width (16px) + gap (8px, matching
                // SearchInput's own left-3/pl-9 icon-to-text spacing).
                style={{ paddingLeft: iconOffset + 24 }}
                {...props}
              />
              {showClear ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    onClear?.();
                    // Keep the field expanded and focused after clearing —
                    // clicking Clear blurs the <input> momentarily, which
                    // would otherwise read as "focus left the container"
                    // and collapse it. Only collapse when the user
                    // actually clicks/tabs away afterward.
                    inputRef.current?.focus();
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
                >
                  <XIcon className="size-4" />
                </button>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { SearchTrigger };
export type { SearchTriggerProps };
