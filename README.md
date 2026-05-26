# BeThere UCL (Unified Content Library)

Shared React component library for all BeThere frontend applications.

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

| Command | Description |
|---------|-------------|
| `npm run storybook` | Launch Storybook dev server (port 6006) |
| `npm run build` | Build library to `dist/` |
| `npm run dev` | Build in watch mode |
| `npm run lint` | Type-check with TypeScript |
| `npm run build-storybook` | Build static Storybook site |

## Using in a BeThere App

Install the package:

```bash
npm install @bethere/ucl
```

Import the theme in your app's global CSS:

```css
@import "tailwindcss";
@import "@bethere/ucl/styles";
@source "../node_modules/@bethere/ucl/dist";
```

Use components:

```tsx
import { Button, Typography } from "@bethere/ucl";
```

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
