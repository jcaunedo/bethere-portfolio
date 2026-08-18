# BeThere UCL (Unified Content Library)

Shared React component library for all BeThere frontend applications. Built with Tailwind CSS 4, shadcn/ui, and TypeScript.

## Quick Reference

| Command                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `npm run build`           | Build library to `dist/` (ESM + types + CSS) |
| `npm run dev`             | Watch mode build                             |
| `npm run storybook`       | Launch Storybook on port 6006                |
| `npm run build-storybook` | Build static Storybook site                  |
| `npm run lint`            | Type-check with `tsc --noEmit`               |

## Architecture

- **Package:** `@bethere-group/ucl`, ESM-only, published to **GitHub Packages** (`https://npm.pkg.github.com`) under the `bethere-group` org
- **Build:** tsup bundles `src/index.ts` → `dist/index.js` + `dist/index.d.ts`; CSS is copied raw to `dist/styles.css`
- **Styling:** Two CSS files:
  - `src/styles/theme.css` — design tokens, `@theme inline`, CSS variables. This is what consumers import (`dist/styles.css`)
  - `src/styles/globals.css` — imports Tailwind + tw-animate-css + theme.css. Used only by Storybook internally
- **Components:** one folder per component, grouped by family under `src/components/<family>/<name>/`. Families: `forms/`, `buttons/`, `overlays/`, `data-display/`, `feedback/`, `cards/`, plus `typography/`. Each folder holds `<name>.tsx`, `<name>.stories.tsx`, an `index.ts` barrel, and (later) `<name>.test.tsx`. Internal cross-component imports use the `@/components/<family>/<name>` alias (the folder `index.ts`), never a deep relative path.
- **Forms & Formik:** primitives (`Input`, `Select`, …) stay Formik-agnostic. Formik-connected fields (`FormikInput`, `FormikSelect`, …) live beside their primitive in `forms/<name>/formik-<name>.tsx` and share `forms/field/` (`FormField` shell + internal `useFormikField` hook). `formik` is an **optional** peer dependency (see "Formik Fields" below).
- **Storybook:** `@storybook/react-vite` with `@tailwindcss/vite` plugin for Tailwind processing. Story `title`s follow the family taxonomy (e.g. `Forms/Input`, `Buttons/Button`)

## Adding a shadcn Primitive (scaffold → relocate)

The shadcn CLI writes a flat file into `src/components/ui/`, which is only a **staging** dir here. After scaffolding, relocate the component into its family folder:

```bash
npx shadcn add <component>
```

1. Move `src/components/ui/<component>.tsx` → `src/components/<family>/<component>/<component>.tsx` (choose the family: `forms`, `buttons`, `overlays`, `data-display`, `cards`).
2. Rewrite its sibling-component imports to the `@/components/<family>/<name>` alias.
3. Add `src/components/<family>/<component>/index.ts` re-exporting the component + variants + types.
4. Create `<component>.stories.tsx` in the same folder with `title: "<Family>/<Component>"`.
5. Export from `src/index.ts`, then delete the now-empty `src/components/ui/`.

## Creating a Custom Component

Create a directory under `src/components/<family>/<name>/` with three files (see `forms/field/` or `typography/` as templates):

### `<name>.tsx` — Component file

- Use `cva` (class-variance-authority) for variant management
- Use `cn()` from `@/lib/utils` for class merging
- Use `React.forwardRef` for ref forwarding
- Type props with `VariantProps<typeof variants>` intersected with HTML element props

### `<name>.stories.tsx` — Storybook stories

- Set `tags: ["autodocs"]` for auto-generated docs, and `title: "<Family>/<Component>"`
- Create individual stories for each variant/state
- Include an `AllVariants` story showing everything at once

### `index.ts` — Re-exports

- Re-export the component, variants, and types

Then add the exports to `src/index.ts`.

## Motion System

Use Motion for React from `motion/react`.

Motion is part of the product design system and brand language. It should provide clear feedback, preserve spatial relationships, and make interactions feel responsive without distracting from the user's task.

### Core Principles

Every animation should:

- Explain a change in state.
- Preserve spatial continuity.
- Reinforce interaction hierarchy.
- Reduce cognitive load.
- Feel immediate and responsive.
- Support the user's task instead of delaying it.

Do not add animation only for decoration. If an animation does not improve clarity, feedback, orientation, or perceived responsiveness, do not implement it.

When uncertain, choose the more subtle option.

### Brand Motion Personality

The product's motion should feel:

