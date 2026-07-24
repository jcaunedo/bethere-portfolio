import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Tracks whether the trigger's last open interaction was pointer-driven vs
 * keyboard, shared between AccountMenuTrigger and AccountMenuContent via
 * context since they're composed as siblings under AccountMenu. Used by
 * AccountMenuContent's onCloseAutoFocus to skip Radix's auto-refocus
 * specifically for pointer closes — without this, closing via a mouse click
 * (including an outside click) still refocuses the trigger, and the
 * browser's `:focus-visible` heuristic treats that programmatic refocus as
 * keyboard-like, so a focus-ring border stays on SelectAccountInfo until the
 * user clicks elsewhere. Keyboard closes (Escape/Tab) are left alone so
 * focus-return still works. Same pattern as Popover/Select.
 */
const AccountMenuPointerContext = React.createContext<
	React.RefObject<boolean> | null
>(null);

function AccountMenu({
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
	const isPointerRef = React.useRef(false);
	return (
		<AccountMenuPointerContext.Provider value={isPointerRef}>
			<DropdownMenuPrimitive.Root data-slot='account-menu' {...props} />
		</AccountMenuPointerContext.Provider>
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
	const isPointerRef = React.useContext(AccountMenuPointerContext);
	return (
		<DropdownMenuPrimitive.Trigger
			data-slot='account-menu-trigger'
			onPointerDown={(event) => {
				if (isPointerRef) isPointerRef.current = true;
				onPointerDown?.(event);
			}}
			{...props}
		/>
	);
}

function AccountMenuContent({
	className,
	side = "top",
	sideOffset = 4,
	onCloseAutoFocus,
	...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
	const isPointerRef = React.useContext(AccountMenuPointerContext);
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				data-slot='account-menu-content'
				side={side}
				sideOffset={sideOffset}
				onCloseAutoFocus={(event) => {
					if (isPointerRef?.current) {
						event.preventDefault();
						isPointerRef.current = false;
					}
					onCloseAutoFocus?.(event);
				}}
				className={cn(
					// Defaults to side="top" (grows upward, e.g. above a
					// bottom-anchored trigger like Sidebar's SelectAccountInfo).
					// Deliberately does NOT cover the trigger the way
					// SelectContent does — DropdownMenuTrigger opens on
					// pointerdown, so covering the trigger puts the matching
					// pointerup/click on the newly-rendered content instead of
					// the trigger (or on whatever menu item now sits under the
					// cursor, which can fire it by accident). Tried multiple
					// workarounds (outside-click guard via trigger ref, a
					// pointer-events-none "ready" gate) — both failed: Radix's
					// DismissableLayer sets an inline `pointerEvents` style that
					// beats any `className`, and even routing the gate through
					// `style` directly still raced against how fast a real click
					// completes vs. when a `useEffect` listener can attach.
					// sideOffset provides a normal gap instead — safe, no
					// special-casing needed.
					"z-50 flex max-h-(--radix-dropdown-menu-content-available-height) w-[282px] origin-(--radix-dropdown-menu-content-transform-origin) flex-col gap-1.5 overflow-x-hidden overflow-y-auto rounded-popover border border-border bg-card px-4 py-4 text-foreground shadow-[var(--shadow-popover)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
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
