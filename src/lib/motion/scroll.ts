import { animate } from "motion/react";

import { scrollTransition } from "./transitions";

/**
 * Where the page has to scroll so `element` is fully in view ("nearest": the least movement),
 * honoring the document's `scroll-padding` and the element's `scroll-margin` the way native
 * `scrollIntoView` does. Element taller than the space: its top is aligned.
 */
function scrollTargetFor(element: HTMLElement) {
	const root = document.documentElement;
	const rootStyle = getComputedStyle(root);
	const style = getComputedStyle(element);
	const px = (value: string) => parseFloat(value) || 0;

	const rect = element.getBoundingClientRect();
	const top = rect.top - px(style.scrollMarginTop);
	const bottom = rect.bottom + px(style.scrollMarginBottom);
	const viewTop = px(rootStyle.scrollPaddingTop);
	const viewBottom = window.innerHeight - px(rootStyle.scrollPaddingBottom);

	let delta = 0;
	if (bottom > viewBottom) delta = Math.min(bottom - viewBottom, top - viewTop);
	else if (top < viewTop) delta = top - viewTop;

	const maxScroll = root.scrollHeight - window.innerHeight;
	return Math.min(Math.max(window.scrollY + delta, 0), maxScroll);
}

/**
 * Scrolls the page so `element` is fully in view, on `scrollTransition`. The target is re-measured
 * every frame, so it can start while the element is still growing or moving (an accordion row
 * expanding, a row revealing, a sibling collapsing) and still land exactly where it settles — one
 * continuous movement instead of waiting for the layout first. Interruptible: any wheel, touch,
 * pointer or key input from the user stops it, and so does `element` leaving the page.
 * Reduced motion: jumps straight to the target.
 * Returns a function that stops the scroll.
 */
function scrollIntoViewSmoothly(element: HTMLElement, { reducedMotion = false } = {}) {
	const scrollTo = (top: number) => window.scrollTo({ top, behavior: "instant" });
	if (reducedMotion) {
		scrollTo(scrollTargetFor(element));
		return () => {};
	}

	const start = window.scrollY;
	const controls = animate(0, 1, {
		...scrollTransition,
		onUpdate: (progress) => {
			if (!element.isConnected) return stop();
			scrollTo(start + (scrollTargetFor(element) - start) * progress);
		},
	});

	const interruptions = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
	function stop() {
		controls.stop();
		for (const event of interruptions) window.removeEventListener(event, stop);
	}
	for (const event of interruptions) window.addEventListener(event, stop, { passive: true });
	controls.then(stop);
	return stop;
}

export { scrollIntoViewSmoothly };
