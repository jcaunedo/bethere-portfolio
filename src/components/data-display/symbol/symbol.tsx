import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Fill treatments for the mark. Figma `Property 1`: Gradient/Solid use the
 * brand orange (`--color-brand-500` / `--sunset-500`, #f26740). Gradient adds
 * a second stop (#b94220) that has no token equivalent — it is a one-off
 * decorative endpoint scoped to this asset. Black/White are flat foreground
 * and literal white.
 */
const symbolVariants = cva("h-9 w-auto shrink-0", {
  variants: {
    variant: {
      gradient: "",
      solid: "text-brand-500",
      black: "text-foreground",
      white: "text-white",
    },
  },
  defaultVariants: {
    variant: "black",
  },
});

type SymbolProps = React.ComponentProps<"svg"> &
  VariantProps<typeof symbolVariants>;

/** Bethere brand mark. Figma: bethere.ds `Bethere Symbol`. */
function Symbol({ className, variant = "black", ...props }: SymbolProps) {
  const gradientId = `bethere-symbol-gradient-${React.useId()}`;
  const isGradient = variant === "gradient";

  return (
    <svg
      data-slot="symbol"
      data-variant={variant}
      viewBox="0 0 32.3387 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(symbolVariants({ variant }), className)}
      {...props}
    >
      {isGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="16.1693"
            y1="14"
            x2="16.1693"
            y2="28"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F26740" />
            <stop offset="1" stopColor="#B94220" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M21.5831 0C22.7219 1.54032e-05 23.7701 0.168599 24.7278 0.505049C25.6855 0.841532 26.5141 1.33311 27.213 1.98015C27.9119 2.60142 28.4559 3.37819 28.8442 4.31008C29.2584 5.24194 29.4653 6.30332 29.4653 7.49402C29.4653 8.71068 29.2067 9.7594 28.6889 10.6395C28.1971 11.5196 27.5629 12.2314 26.7864 12.775C28.5466 13.2927 29.9058 14.2247 30.8636 15.5707C31.8472 16.8909 32.3387 18.3669 32.3387 19.9977C32.3387 21.1365 32.1576 22.1847 31.7952 23.1424C31.4328 24.1002 30.9147 24.942 30.2417 25.6668C29.5946 26.3914 28.7924 26.9607 27.8349 27.3748C26.903 27.7631 25.8542 27.9575 24.6894 27.9575C23.4728 27.9575 22.4373 27.789 21.5831 27.4525C20.7288 27.09 20.0297 26.6629 19.4861 26.171C18.9426 25.6793 18.5411 25.1877 18.2823 24.6959C18.0493 24.1782 17.9333 23.7636 17.9333 23.4529C17.9334 22.7541 18.1528 22.1974 18.5928 21.7833C19.0587 21.3433 19.5636 21.1239 20.1072 21.1238C20.6249 21.1238 21.0913 21.2657 21.5055 21.5504C21.6349 21.6798 21.7768 21.8484 21.9321 22.0555C22.1132 22.2366 22.3336 22.4177 22.5924 22.5989C22.8771 22.7801 23.2142 22.9486 23.6025 23.104C23.9907 23.2333 24.4565 23.2976 24.9999 23.2976C25.8542 23.2976 26.5016 22.9873 26.9417 22.366C27.4076 21.7189 27.6404 20.9421 27.6404 20.0361C27.6404 18.7937 27.2131 17.7973 26.359 17.0466C25.5048 16.2701 24.3399 15.8429 22.8645 15.7652C22.0621 15.7134 21.4021 15.5057 20.8844 15.1433C20.3925 14.7809 20.1464 14.1985 20.1464 13.3961C20.1465 12.8008 20.3534 12.2833 20.7675 11.8433C21.1817 11.4033 21.6865 11.1571 22.2818 11.1054C23.0842 11.0536 23.7443 10.6913 24.262 10.0184C24.8056 9.31956 25.0775 8.51684 25.0776 7.61088C25.0776 6.49776 24.7539 5.66929 24.1067 5.12568C23.4854 4.5821 22.6828 4.31008 21.6991 4.31008C20.198 4.31014 19.0463 4.78918 18.2439 5.74677C17.4414 6.70457 17.0401 8.1546 17.0401 10.0961V18.8168C17.0401 18.8912 17.0361 18.9641 17.0303 19.0358V19.0464C17.0301 23.9915 13.021 27.9999 8.07589 28H2.25965C1.01206 27.9998 0.000170189 26.9888 0 25.7412C1.09081e-07 24.4934 1.01196 23.4817 2.25965 23.4815H8.07589C10.5141 23.4814 12.4912 21.5138 12.5094 19.0799C12.5014 18.9942 12.4971 18.9065 12.4971 18.8168V10.0961C12.4971 8.64644 12.6782 7.29987 13.0406 6.05732C13.4288 4.81492 13.998 3.75345 14.7486 2.87339C15.4993 1.96736 16.4446 1.26821 17.5836 0.77637C18.7225 0.258698 20.0559 0 21.5831 0Z"
        fill={isGradient ? `url(#${gradientId})` : "currentColor"}
      />
    </svg>
  );
}

export { Symbol, symbolVariants };
export type { SymbolProps };
