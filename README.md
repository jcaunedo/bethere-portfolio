# Bethere UCL (Unified Content Library)

Shared React component library for all Bethere frontend applications.

## Tech Stack

- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui (new-york style)
- Storybook 10
- tsup (ESM bundling)

## Getting Started

```bash
npm install
npm run storybook
```

Storybook launches on [http://localhost:6006](http://localhost:6006) where you can browse all components, variants, and the color palette.

## Commands

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `npm run storybook`       | Launch Storybook dev server (port 6006) |
| `npm run build`           | Build library to `dist/`                |
| `npm run dev`             | Build in watch mode                     |
| `npm run lint`            | Type-check with TypeScript              |
| `npm run build-storybook` | Build static Storybook site             |

## Using in a Bethere App

`@bethere-group/ucl` is published to **GitHub Packages** (private, under the
`bethere-group` org). Consuming apps need a root `.npmrc` that points the
`@bethere-group` scope at GitHub Packages:

```
@bethere-group:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set `NPM_TOKEN` to a GitHub Personal Access Token with the `read:packages`
scope (in your shell env or `~/.npmrc`). Then install the package:

```bash
npm install @bethere-group/ucl
```

Import the theme in your app's global CSS:

```css
@import "tailwindcss";
@import "@bethere-group/ucl/styles";
@source "../node_modules/@bethere-group/ucl/dist";
```

Load the **Google Sans Flex** webfont in your app's document `<head>` (the
package declares the `--font-sans`/`--font-display` tokens but does not fetch
the font itself). In a Next.js root layout:

```tsx
// src/app/layout.tsx
<head>
	<link rel='preconnect' href='https://fonts.googleapis.com' />
	<link
		rel='preconnect'
		href='https://fonts.gstatic.com'
		crossOrigin='anonymous'
	/>
	<link
		href='https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap'
		rel='stylesheet'
	/>
</head>
```

Use components:

```tsx
import { Button, Typography } from "@bethere-group/ucl";
```

## Publishing / Releases

Versions are bumped manually with `npm version` and published automatically by
CI when the new `package.json` version lands on `master`.

```bash
# 1. Commit all changes first (npm version requires a clean tree)
# 2. Bump the version (runs lint, tags vX.Y.Z, rebuilds dist)
npm run release:patch   # or release:minor / release:major
# 3. Push the commit + tag
git push && git push --tags
```

The [`publish.yml`](.github/workflows/publish.yml) workflow detects the version
change and publishes the package to GitHub Packages using the built-in
`GITHUB_TOKEN` (no separate secret required).

## Project Structure

```
src/
  index.ts                  # Public API exports
  lib/utils.ts              # cn() class merge utility
  styles/
    theme.css               # Design tokens (shipped to consumers)
    globals.css             # Storybook internal CSS
  components/
    ui/                     # shadcn primitives (Button, etc.)
    typography/             # Custom Typography component
    colors/                 # Color palette stories
```

## AI-Assisted Development

This repo includes a `CLAUDE.md` file that provides context for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) when working on this codebase. It documents component patterns, how to add or update components, and the library architecture. You can safely ignore this file for normal development.

## Julio Notes

cd bethere-ucl
git status
git pull --rebase origin master
git push

```bash
cd bethere-ucl
# Increase the version number and commit
npm run release:patch
# Push the code changes and tag
git push && git push --tags
```

## Practical guidance for your motion instructions:

Lead with variants for describing the animation itself; mention transitions only when tuning timing/easing on top of an already-correct motion.

Use variant:
If what you want matches an existing pattern, name the variant: "use revealVariants for this dropdown," "make the drawer use panelVariants," "this screen swap should use slideVariants." This is exactly how last turn's request worked — you didn't need to know enterTransition even existed to get the right feel.

Use transition:
Reference a transition by name only when the motion itself is fine but the feel of the timing is wrong — e.g. "make it use subtleSpring instead" or "this should feel snappier, use responsiveSpring."
If neither matches, describe it like a person, not a codebase: "slide left," "this should feel like a panel," "make it bouncier" — I'll map that to the closest existing pattern (or tell you if nothing fits and a new one is warranted, same as slideVariants didn't exist until you asked for it).
