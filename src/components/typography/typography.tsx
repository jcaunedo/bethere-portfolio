import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Type scale from the Bethere design system (Figma: bethere.ds).
 * `size` carries font-size + line-height (via the --text-* tokens) plus the
 * design-system font assignment: sizes up to `lg` use the body font, `xl` and
 * larger use the display/headline font. `weight` is an independent axis.
 */
const typographyVariants = cva("", {
  variants: {
    size: {
      xs: "font-sans text-xs",
      sm: "font-sans text-sm",
      base: "font-sans text-base",
      lg: "font-sans text-lg tracking-[0.01em]",
      xl: "font-display text-xl tracking-[0.01em]",
      "2xl": "font-display text-2xl",
      "3xl": "font-display text-3xl",
      "4xl": "font-display text-4xl",
      "5xl": "font-display text-5xl",
      "6xl": "font-display text-6xl",
      "7xl": "font-display text-7xl",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      black: "font-black",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
  },
});

type TypographySize = NonNullable<
  VariantProps<typeof typographyVariants>["size"]
>;
type TypographyWeight = NonNullable<
  VariantProps<typeof typographyVariants>["weight"]
>;

/**
 * Heading definitions, from the bethere.ds text-style descriptions:
 * `2xl/2xl -semibold` is h1 (also page and modal titles), `xl/xl -semibold`
 * is h2, `lg/lg -semibold` is h3. Rendering `as="h1" | "h2" | "h3"` without
 * `size`/`weight` applies these. Pass `size`/`weight` to override for a Figma
 * frame that binds something else. See DESIGN.md "Heading element →
 * `Typography` `size` pairing".
 */
const typographyHeadings = {
  h1: { size: "2xl", weight: "semibold" },
  h2: { size: "xl", weight: "semibold" },
  h3: { size: "lg", weight: "semibold" },
} as const satisfies Record<string, { size: TypographySize; weight: TypographyWeight }>;

type TypographyHeading = keyof typeof typographyHeadings;

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  /**
   * Element to render. Defaults to a <p>. Use this for semantics, e.g. as="h1".
   * `h1`–`h3` also default `size`/`weight` to the heading definitions
   * (`typographyHeadings`).
   */
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, size, weight, as, children, ...props }, ref) => {
    const Component = as ?? "p";
    const heading =
      typeof Component === "string" && Component in typographyHeadings
        ? typographyHeadings[Component as TypographyHeading]
        : undefined;

    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({
            size: size ?? heading?.size,
            weight: weight ?? heading?.weight,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Typography.displayName = "Typography";

export {
  Typography,
  typographyVariants,
  typographyHeadings,
  type TypographyHeading,
  type TypographyProps,
  type TypographySize,
  type TypographyWeight,
};
