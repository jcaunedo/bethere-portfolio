import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * User/business avatar. Figma: bethere.ds `avatar-users`. Built directly on
 * shadcn/ui's Avatar (Radix `Avatar.Root`/`Image`/`Fallback`) — this is a
 * near 1:1 port, reskinned to UCL tokens only where shadcn's own tokens
 * (`muted`, `primary`, `background`) already have a UCL equivalent.
 * `AvatarImage` renders a photo (Figma `w1`-`w10`/`m1`-`m10`); `AvatarFallback`
 * renders either initials (Figma `i1`-`i10`) or an icon (Figma `Account`/
 * `Staff`/`Me`/`Business-1`/`Business-2`) depending on its children.
 */
function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  /**
   * `lg` is 36px (`size-9`) — Figma's actual avatar size — not shadcn's own
   * 40px default; every BeThere avatar spec seen so far is 36px. `xl` is
   * 72px (`size-18`), the large avatar used in `ProfileHeader`.
   */
  size?: "default" | "sm" | "lg" | "xl";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none data-[size=lg]:size-9 data-[size=sm]:size-6 data-[size=xl]:size-18",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full rounded-full", className)}
      {...props}
    />
  );
}

/**
 * Saturation locked to Figma's reference green (`#268D11`, HSL 110/78.5%/31%).
 * Lightness varies per seed within 26–32% for extra variety and a visibly
 * lighter palette than a single fixed value — chosen as a deliberate,
 * slight trade against strict WCAG AA: at L=26% every hue clears 4.5:1
 * against white initials text, but by L=32% the yellow-green band (~60°)
 * drops to ~3.3:1 (still clears AA-Large's 3:1, not AA-normal). Acceptable
 * per product direction; revisit if initials text ever needs to guarantee
 * AA-normal at every hue.
 */
const INITIALS_BG_SATURATION = 78.5;
const INITIALS_BG_MIN_LIGHTNESS = 26;
const INITIALS_BG_MAX_LIGHTNESS = 32;

/** Fixed brand blue for business avatars (Figma `Business-1`, `#0073e6` → HSL 210/100%/45%). */
const BUSINESS_TONE_BACKGROUND = "hsl(210 100% 45%)";

/** Simple deterministic string hash (32-bit). */
function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/** Deterministic hue in [0, 360) from a seed string (e.g. user id or name). */
function hueFromSeed(seed: string): number {
  return Math.abs(hashString(seed)) % 360;
}

/**
 * Deterministic lightness within [INITIALS_BG_MIN_LIGHTNESS,
 * INITIALS_BG_MAX_LIGHTNESS], derived independently of the hue so two seeds
 * that share a hue bucket still read as distinguishable shades.
 */
function lightnessFromSeed(seed: string): number {
  const range = INITIALS_BG_MAX_LIGHTNESS - INITIALS_BG_MIN_LIGHTNESS;
  return (
    INITIALS_BG_MIN_LIGHTNESS +
    (Math.abs(hashString(`${seed}:l`)) % (range + 1))
  );
}

function AvatarFallback({
  className,
  style,
  colorSeed,
  tone = "auto",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  /**
   * Stable per-user/business identifier (e.g. id or full name) used to
   * derive a deterministic colorful background for initials (Figma
   * `i1`-`i10`). Omit for icon fallbacks, which stay on the neutral
   * `bg-muted` (Figma `Account`/`Staff`/`Me`/`Business-1`/`Business-2`).
   * Ignored when `tone="business"`.
   */
  colorSeed?: string;
  /**
   * `"auto"` (default) derives the background from `colorSeed` (or stays
   * neutral `bg-muted` without one). `"business"` forces the fixed brand
   * blue used for business avatars (Figma `Business-1`, `#0073e6`).
   */
  tone?: "auto" | "business";
}) {
  const hasColorSeed = tone === "auto" && colorSeed !== undefined;
  const isBusinessTone = tone === "business";
  const hasColorBackground = hasColorSeed || isBusinessTone;
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      style={
        hasColorBackground
          ? {
              backgroundColor: isBusinessTone
                ? BUSINESS_TONE_BACKGROUND
                : `hsl(${hueFromSeed(colorSeed!)} ${INITIALS_BG_SATURATION}% ${lightnessFromSeed(colorSeed!)}%)`,
              ...style,
            }
          : style
      }
      className={cn(
        "flex size-full items-center justify-center rounded-full text-sm font-medium text-muted-foreground group-data-[size=sm]/avatar:text-[10px] [&_svg]:size-4 group-data-[size=sm]/avatar:[&_svg]:size-3 group-data-[size=lg]/avatar:[&_svg]:size-5 group-data-[size=xl]/avatar:text-2xl group-data-[size=xl]/avatar:font-bold group-data-[size=xl]/avatar:[&_svg]:size-8",
        hasColorBackground ? "text-white" : "bg-muted",
        className,
      )}
      {...props}
    />
  );
}

/** Status indicator pinned to the bottom-right corner. Figma: `Dot`. */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        "group-data-[size=xl]/avatar:size-4 group-data-[size=xl]/avatar:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

/** Overlapping stack of avatars. Composes with `AvatarGroupCount` for a "+N" tile. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

/** "+N" overflow tile for the end of an `AvatarGroup`. */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-9 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
