# Control Size Scale

**Applies to:** buttons, inputs, selects, search inputs, numeric inputs — and future controls: pills, button groups, toggles, segmented controls.

All interactive form controls share one 5-step height scale. Using a single scale across all controls keeps forms and toolbars visually aligned without per-component size negotiation.

## Scale

| Token | Height | Tailwind | Role                                         |
| ----- | ------ | -------- | -------------------------------------------- |
| `xs`  | 24 px  | `h-6`    | Very compact — dense toolbars, tags          |
| `sm`  | 28 px  | `h-7`    | Compact — secondary toolbars, inline forms   |
| `md`  | 32 px  | `h-8`    | Dense / default-small                        |
| `lg`  | 36 px  | `h-9`    | **Default ★** — most surfaces in the product |
| `xl`  | 40 px  | `h-10`   | Large / emphasis — hero forms, onboarding    |

`lg` is the product default. Use it unless a specific density requirement forces otherwise. Never mix sizes within a single row/toolbar.

## CSS custom properties

The scale is declared in `src/styles/theme.css` (`@theme inline` block) as `--control-h-{step}` and is available as CSS custom properties for consumers who need the raw values.

```css
--control-h-xs: 1.5rem; /* 24px */
--control-h-sm: 1.75rem; /* 28px */
--control-h-md: 2rem; /* 32px */
--control-h-lg: 2.25rem; /* 36px */
--control-h-xl: 2.5rem; /* 40px */
```

## Component support

| Component      | Sizes supported        | Default |
| -------------- | ---------------------- | ------- |
| `Button`       | xs · sm · md · lg · xl | `lg`    |
| `Input`        | xs · sm · md · lg · xl | `lg`    |
| `SearchInput`  | xs · sm · md · lg · xl | `lg`    |
| `NumericInput` | xs · sm · md · lg · xl | `lg`    |
| `Select`       | xs · sm · md · lg · xl | `lg`    |

> Future components (pill, toggle, button group, segmented control) must implement the same `size` prop with these five steps and the same `lg` default.

## Usage

```tsx
// Default (lg — 36 px)
<Button>Save</Button>
<Input placeholder="Email" />
<Select><SelectTrigger>…</SelectTrigger></Select>

// Compact row
<Button size="sm">Filter</Button>
<Input size="sm" placeholder="Search…" />

// Large / hero form
<Button size="xl">Get started</Button>
<Input size="xl" placeholder="Your email" />
```
