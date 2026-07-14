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
    <FormikInput name="email" label="Email" placeholder="you@example.com" />
    <FormikSelect
      name="country"
      label="Country"
      options={[
        { value: "us", label: "United States" },
        { value: "br", label: "Brazil" },
      ]}
    />
    <Button type="submit">Save</Button>
  </Form>
</Formik>;
```
