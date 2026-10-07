# UCL layout conventions (for ucl-generate-layout)

File skeletons for a `src/layouts/<name>/` reference layout. These are full-page compositions, not library primitives — lint/build must stay green, but they are intentionally excluded from `src/index.ts`.

For Tailwind breakpoints (used for responsive grid/flex splits like the hero/form column layout), see the shared [ucl-conventions.md](../../ucl-generate-component/references/ucl-conventions.md#tailwind-breakpoints).

## File layout

- Layout: `bethere-ucl/src/layouts/<name>/<name>.tsx` (kebab-case folder + file).
- Stories: `bethere-ucl/src/layouts/<name>/<name>.stories.tsx`.
- Images: `bethere-ucl/src/layouts/<name>/images/*` — every exported Figma asset (photos, logos, illustrations) lives here, never loose in the layout's root folder.
- No `index.ts`, no export from `src/index.ts`.
- Name: kebab-case file/folder, PascalCase component export.
- **Screens that belong to a multi-screen flow nest under that flow's folder**, not at `src/layouts/` root:
  - `account-settings/pages/<page>/<page>.tsx` — Account Settings pages (story title `Layouts/AccountSettings/<Page>`).
  - `new-listing/steps/<step>/<step>.tsx` exporting `<Name>Step` — New Listing wizard steps (story title `Layouts/NewListing/<Name>`), rendering its content inside the shared `NewListingLayout` shell (`new-listing/new-listing.tsx`, like `AccountSettingsLayout`) and wired into `new-listing/new-listing-flow.stories.tsx` (`Layouts/NewListing/Flow`) plus the New Listing `storySort` order in `.storybook/preview.ts`. Name a step with **one word for what it collects** (`search`, `attributes`, `expectations`, `availability`), distinct from the existing steps, never for one category ("yacht-…") or listing type ("experience-…"), and without prefixes the `steps/` path already implies ("asset-", "listing-"). See `src/layouts/new-listing/README.md`.
  - Helpers shared by a flow's screens go in `<flow>/shared/`.
  - When a Figma frame is a New Listing step (Provider Portal "N. …" frames with the Stepper Experience header), it's a new `new-listing/steps/<step>/` — ask for the step name if its purpose isn't obvious.

## Component skeleton

```tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { SocialLoginOptions } from "@/components/ui/social-login-options";
import heroImage from "./images/hero.png";
// …import every piece this page composes from existing UCL exports

/** Full-page reference layout. Figma origin: <file> → <frame name>. */
function <Name>() {
  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="relative">
        {/* hero image / illustration column */}
      </div>
      <div className="flex flex-col items-center justify-center gap-6 px-8">
        {/* logo, heading, form, etc. — composed from existing components */}
      </div>
    </div>
  );
}

export { <Name> };
```

## Stories skeleton

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { <Name> } from "./<name>";

const meta: Meta<typeof <Name>> = {
  title: "Layouts/<Name>",
  component: <Name>,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen", // renders full-bleed, no Storybook canvas padding
  },
};
export default meta;
type Story = StoryObj<typeof <Name>>;

export const Default: Story = {};
```

## Composition rules

- **Instances → existing components, always try this first.** A Figma instance named after (or shaped like) an existing export — `Input`, `button`, `Social Buttons Container` → `SocialLoginOptions` — should become that component, not hand-rolled markup.
- **Structure-only markup is fine inline.** Grid/flex wrappers, spacing, section containers — plain `div`s with Tailwind utilities and tokens (`bg-card`, `gap-6`, `rounded-2xl`, etc.), same restriction as components: never raw hex/px.
- **Real copy, not lorem ipsum.** Pull actual heading/body/button text from the Figma text nodes.
- **Exported images go in `images/`.** Download with `download_assets`, save under `src/layouts/<name>/images/`, import with a relative path (`./images/hero.png`). Add a `*.png`/`*.jpg`/`*.svg` ambient module declaration (see `src/layouts/assets.d.ts`) if one doesn't already cover the extension.
- **Don't add a local index.ts or a `src/index.ts` export.** Layouts are previewed via Storybook only, per this skill's design.

## Verify (from `bethere-ucl/`)

- `npm run lint` (`tsc --noEmit`) — must pass.
- `npm run build` — must succeed.
- Storybook preview: `npm run storybook`, then open `http://localhost:6006/iframe.html?id=layouts-<name>--default&viewMode=story` — full-bleed, no Storybook chrome, thanks to `layout: "fullscreen"`.
