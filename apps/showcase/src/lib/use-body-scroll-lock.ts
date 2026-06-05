import { useEffect } from "react";

// Shared across every overlay so that overlapping locks (e.g. a dialog opened
// while the mobile menu is open) only release the body once all have closed.
let lockCount = 0;
// Captured when the first lock is applied so the original value is restored
// once every lock has released.
let previousOverflow = "";

/**
 * Locks page scrolling while `locked` is true by setting `overflow: hidden` on
 * <body>. Use from any dialog, modal, or overlay (mobile menu) that should stop
 * the page behind it from scrolling.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
    }
    lockCount += 1;
    document.body.style.overflow = "hidden";
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [locked]);
}