- Calm
- Refined
- Natural
- Fluid
- Human
- Confident
- Premium
- Responsive

Avoid motion that feels:

- Bouncy
- Cartoonish
- Hyperactive
- Mechanical
- Aggressive
- Game-like
- Excessively elastic
- Visually distracting

Motion should feel polished and approachable, not playful or theatrical.

### Motion Language

Prefer these movement patterns:

- Fade
- Soft scale
- Gentle elevation
- Short directional slide
- Crossfade
- Shared-element transition
- Smooth layout transition
- Subtle stagger
- Progressive reveal

Use sparingly:

- Rotation under 2 degrees
- Background parallax
- Scroll-linked movement
- Decorative sequencing
- Expressive spring motion

Avoid unless explicitly required:

- Bounce
- Shake
- Spin
- Large rotation
- Elastic overshoot
- Full-screen wipes
- Dramatic zoom transitions
- Long travel distances

### Motion Tokens

All motion values must be centralized and reusable.

Create or reuse motion tokens for:

- Duration
- Easing
- Spring behavior
- Movement distance
- Scale
- Stagger
- Delay

Do not introduce arbitrary timing or easing values directly inside components unless there is a documented exception.

Recommended timing ranges:

- Instant feedback: 100–150 ms
- Hover and press feedback: 120–180 ms
- Standard UI transitions: 180–240 ms
- Panels and overlays: 220–300 ms
- Page-level transitions: 250–350 ms
- Storytelling transitions: up to 450 ms

Avoid transitions longer than 450 ms unless the experience is intentionally cinematic or narrative-driven.

### Easing

Use easing based on interaction intent.

#### Standard

Use for common UI transitions.

- Smooth acceleration
- Controlled deceleration
- No visible overshoot

#### Enter

Use for elements entering the interface.

- Start quickly
- Finish gently
- Emphasize arrival without feeling slow

#### Exit

Use for elements leaving the interface.

- Shorter than enter transitions
- Minimal delay
- Clear and decisive

#### Spring

Use springs for:

- Direct manipulation
- Drag interactions
- Press feedback
- Shared-element movement
- Responsive layout changes

Avoid expressive or high-bounce springs unless explicitly required by the product experience.

### Spatial Rules

Keep movement distances proportional to the interaction.

Recommended ranges:

- Hover movement: 2–4 px
- Small element reveal: 4–8 px
- Component transition: 8–16 px
- Panel transition: 16–32 px
- Page transition: 24–48 px

Avoid moving interface elements over large distances when opacity, scale, or layout animation would communicate the change more clearly.

Movement should follow the spatial direction of the interaction.

Examples:

- A panel opening from the right should move from the right.
- A dropdown should originate near its trigger.
- Expanded content should grow from its existing position.
- A selected card transitioning to detail should preserve the card's visual origin.

### Motion Vocabulary

Use these named patterns consistently across the product.

#### Lift

Use for hoverable cards and interactive surfaces.

Behavior:

- Translate upward by 2 px.
- Optionally increase elevation.
- Optionally scale media slightly.
- Use a subtle spring or short ease-out transition.

Do not apply strong scaling or exaggerated shadows.

#### Press

Use for buttons, cards, and direct interactions.

Behavior:

- Scale between 0.98 and 0.99 while pressed.
- Return immediately on release.
- Use a responsive spring.

Press feedback must not affect surrounding layout.

#### Reveal

Use when content appears in context.

Behavior:

- Fade from 0 to 1.
- Move vertically by approximately 8 px.
- Use a short enter transition.

Avoid using Reveal for every element on a page.

#### Expand

Use when an existing component changes size.

Behavior:

- Use Motion layout animation.
- Preserve the component's visual origin.
- Fade secondary content when necessary.
- Avoid manually animating width or height when `layout` can handle the transition.

#### Connect

Use for shared-element transitions.

Behavior:

- Use `layoutId`.
- Preserve continuity between list, card, gallery, and detail states.
- Keep duration controlled and avoid large scale distortion.

#### Flow

Use for small groups of related items entering together.

Behavior:

- Use subtle staggering.
- Keep stagger intervals short.
- Use only when sequencing improves readability.

Do not stagger long lists or frequently updated content.

#### Glide

Use for directional navigation.

Behavior:

- Apply a short horizontal or vertical movement.
- Match the direction of navigation.
- Combine with opacity when needed.

Avoid full-page sliding unless the spatial model clearly supports it.

#### Dismiss

Use when content is removed or closed.

Behavior:

