import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/forms/input";

type SearchInputProps = React.ComponentProps<typeof Input> & {
  /** Render a clear (×) button when there is a value; called on click. */
  onClear?: () => void;
};

/** Search field with a leading magnifier. Figma origin: bethere.ds Input / Type=Search. */
function SearchInput({
  className,
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const showClear = onClear && value != null && value !== "";
  return (
    <div data-slot="search-input" className="relative w-full">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        className={cn(
          "pl-9 [&::-webkit-search-cancel-button]:appearance-none",
          showClear && "pr-9",
          className,
        )}
        {...props}
      />
      {showClear ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export { SearchInput };
export type { SearchInputProps };
