# Component conventions (@bethere/ucl)

From `bethere-ucl/CLAUDE.md` and existing components.

## Patterns

- Variant management with `cva` (class-variance-authority); merge classes with `cn()` from `@/lib/utils`.
- Type props as `React.ComponentProps<"el"> & VariantProps<typeof variants> & { ...extras }`. Custom components use `React.forwardRef` + `displayName`.
- Use design-system tokens via Tailwind utilities (`bg-primary`, `text-foreground`, `border-border`, `rounded-xl`, `text-sm`, `size-4`…), never hardcoded hex.
- Translate Figma's generated output into clean utilities. Figma emits auto-layout artifacts (negative margins like `mr-[-7px]`, nested padding, `content-stretch`, `data-node-id`) — **do not** copy those; express the design intent with `gap`, `px`/`py`, `h-*`/`size-*`.
- For darken-on-hover that Figma expresses as a black/white overlay, use `color-mix` (e.g. `hover:bg-[color-mix(in_srgb,var(--destructive)_90%,black)]`), not opacity `/90` (which lightens on light backgrounds).

## Every component change touches 3 places

1. `src/components/.../<name>.tsx` — the component.
2. `src/components/.../<name>.stories.tsx` — stories: one per variant/state + an `AllVariants`; `tags: ["autodocs"]`.
3. `src/index.ts` (and the component's `index.ts` for custom components) — exports. Renaming a `cva` variant key or an exported type is **breaking** for consumers; update stories + exports in the same change so `tsc --noEmit` stays green.

## Reference: button + typography APIs (current)

- **Button** sizes: `xs sm md(default) lg xl` + `icon-xs icon-sm icon icon-lg icon-xl`. Heights 24/28/32/36/40, radii 8/10/12/12/12. Variants: `default` (solid primary), `destructive` (light-red fill, default destructive), `destructiveSolid` (solid red, alt), `secondary` (flat neutral), `outline`, `ghost`, `link`. Has a `loading` prop (dependency-free spinner).
- **Typography**: `size` (xs→7xl) × `weight` (regular/medium/semibold/bold/black), `as` for the element. Sizes ≤ lg → `font-sans`; xl+ → `font-display`; lg/xl carry `tracking-[0.01em]`.

## Verify

From `bethere-ucl/`: `npm run lint` then `npm run build`. Optionally `npm run build-storybook` to confirm CSS/font.
