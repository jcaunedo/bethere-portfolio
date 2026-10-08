/**
 * Horizontal padding for the page shell's canvas (the column beside the `Sidebar`). Shared so every
 * layout keeps the same gutters at every breakpoint instead of drifting apart (DESIGN.md "Page shell
 * responsiveness").
 *
 * `px-12` (48 / 48px) at `xl` (1280) and below. In the `2xl` frame (1281–1536px) the gutters are
 * `pl-6` / `pr-12` (24 / 48px) beside the expanded sidebar, and both `px-24` (96px) when it's
 * collapsed. Above `2xl` the right gutter is `pr-40` (160px); the left one is `pl-16` (64px) beside
 * the expanded sidebar and matches the right (`pl-40`) when collapsed.
 *
 * The left padding transitions with the sidebar's width so the content glides instead of jumping.
 * Documented exception to the motion-token rule: CSS can't read `src/lib/motion`, so the duration
 * and curve are `enterTransition`'s (`motionDuration.slow`, 500ms; `[0.16, 1, 0.3, 1]`), the same
 * preset `Sidebar` animates its width with. Keep them in sync.
 */
function layoutCanvasPaddingClassName(sidebarCollapsed: boolean) {
  return [
    "px-12 2xl:pr-40",
    sidebarCollapsed ? "xl:px-24 2xl:pl-40" : "xl:pl-6 2xl:pl-16",
    "transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
  ].join(" ");
}

export { layoutCanvasPaddingClassName };
