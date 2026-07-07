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
- **Components:** shadcn/ui primitives in `src/components/ui/`, custom components in `src/components/<name>/`
- **Storybook:** `@storybook/react-vite` with `@tailwindcss/vite` plugin for Tailwind processing

## Adding a shadcn Primitive

```bash
npx shadcn add <component>
```

This scaffolds the component into `src/components/ui/`. Then:

1. Create a story file: `src/components/ui/<component>.stories.tsx`
2. Export from `src/index.ts`

## Creating a Custom Component

Create a directory under `src/components/<name>/` with three files:

### `<name>.tsx` — Component file

- Use `cva` (class-variance-authority) for variant management
- Use `cn()` from `@/lib/utils` for class merging
- Use `React.forwardRef` for ref forwarding
- Type props with `VariantProps<typeof variants>` intersected with HTML element props

### `<name>.stories.tsx` — Storybook stories

- Set `tags: ["autodocs"]` for auto-generated docs
- Create individual stories for each variant/state
- Include an `AllVariants` story showing everything at once

### `index.ts` — Re-exports

- Re-export the component, variants, and types

Then add the exports to `src/index.ts`.

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

```tsx
import { Button, Typography } from "@bethere-group/ucl";
```
