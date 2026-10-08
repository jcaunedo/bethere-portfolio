import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { accountMenuVariants, fadeVariants, useMotionPreference } from "@/lib/motion";

/**
 * State shared between AccountMenu, AccountMenuTrigger and AccountMenuContent (composed as
 * siblings under AccountMenu):
 * - `open`: AccountMenu owns the open state so AccountMenuContent can keep the panel mounted
 *   through its Motion exit (AnimatePresence + `forceMount`).
 * - `isPointerRef`: whether the trigger's last open interaction was pointer-driven vs keyboard.
 *   AccountMenuContent's onCloseAutoFocus skips Radix's auto-refocus for pointer closes — without
 *   this, closing via a mouse click (including an outside click) still refocuses the trigger, and
 *   the browser's `:focus-visible` heuristic treats that programmatic refocus as keyboard-like, so
 *   a focus ring stays on SelectAccountInfo. Keyboard closes (Escape/Tab) keep focus-return.
 * - `pointerHeldRef`: whether a pointer button is held right now (see `usePointerHeldRef`).
 */
const AccountMenuContext = React.createContext<{
	open: boolean;
	isPointerRef: React.RefObject<boolean>;
	pointerHeldRef: React.RefObject<boolean>;
} | null>(null);

/**
 * Whether a pointer button is held right now, tracked at the document level from the moment
 * AccountMenu mounts. Radix opens the menu on pointer *down*, and a pointer release over an item
 * chooses it (press–drag–release, like native menus). When the panel opens over its own trigger
 * (Sidebar), an ordinary click's release lands on whatever item now sits under the cursor — the
 * menu flashed open and shut, or ran that item. Reading this ref as the panel mounts tells it, with
 * no race, that the opening press is still down.
 */
function usePointerHeldRef() {
	const heldRef = React.useRef(false);
	React.useEffect(() => {
		const down = () => (heldRef.current = true);
		const up = () => (heldRef.current = false);
		document.addEventListener("pointerdown", down, true);
		document.addEventListener("pointerup", up, true);
		document.addEventListener("pointercancel", up, true);
		return () => {
			document.removeEventListener("pointerdown", down, true);
			document.removeEventListener("pointerup", up, true);
			document.removeEventListener("pointercancel", up, true);
		};
	}, []);
	return heldRef;
}

/**
 * The panel's items ignore the pointer until the press that opened it is released, so that
 * release falls through instead of choosing an item. Opened by keyboard (no button held), they're
 * interactive immediately.
 */
function useArmedAfterOpeningPress(pointerHeldRef: React.RefObject<boolean> | undefined) {
	const [armed, setArmed] = React.useState(() => !pointerHeldRef?.current);
	React.useEffect(() => {
		if (armed) return;
		const arm = () => setArmed(true);
		document.addEventListener("pointerup", arm, { once: true, capture: true });
		document.addEventListener("pointercancel", arm, { once: true, capture: true });
		return () => {
			document.removeEventListener("pointerup", arm, true);
			document.removeEventListener("pointercancel", arm, true);
		};
	}, [armed]);
	return armed;
}