- Fade out.
- Optionally move downward or toward its origin.
- Use a shorter transition than the corresponding entrance.

#### Confirm

Use for lightweight success feedback.

Behavior:

- Use a subtle scale or opacity change.
- Keep the feedback brief.
- Do not create celebratory animation unless explicitly required.

#### Focus

Use to draw attention to a newly active or selected element.

Behavior:

- Use a subtle scale, highlight, or layout transition.
- Do not pulse continuously.
- Do not compete with primary content.

### Component Guidance

#### Buttons

Use:

- Press scale between 0.98 and 0.99.
- Fast release.
- Subtle hover feedback where appropriate.
- Immediate visual response.

Do not:

- Bounce buttons.
- Delay the action until the animation completes.
- Animate dimensions.
- Add decorative loops.

#### Cards

Use:

- Lift on hover.
- Subtle image scaling between 1.01 and 1.03.
- Press feedback.
- Shared-element transitions when opening detail views.

Do not:

- Apply large card scaling.
- Continuously animate shadows.
- Add motion to non-interactive cards.
- Combine multiple competing effects.

#### Inputs

Use motion to clarify:

- Focus
- Validation
- Errors
- Helper text
- Success states
- Conditional fields

Preserve layout stability when helper or validation content appears.

Do not shake inputs for validation errors unless explicitly required.

#### Menus and Dropdowns

Use:

- Short fade.
- Small directional movement from the trigger.
- Controlled scale from approximately 0.98 to 1 when appropriate.

Maintain correct focus management and keyboard behavior.

#### Dialogs and Overlays

Use:

- `AnimatePresence` for enter and exit.
- Overlay fade.
- Small scale or vertical movement for the dialog surface.
- Shorter exit timing than entrance timing.

Do not delay dialog usability while the entrance animation completes.

#### Drawers and Panels

Use:

- Directional motion from the panel's origin.
- Overlay fade.
- Controlled duration between 220 and 300 ms.
- Layout animation for internal content changes.

#### Tabs

Use:

- Shared layout animation for the active indicator.
- Crossfade or small directional transition for tab content when useful.
- Immediate keyboard response.

Do not animate the active indicator independently from the selected tab state.

#### Accordions

Use:

- Motion layout animation.
- Optional content fade.
- Preserved spatial continuity.

Avoid manually animating fixed heights.

#### Lists

Use:

- Layout animation for reorder and removal.
- `AnimatePresence` for mounted and unmounted items.
- Stable unique keys.
- Subtle stagger only for short initial lists.

Do not replay entrance animations during routine data updates.

#### Toasts and Notifications

Use:

- Short directional entrance.
- Controlled exit.
- Layout animation when multiple notifications stack.
- Immediate interaction availability.

#### Skeletons and Loading States

Prefer:

- Subtle opacity pulse.
- Lightweight shimmer.
- Progress indicators for longer processes.

Avoid aggressive or high-contrast loading animation.

### Layout Animation

Prefer Motion layout animation when elements change position or size.

Use `layout` for:

- Expanding sections
- Accordions
- Reordered cards
- Filter changes
- Responsive component changes
- Dynamic content updates

Use `layoutId` for:

- Active tab indicators
- Selected filters
- Shared card-to-detail transitions
- Gallery thumbnails
- Navigation indicators
- Persistent media

Use `layoutScroll` when layout animation occurs inside a scrollable container.

Use `layoutRoot` when layout animation occurs inside a fixed-position container.

Do not recreate layout animation using manual position calculations when Motion can manage it.

### Enter and Exit Animation

Use `AnimatePresence` when elements mount or unmount.

Requirements:

- Direct children must have stable, unique keys.
- Exit animation must complete before the element is removed.
- Rapid repeated interactions must not leave stale or duplicated elements.
- Do not use array indexes as keys for dynamic animated lists.

Do not use `AnimatePresence` for elements that remain mounted and only change state.

### Page Transitions

Page transitions should reinforce continuity between destinations.

Prefer:

- Crossfade
- Small vertical movement
- Shared-element transition
- Persistent layout regions
- Consistent content entrance

Avoid:

- Large horizontal page slides without a clear spatial model
- Full-screen wipes
- Dramatic zoom
- Excessive sequencing
- Blocking navigation during transitions

Page transitions should not replay unnecessarily when only query parameters or minor content states change.

### Scroll Motion

Use scroll-triggered and scroll-linked motion selectively.

Use `whileInView` for:

- Editorial content
- Marketing sections
- Discovery pages
- One-time content reveals

