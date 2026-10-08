import * as React from "react";

import { Symbol } from "@/components/data-display/symbol";
import accountChooserImage from "./images/google-account-chooser.png";
import logoMaskImage from "./images/google-account-chooser-logo-mask.svg";

/** The Figma artwork's size (Sign-In → "Account creation by choosing SSO", 23:658). */
const ARTWORK = { width: 1316, height: 713 };

/**
 * Prototype-only stand-in for Google's "Choose an account" step, shown after the Google button on
 * Sign-Up/Sign-In so the flow reads end to end (Figma: Sign-In → "Account creation by choosing
 * SSO", 23:658). It's the Figma artwork — a screenshot of Google's chooser — with Bethere's symbol
 * and name laid over it; the account list is one click target that continues. Not a real OAuth
 * screen: nothing is entered or sent, and it isn't exported from the package.
 */
function GoogleAccountChooser({ onContinue }: { onContinue: () => void }) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  // The artwork is fixed-size (its overlays are positioned in its own pixels), so scale it down to
  // fit narrower windows instead of reflowing it.
  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setScale(Math.min(1, (frame.clientWidth - 48) / ARTWORK.width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      data-slot="google-account-chooser"
      className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f0f4fa]"
    >
      <div
        className="relative shrink-0"
        style={{ width: ARTWORK.width, height: ARTWORK.height, transform: `scale(${scale})` }}
      >
        <img src={accountChooserImage} alt="" className="absolute inset-0 size-full" />
        {/* Brand-orange disc covering the screenshot's own app logo, under Bethere's mark (Figma 23:788;
            the SVG bleeds 35.65% past its box). */}
        <img
          src={logoMaskImage}
          alt=""
          className="pointer-events-none absolute max-w-none"
          style={{ left: 180.88 - 50.49 * 0.3565, top: 220.2 - 50.49 * 0.3565, width: 50.49 * 1.713, height: 50.49 * 1.713 }}
        />
        {/* Bethere's mark over the chooser's app logo (Figma 389:1277: 52px brand circle, 8px padding). */}
        <div className="absolute flex size-[52px] items-center justify-center rounded-full bg-primary" style={{ left: 179, top: 220 }}>
          <Symbol variant="white" className="h-7" />
        </div>
        {/* "to continue to Bethere": the app name over the screenshot's own (Figma 23:787). */}
        <span
          className="absolute bg-white py-2 text-[17px] leading-[20px] font-medium text-[#0a57d0]"
          style={{ left: 285.5, top: 355.5, fontFamily: "Roboto, Arial, sans-serif" }}
        >
          Bethere
        </span>
        {/* The account list: picking any account continues. */}
        <button
          type="button"
          aria-label="Continue with Google"
          onClick={onContinue}
          className="absolute cursor-pointer rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          style={{ left: 688, top: 255, width: 462, height: 170 }}
        />
      </div>
    </div>
  );
}

export { GoogleAccountChooser };