function AccountMenu({
	open: openProp,
	defaultOpen = false,
	onOpenChange,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	const isPointerRef = React.useRef(false);
	const pointerHeldRef = usePointerHeldRef();
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
	const open = openProp ?? uncontrolledOpen;

	const handleOpenChange = (next: boolean) => {
		setUncontrolledOpen(next);
		onOpenChange?.(next);
	};

	return (
		<AccountMenuContext.Provider value={{ open, isPointerRef, pointerHeldRef }}>
			<DropdownMenuPrimitive.Root
				data-slot='account-menu'
				open={open}
				onOpenChange={handleOpenChange}
				{...props}
			/>
		</AccountMenuContext.Provider>
	);
}

function AccountMenuPortal({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
	return (
		<DropdownMenuPrimitive.Portal data-slot='account-menu-portal' {...props} />
	);
}

function AccountMenuTrigger({
	onPointerDown,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
	const context = React.useContext(AccountMenuContext);
	return (
		<DropdownMenuPrimitive.Trigger
			data-slot='account-menu-trigger'
			onPointerDown={(event) => {
				if (context) context.isPointerRef.current = true;
				onPointerDown?.(event);
			}}
			{...props}
		/>
	);
}

/** The panel's children; mounted fresh on each open so the "armed" state starts over. */
function AccountMenuArmedItems({
	pointerHeldRef,
	children,
}: {
	pointerHeldRef: React.RefObject<boolean> | undefined;
	children: React.ReactNode;
}) {
	const armed = useArmedAfterOpeningPress(pointerHeldRef);
	// `contents`: no box of its own, so the panel's flex layout applies to the items directly, while
	// `pointer-events` still inherits down to them. The gate sits on this wrapper rather than the
	// panel because Radix sets an inline `pointer-events: auto` on the panel itself.
	return (
		<div className={cn("contents", !armed && "pointer-events-none")}>
			{children}
		</div>
	);
}

/**
 * The menu panel. Defaults to side="top" (grows upward, e.g. above a bottom-anchored trigger like
 * Sidebar's SelectAccountInfo); pass `align`/`sideOffset` to place it — Sidebar opens it over its
 * trigger (left edges aligned, panel bottom on the avatar's bottom), and the items ignore the
 * opening press's release so that's safe (see `usePointerHeldRef`).
 *
 * Motion: `accountMenuVariants` — fades in while rising `motionDistance.small` (12px) on
 * `standardTransition`; exits with a plain fade. Fade only under reduced motion.
 */
function AccountMenuContent({
	className,
	side = "top",
	sideOffset = 4,
	onCloseAutoFocus,
	children,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	const context = React.useContext(AccountMenuContext);
	const { prefersReducedMotion } = useMotionPreference();
	const open = context?.open ?? false;

	return (
		<AnimatePresence>
			{open ? (
				// Kept mounted through the exit by AnimatePresence; `forceMount` stops Radix from
				// unmounting the panel itself as soon as `open` turns false.
				<DropdownMenuPrimitive.Portal key='account-menu-content' forceMount>
					<DropdownMenuPrimitive.Content
						forceMount
						asChild
						side={side}
						sideOffset={sideOffset}
						onCloseAutoFocus={(event) => {
							if (context?.isPointerRef.current) {
								event.preventDefault();
								context.isPointerRef.current = false;
							}
							onCloseAutoFocus?.(event);
						}}
						{...props}
					>
						<motion.div
							data-slot='account-menu-content'
							variants={prefersReducedMotion ? fadeVariants : accountMenuVariants}
							initial='initial'
							animate='animate'
							exit='exit'
							className={cn(
								"z-50 flex max-h-(--radix-dropdown-menu-content-available-height) w-[282px] flex-col gap-1.5 overflow-x-hidden overflow-y-auto rounded-popover border border-border bg-card px-4 py-4 text-foreground shadow-[var(--shadow-popover)]",
								className,
							)}
						>
							<AccountMenuArmedItems pointerHeldRef={context?.pointerHeldRef}>
								{children}
							</AccountMenuArmedItems>
						</motion.div>
					</DropdownMenuPrimitive.Content>
				</DropdownMenuPrimitive.Portal>
			) : null}
		</AnimatePresence>
	);
}

function AccountMenuGroup({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
	return (
		<DropdownMenuPrimitive.Group data-slot='account-menu-group' {...props} />
	);
}

function AccountMenuItem({
	className,
	children,
	icon,
	showIcon = false,
	showCheckbox = false,
	showCircleColor = false,
	circleColor,
	shortcut,
	showChevron = false,
	variant = "default",
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
	icon?: React.ReactNode;
	showIcon?: boolean;
	showCheckbox?: boolean;
	showCircleColor?: boolean;
	circleColor?: string;
	shortcut?: string;
	showChevron?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<DropdownMenuPrimitive.Item
			data-slot='account-menu-item'
			data-variant={variant}
			className={cn(
				"relative flex h-9 cursor-pointer items-center gap-2 rounded-menu-option px-2 py-[7px] text-sm text-foreground outline-hidden select-none hover:bg-state-hover focus:bg-state-hover data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-muted-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:hover:bg-destructive-subtle/50 data-[variant=destructive]:focus:bg-destructive-subtle/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:[&_svg:not([class*='text-'])]:text-destructive",
				className,
			)}
			{...props}
		>
			{showIcon && icon}
			{showCheckbox && (
				<DropdownMenuPrimitive.ItemIndicator asChild forceMount>
					<span
						aria-hidden
						className='flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-foreground'
					>
						<CheckIcon className='size-3' />
					</span>
				</DropdownMenuPrimitive.ItemIndicator>
			)}
			{showCircleColor && (
				<span
					aria-hidden
					className='size-2 shrink-0 rounded-full'
					style={circleColor ? { backgroundColor: circleColor } : undefined}
				/>
			)}
			<span className='flex-1 truncate text-left'>{children}</span>
			{shortcut && (
				<span className='shrink-0 text-right text-xs text-muted-foreground'>
					{shortcut}
				</span>
			)}
			{showChevron && <ChevronRightIcon className='size-4 shrink-0' />}
		</DropdownMenuPrimitive.Item>
	);
}

function AccountMenuLabel({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) {
	return (
		<DropdownMenuPrimitive.Label
			data-slot='account-menu-label'
			className={cn(
				"px-4 py-1.5 text-xs font-medium text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function AccountMenuSeparator({
	className,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			data-slot='account-menu-separator'
			className={cn("h-px w-full bg-border-soft", className)}
			{...props}
		/>
	);
}

export {
	AccountMenu,
	AccountMenuPortal,
	AccountMenuTrigger,
	AccountMenuContent,
	AccountMenuGroup,
	AccountMenuLabel,
	AccountMenuItem,
	AccountMenuSeparator,
};