Use:

```tsx
viewport={{ once: true, amount: 0.25 }}
```

as a reasonable default when the animation should only play once.

Use `useScroll` and `useTransform` for:

- Progress indicators
- Controlled parallax
- Sticky storytelling sections
- Media transformations tied directly to scroll

Use `useSpring` to smooth scroll-linked values when needed.

Avoid scroll motion in dense operational workflows unless it improves orientation or feedback.

Do not hijack native scrolling.

### Gesture Motion

Use Motion gestures for:

- Hover
- Press
- Drag
- Pan
- Swipe
- Direct manipulation

Gesture feedback must:

- Begin immediately.
- Follow the user's input.
- Remain interruptible.
- Return to a stable state.
- Preserve keyboard alternatives.
- Avoid blocking scrolling unintentionally.

Do not use drag behavior without clear affordances and constraints.

### Accessibility

Always respect reduced-motion preferences.

Use Motion's reduced-motion utilities or `prefers-reduced-motion`.

When reduced motion is enabled:

- Remove nonessential transforms.
- Disable parallax.
- Disable decorative sequencing.
- Disable large shared-element movement.
- Replace directional transitions with opacity when appropriate.
- Preserve state-change feedback.
- Preserve loading and progress communication.
- Avoid removing feedback required to understand the interface.

Motion must never be the only way a state change is communicated.

Maintain:

- Keyboard navigation
- Focus order
- Visible focus states
- Screen-reader semantics
- Pointer and touch access
- Sufficient contrast

### Performance

Prefer animating:

- `opacity`
- `transform`
- `width`
- `height`

Use sparingly:

- `filter`
- `clip-path`
- Large-scale SVG animation

Avoid continuously animating:

- `top`
- `left`
- `margin`
- `padding`
- `box-shadow`
- Large blur effects

Prefer layout animation over manually animating layout properties.

Avoid simultaneous animation of large numbers of elements.

Do not add continuous animation to background elements without a clear product purpose.

### Implementation Rules

When implementing motion:

- Import Motion APIs from `motion/react`.
- Reuse existing motion tokens and variants.
- Reuse named motion patterns before creating new ones.
- Keep motion configuration centralized.
- Keep animations interruptible.
- Preserve existing component behavior.
- Preserve styling unless changes are explicitly requested.
- Preserve accessibility and keyboard behavior.
- Remove conflicting CSS transitions when Motion replaces them.
- Do not animate the same property with CSS and Motion simultaneously.
- Avoid creating one-off animation values inside components.
- Avoid introducing a second animation library.
- Avoid JavaScript-driven animation when CSS or Motion can handle it declaratively.
- Use variants for repeated animation states.
- Use semantic names such as `reveal`, `lift`, `dismiss`, and `expand`.
- Do not use implementation names such as `animation1` or `variantA`.
- Document exceptions when an interaction requires custom motion.

### Recommended File Structure

Use a centralized structure similar to:

```text
src/
  motion/
    tokens.ts
    transitions.ts
    variants.ts
    patterns.ts
    reduced-motion.ts
```

Possible responsibilities:

```text
tokens.ts
- durations
- distances
- scales
- stagger values

transitions.ts
- standard easing
- enter easing
- exit easing
- spring presets

variants.ts
- fade
- reveal
- dismiss
- expand
- overlay
- panel
- stagger container

patterns.ts
- lift
- press
- connect
- flow
- glide
- confirm

reduced-motion.ts
- reduced-motion helpers
- alternative transitions
```

Adapt the structure to the existing repository conventions. Do not create unnecessary abstraction for a small codebase.

### Example Token Direction

```ts
export const motionDuration = {
	instant: 0.1,
	fast: 0.16,
	normal: 0.24,
	slow: 0.32,
	deliberate: 0.4,
};

export const motionDistance = {
	subtle: 4,
	small: 8,
	medium: 16,
	large: 32,
};

export const motionScale = {
	press: 0.98,
	hover: 1.01,
	mediaHover: 1.03,
};

export const motionSpring = {
	subtle: {
		type: "spring",
		stiffness: 400,
		damping: 32,
	},
	responsive: {
		type: "spring",
		stiffness: 500,
		damping: 30,
	},
	layout: {
		type: "spring",
		stiffness: 350,
		damping: 35,
	},
};
```

These are baseline values. Reuse existing design-system values when they already exist.

### Implementation Workflow

Before adding motion to an existing feature:

