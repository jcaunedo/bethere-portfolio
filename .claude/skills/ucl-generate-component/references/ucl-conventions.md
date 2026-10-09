# UCL component conventions (for ucl-generate-component)

The repo's house style for a `src/components/<category>/<component-name>/<component-name>.tsx` component. Match it so the new component is indistinguishable from hand-written code. Source of truth: `bethere-ucl/CLAUDE.md` + the existing `components/buttons/button/button.tsx` / `components/typography`.

## File layout

- Component: `bethere-ucl/src/components/<category>/<component-name>/<component-name>.tsx` (kebab-case folder + file).
- Stories: `bethere-ucl/src/components/<category>/<component-name>/<component-name>.stories.tsx`.
- Local export: `bethere-ucl/src/components/<category>/<component-name>/index.ts` re-exports the component, its `<name>Variants`, and any prop types from the folder.
- Top-level export: re-export the same names from `bethere-ucl/src/index.ts`, grouped under the matching category comment banner.
- Name: kebab-case folder/file, PascalCase export, `<name>Variants` for the `cva` (e.g. `Badge` + `badgeVariants`).

## Component skeleton

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui"; // only if asChild is needed

import { cn } from "@/lib/utils";

const <name>Variants = cva(
  "…base classes shared by every variant…",
  {
    variants: {
      variant: {
        // label each key with its Figma variant name
        default: "…",
      },
      size: {
        md: "…", // keep the xs sm md lg xl scale where it applies
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

/** One-line JSDoc: what this component is + its Figma origin. */
function <Name>({
  className,
  variant = "default",
  size = "md",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof <name>Variants>) {
  return (
    <button
      data-slot="<name>"
      data-variant={variant}
      data-size={size}
      className={cn(<name>Variants({ variant, size, className }))}
      {...props}
    />
  );
}

export { <Name>, <name>Variants };
```

## Tailwind breakpoints

UCL uses Tailwind v4's default breakpoints (`bethere-ucl/src/styles/theme.css` doesn't override `--breakpoint-*`, so these apply as-is). Each prefix is a **min-width** media query — `md:` means "at `md` and up," not "only at `md`." Reference: [tailwindcss.com/docs/responsive-design](https://tailwindcss.com/docs/responsive-design).

| Prefix | Min-width | `min-width` (px) |
| ------ | --------- | ----------------- |
| `sm`   | 40rem     | 640px              |
| `md`   | 48rem     | 768px              |
| `lg`   | 64rem     | 1024px             |
| `xl`   | 80rem     | 1280px             |
| `2xl`  | 96rem     | 1536px             |

Unprefixed utilities are the mobile/base style and apply at all widths unless overridden by a breakpoint prefix. Design mobile-first: write the base (smallest) styles unprefixed, then layer on `sm:`/`md:`/etc. overrides for larger viewports — e.g. `grid-cols-1 md:grid-cols-[0.75fr_1fr]` (single column below `md`, two-column split at `md` and up), as used in `sign-up-sign-in.tsx`'s hero/form split.

Arbitrary/custom breakpoints (a one-off value Tailwind's scale doesn't cover) use the bracket syntax `min-[825px]:flex` — prefer a real Figma breakpoint value if the design specifies one, otherwise reuse the nearest standard prefix rather than inventing a bespoke one-off.

## Established vocabulary to reuse

**Tokens (from `theme.css`, via Tailwind utilities — never raw hex/px):**
`bg-primary` / `text-primary-foreground`, `bg-accent` / `text-accent-foreground`,
`bg-destructive` / `bg-destructive-subtle` / `text-destructive`, `bg-card`, `text-foreground`,
`text-muted-foreground`, `border-border`, `ring-ring`, brand scales `bg-brand-500` etc.,
radii `rounded-lg`/`rounded-[10px]`/`rounded-xl`, `shadow-xs`.

**Button API (mirror these names when the concept matches):**
- `variant`: `default` (solid primary), `destructive` (light-red fill), `destructiveSolid` (solid red), `secondary` (flat neutral), `outline`, `ghost`, `ghost-destructive` (no fill, red label, light-red hover), `link`.
- `size`: `xs sm md lg xl` (+ `icon-*` counterparts). Heights 24/28/32/36/40; radii 8/10/12/12/12.
- extras: `asChild` (radix `Slot`), `loading` (dependency-free spinner).

**Typography API:** `size` (xs→7xl) × `weight` (regular/medium/semibold/bold/black), `as` for the element. Sizes ≤ lg → `font-sans`; xl+ → `font-display`.

## Translation rules (Figma → clean UCL)

- **Variant matrix → `cva` groups.** Reuse existing variant keys when the meaning matches. New axis/value with no equivalent → ask before naming.
- **Interaction states are utilities, not variants:** `hover:…`, `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`, `disabled:pointer-events-none disabled:opacity-50`, `aria-invalid:border-destructive`.
- **Cursor is global — don't add `cursor-pointer`/`cursor-not-allowed` per component.** `theme.css` has a `@layer base` rule giving every clickable control (`button`, `[role="button"]`, `a[href]`, `select`, etc., unless disabled/`aria-disabled`) `cursor: pointer`, and disabled ones `cursor: not-allowed` — this overrides Tailwind v4 preflight's `cursor: default` on `<button>`. A new component gets this for free as long as it uses a real interactive element (or `role="button"` + `aria-disabled` for non-native controls) and doesn't need its own utility class for it.
- **Strip Figma auto-layout noise:** drop `mr-[-7px]`, `content-stretch`, wrapper padding, `data-node-id`. Re-express with `inline-flex items-center`, `gap-*`, `px-*`/`py-*`, `h-*`/`size-*`.
- **Hover-darken:** `hover:bg-[color-mix(in_srgb,var(--primary)_90%,black)]` — not `/90` opacity.
- **Icon sizing pattern:** `[&_svg]:pointer-events-none [&_svg]:shrink-0` in base; per-size `[&_svg:not([class*='size-'])]:size-4`.
- **Gaps/margins/padding must be pixel-accurate to Figma's literal value — never rounded to the nearest token.** Pull the exact value from `get_design_context`/`get_variable_defs` for the specific node in question (not a visually-similar sibling, not a different variant/state of the same component) and compare it against the same rigor used for color/typography tokens below:
  - Value matches an existing spacing token exactly → use that token's Tailwind utility (`gap-2`, `p-6`, `pl-14`, etc.).
  - Value matches no token → use the literal value as an arbitrary class (`gap-[2px]`, `pl-[13px]`) rather than snapping to the closest token-backed utility "for consistency." A raw, honest arbitrary value is correct; a token-backed value that's off by a few px is not — see [DESIGN.md's "Gaps/margins/padding must match Figma's literal value"](../../../../bethere-ucl/DESIGN.md#gapsmarginspadding-must-match-figmas-literal-value--dont-normalize-to-the-nearest-token-srccomponentscardsintegration-cardintegration-cardtsx) for the concrete case this bit (a component's two variants had genuinely different, unmatching gap values — `2px` vs. `spacing/2`/`8px` — for the same visual role, and normalizing them together to "look cleaner" was wrong).
  - If the same visual role has different raw values across variants/states in the same component, preserve that difference rather than collapsing it to one — if it looks like it might be a Figma authoring slip rather than intentional, **ask** which one should win instead of silently picking one.
  - Re-verify this for every gap/margin/padding when doing a Workflow B refine too, not just on first creation — a value that was correct when the component was first built can drift out of sync with a later Figma edit just like a color/variant can.

## Stories skeleton

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { <Name> } from "./<name>";

const meta: Meta<typeof <Name>> = {
  title: "<Category>/<Name>",
  component: <Name>,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof <Name>>;

export const Default: Story = { args: { /* … */ } };
// one story per variant/state…
export const AllVariants: Story = {
  render: () => (/* every variant × size in a grid */),
};
```

## Verify (from `bethere-ucl/`)

- `npm run lint` (`tsc --noEmit`) — must pass. Renaming a `cva` variant key or exported type breaks the folder's stories + its `index.ts` + the top-level `src/index.ts`; fix them all in the same change.
- `npm run build` — must succeed.