1. Inspect the current component boundaries.
2. Identify where state is owned.
3. Identify mount and unmount behavior.
4. Identify existing CSS transitions.
5. Identify layout and overflow constraints.
6. Identify keyboard and focus behavior.
7. Determine whether the interaction requires state animation, layout animation, presence animation, or gesture animation.
8. Reuse the existing motion vocabulary and tokens.
9. Implement the smallest effective motion treatment.
10. Validate behavior under rapid interaction and reduced motion.

For complex animation work, provide a concise implementation plan before modifying files.

### Validation Requirements

After implementing motion, verify:

- The project builds successfully.
- TypeScript checks pass.
- Existing tests pass.
- There are no hydration warnings.
- There is no flash before the initial animation.
- There is no unintended layout shift.
- Exit animations complete correctly.
- Rapid repeated interactions do not break state.
- Animations remain interruptible.
- Keyboard behavior remains intact.
- Focus is preserved or intentionally reassigned.
- Reduced-motion behavior works.
- Animation does not block clicks, scrolling, or navigation.
- Mobile and touch interactions remain usable.
- No duplicate animation systems were introduced.
- Only relevant files were changed.

When reporting completed work, summarize:

- The interaction implemented
- The motion pattern used
- The tokens or variants reused
- The files changed
- The validation performed

## Formik Fields

Consumers build forms with **Formik + Yup**. UCL ships Formik-connected fields so they don't hand-roll `useField` wrappers.

- **Primitives stay pure.** `Input`, `Textarea`, `NumericInput`, `SearchInput`, `Select`, `Combobox`, `DatePicker` never import `formik` — they work in Storybook, tests, and non-form contexts.
- **`Formik*` fields** live next to their primitive (`forms/<name>/formik-<name>.tsx`), take a required `name` plus optional `label`/`description`/`required`, call `useFormikField(name)` internally, render the control inside `FormField` (label + error + description), and wire `aria-invalid`/`aria-describedby`.
  - Native-value inputs bridge via `{...field}` spread.
  - Custom-contract components (`Select`, `Combobox`, `DatePicker`) bridge via `helpers.setValue` / `helpers.setTouched` because they emit `onValueChange`, not a native `onChange`.
- **`formik` is an optional peer dependency** (`peerDependenciesMeta.formik.optional`) and is externalized by tsup. Consumers importing only non-form components tree-shake it away. **Yup is a consumer concern** — validation schemas live in the apps, not here.
- To add a field for a new input: create `forms/<name>/formik-<name>.tsx`, reuse `FormField` + `useFormikField` from `@/components/forms/field`, add a `formik-<name>.stories.tsx` (wrap stories in `<Formik>`), and export from the folder `index.ts` + `src/index.ts`.

## Updating an Existing Component

- Modify the component file directly
- Update stories if the API surface changed
- Update `src/index.ts` exports if types were added/removed
- Run `npm run lint` to verify types

## Key Files

| File                     | Purpose                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `src/index.ts`           | Public API — all consumer-facing exports                             |
| `src/styles/theme.css`   | Design tokens, `@theme inline`, CSS variables — shipped to consumers |
| `src/styles/globals.css` | Storybook entry CSS — imports Tailwind + theme                       |
| `src/lib/utils.ts`       | `cn()` class merge utility                                           |
| `components.json`        | shadcn CLI configuration                                             |
| `tsup.config.ts`         | Library build configuration                                          |
| `.storybook/main.ts`     | Storybook + Tailwind + path alias setup                              |

## Updating Colors

All color variables live in `src/styles/theme.css`:

- **Semantic colors** (primary, secondary, muted, etc.) — used by shadcn components via `@theme inline` mappings
- **Brand colors** (brand-50 through brand-950) — custom palette for BeThere branding, usable as `bg-brand-500`, `text-brand-700`, etc.
- **Dark mode** — override values in the `.dark` block

To add a new color scale, add variables to `@theme inline`, `:root`, and `.dark` blocks in `theme.css`.

## Release & Publishing

- **Registry:** GitHub Packages (`https://npm.pkg.github.com`), org `bethere-group`. Default branch is `master`.
- **Version bump:** manual via `npm run release:patch|minor|major` (wraps `npm version`). `preversion` runs `npm run lint`; `npm version` bumps `package.json`, commits, and tags `vX.Y.Z`; `postversion` runs `npm run build`.
- **Publish:** `.github/workflows/publish.yml` triggers on pushes to `master` filtered to `package.json`, diffs the version against `HEAD~1`, and only publishes when it changed. Auth uses the built-in `secrets.GITHUB_TOKEN` (`packages: write`) — no PAT needed to publish.
- **Release flow:** commit changes → `npm run release:*` → `git push && git push --tags`.
- **`.npmrc`:** the repo root `.npmrc` scopes `@bethere-group` to GitHub Packages and reads the auth token from `${NPM_TOKEN}` (expanded at runtime, no secret committed).

## Consumer Integration

Consumers need a root `.npmrc` scoping `@bethere-group` to GitHub Packages plus an `NPM_TOKEN` (a GitHub PAT with `read:packages`):

```
@bethere-group:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

```bash
npm install @bethere-group/ucl
```

```css
/* In the consuming app's global CSS */
@import "tailwindcss";
@import "@bethere-group/ucl/styles";
@source "../node_modules/@bethere-group/ucl/dist";
```

The `@source` directive tells Tailwind to scan UCL's bundled JS for utility class names so it generates them in the consumer's build.

**Webfont:** `dist/styles.css` intentionally does **not** `@import` the "Google Sans Flex" webfont (a render-blocking `url()` @import in distributed CSS is invalid once the consumer imports Tailwind first, and warns at build time). It only declares the `--font-sans`/`--font-display` tokens. The consuming app must load the font in its document `<head>` — e.g. `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap">` (with `preconnect` hints) in the Next.js root layout, or `next/font`.

```tsx
import { Button, Typography } from "@bethere-group/ucl";
```

**Forms** (requires `formik` installed in the consumer):

```tsx
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormikInput, FormikSelect, Button } from "@bethere-group/ucl";

const schema = Yup.object({
	email: Yup.string().email().required("Email is required."),
	country: Yup.string().required("Pick a country."),
});

<Formik
	initialValues={{ email: "", country: "" }}
	validationSchema={schema}
	onSubmit={(values) => {
		/* … */
	}}
>
	<Form>
		<FormikInput name='email' label='Email' placeholder='you@example.com' />
		<FormikSelect
			name='country'
			label='Country'
			options={[
				{ value: "us", label: "United States" },
				{ value: "br", label: "Brazil" },
			]}
		/>
		<Button type='submit'>Save</Button>
	</Form>
</Formik>;
```

## product-specs writing conventions/

Writing conventions for every spec doc under `product-specs/`. Not a product spec itself — no product content belongs here.

### Status labels

Every inline prose note that flags a gap, risk, decision, confirmation, or fix gets an emoji **plus a bold word label** naming what kind of note it is. The label goes immediately after the emoji, before the explanation.

- ⚠️ for anything unresolved, misaligned, or needing attention — paired with a bold label naming the specific kind of issue: `**Gap:**`, `**Constraint:**`, `**Risk:**`, `**Decision needed:**`, `**Accessibility:**`, or another word that accurately describes the note. Don't default to "Gap" if a more specific word fits better.
- ✅ for anything verified resolved, confirmed, or matching — paired with a bold label naming what was resolved: `**Resolved:**`, `**Confirmed in Figma:**`, `**Copy fix:**`, or similar.
- ℹ️ for purely informative or framing notes — context, scope clarification, "here's why this note exists" — with **no bold label**. If it's not actually flagging a problem or a fix, it isn't ⚠️ or ✅.

Examples:

> ⚠️ **Gap:** exact thresholds and weighting are not yet defined — see Open Questions.
>
> ✅ **Confirmed in Figma (2026-08-05):** the performance scale renders left-to-right as At Risk → Off Track → On Track.
>
> ℹ️ Note: the desktop and mobile widget orders intentionally differ per the source design notes.

**Where this applies:** inline prose notes (sentences/paragraphs within a section). Not needed on already-scannable bulleted lists where every line starts with the same emoji (e.g. a "Key Decisions" or "Open Questions" list) — the list structure itself already provides the scan pattern.

**Why:** specs need to be scannable for status at a glance. The emoji alone isn't enough — the word names the status so a reader isn't relying on color/icon recognition alone, and isn't misled into treating framing text as an open risk (or vice versa).

### Creation header

New documentation files in this folder should open with an HTML comment block recording the creation date, who created it, and the last-updated date — no prompt/source quote. Update `Last updated:` whenever the file's content changes:

```html
<!--
Created: Aug 09, 2026
Created by: Julio Caunedo
Last updated: Aug 09, 2026
Scope: one or two lines on which spec doc(s) this file governs.
Purpose: one or two lines on why the file exists.
-->
```
